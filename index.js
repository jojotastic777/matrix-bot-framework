const Bot = require("./classes/Bot.js");
const loadPluginsFromFiles = require("./helpers/loadPluginsFromFiles.js");

let roomId = "!nVtDAqOQIiTVoydTaH:jojotastic777-2.ddns.net"

let bot = new Bot("generic-test-bot", loadPluginsFromFiles);
bot.loadPlugins();

bot.loadProtocol("matrix")