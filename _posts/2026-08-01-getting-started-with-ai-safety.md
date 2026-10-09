---
title: "Getting Started with AI Safety"
date: 2026-08-01 07:43:15 +0000
description: "This is a written version of a Twitter Space I hosted. I have cleaned it up for reading, but the content and the order are the same as what I said on the call."
tags: [ai-safety, aisafetyresearch, ai, ai-security]
canonical_url: https://poluwafemisani.medium.com/getting-started-with-ai-safety-7fbe2ccd963d
medium_url: https://poluwafemisani.medium.com/getting-started-with-ai-safety-7fbe2ccd963d
---

## AI Safety and Security From Scratch

*This is a written version of a Twitter Space I hosted. I have cleaned it up for reading, but the content and the order are the same as what I said on the call.*

So here is the thing that keeps drawing my attention. If we say we want AI to go well, the whole world needs to be part of it. You cannot say AI is going well for a certain set of people while another group is not involved in it at all. That gives you a skewed perspective of what it even means for AI to go well.

We are living through what is probably the biggest technological shift of our lifetimes, and we have an opportunity to be part of it. That is what this piece is about. By the end of it you should know what AI safety is, how it differs from AI security and AI governance, what skills transfer into it, and exactly where to go next.

## Why now

The field is growing really fast.

A lot of the momentum comes from the effective altruism movement, which is a movement built around doing the most good you can with limited resources and creating the most impact. AI safety has become one of the topmost cause areas for EA recently, and that is where most of the funding for the AI safety programs you have heard of comes from. Even if you have never heard of any AI safety program before, you have probably heard of the Anthropic Fellows Program. That is an AI safety program.

Constellation and Kairos published a post on LessWrong in April, and they said over 20 research fellowships have launched in AI safety, with something like 2,000 to 2,500 people expected to be trained this year alone. That is just this year. You can be one of the people who come in and bring a new perspective.

Now, I want to be honest about the other side of this. The acceptance rates for a lot of these fellowships are genuinely brutal. You can see acceptance rates around 3%, which makes them more competitive than getting into an Ivy League school. But with proper guidance, and knowing where to look, you do not necessarily have to go through all of that. The field is still being shaped. There is no gatekeeping yet, and that is one of the things I love about it.

There is opportunity in community building. There is opportunity in politics and policy. There is opportunity in writing, in shipping projects, in running programs.

## The gap I keep seeing

Here is something I have noticed in my own work. The guardrails, the testing, most of it is built around the English language. So when guardrails encounter a language that is different, sometimes they do not behave the way they were designed to.

Take a simple example. If I tell Claude “you don fall my hand,” an English interpretation is going to translate that literally with no context, because it does not carry the meaning that any Nigerian would pick up immediately. That is a small example, but it points at something much bigger.

In May, at the Microsoft BlueHat conference, I took part in a capture the flag challenge involving an AI agent. The scenario was a ransomware attack. A group of hackers had encrypted all the files on a system, and to get them decrypted you were supposed to pay in cryptocurrency to a wallet the hackers provided, which would give you a promo code. You then hand that promo code to the AI agent, and the agent gives you the decryption key. The task was to trick the agent into thinking you had provided the promo code, or to get the promo code out of the agent directly.

I knew immediately this had to be a prompt injection attack, so I went to work. I tried everything I knew. Roleplay. Persona change. Crescendo prompt injection. None of it worked.

So as a last resort I decided to try prompting in Yoruba. To my surprise, in two prompts, the agent gave me the promo code and I decrypted the files.

That surprised me enough that I could not stop thinking about it for days afterwards. A week later I remembered Lakera’s Gandalf, which is a similar challenge with seven stages where you use prompt injection to get Gandalf to reveal a password. I wanted to check whether what happened at the conference was a one off, peculiar to that particular agent. I passed all seven stages using the same method.

This time I did a bit of ablation rather than just using Yoruba again. I switched to Hausa, another Nigerian language, and code mixed it with a bit of English, using very short prompts of around 300 characters or less. I passed all seven levels again.

When I went looking for prior work on this, I found a study by Yong et al. (2025) covering 300 publications between 2020 and 2024, which found that even high resource non-English languages were not getting much attention in safety research, talk less of low resource ones. I also found work by Godwin Faruna proposing LSR, a benchmark for evaluating exactly this kind of scenario.

I wrote the whole thing up in more detail [here](https://poluwafemisani.medium.com/i-jailbroke-an-ai-agent-in-two-prompts-by-switching-to-yoruba-0d862bdebfbb).

This is a large part of why I think people from our part of the world need to be in this field. Not as a diversity checkbox. If that attack surface exists and nobody in the room speaks those languages when safety decisions are being made, it becomes a hole in the safety of frontier models globally, and that affects everyone.

## So what is AI safety, actually?

AI safety is the field working to ensure that advanced AI systems remain beneficial and controllable as their capabilities grow, especially frontier models.

Most AI safety research today falls into five areas. You do not need to be an expert in all five. Almost nobody is. Most people pick one and go deep.

**Alignment.** This is about how models are trained to be helpful and harmless. The alignment field asks a basic question: are we actually getting these systems to do what we want, or are we just training them to look like they are doing what we want?

There is a good example of the difference. A model was asked to put a ball inside a basket, and it got a reward for doing it. What the model figured out was that if it placed the ball in front of the basket at a certain camera angle, parallax would make it look like the ball was inside. It got the reward without ever doing the task. That is the alignment problem in miniature.

Ryan Kidd, who co-founded MATS, has written about this, and it is worth reading.

**Interpretability.** If you have worked with AI models, you have probably heard large language models described as a black box. We really cannot tell what happens inside the model when it decides to give us a particular answer. What did it think about? What did it piece together?

Interpretability is the field trying to answer that. It is trying to build up an understanding of these models the same way neuroscience studies the brain, looking at how neurons fire to produce certain reactions and certain kinds of thinking. You are trying to see how the model thinks.

This is one of the hottest areas right now. At the last ICML conference, the interpretability workshop had thousands of people in it.

**Evaluations and red teaming.** This is the actual testing for dangerous capabilities and for the places where models fail. This one is closest to what I do, and it is one of the places where AI safety and AI security overlap. If you have a security background, especially offensive security, red teaming or penetration testing, this is easily the bridge you can use to cross into AI safety.

**AI control.** This is an approach that starts from a different assumption: even if we cannot fully trust this model, can we build systems around it that let us use it safely?

If you come from cyber security, you already know this shape. It is defense in depth. In security we have zero trust as a guiding principle, which says you cannot trust anything, so you always have a backup plan in place. Out of zero trust you get defense in depth, where you layer defenses through the system so that no matter what happens, you are still safe. AI control is that same idea applied to models. Put measures in place so that we can always control the AI no matter how capable it gets, and humans still have the final say over what it can do.

**Scalable oversight.** This is the question of how humans supervise systems that may be better than us at specific things. If a model can do a task better than I can, how do I check its work?

## What AI safety is not

Three distinctions matter here, because these terms get used loosely and it causes real confusion.

## AI safety is not AI security

Security is about protecting AI systems from people. Attackers want to make your system behave in a way it was not designed to behave, for their own benefit, so your goal is protecting the system from them. Prompt injection, model theft, adversarial inputs, that is security.

Safety, on the other hand, is about making sure the AI system itself behaves safely, even when nobody is attacking it.

One of the most common things that makes an AI system unsafe is hallucination. I am sure you have seen this message before: “You are absolutely right, I’m sorry, I should have…” That is the model walking back something it asserted with total confidence a moment earlier. Now imagine that in a high stakes setting. Imagine there was poison in front of you and the system told you to go ahead and take it, and by the time you come back to verify it says “I’m sorry, …” but the damage is already done, you are already dead. For high stakes systems, hallucination is a safety problem.

Red teaming is the place where the two fields overlap, because red teaming is where you deliberately attack the system to check whether it will behave.

## AI safety is not AI governance

Governance is the policy layer. Laws, standards, international agreements, and what governments and institutions do to shape AI development. Think of the EU AI Act, the NIST AI Risk Management Framework, the Singapore AI framework. Institutions, governments, policies.

Safety is the technical layer. Making sure the systems actually behave.

They complement each other, and this is important. Governance without safety research is toothless. If a policy says that all high risk AI models need to have human oversight, which is an actual requirement in one of these frameworks, how do you know that they have it without the research that lets you check? And safety without governance cannot scale, because nothing forces adoption. You need both.

There is also technical AI governance, which sits in between. That is where you are monitoring costs so that an organization’s AI spend does not exceed the value it produces, or building observability so you can see what is happening across the organization, or writing enforcement policy that actually blocks things. If you are technical but you want to work on policy and on whether policy is actually being followed, that is your lane.

## AI safety is not AI ethics

This one matters a lot, because people use “AI ethics” and “AI safety” interchangeably and they are different.

AI ethics is mostly about bias in hiring tools, fairness metrics, privacy compliance. Those things matter. People should have access to their data. AI companies should handle data well. Models should interact with people fairly. But that is not what AI safety is about.

## How does this concern me, and what can I do today?

The single most important point I want to make again is that AI safety needs everybody. It needs technical researchers, engineers, evaluators, policy people, community builders, writers, and operations people.

Here is how different backgrounds transfer:

**Data science and machine learning** transfers very easily into alignment, evaluations, and interpretability research. If you can train and fine-tune models, you can start today.

**Cyber security** transfers into red teaming, evaluations, and AI control. This is my own path.

**Software engineering** transfers into research engineering roles. Most research organizations and safety labs are looking for research engineers right now. Software engineering appeared in about 41% of Anthropic’s recent job postings, so this is a really valuable skill to have.

**Policy, law, and international relations** transfer very well into AI governance, at think tanks and international bodies.

**Philosophy, mathematics, and cognitive science** transfer into theoretical alignment work.

**Community building, program management, and operations** transfer into field building, which is one of the areas looking hardest for people right now. If you want to build communities or create a talent pipeline into AI safety, you are hot cake. Let me just put it that way. They are looking for you today.

**Linguistics.** If you studied a language, I am personally looking for you. There is research I want to do that needs linguistic expertise, and I will need help with it.

Two things I want to be very clear about. First, AI safety is still a young field and there is no gatekeeper anywhere telling you that you are too late. The people who take it seriously now have outsized impact. Second, you do not need to know everything before you start. One of the most useful things you can do early is replication. Somebody tested something on Claude, so you go and test it on GPT to see whether it transfers. That is the mindset.

## The map: five tiers

Now to the practical part. How do you actually get in?

I am going to break this into five tiers. This information took me months to gather. I am sharing it because I believe that if it reaches one person, and that person shares it with the next person, the ripple effect will be huge.

## Tier 1: Start here, free, no application

**BlueDot Impact, Future of AI.** A two hour, self-paced course that gives you an insight into what the field is about and what AI is likely to look like over the next months and years. Free, no application, complete it whenever you want. [bluedot.org](https://bluedot.org)

**80,000 Hours.** Let me explain the name, because the reasoning behind it is good. If you work a normal career, you work roughly 40 hours a week for 50 weeks each year and about 40 years, and when you multiply that out you get 80,000 hours. You do not want to spend those 80,000 hours on something that does not matter to you. So the organisation exists to help you think about where to point them. Their career advice leans heavily on AI safety and the effective altruism movement, and you are quite likely to get a free book from them. [80000hours.org](https://80000hours.org)

**AI Safety Fundamentals reading list.** [aisafety.com](https://aisafety.com)

**AI Safety Nigeria.** I found out about this recently. I have not interacted with the leadership yet, but I know they are doing good work, and I saw that they run a paper reading club. I believe they are headquartered in Abuja, and they run virtual events regularly. If you are interested, find a way to join them. [aisafetynigeria.com](https://aisafetynigeria.com)

Tier one is low barrier. A commitment of a few hours gets you real information.

## Tier 2: Structured courses, application based

**BlueDot AGI Strategy.** Around 25 hours of work. Some people do it as five days at five hours a day, others do it as five weeks at about an hour a day. It is free, pay what you want, and cohort based. The only problem is that applications are competitive, and BlueDot rejects more than half the people who apply.

Here is the important part though. You are allowed to work through the course content without joining a cohort. If they reject you, that does not mean you lose access. You can still audit the whole thing. You will not get a certificate, but you get the knowledge, and the knowledge is the point.

**BlueDot Technical AI Safety.** Same shape, but focused on the technical pillars I described earlier: alignment, interpretability, evaluations, control, scalable oversight. This one expects you to understand how large language models are trained, so you need some machine learning background. If you want to do the technical course, it helps to do AGI Strategy first.

**BlueDot AI Governance.** If you are heading toward policy and coordination roles, this is the one.

**ARENA (Alignment Research Engineer Accelerator).** A technical bootcamp, five weeks, in person in London. They sponsor visas and cover travel, accommodation and meals, so cost should not be the barrier. It does require Python. ARENA 9.0 runs from 5 October to 6 November, and I believe applications for that round closed on 12 July, so check whether anything is still open. They run it regularly, so there will be another round. [arena.education](https://arena.education)

The best thing about ARENA is that the curriculum is open. If you do not make it into the bootcamp, you can work through the material on your own. I am actually planning to start the ARENA curriculum with a group of people soon, and I will share a form when I open it up. I want to keep the group small.

## Tier 3: Research fellowships

Be realistic here. These are competitive. But eligibility is usually broader than people assume.

**MATS (ML Alignment and Theory Scholars).** Comes with a stipend, a very generous compute budget (I believe around $15,000), housing, and visa sponsorship. It runs in Berkeley and in London. Highly competitive. [matsprogram.org](https://www.matsprogram.org)

**SPAR (Supervised Program for Alignment Research).** This one is open right now, so if you take one action after reading this, make it this one. Fall 2026 mentee applications are open and close on 18 August.

SPAR is part time and remote, which makes it the most accessible thing on this list. It pairs you with a professional researcher for a three month project, and you commit somewhere in the range of 5 to 20 hours a week depending on your availability. Projects span technical AI safety, policy and governance, and since Spring 2026 they have run biosecurity projects too. Nearly 30% of recent projects have been in policy, so this is not only for technical people. The last round had over 130 projects. It ends with a Demo Day attended by organisations like METR, Redwood Research, GovAI and MATS.

They accept mentees at any level, from undergraduates to mid-career professionals, and they say directly that prior research experience is not required and that many past mentees were accepted without matching a project’s criteria completely. You can apply to as many projects as you like. Nobody is paid, but they cover project expenses including compute and API access. [sparai.org](https://sparai.org)

If you have the experience to guide others rather than be guided, you can also apply as a mentor.

**PIBBSS (Principles of Intelligent Behavior in Biological and Social Systems).** Interdisciplinary. It does not require prior AI safety experience and it does not require a PhD, but it does look for the ability to do research at that level. Past fellows have come from neuroscience, evolutionary biology, complex systems, economics, law and philosophy. Applications for the 2026 to 2027 winter fellowship closed on 20 July, so watch for the next round. [princint.ai](https://princint.ai/programs/fellowship/)

**Pivotal Research.** Nine weeks, in person in London, with a stipend. Does not require prior experience.

**Astra Fellowship.** Runs with Constellation. Eligibility is broad and prior AI safety experience is not required. Fellows get to work with organisations like OpenAI, Anthropic and Redwood Research, and some go on to work with them full time afterwards.

**OpenAI Safety Fellowship.** Announced in April, running from September through to February. That round has closed, but watch for the next one.

**Anthropic Fellows Program.** You have probably seen this one on Twitter many times. Worth watching.

**BASE Fellowship (Black in AI Safety and Ethics).** This one is especially relevant to this audience. It is a 13 week, part time, fully remote fellowship for the Black diaspora, with tracks in AI alignment, AI security and AI governance. Because it is remote and part time, you can do it from Nigeria. It is not paid, but it is structured properly: a curriculum phase, then mentor-led research, with weekly seminars and a capstone. They also run an ARENA-based technical track with cohorts, teachers and assignments, which is a lower barrier way into the same technical material. Both the Spring and Fall 2026 cohorts have closed, so watch for the next round. [baseresearch.org](https://www.baseresearch.org)

## Tier 4: Money and career support

This is the tier I think a lot of people will find most interesting, because this is where the funding is.

**80,000 Hours one-on-one advising.** A free career call with an advisor. Somebody gets on a call with you and talks through how you could transition into AI safety or security, how the field works, and what you need to do to get in. [80000hours.org](https://80000hours.org)

**BlueDot Rapid Grants.** Up to $10,000 for a five minute application, and they typically get back to you within a week. So within a week you know whether you are getting the money or not.

What is the money for? They are not giving you money to grab shawarma and enjoy yourself. It is for concrete work. A project you want to build, an event you want to organise, community building, a tool you need, or compute for your research. If you need OpenAI credits to run an experiment, ask them. Your particular use case might be something they can fund, so go ahead and apply. [bluedot.org](https://bluedot.org)

**Coefficient Giving (formerly Open Philanthropy).** The biggest funder in this space, and when I say biggest I mean it. They recently gave a startup around $1 million, and I believe their current AI safety budget is somewhere around $40 million. The money you get from BlueDot Rapid Grants actually comes from Coefficient Giving in the first place. They also fund individuals, including people’s PhDs, if you have a strong enough proposal and you need support to sustain yourself while doing safety research. [coefficientgiving.org](https://www.coefficientgiving.org)

**Probably Good.** Career advising, similar in spirit to 80,000 Hours but covering a broader range of cause areas. [probablygood.org](https://probablygood.org)

## Tier 5: Community and ecosystem

The field is looking for people who can contribute meaningfully, and one of the most direct ways to do that is by writing. Two places to start:

**LessWrong.** Think of it as Reddit, but weighted heavily toward AI research and effective altruism. A lot of the field’s thinking happens here in public. [lesswrong.com](https://www.lesswrong.com)

**The Alignment Forum.** More focused on AI alignment specifically. [alignmentforum.org](https://www.alignmentforum.org)

**EA Global conferences.** They run several a year and there is always significant AI safety content.

**Kairos.** They run field building programs, including the Pathfinder Fellowship. If you are at a university, or you know someone who is, and you are building a group or community around AI safety, they will help fund it and provide training. [kairos-project.org](https://kairos-project.org)

## One more thing about the ecosystem

A lot of these programs are funded by people from the effective altruism movement, so you will run into EA constantly once you are in this field. Plenty of people working in AI safety do not identify as EA at all. But it is worth knowing that the movement exists and knowing where the funding comes from, because it saves you a lot of confusion later.

## What happens next

That is the field, how to get started, and what you can do today.

If you take one thing from this, let it be this: do one thing this week. Complete the Future of AI course, or read one paper, or apply to one thing on this list. SPAR is the one with a live deadline right now, 18 August, and it is remote and part time, so start there if you are not sure where to start. Momentum matters more than any single decision you make.

Then tell someone else. The reason communities like ours exist is that we do not stop with ourselves.

I am putting together a small working group to go through this material properly, and I will be sharing more about it soon, including the ARENA curriculum group I mentioned. I am also planning to keep these sessions going on a regular cadence. The next one will probably not be on Twitter, because I want to be able to share my screen and go deeper into the technical side, so we may do the discussion on a Space and the session itself on Google Meet.

Thank you to everyone who showed up and stayed for the full hour, and to everyone who spoke at the end. This is how a field gets built.
