define(function (require) {
    'use strict';

    function MobileController(externalSource) {
        this.id = externalSource.id;
    };

    MobileController.prototype.configure = function (input, id) {
        
        // stores the 
        this.internalSourceId = id;

        this.emit = function (data) {

            // remaps the message id as the 
            // source id
            var message = {
                id: this.internalSourceId,
                data: data
            }

            // triggers that an input has arrived
            input.trigger("input", message);

        };

    };

    return MobileController;
});