'use strict';

module.exports = {
  desc: "About SableyeBot",
  usage: "",
  aliases: ['sableye', 'version'],
  options: [],
  adminOnly: false,
  hasCustomFormatting: true,
  process: async function(msg, flags) {
    return ({'embeds': [
      {
        title: "About SableyeBot",
        description: "Competitive Pokemon Discord bot.",
        url: "https://github.com/JsKingBoo/SableyeBot3",
        author: {
          name: "stalruth#3021",
          icon_url: "https://cdn.discordapp.com/avatars/112038152390123520/56a380f68b4127e8bc49d8e08dd6bd6e.webp"
        },
        color: 0x5F32AB,
        fields: [
          {
            name: 'Invite Link',
            value: '[Click Here](https://discord.com/api/oauth2/authorize?client_id=211522070620667905&permissions=0&scope=bot%20applications.commands)',
            inline: true,
          },
          {
            name: 'Support Server',
            value: 'https://discord.gg/etUxhVfA7u',
            inline: true,
          },
          {name: "Language", value: "JavaScript ([discordjs](https://discord.js.org/))"},
          {
            name: 'Privacy Policy',
            value: 'https://sableye-bot.xyz/PRIVACY-v3',
            inline: true,
          },
          {
            name: 'Terms of Use',
            value: 'https://sableye-bot.xyz/TERMS',
            inline: true,
          },
        ],
        footer: {
          text: `SableyeBot version ${packagejson.version}`
        }
      }
    ]});
  }
};






