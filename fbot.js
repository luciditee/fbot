
/*
 * This code is subject to the licensing agreement found in the LICENSE file.
 * You may not modify or redistribute this code without the inclusion of the LICENSE file
 * contents alongside this code.
 *
 * See LICENSE for details.
 *
 */

const configFile = require("./fbot_config.js");
const Discord = require("discord.js");

const bot = new Discord.Client();
const token = configFile.discordToken;
const message = "? fuck 'em"

bot.on('ready', () => {
  console.log('bot is ready')
})

bot.login(token)

class Trigger {

	constructor(words, countdown, bl, useRegex=false) {
		this.words = words
		this.countdownLength = countdown
		this.lastTrigger = 0
		this.blacklist = bl;
		this.useRegex = useRegex;

		if (this.useRegex === false) {
			for (let i = 0; i < this.words.length; i++) {
				this.words[i].word = this.words[i].word.toLowerCase().trim()
			}

			if (this.blacklist !== undefined && this.blacklist != null) {
				for (let i = 0; i < this.blacklist.length; i++) {
					this.blacklist[i] = this.blacklist[i].toLowerCase().trim()
				}
			}
		}
	}

	// checks if this contains the word in question
	containsWord(word) {
		return (this.whichIs(word) != false && this.hasBlacklist(word) === false)
			? this.whichIs(word) : false; // double check, but whatever.
	}

	// checks if it's okay to reset this trigger
	isValid(time) {
		return ((time -  this.lastTrigger) > this.countdownLength);
	}

	// resets the clock
	resetClock() {
		this.lastTrigger = Math.floor(new Date().getTime() / 1000)
	}

	// detects which string was the trigger word and returns it
	// or false if it doesn't find it
	whichIs(str) {
		for (var i = 0; i < this.words.length; i++) {
//			console.log("checking " + this.words[i] + " against " + str);
			if (this.useRegex) {
//				console.log(str);
//				console.log(this.words[i]);
//				console.log(this.words[i].word.test(str.toLowerCase()));
//				console.log("---");
				if (this.words[i].word.test(str.toLowerCase()) === true) {
//					console.log("success");
//					console.log(str.toLowerCase().match(this.words[i].word));
					var m = str.toLowerCase().match(this.words[i].word)[0];
					var p = this.presentTenseFilter(this.words[i], m, this.words[i].word);				
					if (p == false)
						return m;
					return p + this.smartPlural(this.words[i], m);
				}
			} else {
	                        if (str.toLowerCase().indexOf(this.words[i].word) != -1) {
                                        var m = (this.words[i].word).toLowerCase();
					var p = this.presentTenseFilter(this.words[i], m)
					if (p == false)
						return m;
                                        return p + this.smartPlural(this.words[i], m);
				}
			}
                }
                return false
	}

	smartPlural(word, match) {
		if (!(word.pluralize))
			return "";
		if (!(word.smartPlural))
			return word.pluralize;

		var len = word.pluralize.length;
		if (len === undefined)
			return word.pluralize;
		if (match.slice(match.length - len) == word.pluralize)
			return "";
		return word.pluralize;
	}

	presentTenseFilter(wordObj, match, pattern) {
		if (!(wordObj.presentTenseFilter))
			return match;
		let w = match.trim();
		if (w.slice(w.length - 3) == "ing") {
/*			var r = match.slice(0, w.length - 3);
			if (wordObj.useRegex) {
				var s = r;
				while (s !== "" && s.length > 0) {
					s = s.slice(0, s.length-1);
					console.log(s)
					if (pattern.test(s))
						return s;
				}
				return false;
			} else
				return r;
*/
			return false; // fuck english verb conjugation
		}
		return w;
	}

	hasBlacklist(str) {
		if (this.blacklist === undefined || this.blacklist === null) return false;
		for (let i = 0; i < this.blacklist.length; i++) {
			if (this.useRegex) {
				if (this.blacklist[i].test(str.toLowerCase())) {
					console.log(this.blacklist[i].test(str.toLowerCase()));
					return str
				}
			} else {
				if (str.toLowerCase().indexOf(this.blacklist[i]) != -1)
					return str
			}
		}
		return false
	}

}

// parse triggers from config
var triggers = [];
for (let i = 0; i < configFile.triggerConfig.length; i++) {
	let conf = configFile.triggerConfig[i];
	let t = new Trigger(conf.sequences, conf.cooldown, conf.blacklist,
			conf.useRegex);
	triggers.push(t); // pusha t
}

bot.on('message', async (msg) => {
	if (msg.author.bot) return;
//	console.log("got message from " + msg.author);

	var currTime = Math.floor(new Date().getTime() / 1000)

	for (i = 0; i < triggers.length; i++) {
		// yes, I know what short-circuit eval is
		// no, I don't care, this was like this for debug print
		// purposes originally and it's stupid to change at this point
		let word = triggers[i].containsWord(msg.content);
		if (word !== false) { // is the word present?
			if (triggers[i].isValid(currTime)) { // is it time to run?
				// reset clock
				triggers[i].resetClock()

				// say the line, bart!
//				msg.channel.send("> " + triggers[i].whichIs(msg.content) + "\nFuck 'em");
				msg.channel.send("" + word + message);

				// debug
//				console.log("reacted to trigger " + i);

				// stop iteration, don't trigger on multiples
				break;
			}
		}
	}

	// msg.content
	//console.log("received: " + msg.content);  
})


