define(['underscore', 'backbone', '../Control', 'jquery', 'jquery.jstree', 'css!jquery.jstree/../themes/apple/style'],
    function (_, Backbone, Control, $) {
        return Control.extend({
            collection: {},
            root: {},
            nodes: [],
            events: {

            },

            OnInitialise: function () {
                this.nodes = [];
                //  this.SetDataCollection(new Backbone.Collection);
                // this.$el.addClass('ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons');
                this.root = $('<ul></ul>');
                // _.bindAll(this, ''); // fixes loss of context for 'this' within methods

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

                $(this.el).append(this.root);
                this.jstree = $(this.root).bind("before.jstree", _.bind(function (e, data) {

                    //var selected = data.inst.get_selected();
                    // console.log("Action", { func: data.func, Id: $(data.args[0]).attr("Id"), data: data, selected: selected });


                    switch (data.func) {
                        case "open_node":
                            if (this.config.Events) {
                                if (this.config.Events.Expand) {
                                    this.config.Events.Expand($(data.args[0]).attr("Id"), this.collection);
                                }
                            }
                            break;
                    }
                }, this))
                    .jstree({
                        "plugins": [
                           // "themes",
                           "themeroller",
                           "dnd",
                           "ui",
                           "crrm",
                           "contextmenu"]
                    }).bind("loaded.jstree", function (event, data) {
                        // console.log("LOADED JSTREE");
                        // you get two params - event & data - check the core docs for a detailed description
                    }).bind("select_node.jstree", _.bind(function (event, data) {
                        // `data.rslt.obj` is the jquery extended node that was clicked
                        console.log("selected node", data.rslt.obj.attr("id"));

                        if (this.config.Events) {
                            if (this.config.Events.Select) {
                                this.config.Events.Select(this.collection.get(data.rslt.obj.attr("id")));

                            }
                        }

                    }, this)).bind("create.jstree", _.bind(function (e, data) {
                        if ($(data.rslt.obj).attr('Id') === undefined) {
                            var model = new this.collection.model;
                            model.set(this.config.TextField, data.rslt.name);
                            model.set(this.config.ParentKey, $(data.rslt.parent).attr('Id'));

                            $(this.root).find(data.rslt.obj).remove();
                            if (this.config.Events) {
                                if (this.config.Events.BeforeCreate) {
                                    this.config.Events.BeforeCreate({ model: model, name: data.rslt.name, element: data.rslt.obj, parent: data.rslt.parent });
                                }
                            }

                            model.save({}, {
                                success: _.bind(function (response) {
                                    console.log('[/jsui/tree.jstree/create] - Saving is a success', response);
                                    this.trigger('CreateItem', { model: model });

                                    if (this.config.Events) {
                                        if (this.config.Events.Expand) {
                                            this.config.Events.Expand($(data.rslt.parent).attr('Id'), this.collection);
                                        }

                                    }
                                }, this)
                            });

                            //this.collection.add(model);


                        }
                    }, this)).bind("remove.jstree", _.bind(function (e, data) {
                        console.log("remove node", { e: e, data: data });
                        var id = $(data.rslt.obj).attr('Id');
                        if (id) {
                            var model = this.collection.get(id);
                            this.collection.remove(id);
                            this.collection.commit({ success: function () { } });
                        }


                    }, this)).bind("rename.jstree", _.bind(function (e, data) {
                        console.log("rename node", e, data);
                        var id = $(data.args[0]).attr('Id');
                        console.log("rename node", { e: e, data: data, id: id });
                        if (id) {
                            var model = this.collection.get(id);
                            model.set(this.config.TextField, data.rslt.new_name);
                            model.save({}, {
                                success: function () {
                                    //TODO ... do something
                                }
                            });
                        }


                    }, this)).bind("move_node.jstree", _.bind(function (e, data) {
                        console.log("move node", { e: e, data: data });
                        var child = data.rslt.o;
                        var parent = data.rslt.np;
                        var childId = $(child).attr('Id');
                        var parentId = $(parent).attr('Id');
                        var model = this.collection.get(childId);
                        model.set(this.config.ParentKey, parentId);

                        console.log("move node", { e: e, data: data, child: child, parent: parent, model: model, childId: childId, parentId: parentId });
                        model.save({}, {
                            success: function () {
                                //TODO ... do something
                            }
                        });
                    }, this));

            },
            OnAfterRender: function () {


            },
            OnDataChange: function (model) {
              //  console.log("DATACHANGE");
                //var id = model.get(this.config.PrimaryKey);
                //if (this.nodes[id]) {
                //    if (this.config.TextField) {
                //        $(this.nodes[id].Text).text(model.get(this.config.TextField));
                //        //$(newnode.Text).text(model.get(this.config.TextField));
                //    }
                //}
            },
            OnDataAdd: function (model) {
                $(this.root).jstree("create", "#" + model.get(this.config.ParentKey), false, { attr: { Id: model.get(this.config.PrimaryKey) }, state: "closed", data: { title: model.get(this.config.TextField) } }, function () { }, true);
                $(this.root).find(".jstree-loading").parent().remove();
            },
            OnDataRemove: function (model) {
                $(this.root).jstree("remove", "#" + model.get(this.config.PrimaryKey));

            },
            OnDispose: function () {

            }

        });
    });

