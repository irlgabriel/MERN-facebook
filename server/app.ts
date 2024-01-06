import "dotenv/config";
import createError from "http-errors";
import express from "express";
import passport from "passport";
import "./config/passport";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import mongoose from "mongoose";

import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import postsRouter from "./routes/posts";
import commentsRouter from "./routes/comment";
import friendRequestsRouter from "./routes/friend_requests";
import notificationsRouter from "./routes/notifications";

mongoose.connect(process.env.DB_STRING as string, {
  // useUnifiedTopology: true,
  // useNewUrlParser: true,
  // useCreateIndex: true,
});
mongoose.connection.on("open", () => console.log("Connected to mongoDB"));

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, origin);
    },
    credentials: false,
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

// routes path
app.use("/", authRouter);
// prefix /posts/:post_id/comments
// needed to be moved inside actual router (some upgrade broke the previous approach)
app.use("/", commentsRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
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
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.json(err);
});

export default app;
