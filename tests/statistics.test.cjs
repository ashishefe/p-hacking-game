const assert = require('node:assert/strict');
const test = require('node:test');
const { fDistPValue, tDistPValue, runTTest, runANOVA, runRegression } = require('../.test-build/statistics.js');
const fixtures = require('./statistics-reference.json');
function close(actual, expected) {
  assert.ok(Number.isFinite(actual));
  assert.ok(Math.abs(actual - expected) <= Math.max(1e-12, Math.abs(expected) * 1e-9), `${actual} != ${expected}`);
}
test('F survival probabilities match SciPy, including exact symmetry', () => {
  close(fDistPValue(1, 4, 4), 0.5);
  for (const { f, df1, df2, p } of fixtures.f) close(fDistPValue(f, df1, df2), p);
});
test('two-sided t probabilities match SciPy', () => {
  for (const { t, df, p } of fixtures.t) close(tDistPValue(t, df), p);
});
test('distribution endpoints and invalid degrees of freedom', () => {
  assert.equal(fDistPValue(0, 1, 10), 1);
  assert.equal(fDistPValue(Infinity, 1, 10), 0);
  assert.ok(Number.isNaN(fDistPValue(1, 1, 0)));
  assert.ok(Number.isNaN(fDistPValue(NaN, 1, 10)));
});
const request = { test_type: 'ttest', group_var: 'uses_growmax', outcome_var: 'yield_kg_per_hectare', covariates: [], filters: [], description: '' };
const groups = [[1,2,4,8], [2,3,5,6,7]];
const rows = groups.flatMap((g, i) => g.map(y => ({ uses_growmax: i, yield_kg_per_hectare: y })));
test('Welch uses sample variance and matches SciPy', () => {
  const result = runTTest(rows, request);
  close(result.statistic, fixtures.welch.statistic); close(result.p_value, fixtures.welch.p);
});
test('small sample returns before sampleVariance', () => {
  assert.equal(runTTest(rows.slice(3,5), request).significant, false);
});
test('ANOVA matches SciPy on fixture data', () => {
  const result = runANOVA(rows, request);
  close(result.statistic, fixtures.anova.statistic); close(result.p_value, fixtures.anova.p);
});
test('simple regression matches SciPy on fixture data', () => {
  const rows = fixtures.regression.x.map((x,i) => ({ rainfall_mm: x, yield_kg_per_hectare: fixtures.regression.y[i] }));
  const result = runRegression(rows, {...request, test_type:'regression', group_var:'rainfall_mm'});
  close(result.p_value, fixtures.regression.p);
});
test('multiple regression matches NumPy OLS and SciPy F survival', () => {
  const f = fixtures.multiple_regression;
  const rows = f.x1.map((x,i) => ({ rainfall_mm:x, altitude_m:f.x2[i], yield_kg_per_hectare:f.y[i] }));
  const result = runRegression(rows, {...request, test_type:'regression', group_var:'rainfall_mm', covariates:['altitude_m']});
  close(result.p_value, f.p);
});
