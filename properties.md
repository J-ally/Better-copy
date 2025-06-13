Common annotation properties (Zotero PDF annotation object):

annotation.text — The highlighted/annotated text
annotation.pageLabel — The page label (e.g., "iii", "12")
annotation.page — The page number (integer)
annotation.color — The color of the annotation (hex or name)
annotation.tags — Array of tags attached to the annotation
annotation.annotationType — Type of annotation (highlight, note, etc.)
annotation.comment — User comment on the annotation
annotation.parentItemID — Zotero item ID of the parent item
annotation.id — Annotation ID
annotation.created — Creation date/time
annotation.modified — Last modified date/time

Common parentItem properties (Zotero item object):

parentItem.getField("title") — Title of the item
parentItem.getField("date") — Publication date
parentItem.getField("publicationTitle") — Journal/book title
parentItem.getField("DOI") — DOI
parentItem.getCreators() — Array of creator objects (authors, editors, etc.)
parentItem.getField("url") — URL
parentItem.getField("abstractNote") — Abstract
parentItem.getField("pages") — Page range

They are usable as follows:

${annotation.text}
