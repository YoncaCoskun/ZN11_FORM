sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"zn11_form/model/models"
], function(UIComponent, Device, models) {

	"use strict";
	var cSelectItemIndex;
	var cBaf;
	var cPaf;

	return UIComponent.extend("zn11_form.Component", {

		metadata: {

			manifest: "json"		

		},

		config: {

		},

	

		init: function() {
			sap.ui.getCore().busyDialog1 = new sap.m.BusyDialog('busy1',{customIcon: 'http://i2.wp.com/kareblog.net/wp-content/uploads/2015/03/n11-logo-e1414834673115.png'});
			

			// call the base component's init function

			UIComponent.prototype.init.apply(this, arguments);

			// set the device model

			this.setModel(models.createDeviceModel(), "device");
		
			this.getRouter().initialize();
    
	
		},
		getContentDensityClass : function() {
            if (this._sContentDensityClass === undefined) {
            
                            if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
                                            this._sContentDensityClass = "";
                            } else if (!Device.support.touch) { 
                                            this._sContentDensityClass = "sapUiSizeCompact";
                            } else {
                                            
                                            this._sContentDensityClass = "sapUiSizeCozy";
                            }
            }
            return this._sContentDensityClass;
}


	});

});