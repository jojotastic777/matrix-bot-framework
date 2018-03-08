class Context {
  constructor (protocol, caller, room) {
    this.protocol = protocol;
    this.caller = caller;
    this.room = room;
  }
}

module.exports = Context;