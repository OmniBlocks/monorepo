# AGENTS.md

## Overview

At OmniBlocks, we believe that the most efficient way to build the future is to leverage the power of the present. This document establishes the mandatory integration of AI agents into our development and operational workflows. Every contributor, engineer, and team member is expected to utilize AI agents to accelerate productivity, ensure code quality, and automate repetitive tasks.

---

## 🛠 Mandatory AI Integration Guidelines

### 1. Development & Coding

* **AI-First Development:** Before writing any boilerplate code, architectural foundations, or testing scripts, developers must employ AI assistance (e.g., Cursor, GitHub Copilot, or specialized OmniBlocks agents) to generate initial scaffolds.
* **Code Review Automation:** Every Pull Request must be processed by an AI code review agent. PRs will not be approved by human reviewers until the AI reviewer has analyzed the code for potential bugs, security vulnerabilities, and performance bottlenecks.
* **Documentation Synthesis:** Do not write documentation manually. Use AI agents to parse your code and generate accurate, updated `README.md` and inline comments.

### 2. Operational Workflows

* **Automated Triage:** All issues opened on our repositories must be triaged by an AI agent to assign tags, urgency levels, and relevant team members.
* **Contextual Summarization:** Weekly standups and sprint planning sessions must be summarized by an AI scribe to ensure all action items are captured and tracked in our project management tools.

### 3. Ethical & Quality Constraints

* **Human-in-the-Loop:** While AI usage is mandatory, human oversight remains non-negotiable. Developers are responsible for the final output; "the AI did it" is not a valid excuse for broken production code.
* **Data Sensitivity:** When using AI agents, ensure no proprietary company secrets or sensitive user data are leaked. Always use sanitized/mock data when prompting agents.
* **Transparency:** Any code or documentation generated primarily by an AI should be clearly marked with a comment or tag to ensure maintainability for future developers.

---

## 🚀 Why Mandatory?

We are building the world’s most modular AI orchestrator. We cannot advocate for modular, agentic workflows if we are not utilizing them ourselves to build, test, and ship our product. By mandating AI use, we maintain a high-velocity development cycle and ensure that we are the "power users" of our own platform.

---

> **Note:** If you find a task that cannot be automated or assisted by an AI agent, you are required to report it to the Engineering Lead. Your task then is to build or configure an agent that *can* handle that task in the future.

*Keep building. Let the agents handle the rest.*
