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
                console.log("SET CONFIG", { config: config });
                if (config.collection) {
                    
                    this.SetDataCollection(config.collection);
                    
                }
                console.log("BOUND", { config: config });
            },
            SetDataCollection: function (col) {
                this.collection = col;
                
                this.listenTo(this.collection, 'add', this.OnDataAdd);
                this.listenTo(this.collection, 'remove', this.OnDataRemove);
                this.listenTo(this.collection, 'change', this.OnDataChange);
            },
            OnRender: function () {

                $(this.el).append(this.root);
                this.jstree = $(this.root).jstree();
                console.log("JSTREE", this.jstree);
            },
            OnAfterRender: function () {


            },
            OnDataChange: function (model) {
                //var id = model.get(this.config.PrimaryKey);
                //if (this.nodes[id]) {
                //    if (this.config.TextField) {
                //        $(this.nodes[id].Text).text(model.get(this.config.TextField));
                //        //$(newnode.Text).text(model.get(this.config.TextField));
                //    }
                //}
            },
            OnDataAdd: function (model) {

                $(this.root).jstree("create",
                    model.get('Id'),
                    function () { //success

                    },
                    true
                );
                //  var model.Parent
                //var id = model.get(this.config.PrimaryKey);
                //var parentid = model.get(this.config.ParentKey);
                //if (this.nodes[id]) {

                //    this.OnDataChange(model);
                //    return;
                //} else {
                //    var newnode = $('<li class="ui-menu-item"><a href="javascript:;"><span style="float: left" class="ui-icon"></span><span class="text"></span></a> <ul style="display:none"></ul> </li>');
                //    newnode.Text = $(newnode).find('span.text');
                //    newnode.Icon = $(newnode).find('span.ui-icon');
                //    newnode.Children = $(newnode).find('ul');
                //    newnode.expanded = false;
                //    console.log("[jsui/Tree/OnDataAdd]", { NewNode: newnode, Text: newnode.Text, Children: newnode.Children });
                //    if (this.config.TextField) {

                //        // $(newnode.Text)[0].lastChild.data = model.get(this.config.TextField);
                //        $(newnode.Text).text( model.get(this.config.TextField));
                //        $(newnode.Icon).click(_.bind(function () {
                //            if (!this.node.expanded) {
                //                this.tree.collection.GetChildren({
                //                    data: {
                //                        ParentItem: this.node.NodeID,
                //                        Application: app.Data.System.GetCurrentApplicationId()
                //                    }, success: _.bind(function () {
                //                        $(this.node.Children).show();
                //                        if (this.tree.config.theme) {
                //                            if (this.tree.config.theme.close) {
                //                                $(this.node.Icon).removeClass(this.tree.config.theme.open);
                //                            }
                //                            if (this.tree.config.theme.open) {
                //                                $(this.node.Icon).addClass(this.tree.config.theme.open);
                //                            }
                //                        }

                //                    }, { node: this.node, tree: this.tree })
                //                });
                //                this.node.expanded = true;
                //            } else {
                //                $(this.node.Children).hide();
                //                if (this.tree.config.theme) {
                //                    if (this.tree.config.theme.close) {
                //                        $(this.node.Icon).addClass(this.tree.config.theme.open);
                //                    }
                //                    if (this.tree.config.theme.open) {
                //                        $(this.node.Icon).removeClass(this.tree.config.theme.open);
                //                    }
                //                }
                //                this.node.expanded = false;
                //            }
                //        }, { node: newnode, tree: this }));
                //        if (this.config.Editable) {

                //            $(newnode.Text).editable( _.bind(function (value, settings) {
                //                //var cid = $(this).parent().attr('data-modelcid');
                //                this.node.model.set(this.tree.config.TextField, value);
                //                this.node.model.save();
                //                return (value);
                //            },{tree: this, node: newnode}), {
                //                type: 'text',
                //                cancel: 'X',
                //                submit: 'Save'
                //            });
                //        }

                //    }

                //    // $(newnode).append('<div style="clear: both">&nbsp;</div>');
                //    newnode.NodeID = id;
                //    newnode.ParentNodeID = parentid;
                //    newnode.model = model;
                //    this.nodes[id] = newnode;
                //    if (this.nodes[parentid]) {
                //        $(this.nodes[parentid].Children).show();
                //        console.log("[jsui/Tree/OnDataAdd/AppendToParent]", { Parent: this.nodes[parentid], Children: this.nodes[parentid].Children, Node: this.nodes[id] });
                //        $(this.nodes[parentid].Children).append(this.nodes[id]);
                //    } else {
                //        console.log("[jsui/Tree/OnDataAdd/AppendToRoot]", { root: this.root, Node: this.nodes[id] });
                //        $(this.root).append(this.nodes[id]);
                //    }



                //}


            },
            OnDataRemove: function (model) {
                //var id = model.get(this.config.PrimaryKey);
                //if (this.nodes[id]) {
                //    $(this.nodes[id]).remove();
                //    delete this.nodes[id];
                //}
            },
            OnDispose: function () {

            }

        });
    });

