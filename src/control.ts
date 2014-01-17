
import jQuery = require("jquery");
import Promise = require("bluebird")
import Promises = require("./lib/promises");
import Model = require("./model");

class Control {
	model: Model = new Model();
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

function GenerateGuid() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}

export = Control;