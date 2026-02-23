# Appendix for Economics Students: P-Hacking in Your Own Backyard

---

## Why This Appendix Exists

The main essay is deliberately discipline-agnostic. The logic of p-hacking — multiple testing, selective reporting, undisclosed analytical flexibility — is the same whether you're studying fertilizers, jelly beans, or Beatles songs. But if you're an economics student, you might be wondering: what does this look like in *our* literature, with *our* methods? This appendix makes the connection explicit.

Everything here builds on the main essay. If you haven't read it yet, start there.

---

## Two Precision Notes (Before We Get to the Economics)

These aren't economics-specific, but they tighten two points from the main essay that deserve a sharper statement.

### On What α = 0.05 Actually Means

The main essay says we're "willing to accept a 5% chance of being wrong." That's a reasonable first pass, but it can mislead you into thinking that when you see p = 0.04, there's a 96% chance the effect is real. That is *not* what it means.

What α = 0.05 actually guarantees is this: if you use this decision rule repeatedly — across your entire career, across hundreds of tests — and if the null hypothesis happens to be true in some of those tests, you will incorrectly reject it in about 5% of *those cases*. It's a long-run frequency property of the *procedure*, not a probability statement about any single result. The fire alarm analogy from the main essay captures this well: the alarm's false-positive rate is a property of the system's calibration, not a statement about whether *this particular* alarm is a false alarm.

This distinction matters because the tempting (and wrong) interpretation — "p = 0.03, so there's only a 3% chance I'm wrong" — is one of the things that makes p-hacking feel harmless. If you think each individual p-value is telling you the probability of error *for that specific finding*, then a p-value of 0.04 feels very reassuring. But it isn't telling you that. It's telling you something about the procedure, not the finding.

### On the Independence Assumption in the Multiple Testing Math

The main essay shows that running 20 tests at α = 0.05 gives you roughly a 64% chance of at least one false positive, using the calculation 1 − 0.95²⁰. That math assumes the tests are *independent* — that the outcome of one test tells you nothing about the outcome of another.

In practice, research tests are often correlated. If you're testing GrowMax's effect on yield, profit, and revenue per hectare, those outcomes move together — a farm with high yield probably also has high revenue. When tests are positively correlated, the actual false positive rate is somewhat lower than 64%, because the tests aren't giving you 20 fully independent "bites at the apple." Conversely, negatively correlated tests can push the rate higher.

The qualitative point survives either way: running many tests inflates the false positive rate well above the nominal 5%. But it's worth knowing that 64% is an upper bound for positively correlated tests, not an exact figure.

If you're wondering what to *do* about this, the standard approaches are **multiple comparison corrections**. The simplest is the **Bonferroni correction**: if you're running *k* tests, use α/k as your significance threshold for each individual test. Testing 20 hypotheses? Your threshold becomes 0.05/20 = 0.0025 per test. This is conservative — it controls the probability of *any* false positive — but it can be overly strict, especially when tests are correlated. The **Holm-Bonferroni** method is a slightly less conservative step-down version. For settings where you're willing to tolerate some false positives as long as they're a controlled *proportion* of your significant results, the **Benjamini-Hochberg** procedure controls the **false discovery rate** (FDR) rather than the family-wise error rate. These tools exist precisely because the naive "run many tests, report the winners" approach is statistically indefensible.

---

## The Forking Paths of Applied Microeconomics

If you've taken — or are taking — an econometrics course, you already know that applied economics lives and dies by regression analysis. And regression analysis is, almost by construction, a machine for generating researcher degrees of freedom.

Consider what a typical applied micro paper involves:

**Specification choices.** Which control variables do you include? Your theory might suggest a few, but there are usually dozens of plausible candidates. Do you control for household size? For district fixed effects or state fixed effects? For year fixed effects, or year-times-state fixed effects? Each combination is a different regression, and each one produces a different coefficient and a different p-value for your variable of interest.

**Functional form.** Do you use the outcome in levels or in logs? Do you include the key independent variable as linear, quadratic, or as a set of dummies? Do you interact it with other variables? These aren't frivolous choices — they can change the sign of your result, let alone its significance.

**Sample restrictions.** Do you drop outliers? Which ones, and by what rule? Do you restrict to a particular time period? To urban areas only? To households above the poverty line? Each restriction is a fork in the path, and each fork produces a different dataset and a different result.

**Clustering and standard errors.** This one is particularly important in economics. Do you cluster your standard errors at the individual level, the household level, the village level, or the district level? The choice can dramatically affect your standard errors — and therefore your p-values — without changing the point estimate at all. Clustering at a higher level (fewer clusters) generally produces larger standard errors, which makes significance harder to achieve. A researcher who "tries" different clustering levels and reports the one that produces significance is p-hacking, even if each individual choice could be defended on its own.

**Bandwidth and window choices** (in quasi-experimental designs). If you're using a regression discontinuity design, you need to choose a bandwidth around the cutoff. Narrow bandwidths give you observations closer to the cutoff (better internal validity) but fewer observations (less precision). The "right" bandwidth is genuinely ambiguous, and different choices can flip results from significant to insignificant and back. Similarly, difference-in-differences designs require choosing a pre-treatment window and a post-treatment window — and those choices matter.

**Instrument selection** (in IV estimation). If you're using instrumental variables, which instruments do you use? How do you argue for their validity? First-stage F-statistics can be sensitive to specification, and the exclusion restriction is untestable. A researcher who searches across instruments for one that produces a significant second-stage result is engaged in a form of p-hacking that is especially hard to detect.

The point is not that any of these choices are wrong. Most are genuinely ambiguous, and reasonable economists can disagree about them. The point — exactly as in the main essay — is that when these choices are made *after* seeing the data, and when only the specification that produces significance is reported, the false positive rate is no longer 5%. The garden of forking paths, as Andrew Gelman memorably calls it, is particularly lush in applied microeconomics.

---

## The Evidence: What Does P-Hacking Look Like in Economics Journals?

If p-hacking is common in economics, you'd expect to see the same telltale pattern the main essay describes: an unnatural bunching of p-values just below 0.05, with a suspicious dip just above it.

That is exactly what Brodeur, Lé, Sangnier, and Zylberberg found. In their 2016 paper, "Star Wars: The Empirics Strike Back," they examined the distribution of test statistics in 50,000 tests published in the *American Economic Review*, the *Journal of Political Economy*, and the *Quarterly Journal of Economics* — three of the most prestigious economics journals in the world. They found a statistically significant surplus of test statistics just above the critical values for conventional significance levels, and a corresponding deficit just below them. The pattern was more pronounced for some methods (like IV estimation) than others.

The title is a joke, but the finding is not. The distribution of published test statistics in top economics journals does not look the way it should if all analyses were pre-specified and honestly reported. It looks the way it would if researchers — consciously or unconsciously — were nudging their results toward significance.

A follow-up paper by the same team (Brodeur, Cook, and Heyes, 2020) examined methods for detecting and correcting for this distortion, and confirmed that the pattern persists across subfields and time periods.

---

## Replication in Economics

The main essay cites the Open Science Collaboration's finding that only 36% of psychology studies replicated. Economics has its own replication evidence, and it's worth knowing about.

Camerer et al. (2016) replicated 18 laboratory experiments published in the *American Economic Review* and the *Quarterly Journal of Economics* between 2011 and 2014. They found significant effects in the same direction for 11 of the 18 studies — a replication rate of about 61%. That's better than psychology's 36%, but still means that roughly 4 in 10 published experimental findings didn't hold up. Moreover, the replicated effect sizes were on average about 66% the size of the originals — suggesting that even the "real" effects had been inflated by publication bias and analytical flexibility.

The message is the same as in the main essay: the published literature is not a random sample of all research conducted. It is a *filtered* sample, and the filter selects for statistical significance, which means it selects for overestimated effects and, inevitably, for some findings that are simply false.

---

## Confirmatory vs. Exploratory: The Distinction That Disciplines Everything

One recurring theme deserves to be stated as bluntly as possible, because it is the single most important methodological habit you can develop as an economics student:

**Exploration is not a sin. Pretending exploration was confirmatory is.**

There is nothing wrong with looking at your data, noticing a pattern, and investigating it further. That's how science works — hypotheses have to come from *somewhere*, and "I noticed something interesting in the data" is a perfectly legitimate origin story. The problem arises when you present that exploration as if it were a pre-planned test. When your paper reads "we hypothesized that GrowMax would be particularly effective for cotton on loam soil with drip irrigation" — but you only arrived at that hypothesis after trying fifteen other subgroups — you have crossed the line from exploration into false confirmation.

The fix is simple in principle, even if it requires discipline in practice: **label your analyses honestly.** If an analysis was planned before you saw the data, call it confirmatory. If it emerged from exploring the data, call it exploratory. And if your main finding is exploratory, say so — and acknowledge that it needs to be confirmed by a new study with fresh data.

This is what pre-registration formalises. Many economics RCTs now use pre-analysis plans, registered on platforms like the [Open Science Framework](https://osf.io) or the [AEA RCT Registry](https://www.socialscienceregistry.org/). J-PAL has a useful [guide to pre-analysis plans](https://www.povertyactionlab.org/resource/pre-analysis-plans) that discusses both the benefits and the practical tradeoffs — because pre-registration is not free. It requires you to make analytical decisions before you fully understand your data, and it can feel constraining. But that constraint is precisely what makes the resulting evidence credible. The Neyman-Pearson framework's error guarantees only hold when the analysis is pre-specified. Pre-registration is how you demonstrate that yours was.

---

## A Practical Checklist for Economics Students

The main essay's "one eyebrow raised" checklist applies to economics papers too, but here are some additional questions that are specific to the kind of work you'll encounter in economics journals and courses:

**How many specifications were tested?** Does the paper show robustness checks? If it does — good. But also ask: is the "main" specification clearly justified by theory, or does it look like it might have been chosen for its results? If the paper shows five specifications and only one is significant, that's informative.

**What do the standard errors depend on?** Are they clustered? At what level? Does the paper discuss sensitivity to alternative clustering choices? If it doesn't, you might wonder why not.

**Is the effect size economically meaningful?** This is the "practical significance" point from the main essay, translated into economics language. A statistically significant effect of a job training programme that increases earnings by Rs 50 per month is real but useless. Always ask: would this effect change anyone's behaviour or any policy recommendation?

**For quasi-experimental designs: how sensitive are the results to bandwidth, window, or functional form choices?** Good papers show this. Papers that don't leave you wondering what the other bandwidths looked like.

**Is the study pre-registered?** For RCTs, check the AEA RCT Registry. For other designs, check the Open Science Framework. If it's pre-registered, check whether the published analysis matches the pre-analysis plan.

**Has it been replicated?** And if not, how long has it been out? A brand-new finding is a hypothesis. A replicated finding is evidence.

---

## Additional References

1. **Brodeur, A., Lé, M., Sangnier, M., & Zylberberg, Y. (2016).** Star Wars: The Empirics Strike Back. *American Economic Journal: Applied Economics*, 8(1), 1–32. [https://www.aeaweb.org/articles?id=10.1257/app.20150044](https://www.aeaweb.org/articles?id=10.1257/app.20150044)

2. **Brodeur, A., Cook, N., & Heyes, A. (2020).** Methods Matter: P-Hacking and Publication Bias in Causal Analysis in Economics. *American Economic Review*, 110(11), 3634–3660. [https://www.aeaweb.org/articles?id=10.1257/aer.20190687](https://www.aeaweb.org/articles?id=10.1257/aer.20190687)

3. **Camerer, C. F., et al. (2016).** Evaluating Replicability of Laboratory Experiments in Economics. *Science*, 351(6280), 1433–1436. [https://www.science.org/doi/10.1126/science.aaf0918](https://www.science.org/doi/10.1126/science.aaf0918)

4. **Gelman, A. & Loken, E. (2013).** The Garden of Forking Paths. [http://www.stat.columbia.edu/~gelman/research/unpublished/forking.pdf](http://www.stat.columbia.edu/~gelman/research/unpublished/forking.pdf)

5. **J-PAL.** Guide to Pre-Analysis Plans. [https://www.povertyactionlab.org/resource/pre-analysis-plans](https://www.povertyactionlab.org/resource/pre-analysis-plans)

6. **AEA RCT Registry.** [https://www.socialscienceregistry.org/](https://www.socialscienceregistry.org/)
