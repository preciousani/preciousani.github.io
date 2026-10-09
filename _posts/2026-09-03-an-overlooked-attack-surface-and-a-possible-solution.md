---
title: "An Overlooked Attack Surface and a Possible solution"
date: 2026-09-03 18:09:51 +0000
description: "A new attack surface is available right now, and security teams and organizations surprisingly are not paying as much attention as they should to it. If the security incidents…"
tags: [agentic-workflow, agentic-ai-architecture, ai-security, agentic-ai-security]
image: /assets/images/blog/an-overlooked-attack-surface-and-a-possible-solution/01.jpeg
canonical_url: https://poluwafemisani.medium.com/an-overlooked-attack-surface-and-a-possible-solution-44073b546d2f
medium_url: https://poluwafemisani.medium.com/an-overlooked-attack-surface-and-a-possible-solution-44073b546d2f
---

<figure>
  <img src="/assets/images/blog/an-overlooked-attack-surface-and-a-possible-solution/01.jpeg" alt="Image Source: AI Generated (Gemini)" loading="lazy">
  <figcaption>Image Source: AI Generated (Gemini)</figcaption>
</figure>

A new attack surface is available right now, and security teams and organizations surprisingly are not paying as much attention as they should to it. If the security incidents with the top labs (e.g. OpenAI — Hugging face incident) has taught me anything, it is that no vulnerability or finding is negligible. You can read more about the incident, but one thing I want to bring out clearly is the fact that autonomous agents were able to coordinate and chain multiple vulnerabilities together (like SSRF, misconfigurations, and credential harvesting) to escape their sandboxes and compromise Hugging Face’s infrastructure.

So it begs the question: when you have findings in your environment that are labeled as ignored findings, suppressed findings, or false positives, can this set of vulnerabilities become the door through which an attacker walks in tomorrow?

**This is why I built Regnore.**

What it does is use an agentic orchestration system, **LangGraph**, to help you triage these findings and also review them in order for you to have not just a rubber-stamp process for vulnerability verification, but actually digging deep to find out if these false positives are false positives or they are exploitable findings that attackers can leverage.

The architecture behind this is also built on the very basic security principles: **zero trust, defense in depth**. It is an open-source platform that connects to two known **SAST/SCA** tools via API keys and can work with any **SAST/SCA** tool you have because you can download the ignored findings or suppressed findings as **CSV, JSON, XLSX**, from whatever scanner your team uses and upload it into **Regnore**. The agent reads the vulnerability, the developer’s justification, and the surrounding code snippet, then it writes a structured recommendation: accept, reject, or escalate.

The agents never get the final word. What they do is recommend. Critical and high severity findings can never be auto-accepted, and I did not even make this an instruction or a system prompt. This is a deterministic policy baked into the database itself. Another thing that I did was make sure that if the agent’s confidence drops below a threshold of 70%, it escalates to a human security professional immediately. There is also a kill switch baked into the tool that halts all automations or autonomous actions by agents immediately.

For every system that interacts with LLM, there is a reason why prompt injection remains number one on the **OWASP top 10.** I tried to get prompt injection minimized, so there is a mechanical filter, a pre-filter, that catches prompt injection payloads before they even touch the LLM. Every decision, whether it is an agent recommendation, an override by the security engineer, the toggling of the kill switch, gets logged into a tamper-evident **HMAC hash chain.** That is a cryptographic chain where if you delete or edit any single entry, the entire sequence gets broken.

I also built the reviewer dashboard for the security engineer to be slightly paranoid like myself. Those invisible Unicode tricks with bidirectional text controls that can make malicious code look harmless, or scenarios where someone tries to sneak code markers into the Jira code block or channel pings into Slack, all of those get sanitized before it leaves the system.

Now, I have built this to be fully open source, so you can contribute to it. If there are areas where I have not considered, you can be a part of it and make this even better. And I believe AI security, or security AI that teams use, should not be a black box. So if AI is making recommendations for your codebase, you should be able to read the prompt, audit the guardrails, and even verify the governance policies yourself.

Tools that were baked into this process include **Garak, PyRIT, Microsoft Agentic Governance Toolkit, Monaco, LangGraph, and NeMo Guardrails.**

If your team has a backlog of ignored or suppressed findings that nobody has gone back to verify, I built this for you.

🔗 [github.com/DroidPrezzo/regnore](http://github.com/DroidPrezzo/regnore)
