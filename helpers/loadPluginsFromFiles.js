const fs = require("fs");

module.exports = function (bot) {
    let dir = fs.readdirSync("plugins")
    for (let i of dir) {
      delete require.cache[require.resolve("../plugins/"+i)]
    }
    let _plugins = dir.map(a=>require("../plugins/"+a));
    _plugins.forEach(a=>{
      bot.registerPlugin(a);
    })
  }