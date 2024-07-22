import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
	name: { type: String, required: true },
	imageUrl: { type: String }, // URL to the character's image
	role: { type: String }, // e.g., "Protagonist", "Antagonist", "Supporting"
	description: { type: String },
	age: { type: Number },
	skills: [String],
	// Add any other character attributes you find useful
});

const novelSchema = new mongoose.Schema(
	{
		id: { type: String },
		title: { type: String, required: true, unique: true },
		author: { type: String, required: true },
		imageUrl: { type: String },
		description: { type: String },
		genre: { type: String },
		characters: [characterSchema],
		isArchieved: { type: Boolean, default: false },
		chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
	},
	{ timestamps: true }
);

export default mongoose.model("Novel", novelSchema);
