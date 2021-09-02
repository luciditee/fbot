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

#### Pull requests
PRs are welcome but this bot is a joke and I don't expect anyone to take it seriously. Have fun!
