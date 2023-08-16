import mongoose from "mongoose";
import bluebird from "bluebird";
import { log } from "../utils/logger";

mongoose.Promise = bluebird;

mongoose.set("toJSON", {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
    delete converted.password;
    delete converted.__v;
  },
});

export const connect = (url: string) => {
  mongoose
    .connect(url)
    .then(() => log.info("connect to db success"))
    .catch((err) => {
      log.error("connect to db failed");
      console.log(err);
    });
};
