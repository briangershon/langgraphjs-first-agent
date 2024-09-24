import "dotenv/config";

import { BaseMessageLike } from "@langchain/core/messages";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

export async function run() {
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

  const app = graphBuilder
    .addNode("agent", callModel)
    .addEdge("__start__", "agent")
    .compile();

  const messages = Array<BaseMessageLike>();
  messages.push({ content: "hello", role: "user" });

  console.log('Telling the model "hello"');
  const output = await app.invoke({ messages });
  console.log(`Model's reply is "${output.messages.at(-1).content}"`);
}
