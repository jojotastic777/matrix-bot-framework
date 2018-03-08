class Plugin {
  constructor (name, load) {
    this.name = name;
    this._load = load;
  }

  static constructFromObject (args) {
    return new this.prototype.constructor(args.name, args.load);
  }

  load (bot) {
    return this._load(bot);
  }
}

module.exports = Plugin;