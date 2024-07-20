import mongoose from "mongoose";

const novelSchema = new mongoose.Schema(
	{
		id: { type: String },
		title: { type: String, required: true, unique: true },
		author: { type: String, required: true },
		imageUrl: { type: String },
		description: { type: String },
		genre: { type: String },
		isArchieved: { type: Boolean, default: false },
		chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
	},
	{ timestamps: true }
);

export default mongoose.model("Novel", novelSchema);
