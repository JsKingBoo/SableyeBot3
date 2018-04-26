# ![logo](assets/avatar.png "logo") 
# SableyeBot
### Competitive Pokemon Discord bot

## [Add SableyeBot to your server](https://discordapp.com/oauth2/authorize?&client_id=211522070620667905&scope=bot)

## Installation
SableyeBot requires NodeJS 8.0+. In order to run your own local copy of SableyeBot, you need to perform a few steps.

1. Download this repository.
2. Rename `config.js.example` to `config.js` and fill out the empty fields and/or change the default values.
3. Go to and download the [Pokemon-Showdown](https://github.com/Zarel/Pokemon-Showdown) repository. You only need four folders: `/sim`, `/data`, `/mods`, and `/config`
4. In `/sim`, move `dex.js` and `dex-data.js` into the `/utils` folder of SableyeBot
5. Move `/data` and `/mods` to the root directory of SableyeBot
6. Move `/config` to the root directory of SableyeBot. You may delete everything except `formats.js` if you wish. (SableyeBot only uses that one file.)
7. Go to and download the [Pokemon-Showdown-Client](https://github.com/Zarel/Pokemon-Showdown-Client) repository. You only need one folder: `/data`
8. Move `pokedex-mini.js` and `pokedex-mini-bw.js` into the SableyeBot `/data` folder.

If the steps above are performed correctly, you should be able to run `node index.js` and the bot will launch.

## Issues
If you encounter any bugs or need help, create an issue on the issue tracker. Please include:

 * A description of the bug
 * Steps to reproduce this bug
 * Expected versus actual behavior
 * Screenshots and/or gifs, if necessary
 * Bot version and/or date observed
 * Any other additional information
 
## Contributing
Want to help out? Fork this repository, make your changes, and send a pull request.
Do not worry too much over styling--I will look over your code and may change some lines anyways.

## Credits
 * [unlucky4ever's RuneCord bot](https://github.com/unlucky4ever/RuneCord), which SableyeBot is heavily based off of.
 * [Zarel's PokemonShowdown](https://github.com/Zarel/Pokemon-Showdown), whose databases SableyeBot parses.