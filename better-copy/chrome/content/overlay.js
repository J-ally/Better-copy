function log(msg) {
	Zotero.debug("Better Copy: " + msg);
}

function formatAnnotation(annotation, parentItem) {
	try {
		let text = annotation && annotation.text ? annotation.text : "";
		let page = annotation && (annotation.pageLabel || annotation.page) ? (annotation.pageLabel || annotation.page) : "";
		let title = parentItem ? parentItem.getField("title") : "";
		let creators = parentItem && parentItem.getCreators ? parentItem.getCreators().map(c => c.lastName).join(", ") : "";
		let year = parentItem ? parentItem.getField("date") : "";
		let tags = annotation && annotation.tags ? annotation.tags.map(t => `#${t}`).join(" ") : "";

		let format = Services.prefs.getCharPref("extensions.better-copy.format", "plain");
		if (format === "markdown") {
			// Convert to markdown
		} else if (format === "html") {
			// Convert to HTML
		} else {
			// Plain text
		}

		if (!format) {
			log("No format string found in preferences.");
			format = '${text}';
		}
		return format
			.replace(/\$\{text\}/g, text)
			.replace(/\$\{page\}/g, page)
			.replace(/\$\{title\}/g, title)
			.replace(/\$\{creators\}/g, creators)
			.replace(/\$\{year\}/g, year)
			.replace(/\$\{tags\}/g, tags)
			.replace(/\$\{color\}/g, annotation.color || "")
			.replace(/\$\{comment\}/g, annotation.comment || "")
			.replace(/\$\{type\}/g, annotation.annotationType || "")
			.replace(/\$\{doi\}/g, parentItem ? parentItem.getField("DOI") : "")
			.replace(/\$\{url\}/g, parentItem ? parentItem.getField("url") : "")
			.replace(/\$\{citekey\}/g, parentItem ? (parentItem.getField("citationKey") || parentItem.getField("citekey") || "") : "");
	} catch (e) {
		log("Error formatting annotation: " + e);
		return annotation && annotation.text ? annotation.text : "";
	}
}

function overrideCopyAnnotation() {
	try {
		let mainWin = Zotero.getMainWindow();
		if (mainWin && mainWin.ZoteroPDFAnnotation && mainWin.ZoteroPDFAnnotation.prototype) {
			mainWin.ZoteroPDFAnnotation.prototype.copy = function () {
				try {
					let parentItem = Zotero.Items.get(this.parentItemID);
					let md = formatAnnotation(this, parentItem);
					Zotero.Utilities.Internal.copyToClipboard(md);
					log("Annotation copied as Markdown!");
				} catch (e) {
					log("Error copying annotation: " + e);
				}
			};
			log("Better Copy: Overrode annotation copy function.");
		} else {
			log("Better Copy: Could not find ZoteroPDFAnnotation to override.");
		}
	} catch (e) {
		log("Error in overrideCopyAnnotation: " + e);
	}
}

window.addEventListener('load', function () {
	overrideCopyAnnotation();
});
