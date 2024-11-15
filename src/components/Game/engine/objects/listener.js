class Listener {
    // references used across instance
    observers = {};

    // add an event listener
    on(event, listener) {
        // push listerner to list of observers
        (this.observers[event] || (this.observers[event] = [])).push(listener);

        //return target for chaining
        return this;
    }

    // trigger a given event
    trigger(event, data) {
        for (
            // cycle through all listerners for a given event
            var value = this.observers[event], key = 0;
            value && key < value.length;

        ) {
            // call listener and pass data
            value[key++](data);
        }
    }

    // remove (a single or all) event listener
    off(event, listener) {
        var value, key;
        for (
            // get index of the given listener
            value = this.observers[event] || [];
            // find all occurrences
            listener && (key = value.indexOf(listener)) > -1;

        ) {
            // remove the listener
            value.splice(key, 1);
        }

        // assign the new list
        this.observers[event] = listener ? value : [];

        // return target for chaining
        return this;
    }
}

export default Listener
