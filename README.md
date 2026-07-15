# OmniBlocks

**OmniBlocks** is a modular, high-performance AI orchestrator designed to make building, deploying, and scaling multi-agent AI workflows incredibly simple. Think of it as "LEGO for AI"—allowing you to snap together LLMs, vector databases, API connectors, and custom logic blocks into cohesive, production-ready pipelines.

---

## 🚀 Features

* **Modular Architecture:** Build complex AI workflows using highly reusable, self-contained "blocks."
* **Provider Agnostic:** Seamlessly switch between OpenAI, Anthropic, Gemini, local models (Ollama), and more.
* **Stateful Orchestration:** Built-in memory and state management for multi-turn agent conversations.
* **Fast & Lightweight:** Written in asynchronous Python to ensure minimal latency and high throughput.
* **Visual-Ready API:** Native JSON schema generation makes it trivial to hook up to visual, drag-and-drop frontends.

---

## 🛠️ Quick Start

### 1. Installation

Install OmniBlocks via `pip`:

```bash
pip install omniblocks

```

### 2. Set Up Your Environment

Configure your API keys in a `.env` file:

```env
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here

```

### 3. Create Your First Chain

Here is a quick example of linking a Prompt Block to an LLM Block and a Parser Block to extract structured JSON:

```python
import os
from omniblocks import Workflow, PromptBlock, LLMBlock, ParserBlock

# Initialize the workflow
flow = Workflow(name="Review Summarizer")

# Define your blocks
prompt = PromptBlock(
    template="Summarize the following product review in exactly three bullet points: {review_text}"
)

llm = LLMBlock(
    provider="openai",
    model="gpt-4o",
    temperature=0.3
)

parser = ParserBlock(output_format="json")

# Connect the blocks
flow.connect(prompt).to(llm).to(parser)

# Run the workflow
result = flow.run(review_text="This camera is fantastic! The battery life easily lasts all day, the image stabilization is top-tier, and it feels incredibly rugged. However, the menu system is a bit of a labyrinth to navigate at first.")

print(result)

```

---

## 🧱 Supported Blocks

| Block Type | Description | Supported Integrations |
| --- | --- | --- |
| **LLM Block** | Routes prompts to foundational models | OpenAI, Anthropic, Gemini, Ollama, Cohere |
| **Prompt Block** | Handles dynamic templating and variable injection | Jinja2, standard string formatting |
| **Vector Block** | Handles document embedding and retrieval | Pinecone, ChromaDB, Milvus, Qdrant |
| **Tool Block** | Allows agents to execute Python code or web searches | Tavily, DuckDuckGo, Custom Python tools |
| **Logic Block** | Evaluates conditions to route workflows dynamically | If/Else routers, loops |

---

## 🤝 Contributing

We love community contributions! If you want to add a new block, fix a bug, or improve the documentation, please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
