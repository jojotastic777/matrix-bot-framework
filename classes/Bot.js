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
    this.command_prefix = "!"
    this._matrix = null;
    this.invalid_command_message = `"$CMD" is not a valid command. Run "!commands" for a list of commands.`
  }

  registerPlugin (plugin) {
    console.log("Registering Plugin \""+plugin.name+"\"")
    this.plugins[plugin.name] = plugin;
  }

  registerCommand (command) {
    console.log("Registering Command \""+command.name+"\"")
    this.commands[command.name] = command;
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
    this.plugins = {};
    this._pluginsGen(this);
    this.commands = {};
    this.loadPlugins();
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

  initMatrix (username, password, home_server) {
    this._matrix = new MatrixBot(username, password, home_server, "./localstorage-"+this.name);
    this._matrix.on('message', (a,b)=>this.onMessage(a,b));
  }

  async startMatrix () {
    await this._matrix.start();
  }

  send (msg, roomId) {
    this._matrix.sendNotice(roomId, msg, md.render(msg))
  }

  onMessage (content, sender) {
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
  }
}

module.exports = Bot;