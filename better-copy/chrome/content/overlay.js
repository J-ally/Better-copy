Zotero.debug("Better Copy: overlay.js file loaded!");

var BetterCopy = {
	initialized: false,

	init: function () {
		if (this.initialized) return;

		Zotero.debug("Better Copy: Initializing plugin...");

		// Wait for Zotero to be fully loaded
		if (!Zotero.initialized) {
			Zotero.debug("Better Copy: Waiting for Zotero to initialize...");
			setTimeout(() => this.init(), 1000);
			return;
		}

		this.setupEventListeners();
		this.initialized = true;
		Zotero.debug("Better Copy: Plugin initialized successfully!");
	},

	setupEventListeners: function () {
		// Hook into general copy operations
		this.hookGeneralCopy();

		// Add keyboard shortcut
		this.addKeyboardShortcut();
	},

	hookGeneralCopy: function () {
		// Hook into Zotero's general copy functionality
		document.addEventListener('keydown', (event) => {
			if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
				this.handleGeneralCopy(event);
			}
		}, true);
	},

	handleGeneralCopy: function (event) {
		try {
			// Check if we're in the items pane and have an annotation selected
			let selectedItems = ZoteroPane.getSelectedItems();

			if (selectedItems && selectedItems.length === 1) {
				let item = selectedItems[0];

				if (item.isAnnotation && item.isAnnotation()) {
					Zotero.debug("Better Copy: Intercepting copy of annotation from items pane");

					let formattedText = this.formatAnnotation(item);
					if (formattedText) {
						this.copyToClipboard(formattedText);
						event.preventDefault();

						new Zotero.ProgressWindow()
							.createLine({
								text: "Annotation copied with Better Copy formatting",
								type: "success"
							})
							.show();
					}
				}
			}
		} catch (e) {
			Zotero.debug("Better Copy: Error in handleGeneralCopy: " + e);
		}
	},

	addKeyboardShortcut: function () {
		// Add a custom keyboard shortcut (Ctrl+Shift+C / Cmd+Shift+C)
		document.addEventListener('keydown', (event) => {
			if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
				this.copySelectedAnnotationFormatted();
				event.preventDefault();
			}
		}, true);
	},

	copySelectedAnnotationFormatted: function () {
		try {
			let selectedItems = ZoteroPane.getSelectedItems();

			if (selectedItems && selectedItems.length === 1) {
				let item = selectedItems[0];

				if (item.isAnnotation && item.isAnnotation()) {
					let formattedText = this.formatAnnotation(item);
					if (formattedText) {
						this.copyToClipboard(formattedText);

						new Zotero.ProgressWindow()
							.createLine({
								text: "Annotation copied with Better Copy formatting",
								type: "success"
							})
							.show();
					}
				}
			}
		} catch (e) {
			Zotero.debug("Better Copy: Error in copySelectedAnnotationFormatted: " + e);
		}
	},

	formatAnnotation: function (annotation) {
		try {
			if (!annotation) return "";

			// Get parent item
			let parentItem = Zotero.Items.get(annotation.parentItemID);

			// Extract annotation data
			let text = annotation.annotationText || "";
			let page = annotation.annotationPageLabel || annotation.annotationPage || "";
			let comment = annotation.annotationComment || "";

			// Extract parent item data
			let title = parentItem ? parentItem.getField("title") : "";
			let creators = "";
			let year = "";

			if (parentItem) {
				let creatorObjs = parentItem.getCreators();
				if (creatorObjs && creatorObjs.length > 0) {
					creators = creatorObjs.map(c => c.lastName || c.name).join(", ");
				}

				let dateField = parentItem.getField("date");
				if (dateField) {
					let dateMatch = dateField.match(/\d{4}/);
					year = dateMatch ? dateMatch[0] : dateField;
				}
			}

			// Get tags
			let tags = "";
			let tagObjs = annotation.getTags();
			if (tagObjs && tagObjs.length > 0) {
				tags = tagObjs.map(t => `#${t.tag}`).join(" ");
			}

			// Get format template from preferences
			let format = Zotero.Prefs.get("extensions.better-copy.format", false);
			if (!format) {
				format = "> ${text}\n\n**${creators} (${year})** - *${title}* - Page ${page}\n\n${tags}";
			}

			// Replace template variables
			let result = format
				.replace(/\$\{text\}/g, text)
				.replace(/\$\{page\}/g, page)
				.replace(/\$\{title\}/g, title)
				.replace(/\$\{creators\}/g, creators)
				.replace(/\$\{year\}/g, year)
				.replace(/\$\{tags\}/g, tags)
				.replace(/\$\{comment\}/g, comment);

			Zotero.debug("Better Copy: Formatted annotation: " + result);
			return result;

		} catch (e) {
			Zotero.debug("Better Copy: Error in formatAnnotation: " + e);
			return annotation && annotation.annotationText ? annotation.annotationText : "";
		}
	},

	copyToClipboard: function (text) {
		try {
			const clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
				.getService(Components.interfaces.nsIClipboardHelper);
			clipboardHelper.copyString(text);
		} catch (e) {
			Zotero.debug("Better Copy: Error copying to clipboard: " + e);
		}
	},

	openPreferences: function () {
		let prefWindow = window.openDialog(
			"chrome://better-copy/content/prefs.xul",
			"better-copy-prefs",
			"chrome,titlebar,toolbar,centerscreen,modal",
			null
		);
	}
};

// Initialize the plugin
window.addEventListener('load', function () {
	// Wait a bit for Zotero to be ready
	setTimeout(() => {
		BetterCopy.init();
	}, 2000);
}, false);


