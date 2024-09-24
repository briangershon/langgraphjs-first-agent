// We need to import the chatbot we created so we can use it here
import { app } from "./chatbot";

// We'll use these helpers to read from the standard input in the command line
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

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
    console.log("Agent: ", output.messages[output.messages.length - 1].content);
  }
}

chatLoop().catch((error) => console.error("An error occurred:", error));
