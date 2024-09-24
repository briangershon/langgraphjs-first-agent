// We need to import the chatbot we created so we can use it here
import { app } from "./chatbot";

// We'll use these helpers to read from the standard input in the command line
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { AIMessage } from "@langchain/core/messages";

const lineReader = readline.createInterface({ input, output });

console.log("Type 'exit' or 'quit' to quit");

async function chatLoop() {
  while (true) {
    const answer = await lineReader.question("User: ");
    if (["exit", "quit", "q"].includes(answer.toLowerCase())) {
      console.log("Goodbye!");
      lineReader.close();
      break;
    }

    // Run the chatbot, providing it the `messages` array containing the conversation
    const output = await app.invoke(
      {
        messages: [{ content: answer, type: "user" }],
      },
      { configurable: { thread_id: "42" } }
    );

    const lastMessage = output.messages[output.messages.length - 1];
    if (
      lastMessage instanceof AIMessage &&
      lastMessage.tool_calls !== undefined
    ) {
      console.log(
        "Agent: I would like to make the following tool calls: ",
        lastMessage.tool_calls
      );

      // 2. Let the human decide whether to continue or not
      const humanFeedback = await lineReader.question(
        "Type 'y' to continue, or anything else to exit: "
      );
      if (humanFeedback.toLowerCase() !== "y") {
        console.log("Goodbye!");
        lineReader.close();
        break;
      }

      // 3. No new state is needed for the agent to use the tool, so pass `null`
      const outputWithTool = await app.invoke(null, {
        configurable: { thread_id: "42" },
      });
      console.log(
        "Agent: ",
        outputWithTool.messages[outputWithTool.messages.length - 1].content
      );
      continue;
    }

    console.log("Agent: ", output.messages[output.messages.length - 1]);
  }
}

chatLoop().catch((error) => console.error("An error occurred:", error));
