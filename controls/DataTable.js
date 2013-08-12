define(['underscore', 'backbone', '../Control', 'jquery', 'jquery.jeditable'],
    function (_, Backbone, Control, $) {
        return Control.extend({
            dataTable: {},
           // collection: {},
            editable: false,
            //getCollection: function() {},
            columns: [],
            rows: [],
            template: {
            },


            events: {

            },
            OnConfigure: function (config) {

                this.editable = config.editable;

                if (config.columns) {
                    for (var v in config.columns) {
                        this.columns.add(config.columns[v]);
                    }
                }
                if (config.collection) {
                    this.SetDataCollection(config.collection);
                }
                if (config.template) {

                    this.template = _.extend(this.template, config.template);
                }
                if (this.editable) {

                    this.CreateEditableButtons();
                }
            },
            OnInitialise: function () {
                this.columns = new Backbone.Collection;
                this.listenTo(this.columns, 'change', this.OnColumnsChange);
                _.bindAll(this, 'AddRow', 'CreateEditableButtons', 'OnDataAdd', 'OnDataRemove', 'OnDataChange', 'SetDataCollection', 'OnColumnsChange'); // fixes loss of context for 'this' within methods
                this.template = {
                    table: $('<table></table>'),
                    headerSection: $('<thead></thead>'),
                    footerSection: $('<tfoot></tfoot>'),
                    body: $('<tbody></tbody>'),
                    NewRow: function () {
                        return $('<tr></tr>');
                    },
                    NewColumn: function () {
                        return $('<td></td>');
                    },
                    NewHeaderRow: function () {
                        return $('<tr></tr>');
                    },
                    NewHeaderColumn: function () {
                        return $('<th></th>');
                    },
                    NewFooterRow: function () {
                        return $('<tr></tr>');
                    },
                    NewFooterColumn: function () {
                        return $('<td></td>');
                    }
                };
                //   debugger;
            },
            SetDataCollection: function (col) {
                this.collection = col;

                this.listenTo(this.collection, 'add', this.OnDataAdd);
                this.listenTo(this.collection, 'remove', this.OnDataRemove);
                this.listenTo(this.collection, 'change', this.OnDataChange);
            },
            CreateEditableButtons: function () {
                this.columns.add({
                    Header: {
                        Title: "Functions"
                    },
                    Body: {
                        OnRender: _.bind(function (obj) {
                            if (this.editable) {
                                if (this.editable.Buttons) {
                                    if (this.editable.Buttons.Delete) {
                                        var btnDelete = $("<button />");
                                        $(obj.el).append(btnDelete);
                                        obj.row.btnDelete = btnDelete;
                                        $(btnDelete).html("Delete");
                                        $(btnDelete).button();
                                        $(btnDelete).click(_.bind(function () {
                                            this.collection.remove(this.model);
                                            console.log("[jsui/DataTable/btnDelete]", { This: this });
                                        }, { model: obj.model, collection: this.collection }));;

                                    }
                                    if (this.editable.Buttons.Save) {
                                        var btnSave = $("<button />");
                                        $(obj.el).append(btnSave);
                                        obj.row.btnSave = btnSave;
                                        $(btnSave).html("Save");
                                        $(btnSave).button({ disabled: true });

                                        $(btnSave).click(_.bind(function () {
                                            this.model.save({}, {
                                                success: _.bind(function () {
                                                    $(this.button).button({ disabled: true });
                                                }, { button: btnSave, This: this })
                                            });
                                            console.log("[jsui/DataTable/btnSave]", { This: this });
                                        }, { model: obj.model, collection: this.collection }));;

                                    }

                                }
                            }


                        }, this)


                    },
                    Footer: {
                        OnRender: _.bind(function (el) {

                            if (this.editable.Buttons) {
                                if (this.editable.Buttons.Commit) {
                                    var btnCommit = $("<button/>");
                                    $(btnCommit).html("Commit");
                                    $(el).append(btnCommit);
                                    $(btnCommit).button();
                                    $(btnCommit).click(_.bind(function () {
                                        console.log("[jsui/DataTable/Commit", this.collection);
                                        this.collection.commit({
                                            success: _.bind(function (model) {
                                                if (this.editable) {
                                                    if (this.editable.Buttons) {
                                                        if (this.editable.Buttons.Save) {
                                                            var btnSave = this.rows[model.cid].btnSave;
                                                            $(btnSave).button({ disabled: true });
                                                        }
                                                    }
                                                }
                                            }, this)
                                        });
                                    }, this));
                                }

                            }
                        }, this)
                    }
                });
            },
            OnRender: function () {
                $(this.el).addClass('ui-widget-content');
                this.template.headerRow = this.template.NewHeaderRow();
                this.template.footerRow = this.template.NewFooterRow();
                $(this.template.headerSection).append(this.template.headerRow);
                $(this.template.footerSection).append(this.template.footerRow);
                $(this.template.table).append(this.template.headerSection);
                $(this.template.table).append(this.template.body);
                $(this.template.table).append(this.template.footerSection);
                $(this.el).append(this.template.table);
                console.log('[jsui/DataTable/OnRender]', this.columns);
                this.OnColumnsChange();
                this.Refresh();

            },
            OnColumnsChange: function () {
                //if (this.isRendered) {
                $(this.template.header).html('');
                this.columns.each(_.bind(function (col) {
                    console.log("[jsui/DataTable/OnColumnsChange/ColumnsEach]", { Template: this.template });
                    var headerColumn = this.template.NewHeaderColumn();
                    var header = col.get('Header');
                    if (header) {
                        if (header.Title) {
                            $(headerColumn).html(header.Title);
                        }
                        if (header.OnRender) {
                            header.OnRender(headerColumn);
                        }
                    }

                    $(this.template.headerRow).append(headerColumn);
                    var footerColumn = this.template.NewFooterColumn();
                    var footer = col.get('Footer');
                    if (footer) {
                        if (footer.OnRender) {
                            footer.OnRender(footerColumn);
                        }
                    }

                    $(this.template.footerRow).append(footerColumn);

                }, this));
                console.log("[jsui/DataTable/OnColumnsChange]", { Header: this.header, El: this.el });
                //  }
            },

            OnAfterRender: function () {

            },
            OnDataChange: function (model) {
                var row = this.rows[model.cid];
                if (row) {
                    var children = $(row).children();
                    for (var i = 0; i < children.length; i++) {
                        var item = children[i];
                        var name = $(item).attr('name');
                        var value = model.get(name);
                        if (value) {
                            $(item).html(value);
                        }


                    }

                }
                if (this.OnDataBind) {

                    this.OnDataBind(model);
                }

            },
            Refresh: function () {
                $(this.body).html('');
                if (this.collection) {
                    this.collection.each(function (model) {
                        this.AddRow(model);
                    }, this);
                }
            },
            AddRow: function (model) {
                if (this.rows[model.cid]) {
                    this.OnDataChange(model);
                } else {

                    console.log('[jsui/DataTable/AddRow/collection/Each]', { model: model, body: this.body });

                    var row = this.template.NewRow();
                    $(row).attr("data-cid", model.cid);
                    $(this.template.body).append(row);
                    this.rows[model.cid] = row;
                    var cols = this.columns.toJSON(); //is cheap.. not sure if its prohibitively expensive
                    console.log('[jsui/DataTable/AddRow]', { cols: cols });


                    for (var v in cols) {
                        var column = this.template.NewColumn();
                        $(row).append(column);
                        if (cols[v].Body) {
                            if (cols[v].Body.OnRender) {
                                cols[v].Body.OnRender({ el: column, model: model, row: row });
                                return;
                            }
                        }
                        var data = model.get(cols[v].Data);

                        $(column).attr('Name', cols[v].Data);
                        $(column).html(data);


                        if (this.editable && cols[v].Editable) {
                            $(column).editable(function (value, settings) {
                                //var cid = $(this).parent().attr('data-modelcid');
                                var name = $(this).attr('name');
                                settings.model.set(name, value);

                                console.log('[jsui/DataTable/AddRow/editable]', { This: this, value: value, settings: settings });
                                if (settings.model.hasChanged(name) && settings.row.btnSave) {
                                    $(settings.row.btnSave).button({ disabled: false });
                                }
                                return (value);
                            }, _.extend({
                                model: model,
                                row: row,
                                type: 'text',
                                cancel: 'X',
                                submit: 'Save'
                            }, cols.Editable)

                            );

                        }
                    }

                }
            },
            OnDataAdd: function (model) {

                console.log('[jsui/DataTable/OnDataAdd]', { model: model });
                this.AddRow(model);
            },
            OnDataRemove: function (model) {
                var row = this.rows[model.cid];
                if (row) {
                    $(row).remove();
                }
                console.log('[jsui/DataTable/OnDataRemove]', { model: model });
            },
            OnDispose: function () {

            }

        });
    });

