import Listener from "./objects/listener";

class Input extends Listener {
    sources = {};
    sourcesById = {};
    counter = 0;
    addSource(source, id) {
        var isNew;

        id = id || this.counter;

        if (id > this.counter || 0 > id) {
            console.warn("Non used id configured might be overriden");
        }

        isNew = !this.sourcesById[id];

        this.counter++;

        source.configure(this, id);

        if (isNew) {
            this.sourcesById[id] = {};
            this.trigger("new source", source);
        }

        this.sources[source.id] = source;
        this.sourcesById[id][source.id] = source;

        this.trigger("source added", source);
    }
    getSource(name) {
        return this.sources[name];
    }
    getSources() {
        return this.sources;
    }
}

export default new Input();
