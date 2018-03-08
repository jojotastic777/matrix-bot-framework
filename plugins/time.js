const Plugin = require("../classes/Plugin.js");
const Command = require("../classes/Command.js");

module.exports = new Plugin ("time", (plugin, bot)=>{
  bot.registerCommand(new Command("timestamp", (b, context, args)=>{
    b.send(String(Date.now()), context.room)
  }))
})