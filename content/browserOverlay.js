
if ("undefined" == typeof(plasma5Theme)) {
  var plasma5Theme = {};
};

plasma5ThemeOptions = {

  sayHello : function(aEvent) {
    let stringBundle = document.getElementById("plasma5-theme-palemoon-options-string-bundle");
    let message = stringBundle.getString("xulschoolhello.greeting.label");

    window.alert(message);
  }
  onMenuItemCommand: function(e) {
	window.openDialog("chrome://plasma5-theme-palemoon-options/content/options.xul","chrome, toolbar, dialog, resizable=no").focus();
  }
};
