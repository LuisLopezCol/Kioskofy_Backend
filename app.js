const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/database");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const SocketIO = require("socket.io");
const cron = require("node-cron");
const CRONS = require("./utils/crons/getTrendingProducts");

// Connect to databasee
mongoose.set("strictQuery", false);
mongoose.connect(config.database, { useNewUrlParser: true });
mongoose.connection.on("connected", () => {
  console.info("Connected to database ");
});
mongoose.connection.on("error", (err) => {
  console.info("Database error: " + err);
});

// // Set static folder
// const path = require("path");
// app.use(express.static(path.join(__dirname, "/public")));

const app = express();
const port = process.env.PORT || 8080;

// Cors middleware
app.use(cors());

app.use(fileUpload());

// Body Parser Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Use API routes
let router = express.Router();
app.use("/api", router);
require("./routes/api/product")(router);
require("./routes/api/portfolio_views")(router);
require("./routes/api/favorites")(router);
require("./routes/api/question")(router);
require("./routes/api/categories")(router);
require("./routes/api/sub_categories")(router);
require("./routes/api/country")(router);
require("./routes/api/user")(router);
require("./routes/api/banner")(router);
require("./routes/api/order")(router);
require("./routes/api/conversation")(router);
require("./routes/api/aws_s3")(router);
require("./routes/api/search")(router);

// Start server
const server = app.listen(port, () => {
  console.info("Server started on port " + port);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.info("New connection - SocketIO");
  const idHandShake = socket.id;
  const { nameRoom } = socket.handshake.query;
  console.info(`device: ${idHandShake} ---> room: ${nameRoom}`);
  socket.join(nameRoom);
  socket.on("event", (msg) => {
    let test = socket.to(nameRoom).emit("event", msg);
  });
});

//Daily Cron - At 1:00 am
cron.schedule(
  "0 1 * * *",
  async function () {
    CRONS.UPDATE_TRENDING_PRODUCTS();
  },
  {
    scheduled: true,
    timezone: "Canada/Eastern",
  }
);
