class Context {
  constructor (protocol, caller, room) {
    this.protocol = protocol;
    this.caller = caller;
    this.room = room;
  }
  
  static fromMatrixSender (sender) {
    return new this.prototype.constructor(sender.userId, sender.roomId);
  }
}

module.exports = Context;