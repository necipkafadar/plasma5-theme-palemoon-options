var plasma5ThemeOptions = {
	prefs: null,
	colorScheme: "",

	// Initialize the extension

	init: function() {
		this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService)
				.getBranch("plasma5opt.");
		this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
		this.prefs.addObserver("", this, false);		
		
		this.colorScheme = this.prefs.getCharPref("colorScheme");
		this.applyCSS(this.colorScheme);
    },
	
	observe: function(subject, topic, data) {
		if (topic != "nsPref:changed")
		{
			return;
		}

		switch(data)
		{
			case "colorScheme":
				this.colorScheme = this.prefs.getCharPref("colorScheme");
				this.applyCSS(this.colorScheme);
				break;
		}
	},
	
	watchColorScheme: function(newColorScheme) {
		this.prefs.setCharPref("colorScheme", newColorScheme);
	},
	
 	onMenuItemCommand: function(e) {
		window.openDialog("chrome://plasma5-theme-palemoon-options/content/options.xul","chrome, toolbar, dialog, resizable=no").focus();
	},
	
	applyCSS: function(sheetName) {
	 	var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"]
	                   .getService(Components.interfaces.nsIStyleSheetService);
		var ios = Components.classes["@mozilla.org/network/io-service;1"]
	                   .getService(Components.interfaces.nsIIOService);
		var uri = ios.newURI("chrome://browser/skin/subskins/"+sheetName+".css", null, null);
		if(!sss.sheetRegistered(uri, sss.USER_SHEET))
			sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
	},
	
}
window.addEventListener("load", function(e) { plasma5ThemeOptions.init(); }, false);