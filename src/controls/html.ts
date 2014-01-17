
import jQuery = require("jquery");
import Promise = require("bluebird")

import Promises = require("../lib/promises");
import Control = require("../control");


class Html extends Control
{
	tagName: string = "div";
	Id: string;
	Name: string;
    constructor(tagname?:string) {
    	super(); //always call this when overriding the constructor, while extending a object;
		this.el = $("<"+ this.tagName+"></"+this.tagName+">")[0];
    	this.tagName = tagname;
		this.attr("id", this.model.get("Id"));
		this.model.on("Id", (value) => {
        	this.attr("id", value);
        	this.Id = value;
      	});
      	this.model.on("Class", (value) => {
      		this.attr("class", value); 
      	});
      	this.model.on("Name", (value) => {
        	this.attr("name", value);
        	this.Name = value;
        });
		this.model.on("Style", this.setStyles);
		this.model.on("Attributes", this.setAttributes);
		this.model.on("TagName", this.setTag);
			this.model.on("Text", (value) => {
        	if(this.el)
        	{
          		$(this.el).text(value);
        	}
        });
		this.model.on("Html", (value) => {
        	if(this.el)
        	{
          		$(this.el).html(value);
      		}
      	});
	}      

    
    setStyles = (styles: any[]) => {
		if(styles)
		{
			for(var s in styles) {
				this.css(s, styles[s]);
			}
		}
	}

    setAttributes = (attribs: any[]) => {
    	if(attribs)
    	{
    		for(var a in attribs)
    		{
          		this.attr(a, attribs[a]);
      		}
		}
  	}
    setTag = (tagname) => {
    	this.tagName = tagname;
		this.el = $("<"+ this.tagName+"></"+this.tagName+">")[0];
		this.RefreshProperties();
	}
    
    RefreshProperties = () => {
    	var html = this.model.get('Html')
		if(html)
		{
			$(this.el).html(html);
    	}
		var text = this.model.get('Text')
		if(text)
		{
        	$(this.el).text(text);
		}

		var name = this.model.get('Name')
      	if(name)
      	{
      		this.attr("name", name);
      	}
      	var id = this.model.get('Id');
      	if(id)
      	{
        	this.attr('id', id);
    	}
    	var cc = this.model.get('Class');
    	if(cc)
        {
     		this.attr('class', cc);
    	}
	}
    OnRender = () => {
    	return new Promise((resolve, reject) => {
      		if(this.parent)
        	{
        		$(this.parent.el).append(this.el);
        		this.RefreshProperties();
        		return resolve();
			}
        	return reject({ message: "This control does not have a parent assigned. Unable to Render..", control: this});
        });
	}

    css = (key: any, value?:any) => {
    	if(!value) {
        	$(this.el).css(key);
    	} else {
        	$(this.el).css(key, value);
    	}
    }
    attr = (key: any, value?:any) =>{
    	if(!value) {
        	$(this.el).attr(key);
    	} else {
        	$(this.el).attr(key, value);
    	}
	}
}
export = Html;