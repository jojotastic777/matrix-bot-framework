const fs = require("fs");

const Plugin = require("../classes/Plugin.js");

module.exports = new Plugin ("logging", (plugin, bot)=>{
  if (!fs.existsSync(plugin.config.log_dir)) {
    fs.mkdirSync(plugin.config.log_dir);
  }
  plugin.logfile_name = (new Date()).toISOString().replace(/T/,"_").replace(/Z/,"");
  fs.appendFileSync(
    plugin.config.log_dir+"/"+plugin.logfile_name,
    `=== BEGIN LOG ${plugin.logfile_name} ===`
  )
  bot.registerMessageProcessor((context, message) => {
      fs.appendFileSync(
        plugin.config.log_dir+"/"+plugin.logfile_name,
        `\n${context.protocol}\\${context.room}\\${context.caller}\\${message}`
      );
      console.log(`${context.protocol}\\${context.room}\\${context.caller}\\${message}`)
  })
  bot.registerCleanup((_bot)=>{
    fs.appendFileSync(
      plugin.config.log_dir+"/"+plugin.logfile_name,
      `\n=== END LOG ${plugin.logfile_name} ===`
    );
  })
})