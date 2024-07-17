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
// export function processH4ContentData(data) {
// 	return data.map((title) => {
// 		// Extract the chapter number using regex
// 		let chapterMatch = title.match(/Chapter\s*(\d+)/i);
// 		let chapterNumber = chapterMatch ? parseInt(chapterMatch[1]) : null;

// 		// Extract the chapter title using regex
// 		let titleMatch = title.match(/Chapter\s*\d+\s*[-\s]*(.+)/i);
// 		let chapterTitle = titleMatch ? titleMatch[1].trim() : null;

// 		return {
// 			id: chapterNumber,
// 			title: chapterTitle,
// 		};
// 	});
// }

export function processH4ContentData(data) {
	return data.map((title) => {
		// Extract the chapter number using regex
		let chapterMatch = title.match(/Chapter\s*(c?-?\d+)/i);
		let chapterNumber = chapterMatch ? chapterMatch[1] : null;

		// If the chapter number starts with "c-", remove it
		if (chapterNumber && chapterNumber.startsWith("c-")) {
			chapterNumber = chapterNumber.slice(2);
		}

		// Convert the chapter number to an integer
		chapterNumber = parseInt(chapterNumber);

		// Extract the chapter title using regex
		let titleMatch = title.match(/Chapter\s*c?-?\d+\s*[-\s]*(.+)/i);
		let chapterTitle = titleMatch ? titleMatch[1].trim() : null;

		return {
			id: chapterNumber,
			title: chapterTitle,
		};
	});
}
