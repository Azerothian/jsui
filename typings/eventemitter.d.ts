declare module "eventemitter" {
    class EventEmitter {
        getListeners(event: string): Function[];
        flattenListeners(args: any[]): Function[];
        getListenersAsObject(args: any[]): Object;
        addListener(event: string, listener: Function): EventEmitter;
        on(event: string, listener: Function): EventEmitter;
        addOnceListener(event: string, listener: Function): EventEmitter;
        once(event: string, listener: Function): EventEmitter;
        defineEvent(event: string): EventEmitter;
        removeListener(event: string, listener: Function): EventEmitter;
        off(event: string, listener: Function): EventEmitter;
        addListeners(event: string, listeners: Function[]): EventEmitter;
        removeListeners(event: string, listeners: Function[]): EventEmitter;
        manipulateListeners(remove: boolean, event: string, listeners: Function[]): EventEmitter;
        removeEvent(event: string): EventEmitter;
        removeAllListeners(event: string): EventEmitter;
        emitEvent(event: string, args: any[]): EventEmitter;
        trigger(event: string, ...args: any[]): EventEmitter;
        emit(event: string, ...args: any[]): boolean;
        setOnceReturnValue(value: any): EventEmitter;
        noConflict(): EventEmitter;
    }
    export = EventEmitter;
}