# langgraphjs-first-agent

Review and run through new LangGraph (and LangGraph Studio) TypeScript tutorial:

https://github.com/langchain-ai/langgraphjs/tree/allan/first-agent-tutorial/docs/docs/tutorials/first-agent

## Getting Started

### Prerequisites

- install [Docker](https://www.docker.com/get-started)
- install [VSCode](https://code.visualstudio.com/download)

### Setup

- **Important: You must create an `.env` file by copying `.env.example` to `.env` and filling in the values for the dev container to run**
- add your Node.js packages to `package.json`

### Open your project in VSCode

```bash
ssh-add ~/.ssh/id_rsa   # to share your git credentials with container
code .                  # open project in VSCode
```

In VSCode, choose "Reopen in Container" to fire up container. Ensure you setup an `.env` file before launching dev container.

Open up a terminal in VSCode.

Run `env` to verify env vars look good.

`yarn dev`
