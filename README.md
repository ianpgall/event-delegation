js-event-delegation
================

Attempt at creating event delegation without jQuery

Currently Supports:
-------------------

 - Normal handlers
 - Delegated handlers

Use:
----

 - Normal
    - `addEvent(element, eventName, callback)`
    - `addEvent(element, eventName, null, callback)`
    - `addEvent(element, Object)`
    - `addEvent(element, Object, null)`
 - Delegated
    - `addEvent(element, eventName, filter, callback)`
    - `addEvent(element, Object, filter)`

Where `Object` refers to key/value pairs of `eventName` and `callback`

Returning `false` from the handler will effectively prevent the Event's default behavior and stop propagation.
