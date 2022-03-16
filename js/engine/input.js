class Input {
    sources = {};
    sourcesById = {};
    counter = 0;
    addSource(source, id) {
        var isNew;

        id = id || counter;

        if (id > counter || 0 > id) {
            console.warn("Non used id configured might be overriden");
        }

        isNew = !sourcesById[id];

        counter++;

        source.configure(this, id);

        if (isNew) {
            sourcesById[id] = {};
            this.trigger("new source", source);
        }

        sources[source.id] = source;
        sourcesById[id][source.id] = source;

        this.trigger("source added", source);
    }
    getSource(name) {
        return sources[name];
    }
    getSources() {
        return sources;
    }
}

export default Input;
