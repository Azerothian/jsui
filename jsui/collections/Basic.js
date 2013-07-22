define(['backbone', '../models/Basic'], function (Backbone, BasicModel) {
    return Backbone.Collection.extend({
        model: BasicModel
    });


});