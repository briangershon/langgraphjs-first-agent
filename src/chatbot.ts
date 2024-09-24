import "dotenv/config";

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import type { AIMessage } from "@langchain/core/messages";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";

const openAIApiKey = process.env.OPENAI_API_KEY;
if (!openAIApiKey) {
  throw new Error("OPENAI_API_KEY is not defined");
}

const searchTool = new TavilySearchResults({ maxResults: 3 });

const tools = new ToolNode([searchTool]);

const model = new ChatOpenAI({
  openAIApiKey,
  temperature: 0,
}).bindTools([searchTool]);

function shouldUseTool({ messages }: typeof MessagesAnnotation.State) {
  const lastMessage: AIMessage = messages[messages.length - 1];

  // If the LLM makes a tool call, then we route to the "tools" node
  if (!!lastMessage.tool_calls?.length) {
    return "tools";
  }
  // Otherwise, we stop (reply to the user)
  return "__end__";
}

const graphBuilder = new StateGraph(MessagesAnnotation);

async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

export const app = graphBuilder
  .addNode("agent", callModel)
  .addEdge("__start__", "agent")
  .addNode("tools", tools)
  .addConditionalEdges("agent", shouldUseTool)
  .addEdge("tools", "agent")
  .compile({ checkpointer: new MemorySaver(), interruptBefore: ["tools"] });
