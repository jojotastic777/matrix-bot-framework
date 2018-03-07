const Plugin = require("../classes/Plugin.js");
const Command = require("../classes/Command.js");

module.exports = new Plugin ("ping", (bot)=>{
  bot.registerCommand(new Command("ping", (b, context, args)=>{
    b.send("Pong.", context.room)
  }))
  /*bot.registerCommand(new Command("ping2", (b, context, args)=>{
    b.send("Pong. x2", context.room)
  }))*/
  bot.registerCommand(new Command("echo", (b, context, args) => {
    b.send(args.join(" "), context.room)
  }))
  
})