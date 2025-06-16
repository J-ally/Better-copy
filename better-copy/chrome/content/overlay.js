Zotero.debug("Better Copy: overlay.js file loaded!");

function log(message) {
	Zotero.debug("Better Copy: " + message);
}

function formatAnnotation(annotation, parentItem) {
	try {
		let text = annotation && annotation.text ? annotation.text : "";
		let page = annotation && (annotation.pageLabel || annotation.page) ? (annotation.pageLabel || annotation.page) : "";
		let title = parentItem ? parentItem.getField("title") : "";
		let creators = parentItem && parentItem.getCreators ? parentItem.getCreators().map(c => c.lastName).join(", ") : "";
		let year = parentItem ? parentItem.getField("date") : "";
		let tags = annotation && annotation.tags ? annotation.tags.map(t => `#${t}`).join(" ") : "";

		// Get the template string from preferences
		let format = Services.prefs.getCharPref("extensions.better-copy.format", "${text}");

		if (!format) {
			log("No format string found in preferences.");
			format = '${text}';
		}

		// Replace template variables with actual values
		return format
			.replace(/\$\{text\}/g, text)
			.replace(/\$\{page\}/g, page)
			.replace(/\$\{title\}/g, title)
			.replace(/\$\{creators\}/g, creators)
			.replace(/\$\{year\}/g, year)
			.replace(/\$\{tags\}/g, tags);

	} catch (e) {
		log("Error in formatAnnotation: " + e);
		return annotation && annotation.text ? annotation.text : "";
	}
}

function overrideCopyAnnotation() {
	try {
		log("Setting up Better Copy annotation override...");

		// Hook into Zotero's translation system
		let originalGetTranslators = Zotero.Translators.getByType;

		Zotero.Translators.getByType = function (type) {
			let translators = originalGetTranslators.call(this, type);

			// Intercept note/annotation export
			if (type === 'export') {
				log("Export translators requested, checking for annotation copy...");

				// Find the Note Markdown translator and modify it
				translators.forEach(translator => {
					if (translator.label === 'Note Markdown') {
						log("Found Note Markdown translator, overriding...");

						let originalCode = translator.code;
						translator.code = function () {
							// Your custom formatting logic here
							log("Custom Note Markdown translator running!");

							// Get the annotation being copied
							// This is a simplified approach - you might need to adjust based on Zotero's internal structure
							return originalCode.apply(this, arguments);
						};
					}
				});
			}

			return translators;
		};

		log("Better Copy: Successfully set up translation override.");
	} catch (e) {
		log("Error in overrideCopyAnnotation: " + e);
	}
}

// Initialize when Zotero is ready
if (typeof Zotero !== 'undefined') {
	Zotero.Promise.delay(1000).then(() => {
		overrideCopyAnnotation();
	});
} else {
	window.addEventListener('load', function () {
		if (typeof Zotero !== 'undefined') {
			Zotero.Promise.delay(1000).then(() => {
				overrideCopyAnnotation();
			});
		}
	});
}


