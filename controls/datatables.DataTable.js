define(['underscore', 'backbone', '../Control', 'jquery', 'datatables'
    , 'css!datatables/../../css/jquery.dataTables_themeroller'
],
    function (_, Backbone, Control, $) {
        return Control.extend({
            tagName: "table",
            dataTable: {},
            //getCollection: function() {},
            columns: {},


            events: {

            },

            OnInitialise: function () {
                this.columns = new Backbone.Model;
                _.bindAll(this, 'OnDataAdd', 'OnDataRemove', 'OnDataChange', 'StartListen'); // fixes loss of context for 'this' within methods

            },
            StartListen: function() {

                this.listenTo(this.collection, "change", this.OnDataChange);
                this.listenTo(this.collection, "add", this.OnDataAdd);
                this.listenTo(this.collection, "remove", this.OnDataRemove);
            },
            OnRender: function () {
                if (!this.IsRendered) {

                }

            },
            OnAfterRender: function () {

                
                var col = this.columns.toJSON();
                var columnData = new Array;
                for (var v in col) {
                    columnData.push(col[v]);
                }
                console.log('[jsui/DataTable/OnAfterRender]', { collection: this.collection.toJSON() });
                this.dataTable = $(this.el).dataTable({
                    "bJQueryUI": true,
                    "sPaginationType": "full_numbers",
                    "aoColumns": columnData,
                    "aaData": this.collection.toJSON()
                });
            },
            OnDataChange: function(model) {

                console.log('[jsui/DataTable/OnDataChange]', { model: model, dataTable: this.dataTable });
            },
            OnDataAdd: function (model) {

                console.log('[jsui/DataTable/OnDataAdd]', { model: model, dataTable: this.dataTable });
                var aiData = this.dataTable.fnAddData(model.toJSON());
                                
                //var oSettings = oTable.fnSettings();
                //$("td", oSettings.aoData[aiData[0]].nTr).editable(



                //    );


            },
            OnDataRemove: function (model) {
                console.log('[jsui/DataTable/OnDataRemove]', { model: model, dataTable: this.dataTable });

                var data = this.dataTable.fnGetData();

                for (var i = 0; i < data.length; i++) {
                    if (data[i].Id == model.get('Id')) {
                        this.dataTable.fnDeleteRow(i);
                        return;
                    }
                }

                debugger;
            },
            OnDispose: function () {

            }

        });
    });

