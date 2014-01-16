///<reference path='../typings/requirejs/require.d.ts' />
///<reference path='../typings/jquery/jquery.d.ts' />
///<reference path='../typings/bluebird.d.ts' />
///<reference path='../typings/eventemitter.d.ts' />

import jQuery = require("jquery");
import Promise = require("bluebird")
import Promises = require("./lib/promises");
import EventEmitter = require("eventemitter")

export class app {
    root: Control;
    constructor() {
        //var @obj = null;    
    }

    //inline
    initialise = (target) => {
        return new Promise((resolve, reject) => {
            this.root = new Control();
            var el = $(target)[0];
            this.root.el = el;
            this.root.isRendered = true;
            $(target).attr('id', this.root.model.get("Id"));

        });
    }

    // static
    loadControlsFromString(text, parent) {
        //return new Promise((resolve, reject) => {
        //    var obj = Util.jsonToObject(text);
        //    return Template.loadControlsFromObject(obj, parent).then((control) => {
        //        return resolve(control);
        //    });
        //});
    }
}

export class Model extends EventEmitter {
    constructor() {
        super();
    }
    get = (name) => {
        if (this[name]) {
            return this[name];
        }
        return null;
    }
    set = (name, value) => {
        if (this[name] !== value) {
            this.emitEvent(name, [value]);
        }
        this[name] = value;
    }
}

export class Control {
    model = new Model()
    parent: Control;
    el: HTMLElement;
    children: Array<Control> = [];
    isRendered = false;

    constructor() {
        var newGuid = GenerateGuid();
        this.model.set("Id", newGuid);
    }



    addChild = (child) => {
        return new Promise((resolve, reject) => {
            if (child.model.get("Id") == this.model.get("Id")) {
                return reject("Cannot add same control to itself");
            }
            child.model.set("ParentId", this.model.get("Id"));
            child.parent = this;
            this.children[child.model.get("Id")] = child;

            if (this.isRendered) {
                return child.render().then(resolve, reject);
            }
            else {
                return resolve();
            }
        });
    }
    removeChild = (id) => {
      return new Promise((resolve, reject) => {
            if (!this.children[id]) {
                return reject("Child id not found in the children collection");
            }
            delete this.children[id];
            return resolve();
        })
    }
    render = () => {
        return new Promise((resolve, reject) => {
            var promises = new Promises();
            if (this["OnInit"]) {
                promises.push(this["OnInit"], this, ["OnInit"]);
            }
            if (this["OnRender"]) {
                promises.push(this["OnRender"], this, ["OnRender"]);
            }
            promises.push(this.renderChildren, this, ["renderChildren"])
            promises.push(this.renderFinished, this, ["renderFinished"]);

            return promises.chain().then(() => {
                return resolve();
            }, reject);
        }).catch(() => {
                console.log(arguments);
            });
    }
    renderChildren = () => {
        return new Promise((resolve, reject) => {
            var childrenLength = this.children.length;
            var promises = new Promises();
            for (var child in this.children) {
                promises.push(this.children[child].render, this.children[child]);
            }
            return promises.chain().then(resolve, reject);

        });

    }
    renderFinished = () => {
        return new Promise((resolve, reject) => {
            this.isRendered = true;
            return resolve();
        });
    }
    dispose = () => {
        return new Promise((resolve, reject) => {
            var promises = new Promises();
            for (var child in this.children) {
                promises.push(child.dispose, child);
            }
            if (this["OnDispose"]) {
                promises.push(this["OnDispose"], this); //this will get executed after all children dispose actions
            }
            return promises.chain().then(() => {
                this.isRendered = false;
                return resolve();
            }, reject);
        });
    }

}


export function GenerateGuid() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
export function jsonToObject(str) {
    return JSON.parse(str);
}


