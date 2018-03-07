const fs = require("fs");

const Bot = require("./classes/Bot.js");

let roomId = "!nVtDAqOQIiTVoydTaH:jojotastic777-2.ddns.net"

let loadPluginsFromFiles = function (bot) {
  let dir = fs.readdirSync("plugins")
  for (let i of dir) {
    delete require.cache[require.resolve("./plugins/"+i)]
  }
  let _plugins = dir.map(a=>require("./plugins/"+a));
  _plugins.forEach(a=>{
    bot.registerPlugin(a);
  })
}

let bot = new Bot("generic-test-bot", loadPluginsFromFiles);
bot.loadPlugins();

bot.initMatrix("generic-test-bot", "generic-test-bot", "https://jojotastic777-2.ddns.net");
bot.startMatrix();