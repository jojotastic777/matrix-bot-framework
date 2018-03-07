class Command {
  constructor (name, exec) {
    this.name = name;
    this._exec = exec;
  }

  exec (bot_this, context, args) {
    return this._exec(bot_this, context, args);
  }
}

module.exports = Command;