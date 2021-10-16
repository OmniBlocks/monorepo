//A simple events system for effectively direct links without actualy linking files or references
class EventManager { 
    private activeEvents:string[] = [];
    private listeners:any = {};

    constructor() {
        this.activeEvents = [];
        this.listeners = {};
    }


    public raise(eventType: string, eventData: any, extraEventData?: any): void {
        if (this.listeners[eventType] == undefined) {
            this.listeners[eventType] = []
        }
        this.activeEvents.push(eventType);
        for (let i: number = 0; i < this.listeners[eventType].length; i++) {
            this.listeners[eventType][i](eventData,extraEventData)
        }
        this.activeEvents.pop();
    }

    public listen(eventType:string,callback:Function): void {
        if (this.listeners[eventType] == undefined) {
            this.listeners[eventType] = []
        }
        this.listeners[eventType].push(callback)
    }
}

export const events:EventManager = new EventManager()