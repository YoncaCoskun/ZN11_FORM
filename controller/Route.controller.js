sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("zn11_form.controller.Route", {
		onInit: function() {
			
		},

		onAfterRendering: function() {},
		// onLogin: function() {
		// 	var that = this;
		// 	that.showBusyIndicator(2000);

		// },
		hideBusyIndicator: function() {
			sap.ui.core.BusyIndicator.hide();
		},
		//showBusyIndicator: function(iDuration, iDelay) {
		// sap.ui.core.BusyIndicator.show(iDelay);

		//begin of kullanıcı adı ve şifrenin kontrolü
		onLogin: function() {
			var that = this;
			
			var kartNo = that.getView().byId("kardNo").getValue();
			var password = that.getView().byId("sifre").getValue();
			var username;
			

			if (kartNo === "" || password === "") {
				sap.m.MessageToast.show("User or Password Empty!");
				return;
			}
			
			var oHeaders;
			var oToken;
			
			//kullanıcı ismi ile kullanıcı id si alınması begin of ycoskun
			jQuery.ajax({
                type : "GET",
                contentType : "application/json",
                url : "/RESTAdapter/b2b/personelQuery/*&"+kartNo,
                dataType : "json",
                async: false, 
                success : function(data,textStatus, jqXHR) {
                	username = data.T_PERSONEL.item.PERSONEL_NO;
                	sap.ui.getCore().GOREV_KODU = data.T_PERSONEL.item.GOREV_KODU;
                }

            })
            //kullanıcı ismi ile kullanıcı id si alınması end of ycoskun
            
			//var uname = btoa(username);
			//var pword = btoa(password);
			
			//document.cookie = username+"="+password+";"+"secure";
			//// console.log(document.cookie);
			var unamePas = btoa(username+":"+password);
			//var pword = btoa(password);
			  window.localStorage.setItem("unamePas", unamePas);


			jQuery.ajax({
				  url: "/bpmodata/tasks.svc/TaskCollection?$filter=Status eq 'READY'",
				  headers: {"x-csrf-token": "Fetch",
					  "Authorization":"Basic "+unamePas},
				  async: false,
				  method: 'GET'
				}).then(function(data,status,xhr) {
					  oToken = xhr.getResponseHeader('x-csrf-token');
					  oHeaders = {
								"x-csrf-token": oToken
							};
					});
			
			if(oToken){
				sap.ui.getCore().busyDialog1.open();
				that.getOwnerComponent().getRouter().navTo("Home");
				
			}else{
				sap.m.MessageToast.show("User or Password Error");
			}

			//end of

			// if (iDuration && iDuration > 0) {
			// 	if (this._sTimeoutId) {
			// 		jQuery.sap.clearDelayedCall(this._sTimeoutId);
			// 		this._sTimeoutId = null;
			// 	}

			// 		this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function() {
			// 			this.hideBusyIndicator();
			// 			this.getOwnerComponent().getRouter().navTo("Home");
			// 		});

			// }
		}

	});

});