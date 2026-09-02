---
order: 1
title: "We are all senior engineers now"
tags:
  - AI-assisted development
  - Code review
  - Architecture
  - Engineering practice
summary: >-
  Everyone says AI means you need to know less. I think it is the opposite. We
  stopped writing code and started reviewing it, which is the senior engineer's
  job, and we are all doing it now whether we are ready or not. Reviewing takes
  more knowledge than writing does, and the questions that actually matter —
  does this fit the architecture, does it fit the stack, can we maintain it, is
  it worth building — are not in the diff at all.
summaryImage:
  src: "/blog/we-are-all-senior-engineers-now/two-reasons.png"
  alt: >-
    Two panels. Depth covers the code in front of you. Breadth covers whether it
    fits the architecture and tech stack, whether the team can maintain it, and
    whether it is worth building
---

## The assumption everyone makes

The pitch for AI coding tools is that you need to know less. The machine writes
the code, so the knowledge lives in the machine, and you can get further with
less experience than before.

I think that is backwards. AI took over the part of the job you learn by doing,
and left the part you cannot pick up on the way.

## What actually changed

I stopped writing most of my code. I write prompts, and then I read what comes
back and decide whether it ships.

That is not a small change in workflow. It is a different job. Reading code
someone else wrote and deciding if it is good enough to merge is what senior
engineers have always done. Now everyone does it, all day, whether or not they
have the experience that job normally requires.

We are all acting like senior engineers reviewing someone else's code. The
someone else just happens to be a model.

And almost nobody trusts what they are reviewing. In Stack Overflow's 2025
survey, more than 84% of developers said they use AI tools or plan to — but only
**29% said they trust the output**, down eleven points from the year
before <sup><a href="#ref-1" id="cite-1">1</a></sup> . Two years earlier, around
70% were using them and trust sat near 40%.

![A line chart from 2023 to 2025. Developers using AI tools rose from roughly 70
percent to 84 percent. Developers who trust AI output fell from roughly 40
percent to 29
percent.](/blog/we-are-all-senior-engineers-now/adoption-up-trust-down.png)

More of us are using it. Fewer of us believe it. That gap is where the reviewing
happens, and it is getting wider.

## Two reasons you need to know more

There are two of them, and they are different problems.

![Two panels. Depth covers the code in front of you: you must already know what
you are reading, and you only absorb so much in one sitting. Breadth covers
whether it fits the architecture and the tech stack, whether the team can
maintain it, and whether it is worth
building.](/blog/we-are-all-senior-engineers-now/two-reasons.png)

The first is about the code in front of you. The second is about everything
around it. AI can help with the first one, though less than you would expect,
and I will come back to why. It cannot answer the second from the code alone.

## Reason one: you have to know code you did not write

Writing code teaches you as you go. You look things up, you get it wrong, the
bug tells you that you were wrong, and you fix it. The learning is built into
the work.

Reviewing does not work like that. Nothing tells you that you missed something.
To catch a problem you have to already know it is a problem before you read the
line. If you have never heard of the thing that is missing, you will not notice
it is missing.

And there is a limit to how much you can take in at once. I can read a two
hundred line component carefully and understand it. I cannot do that six times
in a morning at the same depth, and pretending otherwise is how things slip
through. You only learn so much in one sitting.

I found this out concretely when I
[tested how much accessibility AI writes on its own](/blog/accessible-enough-to-approve).
The code it produced was genuinely good. I caught the two things it got wrong
only because I already knew a contrast ratio is a number you calculate and
already knew what a screen reader announcement is for. If I had not known those
two things, I would have approved it and never learned that I should not have.

## "Just ask AI to explain it"

This is the obvious objection, and I use AI this way constantly. You do not
understand the code, so you ask the model to walk you through it.

Here is the problem. You are asking the author whether the author was right.

![A four step cycle. AI writes the code, you ask AI to explain it, the answer
sounds right, you approve the change, and the cycle repeats. At the centre, a
note that no independent check enters the
loop.](/blog/we-are-all-senior-engineers-now/loop-that-feels-like-review.png)

You get an explanation. It is clear, it is confident, and it sounds correct
whether or not the code is correct. Nothing independent has entered the loop.
That is not review. It just feels like review, which is worse than not
reviewing at all, because you walk away believing you checked.

You can hand the code to a different model instead, and that genuinely helps.
It catches bugs, missed edge cases, security holes, things that contradict the
spec. Anything where the right answer is inside the code.

But models trained on similar data fail in similar ways. In my accessibility
trials, eight of ten independent runs reached for a gray too light to read — two
different tokens, at 2.56:1 and 2.52:1. They were not copying the same value.
They were each making the same call and getting it wrong the same way, which is
the more troubling result. If I had asked another one of them to review that
code, would it have flagged the contrast? Almost certainly not, because most of
them were making that mistake themselves. Asking a second model is not a second
opinion when both models share the same blind spot.

## Reason two: the questions that are not in the code

This is the bigger reason, and it is the one I think about most.

AI is good at writing simple code now. Genuinely good. The function usually
works. So "is this function correct" is not really the question anymore, which
means reviewing line by line is no longer where the value is.

The questions that matter are not in the diff:

- Does this fit the architecture we already have?
- Does it fit our tech stack, or does it drag in something we now have to own?
- Can the team maintain this after the person who prompted it moves on?
- Is this worth building at all, for the business we actually are?

None of those can be answered by looking at the code, because none of them are
about the code. They are about the system it lands in and the company paying for
it. A model that can only see the diff cannot answer any of them, no matter how
good it gets at writing the diff.

That is the work that is left. And it takes more knowledge than writing the
function would have, not less.

## The damage shows up above the line

If this were just a nice theory you would expect the codebases to look fine.
They do not.

GitClear analyzed 211 million changed lines from repositories owned by Google,
Microsoft, Meta and enterprise companies, from 2020 through
2024 <sup><a href="#ref-2" id="cite-2">2</a></sup> . Two numbers stand out. Copy-pasted
lines rose from 8.3% to 12.3% between 2021 and 2024. Over the same period,
refactored lines fell from 25% of all changed lines to under 10%. In 2024,
copy-paste exceeded refactoring for the first time on record.

![A line chart from 2021 to 2024. Refactored lines fell from 25 percent of
changed lines to under 10 percent, while copy-pasted lines rose from 8.3 percent
to 12.3 percent, crossing in
2024.](/blog/we-are-all-senior-engineers-now/copypaste-up-refactoring-down.png)

Think about what that looks like in review. Every one of those copies is
individually fine. There is nothing to object to in the diff. You would have to
know that the same logic already exists somewhere else in the system to have any
objection at all, and that knowledge is not in front of you. It is in your head
or it is nowhere.

That is a system-level problem produced entirely by locally correct code. It is
exactly the failure you get when everyone reviews the line and nobody is
watching the architecture.

## AI is an amplifier

DORA's 2024 report found that AI adoption "significantly increases individual
productivity, flow, and job satisfaction," and in the same breath that it
"negatively impacts software delivery stability and
throughput" <sup><a href="#ref-3" id="cite-3">3</a></sup> . Everyone feels faster.
The delivery gets shakier.

Their 2025 report puts it more directly. "AI's primary role is as an amplifier,
magnifying an organization's existing strengths and
weaknesses" <sup><a href="#ref-4" id="cite-4">4</a></sup> .

That is the whole argument in one sentence, and it is not mine, it is theirs. AI
multiplies whatever engineering judgment is already there. If the architecture is
sound, it makes you faster at building on it. If it is not, it makes you faster
at making it worse. So your judgment decides where you end up. AI only
decides how fast you get there.

## The gap will close. The question is when.

AI is good. I am not arguing otherwise, and I do not want to be read as a
skeptic.

It also produces a lot of code quickly, which puts pressure on review. Set that
aside. The harder questions are the ones AI cannot solve yet. It cannot see past
the code — it does not know the system its output lands in, or the business
paying for it, and those are the questions that decide whether the work was
worth doing at all.

That is the gap. Not a gap in its ability to write code, which is real and
closing fast. A gap between the code and the context.

For now, people are the bridge across it. That is the job.

I have no doubt the gap closes eventually. Models will get better at
understanding the system they write into and the business they write for, and
when they do, some of this post stops being true.

The question is how long that takes, and what it costs while we wait. How many
decisions get made across a gap nobody has closed yet?

I do not know. But the world still needs software.

## The last check is a business question

AI can review the code. Two models can agree the code is correct. Neither of
them can tell you whether it is the code you wanted.

That last question — is this what we want, for this system, for this business —
is the one nobody without your context can answer. It is not a technical review.
It is a judgment about whether the thing being built is the right thing, and it
sits with the person who understands the architecture, the constraints and what
the company is actually trying to do.

So the bar did not drop when AI started writing our code. It moved up. You need
to know the system, you need to know the stack, you need to know the business,
and you need to know enough about the code to tell when something plausible is
wrong.

You need to know more, not less.

## References

1. <a id="ref-1"></a>Stack Overflow. _Mind the gap: closing the AI trust gap for
   developers_, drawing on the 2025 Stack Overflow Developer Survey.
   [stackoverflow.blog](https://stackoverflow.blog/2026/02/18/closing-the-developer-ai-trust-gap/)
2. <a id="ref-2"></a>GitClear. _AI Copilot Code Quality: 2025 Data Suggests 4x
   Growth in Code Clones_. Analysis of 211 million changed lines from January
   2020 to December 2024.
   [gitclear.com](https://www.gitclear.com/ai_assistant_code_quality_2025_research)
3. <a id="ref-3"></a>DORA. _Accelerate State of DevOps Report 2024_.
   [dora.dev](https://dora.dev/research/2024/dora-report/)
4. <a id="ref-4"></a>DORA. _State of AI-assisted Software Development 2025_.
   [dora.dev](https://dora.dev/research/2025/dora-report/)
