const Plugin = require("../classes/Plugin.js");
const Command = require("../classes/Command.js");

module.exports = new Plugin ("std_cmds", (bot)=>{
  bot.registerCommand(new Command("plugins", (b, context, args)=>{
    b.send(Object.keys(b.plugins).join(", "), context.room)
  }))
  bot.registerCommand(new Command("commands", (b, context, args)=>{
    b.send(Object.keys(b.commands).join(", "), context.room)
  }))
  bot.registerCommand(new Command("reload", (b, context, args)=>{
    b.reloadPlugins();
  }))
})