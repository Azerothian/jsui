
function GenerateGuid(a, b) { for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : ''); return b };
//Control
define(['underscore', 'backbone', './models/Basic', 'jquery', 'Backbone.ModelBinder/Backbone.ModelBinder', 'jquery-ui'],
    function (_, Backbone, BasicModel, $) {

    
    return _.extend(Backbone.View.extend({
        __donotappend: false,
        data: {},
        parent: {},
        children: {},
        isRendered: false,
        model: {},
        modelBinder: {},
        
        initialize: function () {
            console.log("[jsui] Control Init");
            this.modelBinder = new Backbone.ModelBinder();
            var id = GenerateGuid();
            this.model = new BasicModel;
            
            this.listenTo(this.model, 'change', this.OnChange);
            this.model.set("Id", id);
            jsui.models.add(this.model);

            this.children = [];
            this.setModel("Id", GenerateGuid());

            _.bindAll(this, 'addChild', 'removeChild', 'removeAll', 'render', 'dispose', 'getModel', 'setModel', 'CreateBinding', 'getChildByName'); // fixes loss of context for 'this' within methods

            if (this.OnInitialise) {
                this.OnInitialise();
            }
        },
        addChild: function (name, child, donotrender) {
            if (child.getModel("Id") == this.getModel("Id")) {
                throw "Cannot add same control to itself";
            }
            child.setModel("ParentId", this.getModel("Id"));
            child.parent = this;
            child.setModel("Name", name);

            if (this.isRendered && !donotrender) {
                child.render();
            }
            this.children[child.getModel("Id")] = child;
        },
        getChildByName: function (name) {
            for (var v in this.children) {
                if (this.children[v].getModel("Name") == name) {
                    return this.children[v];
                }
            }
            return null;

        }
        , removeChild: function (id) {
            if (this.children[id]) {
                this.children[id].dispose();
                delete this.children[id];
            }
        }, removeAll: function () {
            for (var key in this.children) {
                this.removeChild(key);
            }
        }
        , render: function () {
            if (this.OnRender) {
                this.OnRender();
            }

            if (this.parent && !this.__donotappend) {
                $(this.parent.el).append(this.el);
            }
            //Child Render Loop
            for (var key in this.children) {
                this.children[key].render();
            }
            this.isRendered = true;
            if (this.OnAfterRender) {
                this.OnAfterRender();
            }

        }
        , dispose: function () {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].dispose();
            }
            jsui.models.remove(this.model);
            if (this.OnDispose) {
                this.OnDispose();
            }
            this.remove();
        },
        OnChange: function (data) {
            var attribs = data.changedAttributes();
            for (var v in attribs) {
                $(this.el).attr(v, attribs[v]);
            }
        },
        getModel: function (name) {
            return this.model.get(name);
        },
        setModel: function (name, value) {
            this.model.set(name, value);
        },
                    
        Configure: function (config) {

            this.config = config;


            if (this.OnConfigure) {
                this.OnConfigure(config);
            }
        },
        CreateBinding: function (name, func, context) {
            this.on(name, func, context);
        }

    }), Backbone.Events); 
});