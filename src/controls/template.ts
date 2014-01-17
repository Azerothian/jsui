import Html = require("./html");
import Control = require("../control");
import requirejs = require("requirejs");
class Template extends Html
{
	constructor = () {
		super() //always call this when overriding the constructor, while extending a object;
	}
	OnInit = () => {
		return new Promise((resolve, reject) => {
			if(this.elements)
			{
				return loadControlsFromObject(this.elements, this, this).then(() => {
						return resolve();
				});
			}
			else {
				return resolve();
			}
		});
	}
}


export = Template;


isArray =  Array.isArray || ( value ) => { return {}.toString.call( value ) is '[object Array]'; }

loadControlsFromObject = (obj :any, parent?:Control, primary?:Control) => {
	return new Promise((resolve, reject) => {
		if(isArray(obj))
		{
			if(!primary || !parent)
			{
				return reject("loadControlsFromObject - Error: primary control not set when using array as base");
			}
			return Template.loadChildren(parent, obj, primary).then(() => {
						 return resolve(primary); // returns the main control for reference
			});
			controlType = obj.Control || "jsui/controls/html";
			return requirejs([controlType], (control) => {
				var args = obj.Parameters || [];
				var newControl = control.bind.apply(control, args);
				var c = new newControl();
				for(var prop in obj)
				{
						// if prop isnt "Children"
						c.model.set(prop, obj[prop]); 
				}
					if primary?
						#console.log 'PRIMARY IS SET', primary;
					else
						#console.log 'PRIMARY IS NOT SET'
						primary = c;
					Name = c.model.get("Name");
					if Name? #not sure but will see
						#console.log "SETTING RAWRS", primary,  c, Name
						primary[Name] = c;
					if parent?
						return parent.addChild(c).then () =>
							return Template.childCheck(obj, c, primary).then () =>
								return resolve(c);
							, reject
						, reject
					else
						return Template.childCheck(obj, c, primary).then () =>
							return resolve(c);
						, reject
			});
				 
					
					#console.log "Processing control constructor", { obj: obj, args: args };
					
					
					
});

		/*

		OnInit: () =>
			return new Promise (resolve, reject) =>
				if this.elements?
					return Template.loadControlsFromObject(this.elements, this., this.).then () =>
						return resolve();
				else
					return resolve();
		
							
					
		this.childCheck: (obj, control, primary) =>
			return new Promise (resolve, reject) =>
				if obj.Children?
					return Template.loadChildren(control, obj.Children, primary).then () =>
						return resolve();
					, reject
				else
					return resolve();

		this.loadChildren: (parent, children, primary) =>
			return new Promise (resolve, reject) =>
				promises = new Promises();        
				for child in children
					promises.push Template.loadControlsFromObject, this., [child, parent, primary]
				return promises.chain().then (results) =>
					return resolve();
					#promises_ac = new Promises();
					#for r in results
					#  promises_ac.push parent.addChild, parent, [r[0]];
					#return promises_ac.chain().then () => 
					#  return resolve();*/