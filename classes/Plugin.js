class Plugin {
  constructor (name, load) {
    this.name = name;
    this._load = load;
  }

  static constructFromObject (args) {
    return new this.prototype.constructor(args.name, args.load);
  }

  get config () {
    return require("../config.json")[this.name]
  }

  load (bot) {
    return this._load(this, bot);
  }
}

module.exports = Plugin;