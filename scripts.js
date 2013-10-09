/*

Copyright © 2010, 2011, 2012 Josh Goebel

*/ 

// setTimeout(function() { Bonfire.init(); },10)
// $(window).load(function() { Bonfire.init(); })

var Bonfire={
	init: function()
	{
		if (Bonfire.initing) { return }
		Bonfire.initing = true;
    // Textual.include_js("jquery.tiny.js");
    //Textual.include_js("zepto8.tiny.js");
    //Textual.include_js("support.js");
    // evidentally the page needs a second to render, parse JS, etc
		setTimeout(Bonfire.start, 25);
	},
	start: function()
	{
		Bonfire.render = new Renderer($("#body_home"));
		Bonfire.started = true;
	},
};

Textual.newMessagePostedToView=function(lineNumber)
{
  // FinishedLoding or FinishedReload event should spooling us up, patience
	if (!replaceEmoji(lineNumber)) {
		setTimeout(function() {
		replaceEmoji(lineNumber);
		}, 500);
	}
	if (!Bonfire.started)
		return;
	
  Bonfire.render.message(lineNumber,0);
  return;
	}

// replace Textual mark with our own
Textual.historyIndicatorAddedToView = function() {}

Textual.viewFinishedLoading = function()
{ 
  console.log("viewFinishedLoading");
  Bonfire.init();
}
  
Textual.viewFinishedReload = function()
{ 
  console.log("viewFinishedReload");
  Bonfire.init();
}

function replaceEmoji(lineNumber) {
	var emoji = {
			":)": "😊",
			":-)": "😊",
			"(:": "😊",
			":D": "😃",
			";D": "😄",
			";)": "😉",
			";-)": "😉",
			";P": "😜",
			";-P": "😜",
			":P": "😝",
			":-P": "😝",
			"o_o": "😳",
			"O_O": "😳",
			"o_O": "😳",
			"0_o": "😳",
			"o_0": "😳",
			"0_0": "😳",
			"O_o": "😳",
			":@": "😡",
			">.<": "😣",
			">_<": "😫",
			":(": "😞",
			":-(": "😞",
			"n_n": "😄",
			"u_u": "😔",
			"^_^": "😄",
			"^.^": "😊",
			"x.x": "😵",
			"x.X": "😵",
			"X.x": "😵",
			"X.X": "😵",
			"x_x": "😲",
			"x_X": "😲",
			"X_x": "😲",
			"X_X": "😲",
			"D:": "😧",
			":s": "😖",
			":S": "😖",
			"DD:": "😫",
			"._.'": "😰",
			"._.": "😞",
			";_;": "😢",
			";__;": "😢",
			"D;": "😰",
			"^_^'": "😅",
			"^.^": "😅",
			"T_T": "😭",
			"T.T": "😭",
			":|": "😐",
			":o": "😯",
			":O": "😱",
			":0": "😱",
			"-_-": "😑",
			":*": "😚",
			":**": "😘",
			":***": "😘",
			"*_*": "😍"
		},
		line = document.querySelector("#line" + lineNumber + " .message");

	if (line) {
		for (var i in emoji) {
			while (line.innerHTML.indexOf(i) != -1) {
				line.innerHTML = line.innerHTML.replace(i, emoji[i]);
			}
		}

		return true;
	}

	return false;
}