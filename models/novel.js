import mongoose from "mongoose";

const novelSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		author: { type: String, required: true },
		imageUrl: { type: String },
		description: { type: String },
		chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
	},
	{ timestamps: true }
);

export default mongoose.model("Novel", novelSchema);
