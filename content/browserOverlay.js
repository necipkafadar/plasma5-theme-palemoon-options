var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"]
	                   .getService(Components.interfaces.nsIStyleSheetService);
var ios = Components.classes["@mozilla.org/network/io-service;1"]
	                   .getService(Components.interfaces.nsIIOService);
var plasma5ThemeOptions = {
	prefs: null,
	colorScheme: "",
	labelTextColor: "",
	labelTextColor_att:"",
	iconColor: "",
	iconColor_att:"",
	tabBorderStyle:"",

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

		this.iconColor = this.prefs.getBoolPref("iconColor");
		this.iconColor_att = this.prefs.getCharPref("iconColor_att");
		if(this.iconColor==true) {
			hexColorArray = this.convertHextoRGB(this.iconColor_att);
			this.applyCSSData("iconColor", hexColorArray);
		}

		this.tabBorderStyle = this.prefs.getCharPref("tabBorderStyle");
		this.applyCSS(this.tabBorderStyle);
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
			case "iconColor":
				var hexColorArray = new Object();
				this.iconColor = this.prefs.getBoolPref("iconColor");
				if(this.iconColor==true) {
					this.iconColor_att = this.prefs.getCharPref("iconColor_att");
					hexColorArray = this.convertHextoRGB(this.iconColor_att);
					this.applyCSSData("iconColor", hexColorArray);
				}
				else {
					hexColorArray = this.convertHextoRGB("#000000");
					this.applyCSSData("iconColor", hexColorArray);
				}
				break;
			case "iconColor_att":
				if(this.iconColor==true) {
					this.iconColor_att = this.prefs.getCharPref("iconColor_att");
					hexColorArray = this.convertHextoRGB(this.iconColor_att);
					this.applyCSSData("iconColor", hexColorArray);
				}
				break;
			case "tabBorderStyle":
				this.tabBorderStyle = this.prefs.getCharPref("tabBorderStyle");
				this.applyCSS(this.tabBorderStyle);
				break;
		
		}
	},

 	onMenuItemCommand: function(e) {
		window.openDialog("chrome://plasma5-theme-palemoon-options/content/options.xul","chrome, toolbar, dialog, resizable=no").focus();
	},
	
	applyCSS: function(sheetName) {
		var uri = ios.newURI("chrome://browser/skin/subskins/"+sheetName+".css", null, null);
		if(!sss.sheetRegistered(uri, sss.USER_SHEET))
			sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
	},

	applyCSSData: function (item, color) {
	    switch(item) {
	    	case "labelTextColor":
	    		var uri = ios.newURI("data:text/css;charset=utf-8," + encodeURIComponent("\
	    			description, label {\
  						color: "+color+" !important;\
						}\
	    			"), null, null);
	    	break;
	    	case "iconColor":
	    		var uri = ios.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
	    			.toolbarbutton-1 {\
	    				filter: url("data:image/svg+xml;utf8,\
	    				<svg xmlns=\'http://www.w3.org/2000/svg\'>\
      					<filter id=\'matrix-r\' color-interpolation-filters=\'sRGB\' filterUnits=\'objectBoundingBox\' x=\'0\' y=\'0\' width=\'100%\' height=\'100%\'>\
      					<feColorMatrix type=\'saturate\' in=\'SourceGraphic\' values=\'0\' result=\'A\'/>\
     					<feColorMatrix type=\'matrix\' in=\'A\' values=\'1.0  0.0  0.0  0.0  '+color[0]+'\
      																	 0.0  1.0  0.0  0.0  '+color[1]+'\
      																	 0.0  0.0  1.0  0.0  '+color[2]+'\
      																	 0.0  0.0  0.0  1.0  0.0\'/>\
      					</filter>\
    					</svg>#matrix-r") !important;\
						}\
	    			'), null, null);
	    	break;
	    }
	    if(!sss.sheetRegistered(uri, sss.USER_SHEET))
			sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET); 
	},

	convertHextoRGB: function(hex) {
		var result = new Object();
		hex = hex.replace('#','');
    	result[0] = parseInt(hex.substring(0,2), 16) / 255;
    	result[1] = parseInt(hex.substring(2,4), 16) / 255;
    	result[2] = parseInt(hex.substring(4,6), 16) / 255;
    	return result;
	},

}
window.addEventListener("load", function(e) { plasma5ThemeOptions.init(); }, false);