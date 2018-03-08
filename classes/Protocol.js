class Protocol {
  constructor (name, init, send, context, onMessage) {
    this.name      = name;
    this._init     = init;
    this._send     = send;
    this._context  = context;
    this.onMessage = onMessage;
  }

  static constructFromObject (args) {
    return new this.prototype.constructor(args.name, args.init, args.send, args.context, args.onMessage);
  }

  constructContext (bot, raw) {
    return this._context(this, bot, raw);
  }
  
  init (bot, credentials) {
    this._init(this, bot, credentials);
  }

  send (msg, channel) {
    this._send(this, msg, channel);
  }
}

module.exports = Protocol;