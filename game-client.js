const net = require("net");

const client = new net.Socket();

const minRange = process.argv[2];
const maxRange = process.argv[3];

client.connect(3000, "127.0.0.1", () => {
  client.write(JSON.stringify({ range: `${minRange}-${maxRange}` }));
});

client.on("data", (data) => {
  const message = JSON.parse(data);
  if (message.answer) {
    console.log(`Ответ от сервера: ${message.answer}`);
  } else if (message.result === "success") {
    console.log(`Сервер угадал число! Ответ: ${message.answer}`);
    client.end();
  } else if (message.result === "fail") {
    console.log("Сервер не угадал число.");
  }
});

client.on("close", () => {
  console.log("Соединение закрыто");
});

function makeGuess(number) {
  client.write(JSON.stringify({ guess: number }));
}

process.stdin.on("data", (data) => {
  const message = data.toString().trim();
  if (message === "more" || message === "less") {
    client.write(JSON.stringify({ hint: message }));
  } else {
    const number = parseInt(message, 10);
    if (!isNaN(number)) {
      makeGuess(number);
    } else {
      console.log("Пожалуйста, введите корректное число.");
    }
  }
});
