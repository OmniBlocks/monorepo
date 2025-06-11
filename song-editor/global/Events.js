class EventManager {
    constructor() {
        this.activeEvents = [];
        this.listeners = {};
        this.activeEvents = [];
        this.listeners = {};
    }
    raise(eventType, eventData, extraEventData) {
        if (this.listeners[eventType] == undefined) {
            return;
        }
        this.activeEvents.push(eventType);
        for (let i = 0; i < this.listeners[eventType].length; i++) {
            this.listeners[eventType][i](eventData, extraEventData);
        }
        this.activeEvents.pop();
    }
    listen(eventType, callback) {
        if (this.listeners[eventType] == undefined) {
            this.listeners[eventType] = [];
        }
        this.listeners[eventType].push(callback);
    }
    unlisten(eventType, callback) {
        if (this.listeners[eventType] == undefined) {
            return;
        }
        const lisen = this.listeners[eventType].indexOf(callback);
        if (lisen != -1) {
            this.listeners[eventType].splice(lisen, 1);
        }
    }
    unlistenAll(eventType) {
        if (this.listeners[eventType] == undefined) {
            return;
        }
        this.listeners[eventType] = [];
    }
}
export const events = new EventManager();
//# sourceMappingURL=Events.js.map