# The Story of P-Hacking: Why You Should Read Research Papers With One Eyebrow Raised

---

## Part 1: What a P-Value Actually Means (A Quick Recap)

You've already learnt about the p-value, so this will be brief — but we need to get the foundations exactly right, because what comes next depends on it.

You'll remember the Abhinav Bindra analogy: a world-class shooter is at the back of your classroom, aiming at a target on the blackboard. If all his shots land far from the target, you start to suspect he isn't who he claims to be. The data is so extreme, given who he's *supposed* to be, that you question the assumption. (If you want the full version of this analogy, [here's the original](https://www.econforeverybody.com/p/abhinav-bindra-and-the-p-value).)

That intuition *is* the p-value. More formally:

The **p-value** is the probability of seeing data at least as extreme as what you actually observed, *assuming the null hypothesis is true*. The null hypothesis is the boring default claim — "this drug has no effect," "there is no difference between these groups," or in Bindra terms, "the shooter really is who he says he is."

Now, read that definition one more time, slowly. Notice what it says and what it *doesn't* say.

It does *not* tell you the probability that your hypothesis is correct. This is a trap that almost everyone falls into, so let's spend a moment on why. The p-value tells you P(data | hypothesis) — the probability of seeing this data *given that the null is true*. What you actually *want* to know is P(hypothesis | data) — the probability that the null is true *given what you saw*. These are not the same thing, and flipping them is one of the most common errors in all of statistics.

Here's a simple way to see why they're different. If it is raining, the probability that you are wet is very high. But if you are wet, the probability that it is raining is... well, it depends. Maybe you just stepped out of a shower. Maybe someone threw a water balloon at you. "Wet, therefore raining" doesn't follow, because there are many reasons you might be wet. In exactly the same way, "surprising data, therefore the null hypothesis is false" doesn't follow, because there are many reasons you might see surprising data — including plain bad luck. The p-value measures how surprising the data is under the null hypothesis. It does *not* measure how likely the null hypothesis is to be true. Confusing the two is sometimes called the **transposed conditional**, and if you remember nothing else from this section, remember this: the p-value is about the data, not about the hypothesis.

If the p-value is very small — conventionally, below 0.05 — we say the result is "statistically significant." We reject the null hypothesis. We declare that something interesting appears to be going on.

That threshold of 0.05 (or 5%) means we're willing to accept a 5% chance of being wrong — of rejecting a null hypothesis that was actually true. This kind of mistake is called a **Type I error**, or a false positive.

Let's build an analogy that we'll keep coming back to throughout this essay. Think of a fire alarm system in a building. What is the null hypothesis for a fire alarm? It's: **"There is no fire."** The alarm's job is to monitor the evidence — smoke, heat, fumes — and sound the alarm only if the evidence is so extreme that it would be very unlikely to observe if there really were no fire. The threshold at which the alarm triggers is like α, the significance level. Set it too sensitive (a very low threshold), and the alarm will go off every time someone makes toast — that's a **Type I error**, a false positive. Set it too insensitive (a very high threshold), and the alarm will stay silent even when there's a genuine fire — that's a **Type II error**, a false negative.

A Type I error is the alarm sounding when there is no fire. A Type II error is the alarm *not* sounding when there *is* a fire. Both are bad, but they're bad in different ways, and the tradeoff between them is a central concern of statistics.

Hold on to this fire alarm. We're going to need it again shortly.

Now, here's where things get philosophically interesting.

---

## Part 2: Two Tribes of Statisticians (Who Agree on the Math but Fight About Everything Else)

There are two major schools of thought about what hypothesis testing *means*, and the tension between them is not some dusty historical footnote — it's directly responsible for the mess we're about to discuss.

### The Neyman-Pearson Framework

Jerzy Neyman and Egon Pearson (yes, Karl Pearson's son — statistics has family dramas too) developed what they saw as a rigorous *decision procedure*. The idea is:

1. Before you collect any data, you set your significance level (α), typically at 0.05.
2. You also think about **power** — the probability of correctly detecting a real effect if one exists. (Missing a real effect is a Type II error.)
3. You collect your data and run your test.
4. If p < α, you reject the null hypothesis. If p ≥ α, you don't.
5. That's it. It's a binary decision. You either reject or you don't.

Back to our fire alarm. The Neyman-Pearson approach says: before you install the alarm system, you decide how sensitive it will be. You *choose* your tolerance for false alarms (α) and your tolerance for missed fires (β, which is 1 minus the power). You calibrate the system. Then you let it run. When it goes off, you don't agonize about *how much* smoke there was — you simply follow the protocol. Alarm sounds? Evacuate. Alarm doesn't sound? Stay put.

Under this framework, the specific value of p doesn't matter beyond whether it crosses the threshold. A p-value of 0.001 is not "more significant" than a p-value of 0.04. Both lead to the same decision: reject. The analogy is a courtroom verdict — guilty or not guilty. We don't say someone is "very guilty" or "slightly guilty." The verdict is the verdict.

Now, a small honest aside, because this point deserves it. In strict Neyman-Pearson, the magnitude of p beyond the threshold is irrelevant for the decision *in that single test*. But many thoughtful scientists feel — and not unreasonably — that p = 0.001 should make you more confident than p = 0.04. After all, a result that would be incredibly rare under the null seems like stronger evidence than one that's merely uncommon. Consider a doctor tracking a patient's HbA1c levels over time. The null hypothesis is "this patient does not have Type II diabetes." Each individual blood test might not cross the diagnostic threshold, but if the readings are trending steadily upward, approaching the boundary, the doctor is right to be worried — she can *see* where this is heading. Similarly, if you're watching the capabilities of AI systems improve year after year, you might reasonably form expectations about when a threshold will be crossed, even before the data formally gets there. This kind of trend-watching involves updating your beliefs based on accumulating evidence, and it's actually closer to *Bayesian* reasoning than to either the NP or Fisher framework. It's a genuine tension, and it's one reason the Fisherian perspective — which *does* treat p as a continuous measure — refuses to die, even though its flexibility creates problems we'll see shortly.

Neyman and Pearson were explicit that their framework is about *long-run error control*. If you consistently use α = 0.05, then over the course of your entire career, you'll make false positive errors about 5% of the time. It's a quality control system for scientific decisions, not a measure of evidence in any single experiment.

Pause here for a moment and think about what that means. If a scientist publishes 100 papers over their career, you'd expect about 5 of them to have declared an effect where none actually existed. And that's not a scandal — that's the system *working as designed*. The point is not to find one scientist who made a false positive and say "aha, gotcha!" — individual errors are expected. The point is that *on average, across all scientists*, the false positive rate should hover around 5%.

Now hold that thought, because later in this essay, we're going to ask: is that actually what we see when we look at published research? If you read a thousand papers, would you expect about 50 of them to be false positives? Or does the actual rate seem... suspiciously higher? And if so, what might be going on? File this question away. We'll come back to it.

### The Fisherian Framework

Ronald Fisher, who preceded Neyman and Pearson (and feuded with them bitterly — statistics *really* has family dramas), had a different view. For Fisher, the p-value *was* a measure of evidence — a continuous measure of how much the data contradicted the null hypothesis. A smaller p-value meant stronger evidence against the null. There was no fixed α, no binary decision. Fisher saw the p-value as one input into a scientist's judgment, to be weighed alongside prior knowledge, experimental design, and common sense.

### Which Is Better?

This is one of those questions that working statisticians will argue about over drinks until the bar closes. But here's the case for each side, and then where we come down.

**The case for Fisher:** Treating the p-value as a continuous measure of evidence feels natural and gives the scientist flexibility. A result with p = 0.001 really does seem more compelling than one with p = 0.049, and Fisher's approach lets you say so. It respects the scientist's judgment and doesn't reduce a nuanced inference to a mechanical yes/no.

**The case for Neyman-Pearson:** NP's great strength is exactly what makes it feel rigid — it forces you to commit to your hypothesis, your sample size, and your decision rule *before* you see the data. This pre-commitment is the feature, not the bug. It's what makes the long-run error guarantees work. Fisher's approach, by contrast, asks the researcher to be an impartial judge of their own evidence. And as we're about to see, that's asking quite a lot of human beings who have careers, mortgages, and tenure committees to worry about.

**Our view:** We lean toward Neyman-Pearson as the better *default* for working scientists, precisely *because* it constrains you. The constraints protect you — from your own motivated reasoning, from the temptation to peek at data and adjust your analysis, from the subtle biases that are nearly impossible to eliminate through willpower alone. By the time you finish this essay, you'll have a very concrete sense of what goes wrong when those constraints are loosened. That said, neither framework is perfect — the binary threshold creates its own perverse incentives (the entire rest of this essay is, in a sense, about this), and some statisticians argue that a Bayesian approach, which directly computes the probability of hypotheses given data, might ultimately be best of all. But that's a conversation for another day.

One more thing before we move on. There's a distinction that both frameworks acknowledge but that often gets lost in practice: the difference between **statistical significance** and **practical significance**. A result can be statistically significant — p < 0.05 — without being practically meaningful. Suppose a pharmaceutical company tests a new blood pressure drug on 500,000 people and finds that it lowers systolic blood pressure by 0.2 mmHg on average, with p < 0.001. Statistically, this result is rock-solid. Practically, 0.2 mmHg is clinically meaningless — your blood pressure fluctuates more than that between breaths. The p-value tells you the effect is probably *real*; it tells you nothing about whether it *matters*. How big the effect is — the **effect size** — is a separate and equally important question. Fisher's framework, which treats p as a continuous measure of evidence, can sometimes obscure this distinction, because a very small p-value *feels* like it means the effect is large, when in fact it might just mean the sample was huge. Keep this distinction in mind. It'll come back later.

### The Frankenstein Framework (What Most Researchers Actually Do)

Here's the problem: most practising researchers don't consistently follow either framework. They use a strange hybrid — Neyman-Pearson's machinery (α = 0.05, "reject the null," power calculations) while interpreting results in a Fisherian way (treating p = 0.001 as "stronger" evidence than p = 0.04, celebrating especially low p-values).

This hybrid is arguably the root of many problems in modern science. Researchers use the language of binary decisions but think in terms of continuous evidence, and this philosophical muddle creates space for all kinds of mischief.

But the mischief isn't random. It's *incentivized*. And that's where our story really begins.

---

## Part 3: The Currency of Academia (Or, Why Scientists Chase Stars)

In most academic fields, the path to career success runs through publishing papers in peer-reviewed journals. Hiring committees, tenure boards, and grant agencies all care — a lot — about your publication record. The phrase **"publish or perish"** isn't a joke. It's a reasonably accurate description of how academic incentive structures work.

Now here's the key question: what kind of papers do journals want to publish?

The answer, overwhelmingly, is papers with **statistically significant results**. Papers that find something. Papers where the p-value falls below 0.05 and there are stars next to the numbers in the tables.

Papers where nothing interesting happened — where the null hypothesis was *not* rejected — are dramatically harder to publish. This is not a secret or a conspiracy theory. It has been documented extensively. The psychologist Robert Rosenthal gave this phenomenon a memorable name back in 1979: **the file drawer problem**. His vivid worst-case scenario was that academic journals might be filled with the 5% of studies that show Type I errors, while filing cabinets in labs around the world are stuffed with the 95% of studies that found nothing significant.

Now, if you've never written a paper or conducted research, this might feel abstract. So let's make it very concrete.

### A Research Programme You Can Picture

Imagine you're a young agricultural economist, fresh out of your master's programme, and you want to study whether a new fertilizer — let's call it GrowMax — increases crop yields. This is your first big research project. You design a study: you'll visit 200 farms, 100 that use GrowMax and 100 that don't, and compare their yields.

You collect your data. You run your t-test. And... p = 0.23. Not significant. GrowMax doesn't appear to increase yields.

Now, you're disappointed, but you're also a careful researcher, and you have a lot of data. So you start looking more closely. Maybe the effect is different for different crops? You split by crop type — wheat, rice, sorghum, maize, cotton. For wheat, p = 0.41. For rice, p = 0.67. For sorghum, p = 0.12. For maize, p = 0.78. But for cotton — p = 0.03! GrowMax significantly increases cotton yields!

You also wonder about soil type. You split again — clay, loam, sandy. You check irrigation methods. You try controlling for rainfall. You exclude the five farms with the lowest yields as "outliers" because they seem unusual. Each time you make one of these choices, you're effectively running a new test.

Out of all these analyses, you find one that crosses the magic threshold: GrowMax significantly increases cotton yields on loam soil with drip irrigation (p = 0.04). You write up *that* analysis. The other twenty analyses — the ones that found nothing — go into your file drawer. They never see the light of day.

Your paper is published. Your CV grows. Congratulations.

But think about what just happened from the perspective of long-run error control. Remember the Neyman-Pearson promise: if you use α = 0.05 honestly, you'll make false positive errors about 5% of the time. But you didn't run one test — you ran twenty or more, and reported only the one that "worked." The 5% guarantee is void. And this is your *first project*. If this is how the system works, do you think the false positive rate across your career — and across the careers of thousands of scientists doing the same thing — is going to be anywhere near 5%?

This is **publication bias**: the systematic tendency for journals, reviewers, and researchers themselves to favour the publication of statistically significant results over null results. It creates an ecosystem where:

- Journals want significant results → Reviewers gate-keep for significance → Researchers need significant results to survive → The published literature becomes a biased sample of all research ever conducted.

Think about what this means from a Neyman-Pearson perspective. The whole framework is built on the guarantee that if you use α = 0.05, your false positive rate will be 5% *in the long run*. But that guarantee assumes all studies are reported — the significant ones *and* the non-significant ones. If you only ever see the significant ones, the guarantee is void. It's as if a casino told you the house edge is 5%, but they only showed you footage of the times the house won.

Now, researchers are people. People respond to incentives. If your career depends on producing p-values below 0.05, and there are many small, often innocuous-seeming decisions you can make during data collection and analysis that nudge your p-value downward... what do you think happens?

---

## Part 4: The Beatles Can Make You Younger (No, Really, It's Published)

In 2011, three researchers — Joseph Simmons, Leif Nelson, and Uri Simonsohn — published what would become one of the most important papers in the methodology of social science. It appeared in *Psychological Science*, one of the discipline's flagship journals, and its title was as blunt as a sledgehammer: **"False-Positive Psychology: Undisclosed Flexibility in Data Collection and Analysis Allows Presenting Anything as Significant."**

The paper did two things. First, it used computer simulations to show how various "researcher degrees of freedom" — the many small choices a researcher makes during a study — could inflate the false positive rate from the nominal 5% to **over 60%**.

Second, and far more memorably, it included two actual experiments to demonstrate the point.

In one experiment, the researchers asked university undergraduates to listen to either "When I'm Sixty-Four" by The Beatles or a control song ("Kalimba," the audio file that came pre-installed with Windows 7 — a choice that is, frankly, the funniest methodological detail in the history of science). After listening, participants reported their age and some other variables. The researchers also recorded participants' father's age.

The result? **Listening to "When I'm Sixty-Four" made participants significantly younger.** According to their actual birth dates, people in the Beatles condition were nearly a year and a half younger than those in the control condition (p = .040).

Obviously, a Beatles song cannot reverse aging. This is a necessarily false finding — it cannot possibly be true. Yet it was produced using real participants, legitimate statistical methods, and truthful reporting. How?

The researchers exploited exactly the kinds of flexibility that are common in published research:

- **Flexible covariates:** They included father's age as a covariate, which happened to make the result significant. Without it, p = .33 — nowhere near significant.
- **Selective dependent variable reporting:** They measured multiple outcomes (how old participants *felt*, various other measures) but only reported the one that produced a significant result.
- **Flexible sample size:** They decided when to stop collecting data based on what the results looked like.

Each of these choices, taken individually, might seem reasonable. A researcher might genuinely believe that controlling for a covariate is "the right thing to do." They might argue that one dependent variable is "more appropriate" than another. But the cumulative effect of these choices — especially when they're made *after* seeing the data — is devastating.

Now here's the thing that should click for you as a student of statistics: **the Beatles experiment and the fertilizer experiment are, at a statistical level, the same thing.** The subject matter couldn't be more different — one is absurd by design, the other is plausible agricultural research. But the *structure* of the problem is identical. In both cases, a researcher has many possible analyses to run, runs several, and reports the one that produces significance. Whether you're testing if Beatles songs reverse aging or if GrowMax increases cotton yields on loam soil, the mathematics of false positives works exactly the same way. The specific content written on the variables doesn't matter — what matters is how many tests were run, how they were selected, and whether the significant one was chosen after the fact.

This is one of the most important things to internalize about statistical reasoning: the *domain* is irrelevant to the *logic*. A false positive in psychology and a false positive in agricultural economics are born from exactly the same mechanism.

The paper's title says it all: when you allow yourself undisclosed flexibility in how you collect and analyse data, you can find "evidence" for practically anything.

(You can read the original paper here: [https://journals.sagepub.com/doi/10.1177/0956797611417632](https://journals.sagepub.com/doi/10.1177/0956797611417632))

---

## Part 5: The Many Flavours of Flexibility

The Beatles experiment is a particularly entertaining example, but the underlying problem takes many forms. Here are the most common "researcher degrees of freedom" — the knobs you can turn to nudge a non-significant result toward significance. We'll illustrate each one with our fertilizer study, so you can see how ordinary research decisions become problematic.

**Stopping rules:** When do you stop collecting data? You could set a target sample size in advance (as you should), or you could peek at your results periodically and stop when the p-value dips below 0.05. This is sometimes called "optional stopping." In the fertilizer study: you planned to visit 200 farms, but after 120 you check and find p = 0.06. So close! You visit 20 more. Still p = 0.055. Ten more. Finally, at 157 farms, p = 0.048. You stop. You don't mention in the paper that you originally planned for 200.

**Outcome switching:** If you measure ten different dependent variables, there's a reasonable chance at least one will show a "significant" effect by pure chance. Report that one, don't mention the other nine, and your paper looks clean. In the fertilizer study: you measured yield per hectare, but also profit per hectare, crop height, germination rate, soil nitrogen after harvest, and pest incidence. Yield shows nothing. But germination rate shows p = 0.03. Your paper becomes about how GrowMax improves germination rates.

**Covariate fishing:** Including or excluding control variables (age, gender, income, etc.) can shift your results. If you try several combinations and report the one that works, you're exploiting flexibility. In the fertilizer study: the overall effect isn't significant. But when you control for altitude and average March temperature and years since last crop rotation, suddenly p = 0.04. You report this model and argue that these controls are "theoretically motivated."

**Subgroup analysis:** Your overall result isn't significant? Maybe it is if you look only at women, or only at participants under 30, or only at left-handed participants who took the survey on a Tuesday. In the fertilizer study: GrowMax doesn't work overall. But it works for cotton on loam soil with drip irrigation! You write the paper about that subgroup.

**Outlier exclusion:** There's often genuine ambiguity about what counts as an "outlier." If you define outliers after seeing the data, and your definition happens to be the one that makes the result significant, that's a problem. In the fertilizer study: five farms had unusually low yields. Were they outliers, or were they just farms where GrowMax didn't work? If you exclude them and the result becomes significant, you have a decision to make — and the temptation to exclude is strong.

**Analytic flexibility:** Should you use a t-test or a Mann-Whitney test? Linear regression or logistic regression? Log-transform the data or not? These are often legitimate methodological choices — but when you try several and report the one that "works," you're inflating your false positive rate.

The crucial point: *none of these decisions are inherently wrong*. Including a covariate can be the right analytical choice. Excluding outliers can be entirely justified. The problem arises when these decisions are made (or revised) *after* looking at the data, and when only the combination that produces significance is reported. Each individual choice might be defensible in isolation. But when you make twenty such choices and report only the path that led to p < 0.05, you've turned a 5% false positive rate into something far, far higher.

---

## Part 6: An XKCD Comic That Teaches Better Than Most Textbooks

The webcomic xkcd captured this problem beautifully in comic #882, titled "Significant" ([https://xkcd.com/882/](https://xkcd.com/882/)).

The setup: someone claims jelly beans cause acne. Scientists test this and find no link (p > 0.05). But then they're told it might be a *specific colour* of jelly bean. So they test 20 different colours, one at a time. Nineteen tests find no link. But one — green jelly beans — shows p < 0.05.

The final panel is a newspaper headline: **"GREEN JELLY BEANS LINKED TO ACNE! 95% CONFIDENCE."**

The punch line in the title text is even better: when the scientists repeat the green jelly bean study and find no link, the newspaper reports: "RESEARCH CONFLICTED ON GREEN JELLY BEAN/ACNE LINK; MORE STUDY RECOMMENDED!"

This is the multiple comparisons problem in cartoon form. Let's work through the math, because it's worth understanding where the numbers come from.

If you run a single test at α = 0.05, and the null hypothesis is true (green jelly beans really don't cause acne), the probability of a false positive is 5%, or 0.05. That means the probability of *correctly* finding no effect is 0.95.

Now, if you run 20 *independent* tests, each at α = 0.05, and *none* of the null hypotheses are false (no colour of jelly bean causes acne), what's the probability that you get *at least one* false positive?

The easiest way to calculate this is through the complement — the probability that you get *zero* false positives across all 20 tests. For each test, the probability of no false positive is 0.95. Since the tests are independent, the probability of no false positive across *all 20* is:

0.95 × 0.95 × 0.95 × ... (20 times) = 0.95²⁰ ≈ 0.358

So the probability of getting *at least one* false positive is:

1 − 0.358 ≈ 0.642, or about **64%**.

Read that again. If you test 20 true null hypotheses at α = 0.05, there is roughly a two-in-three chance that at least one of them will come up "significant" by pure chance. Not 5%. Sixty-four percent. And if you only report that one significant result and suppress the nineteen that found nothing, the published literature will contain a confident claim about green jelly beans and acne, backed by a p-value that looks perfectly respectable.

Think back to the Bindra analogy. When we saw all his shots landing far from the target, we concluded the shooter was an impostor — and that reasoning was sound, because we were testing *one* specific claim about *one* specific shooter. But now imagine a different setup: twenty people walk into the classroom, each claiming to be Bindra. Each one takes a single shot. Nineteen miss badly, but one happens to nail the bullseye. If someone only showed you the footage of the one who hit the target, you'd be impressed. You'd believe that person was the real Bindra. But you'd be wrong — you'd be looking at the one lucky shot out of twenty, with the nineteen misses conveniently edited out. That's what selective reporting does to the published literature.

---

## Part 7: So, Finally — What *Is* P-Hacking?

If you've followed the story so far, the formal definition should feel like something you already understand. It's the name for a pattern you've now seen from multiple angles — in the Beatles study, in the fertilizer study, in the jelly bean comic.

**P-hacking** is the practice of exploiting flexibility in data collection, analysis, or reporting — whether consciously or unconsciously — to obtain statistically significant results (p < 0.05). It includes:

- Running multiple analyses and reporting only those that produce significant results
- Collecting data until a significant result appears, then stopping
- Including or excluding variables, data points, or subgroups based on whether they produce significance
- Testing multiple hypotheses without adjusting for multiple comparisons

The term was coined by Uri Simonsohn (one of the authors of the Beatles study) and has become widely used since around 2014.

P-hacking is corrosive because it undermines the very thing the p-value is supposed to guarantee. Remember: a p-value of 0.05 means "if the null hypothesis is true, there's a 5% chance of seeing data this extreme." But that guarantee assumes you ran one pre-specified analysis. If you ran twenty analyses and picked the best one, the actual false positive rate could be many times higher than 5%.

One last visit to Bindra's classroom — but this time, the setup is different from the twenty-impostors version. This is important, because p-hacking isn't just one trick. It's a family of tricks, and this variant illustrates a different member of the family.

The twenty-impostors scenario — twenty people, one target, report only the one who hit it — is analogous to **multiple testing with selective reporting**. You run many tests and cherry-pick the significant one. The false positive is generated by sheer volume.

But now picture this: *one* person walks into the classroom. He fires twenty shots, scattered all over the blackboard. Then someone walks up, finds the spot where one bullet happened to land, draws a bullseye around it, and *then* invites the audience in. The audience sees one shot, one bullseye, dead centre. They conclude they're watching a world-class marksman. They never see that the bullseye was drawn after the fact.

This second scenario is analogous to **HARKing** — Hypothesizing After Results are Known. The researcher doesn't pre-specify what they're looking for; they examine the data, find a pattern, and then construct a hypothesis to fit it, presenting it as though this was the plan all along. It's our fertilizer researcher "discovering" that GrowMax works specifically for cotton on loam soil with drip irrigation, and writing the paper as though that was the research question from the start.

Both mechanisms inflate the false positive rate. Both are forms of p-hacking. But the *how* is different — one exploits volume, the other exploits post-hoc rationalization — and recognizing both is important for spotting them in the wild.

From a Neyman-Pearson perspective, p-hacking is particularly devastating. The whole framework is a long-run error control system. It says: if you follow the procedure honestly — set α, collect data, test, decide — you'll be wrong only α% of the time. P-hacking violates the procedure. Back to our fire alarm: it's like calibrating the system correctly but then, every time the alarm *doesn't* go off, walking over and manually pressing the trigger anyway, and recording "alarm sounded" in your logbook.

And crucially, p-hacking exists on a spectrum. At one end is outright fraud — fabricating data. But that's rare. At the other end are choices so subtle that the researcher genuinely doesn't realize they're doing it. A researcher might sincerely believe that including a particular covariate is "the right analysis" — but the fact that they only checked after seeing it produced a significant result is the problem. The road to false positives is paved with good intentions and undisclosed analytical flexibility.

---

## Part 8: The Replication Crisis — The Bill Comes Due

If p-hacking were rare, it would be a minor footnote. It isn't.

Remember the question we filed away earlier? If the Neyman-Pearson system is working correctly, and everyone is honestly using α = 0.05, the false positive rate across published research should be about 5%. If you read a thousand papers, roughly 50 should contain false positives. That would be the system working as designed.

In 2015, the Open Science Collaboration — a massive collaborative effort led by psychologist Brian Nosek — attempted to replicate 100 studies published in three major psychology journals. The results were sobering: while 97% of the original studies had reported statistically significant results, only **36% of the replications did**. Effect sizes in the replications were, on average, half the magnitude of the originals.

(The original paper: [https://www.science.org/doi/10.1126/science.aac4716](https://www.science.org/doi/10.1126/science.aac4716))

Let that sink in. If the original findings were all real and the original analyses were all honest, you'd expect a very high replication rate — upwards of 89%, according to statistical estimates. Instead, it was 36%.

This was the moment the **replication crisis** entered mainstream awareness. And while p-hacking isn't the only cause — there are many reasons a study might fail to replicate — it is widely regarded as a major contributing factor. When the original literature is inflated by publication bias and undisclosed analytical flexibility, it would be surprising if most findings *did* replicate.

The answer to our earlier question is now clear. The false positive rate in published research is not 5%. It is much, much higher. The Neyman-Pearson system's guarantee — which depends on honest, pre-specified, fully-reported testing — has been systematically undermined by the incentive structures of academic publishing.

The problem extends well beyond psychology. Failed replications have been documented in cancer biology, economics, political science, and medicine.

---

## Part 9: What's Being Done (Because This Story Has a Hopeful Ending)

The replication crisis didn't break science. In many ways, it strengthened it. The response has been a wave of reforms, sometimes called **the credibility revolution**, which aim to make research more transparent and less susceptible to p-hacking and publication bias.

**Pre-registration:** This is perhaps the single most important reform, so let's be concrete about what it means. Remember our fertilizer researcher? Under pre-registration, before visiting a single farm, she would write down her entire analysis plan and post it publicly on a platform like the Open Science Framework ([https://osf.io](https://osf.io)). The plan would specify:

- The hypothesis: "Farms using GrowMax will have higher yields than farms not using GrowMax."
- The outcome variable: yield in kilograms per hectare.
- The covariates she will control for: soil type, rainfall, crop variety, irrigation method.
- The sample size: 200 farms, 100 in each group.
- The statistical test: a two-sample t-test at α = 0.05.
- How outliers will be defined and handled.

This plan is time-stamped and publicly available. *Then* she collects her data and runs the analysis. If her paper reports a different outcome variable, a different subset of farms, a different set of covariates, or a different test — anyone can check the pre-registration and see the discrepancy. She can still run exploratory analyses (testing subgroups, trying different models), but she must label them as exploratory, not confirmatory. The bullseye has to be drawn *before* the shot is fired.

Pre-registration doesn't eliminate all problems, but it makes p-hacking dramatically harder. It reinstates the pre-commitment that Neyman-Pearson requires — the decision rule is set before the data is seen.

**Registered Reports:** Some journals now review and accept papers *before the results are known*, based on the quality of the question and methodology. This eliminates the incentive to p-hack entirely, because the paper is accepted regardless of whether the results are significant. The fertilizer study would be evaluated on the quality of the research design, not on whether GrowMax "worked."

**Emphasis on effect sizes and confidence intervals:** Remember the distinction between statistical significance and practical significance we discussed in Part 2? This reform puts it into practice. Rather than just asking "is this significant?" researchers are increasingly encouraged to report *how big* the effect is and how precisely it's estimated. Our fertilizer researcher wouldn't just report whether GrowMax has an effect — she'd report that it increases yield by, say, 12 kg/hectare with a 95% confidence interval of [3, 21]. This tells you not just that the effect exists, but how large it is and how uncertain we should be about its magnitude.

**Open data and materials:** Sharing raw data and analysis code allows others to verify results and check for undisclosed flexibility. If our fertilizer researcher publishes her dataset, anyone can check whether different (unreported) covariate choices would have changed the result.

**Multi-lab replications:** Large, pre-registered studies conducted across multiple labs simultaneously help establish which findings are robust.

These reforms are far from universally adopted, and their implementation varies across fields. But the direction of travel is encouraging.

---

## Part 10: How to Read a Paper With One Eyebrow Raised

So where does this leave you, as a student learning to engage with academic literature? Here are some practical habits to develop:

**Check for pre-registration.** Was the study registered before data collection? If so, do the reported analyses match the registered plan? Deviations aren't automatically damning, but they should be clearly flagged by the authors.

**Look at the sample size.** Small samples produce noisy estimates and are more susceptible to false positives. If a study with 30 participants reports a dramatic finding, be appropriately cautious.

**Count the comparisons.** How many hypotheses were tested? How many outcome variables were measured? If only one or two are reported as significant out of many measured, that's a flag.

**Ask "could this be an outlier in the literature?"** One study is a data point, not a conclusion. Has the finding been replicated? If it's brand new and hasn't been tested by anyone else yet, hold your excitement.

**Notice the p-value — and think about what its distribution should look like.** This point deserves more than a passing mention, so let's think it through.

If thousands of researchers are doing honest science — pre-specifying their analyses, reporting everything, not p-hacking — what would you expect the distribution of published p-values to look like? Among the significant results (those below 0.05), you'd expect them to be spread fairly evenly, or even skewed toward very small values (because real effects tend to produce small p-values). You'd see plenty of p = 0.001, p = 0.008, p = 0.02 results.

But if p-hacking is widespread, something different happens. Researchers who are "trying" different analyses until they cross the threshold will tend to *just barely* cross it. They'll stop as soon as they hit significance. This means you'd expect to see an unnatural **spike** of p-values clustered just below 0.05 — a suspicious pile-up of results at p = 0.048, p = 0.043, p = 0.049. Think of it like a limbo competition: if people are barely clearing the bar, most of them will clear it by a hair, not by a foot.

And that is, in fact, exactly what researchers have found when examining large bodies of published results. There is a statistically suspicious surplus of p-values just below the 0.05 threshold. Not proof of individual wrongdoing — but a strong signal that, in aggregate, the published literature has been shaped by p-hacking.

(The statistical tool for examining this is called **p-curve analysis**, developed by Simonsohn, Nelson, and Simmons — the same team behind the Beatles study. If you're curious: [https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1850704](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=1850704))

**Distinguish statistical significance from practical significance.** A result with p < 0.001 and an effect size of nearly zero is statistically significant but practically meaningless. Always ask: how *big* is the effect, and does it matter in the real world?

**Read the methods, not just the abstract.** The abstract tells you what the authors want you to remember. The methods section tells you what they actually did.

None of this means you should dismiss all research as untrustworthy. The vast majority of scientists are honest, and the self-correcting mechanisms of science — replication, peer review, methodological criticism — do work, albeit slowly. The goal is not cynicism. It's what we might call **calibrated trust**: taking findings seriously in proportion to the quality of the evidence behind them.

Science is humanity's best tool for understanding the world. P-hacking doesn't change that. But understanding p-hacking makes you a better user of that tool.

---

## Key References

1. **Simmons, J. P., Nelson, L. D., & Simonsohn, U. (2011).** False-Positive Psychology: Undisclosed Flexibility in Data Collection and Analysis Allows Presenting Anything as Significant. *Psychological Science*, 22(11), 1359–1366. [https://journals.sagepub.com/doi/10.1177/0956797611417632](https://journals.sagepub.com/doi/10.1177/0956797611417632)

2. **Rosenthal, R. (1979).** The File Drawer Problem and Tolerance for Null Results. *Psychological Bulletin*, 86(3), 638–641. [https://pages.ucsd.edu/~cmckenzie/Rosenthal1979PsychBulletin.pdf](https://pages.ucsd.edu/~cmckenzie/Rosenthal1979PsychBulletin.pdf)

3. **Open Science Collaboration (2015).** Estimating the Reproducibility of Psychological Science. *Science*, 349(6251), aac4716. [https://www.science.org/doi/10.1126/science.aac4716](https://www.science.org/doi/10.1126/science.aac4716)

4. **xkcd #882: Significant.** [https://xkcd.com/882/](https://xkcd.com/882/)

5. **Open Science Framework** (for pre-registration): [https://osf.io](https://osf.io)
