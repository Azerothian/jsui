///<reference path='../typings/requirejs/require.d.ts' />
///<reference path='../typings/jquery/jquery.d.ts' />
///<reference path='../typings/bluebird.d.ts' />

import jQuery = require("jquery");
import Promise = require("bluebird")
import Promises = require("./lib/promises");
import Control = require("./control");
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




export function jsonToObject(str) {
    return JSON.parse(str);
}


