const EventEmitter = require("events");

class EventBus extends EventEmitter {
  publish(eventName, payload) {
    this.emit(eventName, {
      ...payload,
      eventName,
      occurredAt: new Date().toISOString(),
    });
  }
}

module.exports = new EventBus();
