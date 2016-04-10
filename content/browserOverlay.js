var plasma5ThemeOptions = {
	prefs: null,
	colorScheme: "",
	labelTextColor: "",
	labelTextColor_att:"",

	// Initialize the extension

	init: function() {
		this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService)
				.getBranch("plasma5opt.");
		this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
		this.prefs.addObserver("", this, false);		
		
		this.colorScheme = this.prefs.getCharPref("colorScheme");
		this.applyCSS(this.colorScheme);


		this.labelTextColor = this.prefs.getBoolPref("labelTextColor");
		this.labelTextColor_att = this.prefs.getCharPref("labelTextColor_att");
		if(this.labelTextColor==true) 
			this.applyCSSData("labelTextColor", this.labelTextColor_att);
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
			case "labelTextColor":
				this.labelTextColor = this.prefs.getBoolPref("labelTextColor");
				if(this.labelTextColor==true) {
					this.labelTextColor_att = this.prefs.getCharPref("labelTextColor_att");
					this.applyCSSData("labelTextColor", this.labelTextColor_att);
				}
				else {
					if(this.colorScheme == "plasma5-dark")
						this.applyCSSData("labelTextColor", "#eff0f1");
					else
						this.applyCSSData("labelTextColor", "#3D3D3D");
				}
				break;
			case "labelTextColor_att":
				if(this.labelTextColor==true) {
					this.labelTextColor_att = this.prefs.getCharPref("labelTextColor_att");
					this.applyCSSData("labelTextColor", this.labelTextColor_att);
				}
				break;
		}
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

	applyCSSData: function (item, color) {
		var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"]
	                   .getService(Components.interfaces.nsIStyleSheetService);
		var ios = Components.classes["@mozilla.org/network/io-service;1"]
	                   .getService(Components.interfaces.nsIIOService);
	    switch(item) {
	    	case "labelTextColor":
	    		var uri = ios.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	    			description, label {\
  						color: '+color+' !important;\
						}\
	    			'), null, null);
	    	break;
	    }
	    if(!sss.sheetRegistered(uri, sss.USER_SHEET))
			sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET); 
	},
	
}
window.addEventListener("load", function(e) { plasma5ThemeOptions.init(); }, false);