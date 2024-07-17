import express from "express";
import Novel from "../models/novel.js";

const router = express.Router();
// Create a new novel
router.post("/", async (req, res) => {
	try {
		const novel = new Novel(req.body);
		await novel.save();
		res.status(201).json(novel);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Get all novels
router.get("/", async (req, res) => {
	try {
		const novels = await Novel.find();
		res.json(novels);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get all novel chapter number and title
router.get("/:novelId/title", async (req, res) => {
	try {
		const novel = await Novel.findById(req.params.novelId).populate(
			"chapters",
			"chapterNumber title"
		);
		if (!novel) return res.status(404).json({ message: "Novel not found" });
		res.json(novel.chapters);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get a specific novel
router.get("/:id", async (req, res) => {
	try {
		const novel = await Novel.findById(req.params.id).populate("chapters");
		if (!novel) return res.status(404).json({ message: "Novel not found" });
		res.json(novel);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Update a novel
router.put("/:id", async (req, res) => {
	try {
		const novel = await Novel.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!novel) return res.status(404).json({ message: "Novel not found" });
		res.json(novel);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Delete a novel
router.delete("/:id", async (req, res) => {
	try {
		const novel = await Novel.findByIdAndDelete(req.params.id);
		if (!novel) return res.status(404).json({ message: "Novel not found" });
		res.json({ message: "Novel deleted" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

export default router;
