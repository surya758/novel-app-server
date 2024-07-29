import express from "express";
import Novel from "../models/novel.js";
import cache from "../utils/redis.js";
import upload, { deleteObject } from "../utils/s3.js";

const router = express.Router();
// Create a new novel
router.post("/", upload.single("file"), async (req, res) => {
	try {
		const novelData = req.body;

		if (req.file) {
			// This is an uploaded novel
			novelData.type = "uploaded";
			novelData.fileUrl = req.file.location; // S3 URL
		} else {
			// This is a normal novel
			novelData.type = "normal";
		}

		const novel = new Novel(novelData);
		await novel.save();
		res.status(201).json(novel);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Get all novels
router.get("/", cache.route(), async (req, res) => {
	try {
		// find by query parameters
		const novels = await Novel.find(req.query, { chapters: 0 });
		res.json(novels);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get all novel chapter number and title
router.get("/:novelId/title", cache.route(), async (req, res) => {
	// sorted by chapter number
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
		const novel = await Novel.findById(req.params.id);
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
		// delete the novel file from S3
		if (novel.type === "uploaded") {
			const key = novel.fileUrl.split("/").slice(-2).join("/");
			console.log(key);
			deleteObject(key);
			console.log("deleted");
		}
		if (!novel) return res.status(404).json({ message: "Novel not found" });
		res.json({ message: "Novel deleted" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Add a character to a novel
router.post("/:id/characters", async (req, res) => {
	try {
		const novel = await Novel.findById(req.params.id);
		if (!novel) {
			return res.status(404).json({ message: "Novel not found" });
		}
		novel.characters.push(req.body);
		const updatedNovel = await novel.save();
		res.status(201).json(updatedNovel.characters[updatedNovel.characters.length - 1]);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Fetch all characters of a novel
router.get("/:id/characters", async (req, res) => {
	try {
		const novel = await Novel.findById(req.params.id);
		if (!novel) {
			return res.status(404).json({ message: "Novel not found" });
		}
		res.json(novel.characters);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

router.delete("/:novelId/characters/:characterId", async (req, res) => {
	const { novelId, characterId } = req.params;

	try {
		const novel = await Novel.findById(novelId);

		if (!novel) {
			return res.status(404).json({ message: "Novel not found" });
		}

		// Check if the character exists
		if (!novel.characters.id(characterId)) {
			return res.status(404).json({ message: "Character not found" });
		}

		// Remove the character using $pull operator
		await Novel.updateOne({ _id: novelId }, { $pull: { characters: { _id: characterId } } });

		res.json({ message: "Character deleted successfully" });
	} catch (error) {
		console.error("Error deleting character:", error);
		res.status(500).json({ message: "An error occurred while deleting the character" });
	}
});

export default router;
