const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const { verifyApiKey } = require("./middleware");

const port = process.env.PORT;

let corsConfig = {
  cors: {
    origin:
      process.env.NODE_ENV != "PRODUCTION" ? "*" : process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
};

const io = require("socket.io")(server, corsConfig);

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("a user connected : ", socket.handshake.address);
});

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/broadcast", verifyApiKey, (req, res) => {
  const { channel, payload } = req.body;
  if (typeof channel != "string") {
    return res
      .status(400)
      .json({ code: 400, message: "channel must be string" });
  }
  if (channel == "") {
    return res
      .status(400)
      .json({ code: 400, message: "channel must be filled" });
  }
  if (typeof payload != "object") {
    return res
      .status(400)
      .json({ code: 400, message: "payload must be object" });
  }
  console.log(req.body);
  try {
    io.emit(channel, payload);
  } catch (error) {
    console.error(error);
    return res.status(200).json({ code: 500, message: "internal error" });
  }
  return res.status(200).json({ code: 200, result: req.body });
});

server.listen(port, () => {
  console.log("listening on *:" + port);
});
