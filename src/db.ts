import mongoose, { model, Schema } from "mongoose";

mongoose.connect(
  "mongodb+srv://kshitijkardile:Kshitij77@cluster0.1aw5l7e.mongodb.net/SecondBrain?appName=Cluster0"
);

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
