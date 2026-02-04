const chat = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");

let step = 0;
let answers = {};

function bot(text) {
  const div = document.createElement("div");
  div.className = "message bot";
  div.textContent = "Bot: " + text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function user(text) {
  const div = document.createElement("div");
  div.className = "message user";
  div.textContent = "You: " + text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

bot("Hi! What is your budget in USD? (example: 900)");

send.onclick = () => {
  const text = input.value.trim();
  input.value = "";

  if (text === "") {
    bot("Please type something.");
    return;
  }

  user(text);

  if (step === 0) {
    const num = parseInt(text.replace(/\D/g, ""));
    if (isNaN(num)) {
      bot("I need a number, like 900.");
      return;
    }
    answers.budget = num;
    bot("What will you mainly use the laptop for? (school, gaming, work)");
    step++;
  }

  else if (step === 1) {
    if (!["school", "gaming", "work"].includes(text.toLowerCase())) {
      bot("Please choose: school, gaming, or work.");
      return;
    }
    answers.use = text;
    bot("Do you care about portability? (high, medium, low)");
    step++;
  }

  else if (step === 2) {
    if (!["high", "medium", "low"].includes(text.toLowerCase())) {
      bot("Please answer: high, medium, or low.");
      return;
    }
    answers.portability = text;
    bot("Do you prefer Windows or Mac?");
    step++;
  }

  else if (step === 3) {
    answers.os = text;
    bot(
      `Recommendation:
Budget: $${answers.budget}
Use: ${answers.use}
Portability: ${answers.portability}
OS: ${answers.os}

I recommend a mid-range laptop with 16GB RAM and SSD storage.`
    );
    step++;
  }
};
