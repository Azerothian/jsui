var jsui = jsui || {};

define([
    './Control',
    './collections/Basic',
    'jquery',
    'backbone'
], function (Control,BasicCollection, $, Backbone) {
    function JSui() {
        jsui = this;
       
    };

    JSui.prototype = {
        start: function (target) {
            console.log("[jsui] Init root object", target);
            this.models = new BasicCollection;
            this.root = new Control;
            this.root.el = $(target)[0];
            this.root.isRendered = true;
            this.events = _.extend({}, Backbone.Events);
            $(target).attr('id', this.root.getModel("Id"));
        },

        root: {},
        events: {}

    };

    return JSui;
});
