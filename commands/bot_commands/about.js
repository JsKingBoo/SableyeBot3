'use strict';

module.exports = {
  desc: "About SableyeBot",
  usage: "",
  aliases: ['sableye', 'version'],
  options: [],
  adminOnly: false,
  hasCustomFormatting: true,
  process: async function(msg, flags) {
    return ({'msg': '', 'embed': {
      title: "About SableyeBot",
      description: "Competitive Pokemon Discord bot.",
      url: "https://github.com/JsKingBoo/SableyeBot3",
      author: {
        name: "JsKingBoo#8858",
        icon_url: "http://i.imgur.com/HYJS7kn.png"
      },
      color: 0x5F32AB,
      fields: [
        {name: "Invite Link", value: "[Click here](https://discordapp.com/oauth2/authorize?&client_id=211522070620667905&scope=bot)"},
        {name: "Language", value: "JavaScript (discordjs)"}
      ],
      footer: {
        text: `SableyeBot version ${packagejson.version}`
      }
    }});
    
  }
};






