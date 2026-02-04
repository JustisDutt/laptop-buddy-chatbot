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

  bot("Hi! I’ll help you choose a laptop.");
  bot("You can type: help, restart, or why at any time.");
  bot("First question: what’s your budget in USD? (example: 700)");
}

function showHelp() {
  bot(
    "I can help with:\n\n" +
    "• Budget: numbers like 600 or 1200\n" +
    "• Use case: school, gaming, work, creative\n" +
    "• Portability: high, medium, low\n\n" +
    "Commands:\n" +
    "• help – show this message\n" +
    "• why – explain my recommendation\n" +
    "• restart – start over"
  );
}

reset();

send.onclick = () => {
  const raw = input.value.trim();
  const text = raw.toLowerCase();
  input.value = "";

  if (!text) {
    bot("I didn’t catch that. Try typing a short answer.");
    return;
  }

  user(raw);

  /* ---------- Global commands ---------- */
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
      "Here’s how I decided:\n\n" +
      `• Budget: $${data.budget}\n` +
      `• Use case: ${data.use}\n` +
      `• Portability: ${data.portability}\n` +
      `• OS preference: ${data.os}\n\n` +
      "Laptop hardware scales strongly with price, so specs are matched to realistic market tiers."
    );
    return;
  }

  /* ---------- Budget step ---------- */
  if (step === "BUDGET") {
    const num = parseInt(text.replace(/\D/g, ""));
    if (isNaN(num)) {
      bot("I need a number for budget. Example: 700.");
      return;
    }
    if (num < 300) {
      bot(
        "That budget is very low for a new laptop.\n\n" +
        "If possible, try at least $300 for acceptable performance."
      );
      return;
    }

    data.budget = num;
    step = "USE";
    bot(
      "Got it.\n\n" +
      "What will you mainly use the laptop for?\n" +
      "Options: school, gaming, work, creative"
    );
    return;
  }

  /* ---------- Use case step ---------- */
  if (step === "USE") {
    if (!["school", "gaming", "work", "creative"].includes(text)) {
      bot(
        "I didn’t recognize that.\n\n" +
        "Please choose one of: school, gaming, work, creative."
      );
      return;
    }

    data.use = text;

    if (text === "gaming" && data.budget < 800) {
      bot(
        "Quick heads-up:\n\n" +
        "Gaming laptops with dedicated GPUs usually start closer to $800–$900."
      );
    }

    step = "PORTABILITY";
    bot(
      "How important is portability?\n\n" +
      "Options:\n" +
      "• high – carry it often\n" +
      "• medium – some travel\n" +
      "• low – mostly stays on a desk"
    );
    return;
  }

  /* ---------- Portability step ---------- */
  if (step === "PORTABILITY") {
    if (!["high", "medium", "low"].includes(text)) {
      bot("Please answer with: high, medium, or low.");
      return;
    }

    data.portability = text;
    step = "OS";
    bot(
      "Any OS preference?\n\n" +
      "Options: windows, mac, or either"
    );
    return;
  }

  /* ---------- OS + Recommendation ---------- */
  if (step === "OS") {
    if (!["windows", "mac", "either"].includes(text)) {
      bot("Please answer: windows, mac, or either.");
      return;
    }

    data.os = text;

    const b = data.budget;
    const u = data.use;

    let specs = "";
    let notes = "";

    if (u === "school" || u === "work") {
      if (b < 600) {
        specs = "8GB RAM, 256GB SSD, integrated graphics";
        notes = "Good for documents, browsing, and basic multitasking.";
      } else if (b < 900) {
        specs = "8–16GB RAM, 512GB SSD, integrated graphics";
        notes = "Comfortable for heavier multitasking and longevity.";
      } else {
        specs = "16GB RAM, 512GB–1TB SSD, integrated graphics";
        notes = "Prioritize build quality and battery life.";
      }
    }

    if (u === "gaming") {
      if (b < 800) {
        specs = "8–16GB RAM, integrated graphics";
        notes = "Only light or older games at low settings.";
      } else if (b < 1200) {
        specs = "16GB RAM, 512GB SSD, entry-level dedicated GPU";
        notes = "Playable modern games at medium settings.";
      } else {
        specs = "16–32GB RAM, 1TB SSD, strong dedicated GPU";
        notes = "High settings and better future-proofing.";
      }
    }

    if (u === "creative") {
      if (b < 900) {
        specs = "16GB RAM, 512GB SSD, integrated graphics";
        notes = "Fine for light photo/video work.";
      } else if (b < 1300) {
        specs = "16–32GB RAM, 512GB–1TB SSD, dedicated GPU recommended";
        notes = "Much better for video editing and design tools.";
      } else {
        specs = "32GB RAM, 1TB+ SSD, strong dedicated GPU";
        notes = "Ideal for demanding creative workloads.";
      }
    }

    bot(
      "Here’s my recommendation 👇\n\n" +
      "Look for a laptop with:\n" +
      `• ${specs}\n` +
      `• Price around $${b}\n\n` +
      `Notes: ${notes}\n\n` +
      "Type \"why\" to see my reasoning, or \"restart\" to try again."
    );

    step = "DONE";
  }
};
