import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

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
		id: { type: String, unique: true },
		title: { type: String, required: true, unique: true },
		author: { type: String, required: true },
		imageUrl: { type: String },
		description: { type: String },
		genre: { type: String },
		characters: [characterSchema],
		isArchieved: { type: Boolean, default: false },
		chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
		type: { type: String, enum: ["normal", "uploaded"], default: "normal" },
		fileUrl: { type: String }, // S3 URL for uploaded files
	},
	{ timestamps: true }
);

novelSchema.pre("save", function (next) {
	if (!this.id) {
		this.id = uuidv4();
	}
	next();
});

export default mongoose.model("Novel", novelSchema);
