define(['underscore', 'backbone', '../Control', 'jquery'],
    function (_, Backbone, Control, $) {
        return Control.extend({
            Controls: {},
            initialise: function () {
                Control.initialise.apply(this, arguments);
                _.bindAll(this, "OnCreateControl");
            },
            OnRender: function () {
                if (this.template) {
                    $(this.el).append($(this.template));
                    //console.log("[jsui/TemplateControl/OnRender]", this.template);
                    var found = $(this.el).find('jsui');
                    console.log("[jsui/TemplateControl/OnRender]", { Elements: found });
                    _.each(found, function (element) {
                        var controlPath = $(element).attr('require');
                        var config = $(element).attr('config');
                        var name = $(element).attr('name');
                        requirejs([controlPath], _.bind(function (control) {
                            var c = new control;
                            if (this.config) {
                                c.Configure(JSON.stringify(this.config));
                            }
                            c.setModel("Name", name);


                            c.__donotappend = true;
                            this.parent.addChild(name, c, true);
                            $(this.el).find(element).replaceWith(c.el);
                            c.render();
                            if (this.parent.OnCreateControl) {
                                this.parent.OnCreateControl(name, c);
                            }
                        }, { parent: this, template: this.template, element: element, config: config, name: name, el: this.el }));


                    }, this);

                }
                // $(this.el).append(this.template);
               

            },
            OnCreateControl: function (name, control) {

            }

        });
    });

