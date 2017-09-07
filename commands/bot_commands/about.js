'use strict';

module.exports = {
  desc: "About SableyeBot",
  usage: "",
  aliases: ['sableye', 'version'],
  options: [],
  hasCustomFormatting: true,
  process: (msg, flags) => {
    return ({
      title: "About SableyeBot",
      description: "Competitive Pokemon Discord bot.",
      url: "https://github.com/JsKingBoo/SableyeBot3",
      author: {
        name: "JsKingBoo#8858",
        icon_url: "http://i.imgur.com/HYJS7kn.png"
      },
      color: 0x5F32AB,
      fields: [
        {name: "Language", value: "JavaScript (discordjs)"}
      ],
      footer: {
        text: `SableyeBot version ${packagejson.version}`
      }
    });
    
  }
};






