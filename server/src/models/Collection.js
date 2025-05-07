// server/src/models/Collection.js
import mongoose from "mongoose";

const CollectionSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Collection", CollectionSchema);