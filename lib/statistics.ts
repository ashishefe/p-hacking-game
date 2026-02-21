import * as ss from "simple-statistics";
import type { Farm, AnalysisRequest, StatResult, FilterCondition } from "./types";

export function applyFilters(data: Farm[], filters: FilterCondition[]): Farm[] {
  return data.filter((row) => {
    return filters.every((f) => {
      const val = row[f.field];
      const fval = f.value;
      switch (f.operator) {
        case "eq":
          return String(val).toLowerCase() === String(fval).toLowerCase();
        case "neq":
          return String(val).toLowerCase() !== String(fval).toLowerCase();
        case "gt":
          return Number(val) > Number(fval);
        case "lt":
          return Number(val) < Number(fval);
        case "gte":
          return Number(val) >= Number(fval);
        case "lte":
          return Number(val) <= Number(fval);
        default:
          return true;
      }
    });
  });
}

// Two-sample Welch's t-test
export function runTTest(
  data: Farm[],
  request: AnalysisRequest
): StatResult {
  const filtered = applyFilters(data, request.filters);
  const groupVar = request.group_var ?? "uses_growmax";
  const outcomeVar = request.outcome_var;

  const groups = new Map<string, number[]>();
  for (const row of filtered) {
    const key = String(row[groupVar]);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(Number(row[outcomeVar]));
  }

  const groupEntries = Array.from(groups.entries());

  if (groupEntries.length < 2) {
    return {
      test_type: "Two-sample t-test",
      p_value: 1,
      statistic: 0,
      n: filtered.length,
      n_filtered: filtered.length,
      group_means: Object.fromEntries(
        groupEntries.map(([k, v]) => [k, ss.mean(v)])
      ),
      description: "Not enough groups to compare.",
      significant: false,
    };
  }

  // Use first two groups (typically 0 vs 1 for binary vars)
  const [key1, vals1] = groupEntries[0];
  const [key2, vals2] = groupEntries[1];

  const mean1 = ss.mean(vals1);
  const mean2 = ss.mean(vals2);
  const var1 = ss.variance(vals1);
  const var2 = ss.variance(vals2);
  const n1 = vals1.length;
  const n2 = vals2.length;

  if (n1 < 2 || n2 < 2) {
    return {
      test_type: "Two-sample t-test",
      p_value: 1,
      statistic: 0,
      n: filtered.length,
      n_filtered: filtered.length,
      group_means: { [key1]: mean1, [key2]: mean2 },
      description: "Sample too small for reliable test.",
      significant: false,
    };
  }

  // Welch's t-statistic
  const se = Math.sqrt(var1 / n1 + var2 / n2);
  if (se === 0) {
    return {
      test_type: "Two-sample t-test",
      p_value: 1,
      statistic: 0,
      n: filtered.length,
      n_filtered: filtered.length,
      group_means: { [key1]: mean1, [key2]: mean2 },
      description: "No variation in data.",
      significant: false,
    };
  }

  const t = (mean1 - mean2) / se;

  // Welch-Satterthwaite degrees of freedom
  const df =
    Math.pow(var1 / n1 + var2 / n2, 2) /
    (Math.pow(var1 / n1, 2) / (n1 - 1) + Math.pow(var2 / n2, 2) / (n2 - 1));

  const pValue = tDistPValue(Math.abs(t), df);

  return {
    test_type: "Two-sample t-test (Welch's)",
    p_value: pValue,
    statistic: t,
    n: data.length,
    n_filtered: filtered.length,
    group_means: { [key1]: Math.round(mean1), [key2]: Math.round(mean2) },
    description: `Compared ${outcomeVar} between ${groupVar} groups.`,
    significant: pValue < 0.05,
  };
}

// Simple or multiple linear regression
export function runRegression(
  data: Farm[],
  request: AnalysisRequest
): StatResult {
  const filtered = applyFilters(data, request.filters);
  const outcomeVar = request.outcome_var;

  // Build predictor list: group_var + covariates
  const predictors: (keyof Farm)[] = [];
  if (request.group_var) predictors.push(request.group_var);
  for (const c of request.covariates) {
    if (!predictors.includes(c)) predictors.push(c);
  }

  if (predictors.length === 0) {
    return runTTest(data, {
      ...request,
      group_var: "uses_growmax",
      test_type: "ttest",
    });
  }

  const y = filtered.map((r) => Number(r[outcomeVar]));

  if (predictors.length === 1) {
    // Simple linear regression
    const x = filtered.map((r) => Number(r[predictors[0]]));
    const pairs = x.map((xi, i) => [xi, y[i]] as [number, number]);
    const reg = ss.linearRegression(pairs);
    const rLine = ss.linearRegressionLine(reg);
    const yHat = x.map((xi) => rLine(xi));
    const rSquared = ss.rSquared(pairs, rLine);

    // F-test p-value via F = r²(n-2)/(1-r²), df1=1, df2=n-2
    const n = y.length;
    const F = (rSquared * (n - 2)) / (1 - rSquared + 1e-15);
    const pValue = fDistPValue(F, 1, n - 2);

    return {
      test_type: "Simple linear regression",
      p_value: pValue,
      statistic: F,
      n: data.length,
      n_filtered: filtered.length,
      r_squared: rSquared,
      coefficients: {
        intercept: reg.b,
        [predictors[0]]: reg.m,
      },
      description: `Regressed ${outcomeVar} on ${predictors[0]}.`,
      significant: pValue < 0.05,
    };
  }

  // Multiple regression — use simple-statistics' linearRegressionLine approach
  // Build X matrix (with intercept), solve OLS via normal equations
  const X = filtered.map((row) => [
    1,
    ...predictors.map((p) => Number(row[p])),
  ]);
  const { beta, rSquared, pValue } = olsWithPValue(X, y);

  const coefficients: Record<string, number> = { intercept: beta[0] };
  predictors.forEach((p, i) => {
    coefficients[p] = beta[i + 1];
  });

  return {
    test_type: "Multiple linear regression",
    p_value: pValue,
    statistic: 0,
    n: data.length,
    n_filtered: filtered.length,
    r_squared: rSquared,
    coefficients,
    description: `Regressed ${outcomeVar} on ${predictors.join(", ")}.`,
    significant: pValue < 0.05,
  };
}

// One-way ANOVA
export function runANOVA(
  data: Farm[],
  request: AnalysisRequest
): StatResult {
  const filtered = applyFilters(data, request.filters);
  const groupVar = request.group_var ?? "crop_type";
  const outcomeVar = request.outcome_var;

  const groups = new Map<string, number[]>();
  for (const row of filtered) {
    const key = String(row[groupVar]);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(Number(row[outcomeVar]));
  }

  const groupArrays = Array.from(groups.values()).filter((g) => g.length >= 2);

  if (groupArrays.length < 2) {
    return {
      test_type: "One-way ANOVA",
      p_value: 1,
      statistic: 0,
      n: data.length,
      n_filtered: filtered.length,
      description: "Need at least 2 groups with 2+ observations each.",
      significant: false,
    };
  }

  const allValues = groupArrays.flat();
  const grandMean = ss.mean(allValues);
  const N = allValues.length;
  const k = groupArrays.length;

  const ssBetween = groupArrays.reduce((acc, grp) => {
    return acc + grp.length * Math.pow(ss.mean(grp) - grandMean, 2);
  }, 0);

  const ssWithin = groupArrays.reduce((acc, grp) => {
    const gMean = ss.mean(grp);
    return acc + grp.reduce((a, v) => a + Math.pow(v - gMean, 2), 0);
  }, 0);

  const dfBetween = k - 1;
  const dfWithin = N - k;
  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin + 1e-15;
  const F = msBetween / msWithin;
  const pValue = fDistPValue(F, dfBetween, dfWithin);

  const groupMeans: Record<string, number> = {};
  for (const [key, vals] of groups.entries()) {
    groupMeans[key] = Math.round(ss.mean(vals));
  }

  return {
    test_type: "One-way ANOVA",
    p_value: pValue,
    statistic: F,
    n: data.length,
    n_filtered: filtered.length,
    group_means: groupMeans,
    description: `Compared ${outcomeVar} across ${groupVar} categories.`,
    significant: pValue < 0.05,
  };
}

export function runAnalysis(data: Farm[], request: AnalysisRequest): StatResult {
  switch (request.test_type) {
    case "anova":
      return runANOVA(data, request);
    case "regression":
      return runRegression(data, request);
    case "ttest":
    default:
      return runTTest(data, request);
  }
}

// ---- Statistical distribution helpers ----

// Two-tailed p-value from t-distribution using regularized incomplete beta
function tDistPValue(t: number, df: number): number {
  // Use the relationship between t and F: F = t²
  return fDistPValue(t * t, 1, df);
}

// p-value from F-distribution using regularized incomplete beta
function fDistPValue(F: number, df1: number, df2: number): number {
  if (F <= 0 || isNaN(F) || !isFinite(F)) return 1;
  const x = df2 / (df2 + df1 * F);
  return regularizedIncompleteBeta(x, df2 / 2, df1 / 2);
}

// Regularized incomplete beta function (continued fraction approximation)
function regularizedIncompleteBeta(x: number, a: number, b: number): number {
  if (x < 0 || x > 1) return NaN;
  if (x === 0) return 0;
  if (x === 1) return 1;

  const lbeta = lgamma(a + b) - lgamma(a) - lgamma(b);
  const front =
    Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta) / a;

  // Use Lentz's continued fraction method
  const cf = betaContinuedFraction(x, a, b);
  return front * cf;
}

function betaContinuedFraction(x: number, a: number, b: number): number {
  const maxIter = 200;
  const eps = 1e-12;

  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;

  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  let h = d;

  for (let m = 1; m <= maxIter; m++) {
    const m2 = 2 * m;

    // Even step
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    h *= d * c;

    // Odd step
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const del = d * c;
    h *= del;

    if (Math.abs(del - 1) < eps) break;
  }

  return h;
}

// Log-gamma function (Lanczos approximation)
function lgamma(z: number): number {
  const g = 7;
  const c = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];

  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
  }

  z -= 1;
  let x = c[0];
  for (let i = 1; i < g + 2; i++) {
    x += c[i] / (z + i);
  }

  const t = z + g + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

// OLS multiple regression with F-test p-value
function olsWithPValue(
  X: number[][],
  y: number[]
): { beta: number[]; rSquared: number; pValue: number } {
  const n = y.length;
  const p = X[0].length; // includes intercept

  // Compute X'X and X'y
  const XtX = matMul(transpose(X), X);
  const Xty = matVecMul(transpose(X), y);

  // Solve X'X β = X'y via Gaussian elimination
  const beta = gaussianElimination(XtX, Xty);

  // Fitted values and residuals
  const yHat = X.map((row) => row.reduce((s, xi, i) => s + xi * beta[i], 0));
  const residuals = y.map((yi, i) => yi - yHat[i]);

  const yMean = y.reduce((a, b) => a + b, 0) / n;
  const ssTot = y.reduce((a, yi) => a + (yi - yMean) ** 2, 0);
  const ssRes = residuals.reduce((a, r) => a + r * r, 0);
  const ssReg = ssTot - ssRes;

  const rSquared = ssReg / (ssTot + 1e-15);
  const dfReg = p - 1;
  const dfRes = n - p;

  const F = (ssReg / dfReg) / (ssRes / dfRes + 1e-15);
  const pValue = fDistPValue(F, dfReg, dfRes);

  return { beta, rSquared, pValue };
}

function transpose(m: number[][]): number[][] {
  return m[0].map((_, i) => m.map((row) => row[i]));
}

function matMul(A: number[][], B: number[][]): number[][] {
  const n = A.length, p = B[0].length, m = B.length;
  const C = Array.from({ length: n }, () => new Array(p).fill(0));
  for (let i = 0; i < n; i++)
    for (let k = 0; k < m; k++)
      for (let j = 0; j < p; j++)
        C[i][j] += A[i][k] * B[k][j];
  return C;
}

function matVecMul(A: number[][], v: number[]): number[] {
  return A.map((row) => row.reduce((s, aij, j) => s + aij * v[j], 0));
}

function gaussianElimination(A: number[][], b: number[]): number[] {
  const n = A.length;
  // Augmented matrix
  const M = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    // Find pivot
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > Math.abs(M[maxRow][col])) maxRow = row;
    }
    [M[col], M[maxRow]] = [M[maxRow], M[col]];

    if (Math.abs(M[col][col]) < 1e-12) continue;

    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = M[row][col] / M[col][col];
      for (let k = col; k <= n; k++) {
        M[row][k] -= factor * M[col][k];
      }
    }
  }

  return M.map((row, i) => row[n] / (row[i] || 1));
}
