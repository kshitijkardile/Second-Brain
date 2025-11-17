import mongoose, { model, Schema } from "mongoose";

mongoose.connect(
  "mongodb+srv://kshitijkardile:Kshitij77@cluster0.1aw5l7e.mongodb.net/SecondBrain?appName=Cluster0"
);

const UserSchema = new Schema({
  Username: { type: String, unique: true },
  Password: { type: String, required: true },
});

export const UserModel = model("User", UserSchema);
