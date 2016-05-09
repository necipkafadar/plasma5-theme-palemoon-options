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
	tabMinWidth:"",
	tabMinHeight:"",
	customColorScheme_att1:"",
	customColorScheme_att2:"",

	// Initialize the extension

	init: function() {
		this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService)
				.getBranch("plasma5opt.");
		this.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
		this.prefs.addObserver("", this, false);		
		
		this.colorScheme = this.prefs.getCharPref("colorScheme");
		this.applyCSS(this.colorScheme);
		if(this.colorScheme == "custom-scheme")
			this.applyCustomScheme();

		this.labelTextColor = this.prefs.getBoolPref("labelTextColor");
		this.labelTextColor_att = this.prefs.getCharPref("labelTextColor_att");
		if(this.labelTextColor==true) 
			this.applyCSSDataColor("labelTextColor", this.labelTextColor_att);

		this.iconColor = this.prefs.getBoolPref("iconColor");
		this.iconColor_att = this.prefs.getCharPref("iconColor_att");
		if(this.iconColor==true) {
			hexColorArray = this.convertHextoRGB(this.iconColor_att,true);
			this.applyCSSDataColor("iconColor", hexColorArray);
		}

		this.tabBorderStyle = this.prefs.getCharPref("tabBorderStyle");
		this.applyCSS(this.tabBorderStyle);

		this.tabMinWidth = this.prefs.getIntPref("tabMinWidth");
		this.applyCSSData("tabMinWidth");

		this.tabMinHeight = this.prefs.getIntPref("tabMinHeight");
		this.applyCSSData("tabMinHeight");
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
				this.checkElements();
				this.applyCSS(this.colorScheme);
				if(this.colorScheme == "custom-scheme")
					this.applyCustomScheme();
				break;
			case "customColorScheme_att1":
			case "customColorScheme_att2":
				this.applyCustomScheme();
				break;
			case "labelTextColor":
				this.labelTextColor = this.prefs.getBoolPref("labelTextColor");
				if(this.labelTextColor==true) {
					this.labelTextColor_att = this.prefs.getCharPref("labelTextColor_att");
					this.applyCSSDataColor("labelTextColor", this.labelTextColor_att);
				}
				else {
					if(this.colorScheme == "plasma5-dark")
						this.applyCSSDataColor("labelTextColor", "#eff0f1");
					else
						this.applyCSSDataColor("labelTextColor", "#3D3D3D");
				}
				break;
			case "labelTextColor_att":
				if(this.labelTextColor==true) {
					this.labelTextColor_att = this.prefs.getCharPref("labelTextColor_att");
					this.applyCSSDataColor("labelTextColor", this.labelTextColor_att);
				}
				break;
			case "iconColor":
				var hexColorArray = new Object();
				this.iconColor = this.prefs.getBoolPref("iconColor");
				if(this.iconColor==true) {
					this.iconColor_att = this.prefs.getCharPref("iconColor_att");
					hexColorArray = this.convertHextoRGB(this.iconColor_att,true);
					this.applyCSSDataColor("iconColor", hexColorArray);
				}
				else {
					hexColorArray = this.convertHextoRGB("#000000",true);
					this.applyCSSDataColor("iconColor", hexColorArray);
				}
				break;
			case "iconColor_att":
				if(this.iconColor==true) {
					this.iconColor_att = this.prefs.getCharPref("iconColor_att");
					hexColorArray = this.convertHextoRGB(this.iconColor_att,true);
					this.applyCSSDataColor("iconColor", hexColorArray);
				}
				break;
			case "tabBorderStyle":
				this.tabBorderStyle = this.prefs.getCharPref("tabBorderStyle");
				this.applyCSS(this.tabBorderStyle);
				break;
			case "tabMinHeight":
				this.applyCSSData("tabMinHeight");
				break;
			case "tabMinWidth":
				this.applyCSSData("tabMinWidth");
				break;
		}
	},

	checkElements: function() {
		this.colorScheme = this.prefs.getCharPref("colorScheme");
		if(this.colorScheme == "custom-scheme") {
			document.getElementById('custom-scheme').style.display = 'inherit';
		}
		else {
			document.getElementById('custom-scheme').style.display = 'none';
		}
	},

 	onMenuItemCommand: function(e) {
		window.openDialog("chrome://plasma5-theme-palemoon-options/content/options.xul","chrome, toolbar, dialog, resizable=no").focus();
	},
	
	applyCSS: function(scheme) {	
			var uri = ios.newURI("chrome://browser/skin/subskins/"+scheme+".css", null, null);
			if(!sss.sheetRegistered(uri, sss.USER_SHEET))
				sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);

	},

	applyCustomScheme: function() {
		var color1 = this.prefs.getCharPref('customColorScheme_att1');
		var color2 = this.prefs.getCharPref('customColorScheme_att2');
		var additionalColor = this.convertHextoRGB(color2,false);
		additionalColor = this.generateAdditionalColor(additionalColor);
		var uri = ios.newURI("data:text/css;charset=utf-8," + encodeURIComponent("\
	    			menubar, toolbar, #addon-bar, nav-bar, .tabbrowser-tab[selected='true'],\
	    			menupopup, panel, window, page, dialog, wizard, prefwindow, prefpane, .addon,\
	    			.panel-arrowcontent, tabpanels {\
  						background-color: "+color1+" !important;\
					}\
					.tabbrowser-tab, .tabs-newtab-button, ::-moz-selection, button, .category,\
					.alert, .option-tab, menubar > menu[open], menu[_moz-menuactive='true'],\
					menuitem[_moz-menuactive='true'], .splitmenu-menuitem[_moz-menuactive='true'],\
					button:hover, .addon[selected] {\
						background-color: "+color2+" !important;\
					}\
					.tabbrowser-tab:hover,.tabs-newtab-button:hover, .category[selected] {\
						background-color: rgb("+additionalColor[0]+","+additionalColor[1]+",\
						"+additionalColor[2]+") !important;\
					}\
	    			"), null, null);
		if(!sss.sheetRegistered(uri, sss.USER_SHEET))
			sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
	},

	applyCSSDataColor: function (item, color) {
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

	applyCSSData: function(item) {
		switch(item) {
			case "tabMinWidth":
				var uri = ios.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
					.tabbrowser-tab {\
						min-width:'+this.prefs.getIntPref('tabMinWidth')+'px !important;\
					}\
				'), null, null);
			break;
			case "tabMinHeight":
				var uri = ios.newURI("data:text/css;charset=utf-8," + encodeURIComponent('\
					.tabbrowser-tab, .tabs-newtab-button {\
						min-height:'+this.prefs.getIntPref('tabMinHeight')+'px !important;\
					}\
				'), null, null);
			break;
		}
			if(!sss.sheetRegistered(uri, sss.USER_SHEET))
			sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
	},

	convertHextoRGB: function(hex, normalized) {
		var result = new Object();
		hex = hex.replace('#','');
		if(normalized == true) {
    		result[0] = parseInt(hex.substring(0,2), 16) / 255;
    		result[1] = parseInt(hex.substring(2,4), 16) / 255;
    		result[2] = parseInt(hex.substring(4,6), 16) / 255;
    	}
    	if(normalized == false) {
    		result[0] = parseInt(hex.substring(0,2), 16);
    		result[1] = parseInt(hex.substring(2,4), 16);
    		result[2] = parseInt(hex.substring(4,6), 16);
    	}
    	return result;
	},

	generateAdditionalColor: function(color) {
		if(color[0] > 205 || color[1] > 205 || color[2]) {
			color[0] -= 50;
			color[1] -= 50;
			color[2] -= 50;
		}
		else {
			color[0] += 50;
			color[1] += 50;
			color[2] += 50;
		}
		return color;
	},

}
window.addEventListener("load", function(e) { plasma5ThemeOptions.init(); }, false);