const Plugin   = require("../classes/Plugin.js");
const Protocol = require("../classes/Protocol.js");
const Context  = require("../classes/Context.js");

const MatrixBot = require("matrix-js-basic-bot");
const md = require("markdown-it")();

module.exports = new Plugin ("matrix", (bot)=>{
  bot.registerProtocol(Protocol.constructFromObject({
    name: "matrix",
    init: function (self, _bot, credentials) {
      self._matrix = new MatrixBot(credentials.username, credentials.password, credentials.homeserver, "./localstorage-"+_bot.name+"-"+self.name);
      //console.log(self._matirx);
      self._matrix.on('message', (a,b)=>self.onMessage(self,_bot,a,b));
      self._matrix.start();
    },
    send: function (self, msg, room) {
      self._matrix.sendNotice(room, msg, md.render(msg))
    },
    context: function (self, raw) {
      return new Context(self.name, raw.userId, raw.roomId)
    },
    onMessage: function (self, b, content, sender) {
      let context = self.constructContext(sender);
      if (content.body.slice(0,b.command_prefix.length) == b.command_prefix) {
        let cmd_raw = content.body.slice(b.command_prefix.length)
        let cmd_raw_array = cmd_raw.split(" ");
        let cmd_name = cmd_raw_array[0];
        let args = cmd_raw_array.slice(1);
        if (b.execCommandIfExists(cmd_name, context, args) === -1) {
          self.send(b.invalid_command_message.replace(/\$CMD/g, cmd_name), context.room);
        }
      }
      for (let processor of b.messageProcessors) {
        processor(context, content.body);
      }
    },
  }))
  bot.registerCleanup((_bot)=>{
    console.log("Running Matrix Cleanup")
    _bot.protocols.matrix._matrix.stop();
    delete _bot.protocols.matrix["_matrix"];
  })
})