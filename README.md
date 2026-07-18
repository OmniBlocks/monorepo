# OmniBlocks

**OmniBlocks** is an agentic vibe coding tool designed to let you build slop software by describing your intent in natural language. Forget the boilerplate—OmniBlocks bridges the gap between your vision and a functioning codebase by orchestrating intelligent agents to plan, execute, and verify your code in real-time.

---

## 🚀 Overview

"Vibe coding" is about giving the creative flow of development to a clanker. OmniBlocks facilitates this by acting as your autonomous pair programmer. You provide the high-level intent, and OmniBlocks manages the underlying complexity—file structures, dependencies, and git commits—allowing you to focus entirely on the "what" rather than the "how."

## ✨ Key Features

* **Agentic Orchestration:** Built-in agents for planning, coding, and verification ensure that your code is not just written, but tested and integrated.
* **Plan-Implement-Run Workflow:** Uses a disciplined approach to break down complex requirements into actionable steps before touching a single line of code.
* **Seamless Context Management:** Automatically injects relevant project documentation, file structures, and coding standards into your prompts for higher accuracy.
* **Continuous Iteration:** Designed for rapid feedback loops. If the output doesn't match the "vibe," iterate with simple natural language refinements.
* **Git-First Philosophy:** Ensures your work is saved with automatic commits, so you never lose progress during experimental sessions.

## 🛠️ Quick Start

### Prerequisites

* Node.js (v18+)
* An API key from your preferred LLM provider (e.g., Anthropic, OpenAI, or Ollama for local models).

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/omniblocks.git
cd omniblocks

# Install dependencies
npm install

# Configure your environment
cp .env.example .env
# Add your LLM API Key to the .env file

```

### Usage

Start your session by defining your vision:

```bash
npx omniblocks "Create a dashboard for tracking personal finance with dark mode"

```

OmniBlocks will generate a `docs/plans/dashboard.plan.md`, present it for your approval, and then proceed to build the requested features once you give the signal.

## 📋 The Vibe Coding Mindset

To get the best results with OmniBlocks, remember:

1. **Be Explicit, Not Exhaustive:** You don't need to write the code yourself, but you must be clear about your requirements.
2. **Continuous Commits:** When the agent hits a milestone that works, commit it immediately.
3. **Iterate:** If the result isn't perfect, treat the AI as a partner. Use small, descriptive prompts to steer it back toward your vision.

## 🤝 Contributing

We love contributions! If you have ideas for new agent behaviors or want to improve the orchestration logic, please check out our [Contributing Guidelines](https://www.google.com/search?q=CONTRIBUTING.md).

---

*Built to embrace the exponentials. Happy coding.*
