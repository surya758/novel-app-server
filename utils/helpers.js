export function processPContentData(data) {
	// Remove empty strings and trim whitespace
	let cleanedData = data.filter((item) => item.trim() !== "");

	// Remove any items that look like advertisements
	cleanedData = cleanedData.filter((item) => !item.includes("𝒏ovels on n𝒐/v/elbin(.)co/m"));

	// Structure the data
	const structuredData = cleanedData.map((item, index) => ({
		id: index + 1,
		content: item.trim(),
		wordCount: item.trim().split(/\s+/).length,
	}));

	return structuredData;
}

export function processH4ContentData(data) {
	const cleanedData = data.map((item) => {
		// Remove the word "Chapter" and the colon
		let cleanedItem = item.replace("Chapter", "").replace(":", "").trim();

		// Remove any special characters
		cleanedItem = cleanedItem.replace(/[*!]/g, "");

		return cleanedItem;
	});

	const structuredData = cleanedData.map((item) => ({
		id: item.split(" ")[0].trim(),
		title: item.split(" ").slice(1).join(" ").trim(),
	}));

	return structuredData;
}
