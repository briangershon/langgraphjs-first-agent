import "dotenv/config";

import { BaseMessageLike } from "@langchain/core/messages";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

const openAIApiKey = process.env.OPENAI_API_KEY;
if (!openAIApiKey) {
  throw new Error("OPENAI_API_KEY is not defined");
}

const model = new ChatOpenAI({
  openAIApiKey,
  temperature: 0,
});

const graphBuilder = new StateGraph(MessagesAnnotation);

async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

export const app = graphBuilder
  .addNode("agent", callModel)
  .addEdge("__start__", "agent")
  .compile();
