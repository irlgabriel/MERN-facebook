require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const passport = require("passport");
require("./config/passport");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comment");
const friendRequestsRouter = require("./routes/friend_requests");
const notificationsRouter = require("./routes/notifications");

mongoose.connect(process.env.DB_STRING, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});
mongoose.connection.on("open", () => console.log("Connected to mongoDB"));

const app = express();

app.use(express.static(path.resolve(__dirname, "client/build")));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, origin);
    },
    credentials: true,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

// routes path
app.use("/", authRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/posts/:post_id/comments", commentsRouter);
app.use("/notifications", notificationsRouter);
app.use("/friend_requests", friendRequestsRouter);

if (process.env.NODE_ENV !== "development") {
  app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "client/build", "index.html"));
  });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.json(err);
});

module.exports = app;
