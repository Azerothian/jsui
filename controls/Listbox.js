define(['underscore', 'backbone', '../Control', 'jquery'],
    function (_, Backbone, Control, $) {
        return Control.extend({
            collection: {},
            //root: {},
            //  nodes: [],
            events: {

            },

            OnInitialise: function () {
                // this.nodes = [];
                //  this.SetDataCollection(new Backbone.Collection);
                // this.$el.addClass('ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons');
                this.el = $('<select size="5"></select>');
                _.bindAll(this, 'SetDataCollection', 'OnSelectedChange'); // fixes loss of context for 'this' within methods

            },
            OnConfigure: function (config) {
                if (config.collection) {
                    this.SetDataCollection(config.collection);
                }
            },
            SetDataCollection: function (col) {
                this.collection = col;

                this.listenTo(this.collection, 'add', this.OnDataAdd);
                this.listenTo(this.collection, 'remove', this.OnDataRemove);
                this.listenTo(this.collection, 'change', this.OnDataChange);
            },
            OnRender: function () {


            },
            OnAfterRender: function () {

                $(this.el).on("change", this.OnSelectedChange);
            },
            OnDataChange: function (model) {
                $(this.el).find("#" + model.get(this.config.Key))
                    .attr('value', model.get(this.config.Value))
                    .html(model.get(this.config.Text));
            },
            OnDataAdd: function (model) {
                $(this.el).append($("<option></option>")
                                .attr('id', model.get(this.config.Key))
                                .attr('value', model.get(this.config.Value))
                                .html(model.get(this.config.Text)));
            },
            OnDataRemove: function (model) {

                $(this.el).find("#" + model.get(this.config.Key)).remove();
            },
            OnDispose: function () {

            },
            OnSelectedChange: function () {
                if (this.config.Events) {
                    if (this.config.Events.OnSelect) {
                        var id = $(this.el).find('option:selected').attr('id');
                        this.config.Events.OnSelect(this.collection.get(id));
                    }
                }
            }

        });
    });

