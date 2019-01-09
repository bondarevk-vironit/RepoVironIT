class EventEmitter {
  constructor() {
    this.events = {};
  }

  emit(eventName, data) {
    const event = this.events[eventName];
    if (event) {
      event.forEach(fn => {
        fn.call(null, data);
      });
    }
  }

  subscribe(eventName, fn) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(fn);
    // отлично! я и забыл вам дать в задание реализацию отписки
    return () => {
      this.events[eventName] = this.events[eventName].filter(
        eventFn => fn !== eventFn
      );
    };
  }
}
