window.addEventListener("load", function () {
    let format = Services.prefs.getCharPref("extensions.better-copy.format", "plain");
    document.getElementById("exportFormat").value = format;
});

document.documentElement.addEventListener("dialogaccept", function () {
    let format = document.getElementById("exportFormat").value;
    Services.prefs.setCharPref("extensions.better-copy.format", format);
});

var gBetterCopyPrefs = {
    PREF_KEY: "extensions.better-copy.format",

    init: function () {
        var prefs = Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefBranch);
        var format = "";
        try {
            format = prefs.getCharPref(this.PREF_KEY);
        } catch (e) { }
        document.getElementById("exportFormat").value = format;
    },

    save: function () {
        var prefs = Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefBranch);
        var format = document.getElementById("exportFormat").value;
        prefs.setCharPref(this.PREF_KEY, format);
    }
};

// This code is for a Firefox extension that allows users to set a preference for the format in which annotations are copied.
// extension setting textbox is working but the windiws diesnt disappear when clicking save ...
// didn,'test if the behavior is rightv either !