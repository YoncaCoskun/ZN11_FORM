jQuery.sap.require("zn11_form.util.Formatter");
sap.ui.define([
	'sap/m/MessagePopover',
	'sap/m/MessagePopoverItem',
	'sap/m/Link',
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/Popover',
	'sap/m/Button',
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageToast',
	'sap/ui/model/Filter',
	'sap/m/MessageBox',
	"zn11_form/util/Formatter"
], function(MessagePopover, MessagePopoverItem, Link, jQuery, Fragment, Controller, JSONModel, Popover, Button,
	ResourceModel, MessageToast, Filter,MessageBox,Formatter) {
	"use strict";
    //test
	var usersTo = [];
	var budgetId = "";
	var multiUserTo = [];
	var usersInf = [];
	var multiUserInf = [];
	var attachFiles = [];
	var count = 0;
	var idNum = 0;
	var columnListItemNewLine;
	var inputArrayId = [];
	var buttonArrayId = [];
	var tableList = [];
	var oInstallments = [];
	var sDate;
	var sTime;
	var TaskInstanceID;
	var supplierModel = new sap.ui.model.json.JSONModel();
	var searchModel = new sap.ui.model.json.JSONModel();
	var sendUserModel =  new sap.ui.model.json.JSONModel();
	var oSelectedIndex;
	var oSelectedRadioText;

	var twoEntry = [];
	var oModel = new sap.ui.model.json.JSONModel();
	var sKur;
	var selectItem;
	var imgData = "";
	var zdata = [];
	

	var unamePas;
	var arrayUserPas;
	var username;
	var password;
	var vUIAction;
	var vbaf = sap.ui.getCore().cBaf;


	var CController = Controller.extend("zn11_form.controller.SendItemBaf", {
		Formatter: Formatter,
		serviceUrl : "/bpmodata/taskdata.svc/",
		bpmPrefixParameter : "?prefixReservedNames=true",
		
		oDataSettings : {
			json : true,
			useBatch : false,
			disableHeadRequestForToken : true
		},
		
		model: new sap.ui.model.json.JSONModel(),
		onAfterRendering: function() {
			unamePas = atob(window.localStorage["unamePas"]);
			arrayUserPas = unamePas.split(":");
			username = arrayUserPas[0];
			password = arrayUserPas[1];
			
		
			
			
			var that = this;
			var oUserData = "";
			var usernameService =  "/RESTAdapter/b2b/SearchHelp";
			var HttpRequest = "";
			HttpRequest = new XMLHttpRequest();
			HttpRequest.onreadystatechange = function() {
			if (HttpRequest.readyState == 4 && HttpRequest.status == 200) {
			oUserData = JSON.parse(xmlHttp.responseText);
			}

			};
			HttpRequest.open( "GET", usernameService, false );
			var usernameFinal = oUserData.id;			
			// console.log(usernameFinal);

			//get token begin of 
			var oHeaders;
			var oToken;
			
			
    		var aData = jQuery.ajax({
                type : "GET",
                contentType : "application/json",
                url : "/RESTAdapter/b2b/findObject/0417/BAF/"+vbaf,
                dataType : "json",
                async: false, 
                success : function(data,textStatus, jqXHR) {
                	
                }

            });
    	
    		try{
    			var aDataFlow = jQuery.ajax({
    	            type : "GET",
    	            contentType : "application/json",
    	            url : "/RESTAdapter/b2b/processLog/*/*/"+vbaf,
    	            dataType : "json",
    	            headers: {"x-csrf-token": "Fetch",
    					  "Authorization":"Basic "+btoa(username+":"+password)},
    	            async: false, 
    	            success : function(data,textStatus, jqXHR) {
    	            }

    	        });
    			var oJsonFlowModel = new sap.ui.model.json.JSONModel();
    			oJsonFlowModel.setData(aDataFlow.responseJSON.T_LOG.item);
    			that.getView().setModel(oJsonFlowModel, "oFlowModel");
    			this.getView().byId("SendItemBudgetFlowTbl").setModel(this.getView().getModel("oFlowModel"));

        that.getView().byId("SendItemrequestOwner").setValue(oJsonFlowModel.oData[0].FNAME+" "+oJsonFlowModel.oData[0].LNAME);
        that.getView().byId("SendItemdepartment").setValue(aData.responseJSON.T_BAF.item.DEPPR);
        that.getView().byId("SendItemtitle").setValue(aData.responseJSON.T_BAF.item.TITLE);
        that.getView().byId("SendItemrequestNum").setValue(vbaf);
        that.getView().byId("SendItemrequestDate").setValue(aData.responseJSON.T_BAF.item.RQDAT);
        that.getView().byId("SendItemrequestTime").setValue(aData.responseJSON.T_BAF.item.RQTIM);
   
        
        
        that.getView().byId("SendItemperiodEnd").setValue(aData.responseJSON.T_BAF.item.BPEND);
        that.getView().byId("SendItemperiodStart").setValue(aData.responseJSON.T_BAF.item.BPSTA);
        that.getView().byId("SendItemsupplier").setValue(aData.responseJSON.T_BAF.item.SUPPL);
        that.getView().byId("SendItemsubject").setValue(aData.responseJSON.T_BAF.item.SUBJC);     
        that.getView().byId("SendItemidBudget").setValue(aData.responseJSON.T_BAF.item.BDALL);
	
        that.getView().byId("SendItemidDepartment").setValue(aData.responseJSON.T_BAF.item.DEPBG);
        that.getView().byId("SendItemidType").setValue(aData.responseJSON.T_BAF.item.TYPEE);
        that.getView().byId("SendItemidDesc").setValue(aData.responseJSON.T_BAF.item.DESCR);
        that.getView().byId("SendItemidSubDesc").setValue(aData.responseJSON.T_BAF.item.SUBDE);
        that.getView().byId("SendItemremBudget").setValue(aData.responseJSON.T_BAF.item.REBAM);
        that.getView().byId("SendItempurpose").setValue(aData.responseJSON.T_BAF.item.PURPO);
        that.getView().byId("SendItemexplanation").setValue(aData.responseJSON.T_BAF.item.EXPLN);
        that.getView().byId("SendItembrExp").setValue(aData.responseJSON.T_BAF.item.BREXP);
        
        //that.getView().byId("ManCurrencyType").setValue(Amount.CurrencyType);
        that.getView().byId("SendItemcurrency").setValue(aData.responseJSON.T_BAF.item.ATWAT);
        
        if(aData.responseJSON.T_BAF.item.APPRO === "Related Party"){
        	that.getView().byId("SendItemrelatedParty").setVisible(true);
        	that.getView().byId("SendItemrelatedParty").setVisible(true);
        	that.getView().byId("SendItemrelatedParty").setEnabled(false);
        	that.getView().byId("SendItemrelatedParty").setValue(aData.responseJSON.T_BAF.item.APPRO);
        }
        else{
        	that.getView().byId("SendItemrelatedParty").setVisible(false);
        	that.getView().byId("SendItemrelatedParty").setVisible(false);
        	that.getView().byId("SendItemrelatedParty").setEnabled(true);
        }
      
        if(aData.responseJSON.T_BAF.item.APPRO === "Donation"){
        	that.getView().byId("SendItemRB3-2").setSelected(true);
        }
        else if(aData.responseJSON.T_BAF.item.APPRO === "Related Party"){
        	that.getView().byId("SendItemRB3-1").setSelected(true);
        }
        else if(aData.responseJSON.T_BAF.item.APPRO === "Domestic Education"){
        	that.getView().byId("SendItemRB3-3").setSelected(true);
        }
        else if(aData.responseJSON.T_BAF.item.APPRO === "Abroad Education"){
        	that.getView().byId("SendItemRB3-4").setSelected(true);
        }
        else if(aData.responseJSON.T_BAF.item.APPRO === "Oversea Business Trip"){
        	that.getView().byId("SendItemRB3-5").setSelected(true);
        }
        else if(aData.responseJSON.T_BAF.item.APPRO === "Domestic Business Trip"){
        	that.getView().byId("SendItemRB3-6").setSelected(true);
        }
        else if(aData.responseJSON.T_BAF.item.APPRO === "Others"){
        	that.getView().byId("SendItemRB3-7").setSelected(true);
        }
        
        
      
//        var valSendItemtotalAmount = parseFloat(aData.responseJSON.T_BAF.item.AWTRY) * parseFloat(aData.responseJSON.T_BAF.item.ATWAT);
//        valSendItemtotalAmount = valSendItemtotalAmount.toString().replace(".","")
//		var vSendItemtotalCurrAmount =parseFloat(valSendItemtotalAmount).toFixed(2)
//	       .replace(".", ",") 
//	       .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        
		var vfloatTotalCurrAmount = parseFloat(aData.responseJSON.T_BAF.item.AWTRY) * parseFloat(aData.responseJSON.T_BAF.item.ATWAT);
		vfloatTotalCurrAmount = vfloatTotalCurrAmount.toString().replace(".","")
		var vSendItemtotalCurrAmount = parseFloat(vfloatTotalCurrAmount).toFixed(2)
	       .replace(".", ",") 
	       .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        
        that.getView().byId("SendItemtotalAmount").setValue(Formatter.setInstallment(aData.responseJSON.T_BAF.item.AWVAT));
        that.getView().byId("SendItemidTotalAmount").setValue(Formatter.setInstallment(aData.responseJSON.T_BAF.item.AWVAT));
        that.getView().byId("SendItemtotalCurrAmount").setValue(vSendItemtotalCurrAmount);
	
        that.getView().byId("SendItemCurrencyType").setValue(aData.responseJSON.T_BAF.item.CURRC);
        //that.getView().byId("ManidBudget").setSelectedKey(2);;
        
		var oJsonBafItemModel = new sap.ui.model.json.JSONModel();
		oJsonBafItemModel.setData(aData.responseJSON.T_BAF_BDGT);
		that.getView().setModel(oJsonBafItemModel, "JBafItemModel");
		this.getView().byId("SendItemmainViewTbl").setModel(this.getView().getModel("JBafItemModel"));
		
		//flow içeriğinin doldurulması begin of ycoskun
	
		var vStatu;
		if(aDataFlow.responseJSON.T_LOG.item.length === undefined){
			that.getView().byId("SendItemBudgetFlowTbl2").setVisible(true);
			that.getView().byId("SendItemBudgetFlowTbl").setVisible(false);
			if(aDataFlow.responseJSON.T_LOG.item.OBJTY === -2){
				vStatu="Pending Approval";
			}
			if(aDataFlow.responseJSON.T_LOG.item.OBJTY === -1){
				vStatu="Request Owner";
			}
			else{
				
			}
			that.getView().byId("SendItemBudUserId").setText(aDataFlow.responseJSON.T_LOG.item.PERNR);
    		that.getView().byId("SendItemBudTitle").setText(aDataFlow.responseJSON.T_LOG.item.TITLE);
    		that.getView().byId("SendItemBudDprt").setText(aDataFlow.responseJSON.T_LOG.item.DEPRT);
    		that.getView().byId("SendItemBudEvnt").setText(vStatu);
    		that.getView().byId("SendItemBudReqDate").setText(aDataFlow.responseJSON.T_LOG.item.DATUM+" "+aDataFlow.responseJSON.T_LOG.item.UZEIT);
			
		}
		else{
			that.getView().byId("SendItemBudgetFlowTbl2").setVisible(false);
			that.getView().byId("SendItemBudgetFlowTbl").setVisible(true);
			if(aDataFlow.responseJSON.T_LOG.item[aDataFlow.responseJSON.T_LOG.item.length-1].OBJTY === -2){
				vStatu="Pending Approval";
			}
			if(aDataFlow.responseJSON.T_LOG.item[aDataFlow.responseJSON.T_LOG.item.length-1].OBJTY === -1){
				vStatu="Request Owner";
			}
			else{
				
			}
		      		
    		
		}
		that.getView().byId("SendItemBudFlowRequestNum").setValue(vbaf);
		that.getView().byId("SendItemBudFlowRequestOwner").setValue(oJsonFlowModel.oData[0].FNAME+" "+oJsonFlowModel.oData[0].LNAME);
		that.getView().byId("SendItemBudFlowRequestType").setValue(aData.responseJSON.T_BAF.item.APPRO);
		that.getView().byId("SendItemBudFlowSubject").setValue(aData.responseJSON.T_BAF.item.SUBJC);
		that.getView().byId("SendItemBudFlowStatus").setValue(that.statusObjty(aData.responseJSON.T_BAF.item.STATU));
		//flow içeriğinin doldurulması end of ycoskun
        
		
		var aAttachData = jQuery.ajax({
            type : "GET",
            contentType : "application/json",
            url : "/RESTAdapter/b2b/getAttachment/*&"+vbaf,
            dataType : "json",
            headers: {"x-csrf-token": "Fetch",
				  "Authorization":"Basic "+btoa(username+":"+password)},
            async: false, 
            success : function(data,textStatus, jqXHR) {
            }

        });
		var oJsonAttachModel = new sap.ui.model.json.JSONModel();
		oJsonAttachModel.setData(aAttachData.responseJSON.E_ATTACHMENTS);
		that.getView().setModel(oJsonAttachModel, "oJsonAttachModel");
		this.getView().byId("idManAttachTable").setModel(this.getView().getModel("oJsonAttachModel"));
    		}
    		catch(err){
    			
    		}	
    	
		},
		statusObjty : function (value) {
			if(value==="A"){
        		value = "APPROVED";
        	}else if(value==="R"){
        		value = "REJECTED";
        	}else if(value==="U"){
        		value = "SEND BACK";
        	}else if(value==="D"){
        		value = "DRAFT";
        	}else if(value==="C"){
        		value = "Pending Approval";
        	}
   	 return value;
  
		},

		setEventType:function(value){
			
			var eventText;
				if (value === -1) {
					eventText = "Request Owner";
					return eventText;
				
				} else if (value === -2) {
					eventText = "Pending Approval";
					return eventText;				
				} 
				else if (value === 0) {
					eventText = "Rejected";
					return eventText;				
				} 
				else if (value === 1) {
					eventText = "Approved";
					return eventText;				
				} 
				else if (value === 2) {
					eventText = "Send Back";
					return eventText;				
				} 
				else if (value === 3) {
					eventText = "Take Opinion";
					return eventText;				
				} 
				else if (value === 5) {
					eventText = "Complete";
					return eventText;				
				} 
				else {
					return value;
				}
		},
		setInstallment:function(value){
			if (value) {
//				var floatValue = parseFloat(value.toString().replace(/\D/g, '')).toFixed(2);
				
				  var remData =  parseFloat(value);
					var strTotalAmountValue =remData.toFixed(2)
				       .replace(".", ",") 
				       .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
					
				return strTotalAmountValue;
			
			} else {
				return value;
			}
		},
		btnHomeClick:function(){
			this.getOwnerComponent().getRouter().navTo("Home");
			window.location.reload();
		},
		onAttachWatch: function(oEvent){
			 var bindingContext = oEvent.getSource().getBindingContext();
			  var preqNo = bindingContext.getProperty("FILENAME");
			  var preqName = bindingContext.getProperty("FILETYPE");
			  var aAttachDown = jQuery.ajax({
		            type : "GET",
		            contentType : "application/json",
		            url : "/RESTAdapter/b2b/getAttachment/"+preqNo+"&"+vbaf,
		            dataType : "json",
		            headers: {"x-csrf-token": "Fetch",
						  "Authorization":"Basic "+btoa(username+":"+password)},
		            async: false, 
		            success : function(data,textStatus, jqXHR) {
		            }

		        });
			  
			  var type = aAttachDown.responseJSON.E_CONTENT.split(";");
			  type = type[0].slice("5");
			 
			  download(aAttachDown.responseJSON.E_CONTENT, preqNo+"."+preqName, type);
			
//			    var dlnk = aAttachDown.responseJSON.E_CONTENT.split("base64,");
//			   var url = "data:application/octet-stream;base64," + dlnk[1];
//				  sap.m.URLHelper.redirect(url, true);
		},

		handleUserNamePress: function(){
//			var that = this;
//
//		var oToken;
//		var oHeaders;
		
//		document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });						
		
		//document.execCommand('ClearAuthenticationCache'); 
		

		jQuery.ajax({
                type : "GET",
                contentType : "application/json",
                url : "http://dperppo01d.n11.local:50000/bpminbox/auth?serviceName=logout",
                dataType : "json",
                async: false, 
                success : function(data,textStatus, jqXHR) {
                }

            });
		window.localStorage.clear();
		window.location.replace("http://dperppo01d.n11.local:50000/n11.com~dc_zbpm_ui5/zn11_form/index.html");
		
		}

	});

	return CController;

});