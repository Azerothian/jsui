define(['underscore', 'backbone', '../Control', 'jquery','jsoneditor/jsoneditor'],
    function (_, Backbone, Control, $, jsoneditor) {
        return Control.extend({
         
            events: {

            },
            OnConfigure: function (config) {

                if (this.config.DataSource && this.DataSource) {
                    this.stopListening(this.DataSource);
                }
                if (this.config.DataSource) {
                    this.DataSource = this.config.DataSource
                   // this.listenTo(this.DataSource, 'change', this.OnDataChange);
                    this.Refresh();
                }
                
            },
            Refresh: function() {
                if (this.config.Key) {
                    var json = {};
                    var key = this.DataSource.get(this.config.Key);

                    //  console.log("REFERESDA", json, key, this.DataSource);
                    try {

                        json = JSON.parse(key);
                    }
                    catch (e) { }

                    // var json = this.DataSource.get(this.config.Key);
                    this.editor.set(json);
                } else {
                    //THROW ERROR
                }
            },
            Update: function () {
                
                if (this.config.Key) {
                    var object = this.editor.get();
                    if (this.config.Stringify)
                        object = JSON.stringify(object)
                    this.DataSource.set(this.config.Key, object);
                   // this.DataSource.set(this.config.Key, this.editor.get());
                } else {
                    //THROW ERROR
                }
            },
            OnInitialise: function () {
                _.bindAll(this, 'Refresh', 'Update', 'OnDataChange'); // fixes loss of context for 'this' within methods

            },
            
            OnRender: function () {
                var options = {
                    mode: "tree",
                    error: function (err) {
                        console.log('[/jsui/jsoneditor] - Something went wrong...', { error: err });
                    },
                    change: _.bind(function () {
                        this.Update();
                    }, this)
                };
                if(this.config)
                {
                    if(this.config.options)
                    {
                        options = _.extend(this.config.options,  options)
                    }
                }

                this.editor = new jsoneditor.JSONEditor($(this.el)[0], options);
                
            },
            OnAfterRender: function () {

            },
            OnDispose: function () {

            },
            OnDataChange: function () {
                this.Refresh();
            }

        });
    });

