const MatrixBot = require("matrix-js-basic-bot");
const md        = require("markdown-it")();
const Context   = require("../classes/Context.js");

class Bot {
  constructor (name, pluginsGen) {
    this.name = name;
    this._pluginsGen = pluginsGen;
    this.plugins = {}
    pluginsGen(this);
    this.commands = {};
    this.protocols = {};
    this.protocolsCache = {};
    this.cleanup = [];
    this.messageProcessors = [];
    this.command_prefix = "!"
    this.invalid_command_message = `"$CMD" is not a valid command. Run "!commands" for a list of commands.`
  }

  registerPlugin (plugin) {
    console.log("Registering Plugin \""+plugin.name+"\"")
    this.plugins[plugin.name] = plugin;
  }

  registerCleanup (cleanup) {
    console.log("Registering Cleanup Function");
    this.cleanup.push(cleanup);
  }

  registerCommand (command) {
    console.log("Registering Command \""+command.name+"\"")
    this.commands[command.name] = command;
  }

  registerProtocol (protocol) {
    console.log(`Registering Protocol "${protocol.name}"`)
    this.protocols[protocol.name] = protocol;
    this.protocolsCache[protocol.name] = this.protocolsCache[protocol.name] == undefined ? {} : this.protocolsCache[protocol.name];
  }

  registerMessageProcessor (messageProcessor) {
    console.log(`Registering Message Processor`);
    this.messageProcessors.push(messageProcessor);
  }

  loadProtocol (protocol_name, credentials) {
    console.log(`Loading Protocol "${protocol_name}"`)
    this.protocolsCache[protocol_name].credentials = credentials;
    this.protocols[protocol_name].init(this, credentials);
  }

  loadPlugin (plugin_name) {
    console.log("Loading Plugin \""+plugin_name+"\"")
    this.plugins[plugin_name].load(this)
  }

  loadPlugins () {
    for (let i in this.plugins) {
      this.loadPlugin(i);
    }
  }

  reloadPlugins () {
    console.log("Plugin Reload Initiated.")
    for (let func of this.cleanup) {
      func(this);
    }
    this.plugins = {};
    this.commands = {};
    this.protocols = {};
    this.cleanup = [];
    this.messageProcessors = [];
    this._pluginsGen(this);
    this.loadPlugins();
    console.log(this.protocolsCache);
    for (let protocol of Object.keys(this.protocols).map(a=>this.protocols[a])) {
      protocol.init(this, this.protocolsCache[protocol.name].credentials);
    }
    console.log("Plugin Reload Complete.")
  }

  execCommand (command_name, context, args) {
    this.commands[command_name].exec(this, context, args);
  }

  execCommandIfExists (command_name, context, args) {
    if (this.commands[command_name] !== undefined) {
      this.execCommand(command_name, context, args);
    } else {
      return -1;
    }
  }

  setCommandPrefix (prefix) {
    this.command_prefix = prefix;
  }

  /*initMatrix (username, password, home_server) {
    this._matrix = new MatrixBot(username, password, home_server, "./localstorage-"+this.name);
    this._matrix.on('message', (a,b)=>this.onMessage(a,b));
  }*/

  /*async startMatrix () {
    await this._matrix.start();
  }*/

  send (msg, roomId) {
    //this._matrix.sendNotice(roomId, msg, md.render(msg))
    for (let protocol of Object.keys(this.protocols).map(a=>this.protocols[a])) {
      protocol.send(msg, roomId)
    }
  }

  /*onMessage (content, sender) {
    let context = Context.fromMatrixSender(sender);
    if (typeof this.override_onMessage == "function") {
      return this.override_onMessage(content, sender)
    } else if (content.body.slice(0,this.command_prefix.length) == this.command_prefix) {
      let cmd_raw = content.body.slice(this.command_prefix.length)
      let cmd_raw_array = cmd_raw.split(" ");
      let cmd_name = cmd_raw_array[0];
      let args = cmd_raw_array.slice(1);
      if (this.execCommandIfExists(cmd_name, context, args) === -1) {
        this.send(this.invalid_command_message.replace(/\$CMD/g, cmd_name), context.room);
      }
    }
  }*/
}

module.exports = Bot;