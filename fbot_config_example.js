data = {
  "discordToken": "put your discord bot's API token here",
  "avoidEmojiCollisions": true,
  "commandPrefix": "f!",
  "admins": [
    0, // this number should be equivalent to your Discord user ID. NOT THE SAME AS USERNAME
  ],
  "triggerConfig": [
    {
      "sequences": [
        {"word": "kraft", "pluralize": false },
        {"word": "cheese", "pluralize": "s" }
      ],
      "cooldown": 600,
      "blacklist": null,
      "useRegex": false
    },
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
  ],
  "commands": [
    {
      "name": "ping",
      "cooldown": 5,
      "adminOnly": false,
      "action": (msg, sequence, params, author, bot, msgObj) => {
        msgObj.channel.send("pong");
      }
    }
  ]
};

module.exports = data;
