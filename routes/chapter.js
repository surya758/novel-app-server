import express from "express";

import Chapter from "../models/chapter.js";
import Novel from "../models/novel.js";
import { processH4ContentData, processPContentData } from "../utils/helpers.js";
import cache from "../utils/redis.js";

const router = express.Router();

// Create a new chapter
router.post("/", async (req, res) => {
	try {
		const { novel_id, h4_content, p_content } = req.body;

		// clean the data, transform it, or prepare it for database insertion
		const processedH4Content = processH4ContentData(h4_content)[0];
		const processedPContent = processPContentData(p_content);

		const chapter = new Chapter({
			novel: novel_id,
			title: processedH4Content.title,
			content: JSON.stringify(processedPContent),
			chapterNumber: processedH4Content.id,
		});

		// if that chapter for that novel already exists, skip creating a new chapter
		const existingChapter = await Chapter.findOne({
			novel: novel_id,
			chapterNumber: processedH4Content.id,
		});
		if (existingChapter) {
			return res.status(409).json({ message: "Chapter already exists" });
		}

		await chapter.save();
		await Novel.findByIdAndUpdate(chapter.novel, { $push: { chapters: chapter._id } });
		res.status(201).json(chapter);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Get all chapters of a novel
router.get("/novel/:novelId", async (req, res) => {
	try {
		const chapters = await Chapter.find({ novel: req.params.novelId }).sort("chapterNumber");
		res.json(chapters);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get a specific chapter
router.get("/:id", cache.route(), async (req, res) => {
	try {
		const chapter = await Chapter.findById(req.params.id);
		if (!chapter) return res.status(404).json({ message: "Chapter not found" });
		res.json(chapter);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Update a chapter
router.put("/:id", async (req, res) => {
	try {
		const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!chapter) return res.status(404).json({ message: "Chapter not found" });
		res.json(chapter);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Delete a chapter
router.delete("/:id", async (req, res) => {
	try {
		const chapter = await Chapter.findByIdAndDelete(req.params.id);
		if (!chapter) return res.status(404).json({ message: "Chapter not found" });
		await Novel.findByIdAndUpdate(chapter.novel, { $pull: { chapters: chapter._id } });
		res.json({ message: "Chapter deleted" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Delete all chapter of a novel by id
router.delete("/novel/:novelId", async (req, res) => {
	try {
		const chapters = await Chapter.find({ novel: req.params.novelId });
		if (chapters.length === 0) {
			return res.status(404).json({ message: "Chapters not found" });
		}
		await Chapter.deleteMany({ novel: req.params.novelId });
		await Novel.findByIdAndUpdate(req.params.novelId, { chapters: [] });
		res.json({ message: "Chapters deleted" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

export default router;
