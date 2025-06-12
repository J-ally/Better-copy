window.addEventListener("load", function () {
    let format = Services.prefs.getCharPref("extensions.better-copy.format", "plain");
    document.getElementById("formatGroup").value = format;
});

document.documentElement.addEventListener("dialogaccept", function () {
    let format = document.getElementById("formatGroup").value;
    Services.prefs.setCharPref("extensions.better-copy.format", format);
});

var gBetterCopyPrefs = {
    PREF_KEY: "extensions.better-copy.exportFormat",

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