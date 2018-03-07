class Plugin {
  constructor (name, load) {
    this.name = name;
    this._load = load;
  }

  load (bot) {
    return this._load(bot);
  }
}

module.exports = Plugin;