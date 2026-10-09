---
title: "I Jailbroke an AI Agent in Two Prompts by Switching to Yoruba"
date: 2026-06-30 05:17:24 +0000
description: "In my experience, I found that most safety research, benchmarks, and even training data for language models have largely been in high-resource languages, especially English.…"
tags: [ai-safety, ai, prompt-engineering, artificial-intelligence, llm]
canonical_url: https://poluwafemisani.medium.com/i-jailbroke-an-ai-agent-in-two-prompts-by-switching-to-yoruba-0d862bdebfbb
medium_url: https://poluwafemisani.medium.com/i-jailbroke-an-ai-agent-in-two-prompts-by-switching-to-yoruba-0d862bdebfbb
---

In my experience, I found that most safety research, benchmarks, and even training data for language models have largely been in high-resource languages, especially English. And it’s quite important to also note that when prompt injection attacks and guardrails have been discussed, most of the discussion happens in English. According to the study by Yong et al. (2025) of nearly 300 publications between 2020 and 2024, it was found that even high-resource, non-English languages were not getting as much attention, talk less of low-resource languages.

## The Blue Hat Moment

I had a eureka moment in May 2026 at the Microsoft BlueHat conference, where I participated in a Capture the Flag challenge. The challenge involved an AI agent that had been given instructions, and the goal was to trick the agent. The full scenario: a group of hackers called Grad Monty had taken over a system and encrypted all the files on that system using ransomware. The task for the player was to get those files decrypted. In order to decrypt the files, you were supposed to pay in cryptocurrency to either a Dash wallet or a Bitcoin wallet that the hackers had provided, after which you get a promo code. You then provide this promo code to the AI agent, who would give you the decryption key to decrypt the files. The actual task was to trick the agent into thinking that you had provided the promo code, or to get the promo code from the agent itself.

I knew immediately that this had to be a prompt injection attack, and I went to work. I tried all the things I knew about prompt injection: roleplay, persona change, crescendo prompt injection, multi-turn trust building. None of it was working. So I decided to go a bit further by trying to prompt in my local language, Yoruba, as a last resort.

To my surprise, in two prompts, the agent gave me the promo code and I was able to decrypt the files. With just two simple prompts.

## Testing the Theory on Gandalf

This surprised me, and I couldn’t stop thinking about it for days after the conference. About a week later, I remembered Lakera’s Gandalf, which is a similar challenge where they have seven progressively harder stages where you try prompt injection to get Gandalf to reveal a password. So I decided to test this theory to see if what happened was just a one-off event peculiar to the agent I encountered at the conference.

To my amazement, I passed all seven stages of Gandalf using the same method. This time around I decided to do a bit of ablation and not just use Yoruba. I switched to another West African, Nigerian language, Hausa, and what I did was code-mix, using a bit of English and Hausa together. With very short prompts of probably 300 characters or less, I was able to pass all seven levels.

For context, other people who have taken on the Gandalf challenge have documented needing base64 encoding, elaborate persona construction, and multi-step approaches to pass the later stages. I did it with simple, short prompts in a low-resource language. I documented my process in a LinkedIn post here: [https://www.linkedin.com/posts/activity-7465088117121789952-nrsd](https://www.linkedin.com/posts/activity-7465088117121789952-nrsd?utm_source=share&utm_medium=member_desktop&rcm=ACoAAA8Yrf8BNd1zk9UmiAdCRWVFALDcqKLLSyk)

## Existing Research Backs This Up

It was quite interesting to me to see this, and I decided to research whether further work had been done in this area. In my research, I found work done by Godwin Faruna, who proposed the LSR benchmark (Linguistic Safety Robustness) specifically for evaluating this kind of scenario with low-resource West African languages (2026).

What Faruna found maps closely onto what I experienced. He evaluated Gemini 2.5 Flash across four West African languages (Yoruba, Hausa, Igbo, and Igala) using a dual-probe evaluation protocol. Basically, he submitted matched English and target-language probes to the same model and measured what happened. He introduced a metric called refusal centroid drift, which is essentially a way to quantify how much of a model’s English refusal behavior disappears when harmful intent is encoded in a target language.

The results were stark. English refusal rates held at about 90%. Across the West African languages, refusal rates dropped by 35 to 55 percentage points. That is a massive gap. A model that refuses a harmful prompt in English nine times out of ten might only refuse that same prompt four or five times out of ten when it’s written in Yoruba or Hausa.

Faruna tested 14 culturally grounded attacks across four harm categories and used the UK AISI Inspect evaluation framework. He’s proposing to add the LSR benchmark to the Inspect repository, which would give it significant reach in the AI safety community.

My field observations are consistent with his findings. The difference is that I ran into this in adversarial, real-world environments, a live CTF with a hardened model and a public safety benchmarking platform, rather than a controlled research setting. Two independent angles pointing at the same problem.

## What I Want to Do Next

Faruna’s benchmark covers one model family. The natural question is whether this holds more broadly, and I think the tooling exists today to answer that. Here’s what I’m planning:

First, I want to replicate the refusal centroid drift finding across other frontier model families like GPT-4o, Claude, Llama 3, and Mistral to see if some architectures are more robust than others. If the pattern holds across model families, this is not a one-model anomaly. It’s a structural gap in how safety fine-tuning generalizes across languages.

Second, I want to dig into which harm categories show the largest degradation. Are some types of harmful intent more easily encoded in low-resource languages than others? That matters for understanding where the real risk is concentrated.

Third, I want to build an automated prompt translation pipeline using Microsoft PyRIT to systematically translate attack prompts across languages and harm categories. Right now the bottleneck is manual. You need someone who speaks these languages crafting prompts one by one. Automating that opens up the scale of evaluation significantly.

Fourth, I want to expand beyond West African languages. Do similar patterns hold in other low-resource language families? This is a global question, not just a West African one.

## Why This Matters

Most AI safety red-teaming happens in English, by practitioners who are predominantly English-first speakers, evaluating models that were predominantly fine-tuned on English safety data. But low-resource language speakers are not an edge case in global AI deployment. They represent a significant portion of the world’s population, and they are already interacting with AI systems whose safety properties have not been tested in their languages.

If guardrails degrade significantly when harmful prompts are written in Yoruba, Hausa, or Igbo, then every AI system deployed across West Africa is operating with a weakened safety profile that its developers probably haven’t measured. That’s not a theoretical concern. I watched it happen in practice, twice.

I’m not claiming to have fully characterized this problem. Two experiments are not a study. But two independent real-world observations, consistent with existing research, are enough to justify studying it rigorously. The tooling to do that (PyRIT, Inspect, open model APIs) is available today.

I’m currently designing the extended study. If you’re working in this space or have relevant data, I’d welcome collaboration.

## References

Faruna, G. A. (2026). LSR: Linguistic Safety Robustness Benchmark for Low-Resource West African Languages. Fagmart Lab. Preprint, February 2026. Reference implementation: <https://huggingface.co/spaces/Faruna01/lsr-dashboard>. Dataset: <https://huggingface.co/datasets/Faruna01/lsr-benchmark>.

Yong, Z.-X., Ermis, B., Fadaee, M., Bach, S. H., and Kreutzer, J. (2025). The State of Multilingual LLM Safety Research: From Measuring the Language Gap to Mitigating It. EMNLP 2025, pages 15845–15860. <https://arxiv.org/abs/2505.24119>
