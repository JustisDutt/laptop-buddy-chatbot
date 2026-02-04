const chat = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");

let step = "BUDGET";
let data = {};

function addMessage(text, role) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.textContent = (role === "bot" ? "Bot: " : "You: ") + text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function bot(text) {
  addMessage(text, "bot");
}

function user(text) {
  addMessage(text, "user");
}

function reset() {
  chat.innerHTML = "";
  step = "BUDGET";
  data = {};
  bot("Hi! I’ll help you choose a laptop. You can type 'help' or 'restart' at any time.");
  bot("First question: what is your budget in USD? (example: 900)");
}

function showHelp() {
  bot(
    "Help menu:\n" +
    "- Enter numbers for budget (example: 800)\n" +
    "- Use cases: school, gaming, work, creative\n" +
    "- Portability: high, medium, low\n" +
    "- Type 'why' to see reasoning\n" +
    "- Type 'restart' to start over"
  );
}

reset();

send.onclick = () => {
  const text = input.value.trim().toLowerCase();
  input.value = "";

  if (!text) {
    bot("I didn’t catch that. Try typing a short answer.");
    return;
  }

  user(text);

  // GLOBAL COMMANDS
  if (text === "restart") {
    reset();
    return;
  }

  if (text === "help") {
    showHelp();
    return;
  }

  if (text === "why" && step === "DONE") {
    bot(
      `I recommended this because:
- Budget: $${data.budget}
- Use case: ${data.use}
- Portability: ${data.portability}
- OS preference: ${data.os}

These factors balance performance, cost, and usability.`
    );
    return;
  }

  // STEP: BUDGET
  if (step === "BUDGET") {
    const num = parseInt(text.replace(/\D/g, ""));
    if (isNaN(num)) {
      bot("I was expecting a number like 900. Could you try again?");
      return;
    }
    if (num < 300) {
      bot("That budget is very low for a laptop. If possible, consider at least $300.");
      return;
    }
    data.budget = num;
    step = "USE";
    bot("What will you mainly use the laptop for? (school, gaming, work, creative)");
    return;
  }

  // STEP: USE CASE
  if (step === "USE") {
    if (!["school", "gaming", "work", "creative"].includes(text)) {
      bot("I didn’t recognize that. Please choose: school, gaming, work, or creative.");
      return;
    }
    data.use = text;

    if (text === "gaming" && data.budget < 600) {
      bot("Just a heads-up: gaming laptops usually need a higher budget for good performance.");
    }

    step = "PORTABILITY";
    bot("How important is portability? (high, medium, low)");
    return;
  }

  // STEP: PORTABILITY
  if (step === "PORTABILITY") {
    if (!["high", "medium", "low"].includes(text)) {
      bot("Please answer with: high, medium, or low.");
      return;
    }
    data.portability = text;
    step = "OS";
    bot("Do you prefer Windows or Mac? (or type 'either')");
    return;
  }

  // STEP: OS
  if (step === "OS") {
    if (!["windows", "mac", "either"].includes(text)) {
      bot("Please answer with: windows, mac, or either.");
      return;
    }
    data.os = text;

    let recommendation = "a balanced mid-range laptop";
    if (data.use === "gaming") recommendation = "a gaming laptop with a dedicated GPU";
    if (data.use === "school") recommendation = "a lightweight laptop with good battery life";
    if (data.use === "creative") recommendation = "a laptop with strong CPU and high-quality display";

    bot(
      `Recommendation:\n` +
      `Based on your answers, I recommend ${recommendation}.\n\n` +
      `Key specs to look for:\n` +
      `- 16GB RAM\n` +
      `- SSD storage\n` +
      `- Price around $${data.budget}\n\n` +
      `Type 'why' to see how I decided, or 'restart' to try again.`
    );

    step = "DONE";
    return;
  }
};
