// no longer generated
(function() {
	
	var Bonfire, Hello, Renderer;

	  Textual.viewFinishedLoading = function() {
	    return Bonfire.boot();
	  };

	  Textual.viewFinishedReload = function() {
	    return Bonfire.boot();
	  };

	  Textual.handleEvent = function(event) {
	    return Bonfire.handleEvent(event);
	  };

	  Textual.newMessagePostedToView = function(lineNumber) {
	  	if (!replaceEmoji(lineNumber)) {
	  		setTimeout(function() {
	  		replaceEmoji(lineNumber);
	  		}, 500);
	  	}
	    return Bonfire.message(lineNumber);
	  };
	  
	  Textual.topicBarValueChanged = function() {
	    return Bonfire.topic();
	  }; 

	  Bonfire = {
	    boot: function() {
	      return Bonfire.booting || (Bonfire.booting = setTimeout(function() {
	        return Bonfire.renderer = new Renderer($("#body_home"));
	      }, 25));
	    },
	    message: function(lineNumber) {
	      if (Bonfire.renderer) {
	        return Bonfire.renderer.message(lineNumber, 0);
	      }
	    },
		topic: function() {
		  console.log("topicBarValueChanged");
	      return Bonfire.renderer.fixup_topic();
		}, 
	    handleEvent: function(event) {
	      console.log("event: " + event);
	      if (Bonfire.renderer.hello[event]) {
	        return Bonfire.renderer.hello[event]();
	      }
	    }
	  };

	  Hello = (function() {
	    function Hello(table) {
	      this.table = table;
	      this.div = $("#hello");
	      this.summary = $("#status"); 
	      this.hidden = false;
		  this.table.hide(); 
	      this.render();
	    }

	    Hello.prototype.render = function() {
	      var channel;
	      channel = $("html").attr("channelname");
	      if (channel) {
	        this.text("You have not joined this channel yet.");
	      }
	      if (!app.serverIsConnected) {
	        return;
	      }
	      this.summary.hide(); 
	      if (!app.serverIsConnected()) {
	       this.text("You have not yet connected to the server.");
	       return this.status("Not connected to server.");
	      } else if (channel && !app.channelIsJoined()) {
			  return this.status("Not joined to channel."); 
	      } else if (app.channelIsJoined()) {
	        return this.text("No chatter on this channel yet.");
	      }
	    };

	    Hello.prototype.status = function(x) {
	     if (this.hidden) {
	        this.summary.show();
	      }
	      return this.summary.find("p").html(x);
	    };

	    Hello.prototype.show = function() {
	      this.hidden = false;
	      this.div.show();
	      return $("#topic_bar").hide();
	    };

	    Hello.prototype.text = function(x) {
	      return this.div.find("p").html(x);
	    };

	    Hello.prototype.hide = function() {
	      if (this.hidden) {
	        return;
	      }
	      if (this.table.find(".line").length === 0) {
	        return;
	      }
	      this.table.show();
	      this.hidden = true;
	      this.div.hide();
	      $("#topic_bar").show();
		  return this.render();
	    };

	    Hello.prototype.rerender = function() {
			return setTimeout(((function(_this) {
				return function() {
					return _this.render();
				};
			})(this)), 25);
	    };

	    Hello.prototype.serverDisconnected = function() {
	      return this.rerender();
	    };

	    Hello.prototype.serverConnected = function() {
	      return this.rerender();
	    };

	    Hello.prototype.channelJoined = function() {
	      return this.rerender();
	    };

	    Hello.prototype.channelParted = function() {
	      return this.rerender();
	    };

	    return Hello;

	  })();


  Renderer = (function() {

    function Renderer(table) {
      this.table = table;
	  this.hello = new Hello(this.table);
      this.draw();
      this.same_nick = 0;
	  this.no_time = 0;
    }

    Renderer.prototype.draw_done = function(final) {
      this.hello.hide();
      Textual.scrollToBottomOfView();
      this.cap_link_width();
      return this.setup_cap_links();
    };

    Renderer.prototype.draw = function() {
      var lines, raw_lines;
      this.drawing = true;
      this.decay || (this.decay = 25);
      lines = this.table.find(".line");
	  raw_lines = this.table.find(".line.raw");
	  raw_lines.each((function(_this) {
        return function(i, o) {
			var num;
        	num = o.id.replace("line", "");
        	return _this.message(num, 0);
     	};
	  })(this));
      if (lines.length > 0) {
        this.draw_done();
      }
      this.decay *= 2;
      if (!(this.decay > 15000)) {
        return setTimeout((function(_this) {
          return function() {
        	  return _this.draw();
		   };
		})(this), this.decay);
      } else {
        this.drawing = false;
        return this.draw_done(true);
      }
    };

    Renderer.prototype.setup_cap_links = function() {
      if (this.cap_links_setup) {
        return;
      }
      this.cap_links_setup = true;
      setTimeout(((function(_this) {
        return function() {
          return _this.cap_link_width;
        };
      })(this)), 30000);
      return window.addEventListener("resize", (function(_this) {
        return function() {
          if (_this.resize) {
            clearTimeout(_this.resize.timeoutID);
          }
          return _this.resize = setTimeout(function() {
            return _this.cap_link_width();
          }, 250);
        };
      })(this));
    };

    Renderer.prototype.cap_link_width = function() {
      var column, css, left_column, right_column, style_fixes, width;
      column = this.table.find("div.line:first-child div").first();
      width = 0;
      if (column.length > 0) {
        width = $(window).width() - column[0].offsetWidth;
        width = Math.ceil(width * 0.85);
      } else {
        width = Math.ceil($(window).width() * 0.6);
      }
      if (width === 0) {
        width = 200;
      }
      style_fixes = $("head style#fixes");
      if (style_fixes.length === 0) {
        style_fixes = $("<style id='fixes'>").appendTo($("head"));
      }
      css = ".chatlog .line a { max-width:" + width + "px; }\n";
      left_column = column[0] ? column[0].offsetWidth : 120;
      if (left_column < 100) {
        left_column = 120;
      }
      if (left_column > 150) {
        left_column = 150;
      }
      right_column = $(window).width() - left_column - 8;
	  css += "div.chatlog .line div:first-child { width: " + left_column + "px !important }\n";
	  css += "div.chatlog .line div.last-child { width: " + right_column + "px !important }\n"; 
      css += "div.chatlog { width: " + $(window).width() + "px !important }";
      style_fixes.html(css);
      return null;
    };

	Renderer.prototype.time = function(s, opts) {
	      var diff, row, ts;
	      ts = new Date;
	      diff = 5;
	      if (this.last_time) {
	        diff = (ts - this.last_time) / 1000 / 60;
	      }
	      if (diff < 7 && opts.before.attr("type") !== "privmsg") {
	        this.no_time += 1;
	        return;
	      }
	      s = s.replace(/^0/, "");
		  if (diff >= 5 || (diff < 0.1 && this.no_time > 10 && s !== this.last_time_string)) {
	        //row = $("<div class='line time'><div class='blank'></div><div class='msg'>" + s + "</div></div>");
	        Bonfire.last_nick = null;
	        //row.insertBefore(opts.before);
	        this.last_time = ts;
	        this.last_time_string = s;
	        return this.no_time = 0;
	      } else {
	        return this.no_time += 1;
	      }
	    };

	Renderer.prototype.line = function(num) {
	  return this.table.find("#line" + num);
	};

    Renderer.prototype.fix_really_long_words = function(row) {
      var msg, txt, word, words, _i, _len;
      msg = row.find("span.message");
	  txt = row.text();
      if (txt.length > 100) {
       words = txt.split(" ");
	   for (_i = 0, _len = words.length; _i < _len; _i++) {
	    word = words[_i];
	    if (word.length > 100) {
	     msg.css({
	     "word-break": "break-all"
	     });
	   break;
	   } 
        }
      return null; 
      }
    }; 

    Renderer.prototype.message = function(lineNumber, repeat) {
      var nick, row, sender, time;
      row = this.line(lineNumber);
	  this.hello.hide();
      if (!row[0]) {
        console.warn("missing " + lineNumber + ", retrying");
		if (repeat > 5) {
			console.warn("bailing, too many tries for " + lineNumber);
			return;
		} 
		setTimeout((function(_this) {
		          return function() {
		            return _this.message(lineNumber, repeat + 1);
		          };
		        })(this), 50);
        return;
      }
      //time = row.find("span.time");
      //this.time(time.html(), {
     //   before: row
     // });
      //time.remove();
	  this.fix_really_long_words(row); 
      row.removeClass("raw");
      sender = row.find("span.sender");
      nick = sender.attr("nick");
      if (nick !== Bonfire.last_nick || this.same_nick > 7) {
        Bonfire.last_nick = nick;
        this.same_nick = 0;
        if (nick && nick.length > 13) {
          sender.css({
            "font-size": "0.97em"
          });
          return sender.parent().css({
            "padding-top": "6px"
          });
        }
      } else {
        this.same_nick += 1;
		return sender.hide();
      }
    };

    return Renderer;

  })();
  
  window.BonfireHelpers = {
    highlight_nick: function(nick) {
      var user_msgs;
      user_msgs = $(".nick[data-nick=\"" + nick + "\"]");
      return user_msgs.each((function(_this) {
        return function(idx, msg) {
          return $(msg).addClass("nick-highlighted");
        };
      })(this));
    },
    unhighlight_nick: function(nick) {
      var user_msgs;
      user_msgs = $(".nick[data-nick=\"" + nick + "\"]");
      return user_msgs.each((function(_this) {
        return function(idx, msg) {
          return $(msg).removeClass("nick-highlighted");
        };
      })(this));
    }
  };
  
  replaceEmoji = function(lineNumber) {
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
  			"*_*": "😍",
			":/": "😕",
			"😕/": "://"
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
  
}).call(this);
