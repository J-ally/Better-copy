window.addEventListener("load", function () {
    // Set a default template if none exists
    let format = Services.prefs.getCharPref("extensions.better-copy.format", "> ${text}\n\n**${creators} (${year})** - *${title}*, p. ${page}");
    document.getElementById("exportFormat").value = format;
});

document.documentElement.addEventListener("dialogaccept", function (event) {
    let format = document.getElementById("exportFormat").value;
    Services.prefs.setCharPref("extensions.better-copy.format", format);
});

// This code is for a Firefox extension that allows users to set a preference for the format in which annotations are copied.
// extension setting textbox is working but the windiws diesnt disappear when clicking save ...
// didn,'test if the behavior is rightv either !