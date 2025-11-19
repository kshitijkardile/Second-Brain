import mongoose, { model, Schema } from "mongoose";

const mongodbUrl = process.env.MONGODB_URL;
if (!mongodbUrl) {
  throw new Error("MONGODB_URL environment variable is not set");
}

mongoose.connect(mongodbUrl);

const UserSchema = new Schema({
  Username: { type: String, unique: true },
  Password: { type: String, required: true },
});

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
  title: String,
  link: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User", reqired: true },
});

export const ContentModel = model("Content", ContentSchema);
