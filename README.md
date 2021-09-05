# FBot
A Discord bot that says "fuck 'em" to things you don't like. Released under the 3-clause BSD 
license.

It's held together with Scotch tape and love, but it works!

### Disclaimer
It's obvious this bot can be used for bullying or people generally being utter douchebags. 
Maybe *don't* do that? I can't really stop people from doing that, but I can say this at least:

This bot was made for friends of mine as a joke so we could pick on things we
collectively disliked, such as Comcast or yellow jacket wasps. If anyone uses this bot for
malicious purposes, such as targeted harassment of any person or group of people--fuck 'em.
Please don't misuse my code.

That said, due to the way open source software generally works, there's no real way to stop 
bad actors from using this code maliciously, so per the license terms, the authors assume 
no warranty or liability for the misuse of the code in this repository. See LICENSE for details.

### Setup
Follow the configuration settings in the **Configuration** section below. Alternatively, to 
get started very quickly, just put your Discord bot API token in the `discordToken` field in
`fbot_config_example.js`. Rename it to `fbot_config.js` and you can run the bot using

```
$ node fbot.js
```

Depending on your platform (I'm on Linux for this), you can use tools such as `nohup` to suppress 
output and run the bot in the background, regardless of whether your close your shell.

```
$ nohup node fbot.js &
```

### Configuration
As seen in `fbot_config.js`, you can edit how the bot interacts with things.

#### Nomenclature

* **Trigger**: A thing that sets off the bot and makes it say "fuck 'em."

* **Sequence**: A set of words or expressions that are usually related or synonymous to one another, such as how Comcast rebranded their ISP service as Xfinity, but no one is fooled by this and we all know it's just Comcast. All *sequences* set off the same *trigger.*

* **Cooldown**: The minimum time, in seconds, that must elapse between usages of the same trigger.

* **Blacklist**: Words that may match a non-regex expression, such as how *ass* can be found in *associate* or *assistant*, so your immature self may want to add "ass" as a trigger, but not set off on common words. **This isn't always the best practice.** For that, you can use regular expressions (see below).

* **Pluralization**: The act of making a word plural, such as *game* into *games*.

* **Regular expressions:** Character vomit that describes an abstract set of character sequence matching rules. I use [Regex101](https://regex101.com/) for editing my regular expressions and as a quick reference card, but you can use whatever.

* **Command:** An explicit directive given to the bot to do something. See the *Commands* section below.

#### Example of a standard, unremarkable trigger
```
    {
      "sequences": [
        {"word": "comcast", "pluralize": false },
        {"word": "xfinity", "pluralize": false }
      ],
      "cooldown": 300,
      "blacklist": null,
      "useRegex": false
    }
```

This trigger *does not use regular expressions* and is pretty standard. It will trigger on the words "comcast" and "xfinity," because they aren't fooling anyone and everyone knows they're the same thing. Both words will be subject to the same 300 seconds (5-minute cooldown).

#### Example of a regular expression trigger
```
    {
      "sequences": [
        {
          "word": /[\s?]?([^a-z\-A-Z0-9]^|^|\s)ad($|\s|s|vertisement|vert|verti(s|z)(e(>)))/,
          "pluralize": "s",
          "smartPlural": true,
          "presentTenseFilter": true
        }
      ],
      "cooldown": 600,
      "blacklist": null,
      "useRegex": true
    }
```

This trigger *does* use regular expressions, and its only sequence is one that detects the use of "advertisement"-related phrases, such as "ad" or "advert," but not words that might encapsulate it such as "adventure" or "advantageous." A few of the extra things going on:

* `smartPlural` means it will attempt to use `N` or `eN` (where `N` is the `s` character specified in `pluralize`) depending on whether or not it ends in a consonant. This feature is optional and doesn't work for every English word, and breaks horribly in other languages.

* `presentTenseFilter` identifies when English present tense conjugations `-ing` are used, and disables pluralization for that sequence. Without this feature, for example, "advertising" would be "advertisings," which isn't really a word, and trying to account for valid English verb conjugation is just way too out of scope for this silly little bot.

#### Commands

A *command* can be given to the bot by any user (or by admins, as defined in the `admins` section of `fbot_config.js`).

To mark yourself as an admin to use admin-only commands, you must use your [Discord user ID](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) number, which is distinct from your username (it's a really long number), and put it in the `admins` array of `fbot_config.js`.

Commands are preceded by a prefix, by default `f!`, and would be invoked as `f!help` or `f!list`.

Here are all the admin commands:

* `help` - Lists all commands in the bot.
* `list trigger` - Lists all triggers and sequences available within the bot, and their cooldowns. Replace `trigger` with a trigger you'd like to list more thoroughly, *or* omit it entirely and just use the `list` command alone to get a list of everything.
* `timeleft trigger` - The amount of time remaining in the cooldown for a given trigger. Replace `trigger` with the one you'd like to know about.
* `warmup trigger` - Resets (warms up) the cooldown timer to 0.

Commands are always parsed before triggers, so if a command somehow shares an incantation with a trigger sequence, the command will still run as expected--but the trigger won't set off a "fuck 'em" response.

#### Custom Commands
At the bottom of `fbot_config.js`, after the `triggerConfig` section, you'll see a section for `commands`. In this section, you can write your own JavaScript code to comprise custom commands for the bot, thereby allowing you unfettered extensions to the bot's functionality without ever having to directly edit the `fbot.js` code itself.

The following is an example command which, when the user types `f!ping` (assuming the default prefix setting of `f!`), will cause the bot to respond with `pong`.

```
    {
      "name": "ping",
      "cooldown": 5,
      "adminOnly": false,
      "action": (msg, sequence, params, author, bot, msgObj) => {
        msgObj.channel.send("pong");
      }
    }
```

Most of this should be self explanatory.

The `action` is a function that has 6 parameters:

- `msg` is the plaintext message that was seen by the bot.
- `sequence` is the text of the command, minus the prefix, if you need access to this.
- `params` is all text after the command text, so the `params` of `f!list test` would simply read `test`. The `params` string is always whitespace-trimmed.
- `author` is the User ID of the author, in case you need to compare it against something.
- `bot` is the Discord.js `bot` object.
- `msgObj` is the Discord.js `message` object emitted by the message event, which you can use to check for specific metadata not exposed through the other function parameters, such as the channel the message was sent to.

Trigger and Command objects for the bot are appended to the `bot` object, and can be accessed as follows:

- `bot.fbotTriggers`
- `bot.fbotCommands`

in case you need access to this information.

#### Pull requests
PRs are welcome but this bot is a joke and I don't expect anyone to take it seriously. Have fun!
