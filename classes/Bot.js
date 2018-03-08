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

    if (process.platform === "win32") {
      var rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
      });
    
      rl.on("SIGINT", function () {
        process.emit("SIGINT");
      });
    }
    
    process.on("SIGINT",()=>this.gracefulExit());
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

  send (msg, roomId) {
    //this._matrix.sendNotice(roomId, msg, md.render(msg))
    for (let protocol of Object.keys(this.protocols).map(a=>this.protocols[a])) {
      protocol.send(msg, roomId)
    }
  }

  gracefulExit () {
    console.log();
    for (let func of this.cleanup) {
      try {
        func(this);
      } catch (e) {
        console.log(e);
      }
    }
    process.exit();
  }
}

module.exports = Bot;