define(['backbone'], function (Backbone) {
    return Backbone.Collection.extend({
        deleted: [],
        parse: function (resp, xhr) {
            this.header = resp.header;
            this.stats = resp.stats;
            return this.OnParse(resp);
        },
        commit: function (obj) {


            console.log("[jsui/StateCollection/commit]", { This: this, deleted: this.deleted });
            this.each(function (model) {
                model.save({}, {
                    success: _.bind(function () {
                        this.success(this.model);
                    }, { success: obj.success, model: model })
                });
            }, this);


            for (var v in this.deleted) {
                var model = this.deleted[v];
                model.destroy();
                delete this.deleted[v];
            }

        },
        initialize: function (models, options) {
            _.bindAll(this, 'OnDataRemove', 'OnDataAdd', 'commit'); // fixes loss of context for 'this' within methods
            this.listenTo(this, 'remove', this.OnDataRemove);
            this.listenTo(this, 'add', this.OnDataAdd);
            this.deleted = [];
        },
        OnDataRemove: function (model) {
            console.log("[jsui/StateCollection/OnDataRemove]", { model: model });

            this.deleted[model.cid] = model;
            //this.deleted.add(model);
        },
        OnDataAdd: function (model) {
            console.log("[jsui/StateCollection/OnDataAdd]", { deleted: this.deleted });

            if (this.deleted[model.cid]) {
                delete this.deleted[model.cid];
            }

        }

    });


});