class MobileController {
    constructor(externalSource) {
        this.id = externalSource.id;
    }

    configure(input, id) {
        // stores the
        this.internalSourceId = id;

        this.emit = function (data) {
            // remaps the message id as the
            // source id
            var message = {
                id: this.internalSourceId,
                data: data,
            };

            // triggers that an input has arrived
            input.trigger("input", message);
        };
    }
}

export default MobileController
