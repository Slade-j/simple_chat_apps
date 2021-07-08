const createError = require("http-errors");
const express = require("express");
const { join } = require("path");
const logger = require("morgan");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./db");
const { User } = require("./db/models");
const http = require("http");
const onlineUsers = require("./onlineUsers");
// create store for sessions to persist in database
const sessionStore = new SequelizeStore({ db });

const { json, urlencoded } = express;

const app = express();
const server = http.createServer(app);

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(express.static(join(__dirname, "public")));

app.use(function (req, res, next) {
  const token = req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decoded) => {
      if (err) {
        return next();
      }
      User.findOne({
        where: { id: decoded.id },
      }).then((user) => {
        req.user = user;
        return next();
      });
    });
  } else {
    return next();
  }
});

// create socket and socket middleware
const io = require("socket.io")(server);

// socket middleware to authenticate connection using jwt
io.use(function(socket, next){
  if (socket.handshake.query && socket.handshake.query.token){
    jwt.verify(socket.handshake.query.token,  process.env.SESSION_SECRET, (err, decoded) => {
      if (err) return next(err);
      socket.decoded = decoded;
      next();
    });
  }
  else {
    next(new Error('Authentication error'));
  }
})
.on("connection", (socket) => {
  socket.on("go-online", (id) => {
    // each user joins their own room
    socket.join(id);

    onlineUsers.addOnlineUser(id);
    // send the user who just went online to everyone else who is already online
    socket.broadcast.emit("add-online-user", id);
  });

  socket.on("new-message", (data) => {
    // only send message to recipients room
    socket.to(data.recipientId).emit("new-message", {
      message: data.message,
      sender: data.sender,
      recipientId: data.recipientId
    });
  });

  socket.on("logout", (id) => {
    onlineUsers.removeOnlineUser(id);
    socket.broadcast.emit("remove-offline-user", id);
    socket.leave();
  });
});

// require api routes here after I create them
app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/api"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

module.exports = { app, sessionStore, server };
