data = {
  "discordToken": "put your discord bot's API token here",
  "avoidEmojiCollisions": true,
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
  ]
};

module.exports = data;
