// Based on @angular/cdk/testing
import { EventEmitter, NgZone } from '@angular/core';

export function dispatchEvent(node: Node | Window, event: Event): Event {
    node.dispatchEvent(event);
    return event;
}

export function dispatchFakeEvent(
    node: Node | Window,
    type: string,
    canBubble?: boolean
): Event {
    return dispatchEvent(node, createFakeEvent(type, canBubble));
}

export function createFakeEvent(
    type: string,
    canBubble = false,
    cancelable = true
) {
    const event = document.createEvent('Event');
    event.initEvent(type, canBubble, cancelable);
    return event;
}

export function dispatchKeyboardEvent(
    node: Node,
    type: string,
    keyCode: number,
    target?: Element
): KeyboardEvent {
    return dispatchEvent(
        node,
        createKeyboardEvent(type, keyCode, target)
    ) as KeyboardEvent;
}

export function createKeyboardEvent(
    type: string,
    keyCode: number,
    target?: Element,
    key?: string
) {
    const event = new KeyboardEvent(type, {
        bubbles: true,
        cancelable: true,
        key
    }) as any;
    const originalPreventDefault = event.preventDefault;

    // Webkit Browsers don't set the keyCode when calling the init function.
    // See related bug https://bugs.webkit.org/show_bug.cgi?id=16735
    Object.defineProperties(event, {
        keyCode: { get: () => keyCode },
        key: { get: () => key },
        target: { get: () => target }
    });

    // IE won't set `defaultPrevented` on synthetic events so we need to do it manually.
    event.preventDefault = function() {
        Object.defineProperty(event, 'defaultPrevented', { get: () => true });
        return originalPreventDefault.apply(this, arguments);
    };

    return event;
}

export function dispatchMouseEvent(
    node: Node,
    type: string,
    x = 0,
    y = 0,
    event = createMouseEvent(type, x, y)
): MouseEvent {
    return dispatchEvent(node, event) as MouseEvent;
}

/** Creates a browser MouseEvent with the specified options. */
export function createMouseEvent(type: string, x = 0, y = 0, button = 0) {
    const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: false,
        detail: 0,
        screenX: x,
        screenY: y,
        clientX: x,
        clientY: y,
        button
    });

    // `initMouseEvent` doesn't allow us to pass the `buttons` and
    // defaults it to 0 which looks like a fake event.
    Object.defineProperty(event, 'buttons', { get: () => 1 });

    return event;
}

export class MockNgZone extends NgZone {
    override onStable: EventEmitter<any> = new EventEmitter(false);
    constructor() {
        super({ enableLongStackTrace: false });
    }
    override run(fn: Function): any {
        return fn();
    }
    override runOutsideAngular(fn: Function): any {
        return fn();
    }
    simulateZoneExit(): void {
        this.onStable.emit(null);
    }
}
