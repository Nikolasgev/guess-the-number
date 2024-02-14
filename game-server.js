const net = require("net");

const server = net.createServer((socket) => {
  console.log("Игра началась...");

  let secretNumber;
  let minRange;
  let maxRange;

  function sendAnswer() {
    const answer =
      Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
    secretNumber = answer;
    socket.write(JSON.stringify({ answer }));
  }

  socket.on("data", (data) => {
    const message = JSON.parse(data);
    if (message.range) {
      const [min, max] = message.range.split("-");
      minRange = parseInt(min, 10);
      maxRange = parseInt(max, 10);
      sendAnswer();
    } else if (message.hint) {
      if (message.hint === "more") {
        minRange = secretNumber + 1;
      } else if (message.hint === "less") {
        maxRange = secretNumber - 1;
      }
      sendAnswer();
    } else if (message.guess) {
      if (message.guess === secretNumber) {
        socket.write(
          JSON.stringify({ result: "success", answer: secretNumber })
        );
        socket.end();
      } else {
        socket.write(JSON.stringify({ result: "fail" }));
      }
    }
  });

  socket.on("end", () => {
    console.log("Игра завершена");
  });
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Готов к игре...");
});
