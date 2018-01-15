jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");
jQuery.sap.require("zn11_form.util.ErrorHandler");
jQuery.sap.require("zn11_form.util.TcmHelper");
jQuery.sap.require("zn11_form.util.ModelBuilder");
sap.ui.define([
	'sap/m/MessagePopover',
	'sap/m/MessagePopoverItem',
	'sap/m/Link',
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/odata/AnnotationHelper',
	'sap/m/Popover',
	'sap/m/Button',
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageToast',
	'sap/ui/model/Filter',
	'sap/m/Dialog',
	'sap/m/Text',
	'sap/m/MessageBox'
], function(MessagePopover, MessagePopoverItem, Link, jQuery, Fragment, Controller, JSONModel, AnnotationHelper, Popover, Button,
	ResourceModel, MessageToast, Filter,Dialog,Text,MessageBox) {
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
	var oSelectedIndex;
	var oSelectedRadioText;
	var supplierModel = new sap.ui.model.json.JSONModel();
	var searchModel = new sap.ui.model.json.JSONModel();
	var relModel = new sap.ui.model.json.JSONModel();
	var selectBudgetId;
	var selectCurr;
	var selectCurrNum;
	var oInstallmentsTbl=[];
	var relModel = new sap.ui.model.json.JSONModel();
	var selectsRel = [];
	
	var twoEntry = [];
	var oModel = new sap.ui.model.json.JSONModel();
	var sKur;
	var selectItem;
	var imgData = "";
	var zdata = [];
	var comment;
	var selectsSupp = [];
	var selectsRel = [];

	var unamePas;
	var arrayUserPas;
	var username;
	var password;



	var CController = Controller.extend("zn11_form.controller.resendBudget", {
		serviceUrl : "/bpmodata/taskdata.svc/",
		bpmPrefixParameter : "?prefixReservedNames=true",
		
		oDataSettings : {
			json : true,
			useBatch : false,
			disableHeadRequestForToken : true
		},
		
		model: new sap.ui.model.json.JSONModel(),
		onInit: function() {
			unamePas = atob(window.localStorage["unamePas"]);
			arrayUserPas = unamePas.split(":");
			username = arrayUserPas[0];
			password = arrayUserPas[1];
			
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

			var usernameFinal = oUserData.id
			
			// console.log(usernameFinal);

	   		var that = this;
    		var aData = jQuery.ajax({
                type : "GET",
                contentType : "application/json",
                url : "/bpmodata/tasks.svc/TaskCollection?$filter=Status eq 'READY'",
                dataType : "json",
                async: false, 
                success : function(data,textStatus, jqXHR) {
                }

            });
    		try{
    			TaskInstanceID = aData.responseJSON.d.results[sap.ui.getCore().cSelectItemIndex].InstanceID;
    			
    		var serviceUrlWithPrefix = this.serviceUrl + TaskInstanceID + this.bpmPrefixParameter;
    		var odataModel = new sap.ui.model.odata.v2.ODataModel(serviceUrlWithPrefix, this.oDataSettings);
    		
            var startTypeINPUT = jQuery.ajax({
                type : "GET",
                contentType : "application/json",
                url : "/bpmodata/taskdata.svc/"+ TaskInstanceID +"/InputData('"+ TaskInstanceID +"')?$format=json&$expand=startTypeINPUT/start/DO_BudgetApproval/Installments/row,startTypeINPUT/start/DO_BudgetApproval/Head,startTypeINPUT/start/DO_BudgetApproval/Details,startTypeINPUT/start/DO_BudgetApproval/Amount,startTypeINPUT/start/DO_BudgetApproval/Attachments,startTypeINPUT/start/DO_BudgetApproval/Opinion",
                dataType : "json",
                async: false, 
                success : function(data,textStatus, jqXHR) {
      
    				var oODataJSONModel = new sap.ui.model.json.JSONModel(data);

                }

            });
            zdata = startTypeINPUT.responseJSON.d.startTypeINPUT.start;
            // console.log(zdata);
        var Amount = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Amount;
        var Head = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Head;
        var Details = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Details;
        var Installments = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Installments;
        

        
        var uiAction = startTypeINPUT.responseJSON.d.startTypeINPUT.start.UIAction;
        comment = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Details.comment;
        var dobeln = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BELN;
        
        if(uiAction === "2"){
            that.getView().byId("RerequestOwner").setValue(Head.requestOwner);
            that.getView().byId("Redepartment").setValue(Head.department);
            that.getView().byId("Retitle").setValue(Head.title);
            that.getView().byId("RerequestNum").setValue(dobeln);
            that.getView().byId("RerequestDate").setValue(Head.requestDate);
            that.getView().byId("RerequestTime").setValue(Head.requestTime);
            //that.getView().byId("Manstatus").setValue(Head.status); status doldurulmalı
            
            
            that.getView().byId("ReperiodEnd").setValue(Details.periodEnd);
            that.getView().byId("ReperiodStart").setValue(Details.periodStart);
            that.getView().byId("Resupplier").setValue(Details.supplierId + " - "+ Details.supplier);
            that.getView().byId("Resubject").setValue(Details.subject);     
     
    	
            that.getView().byId("ReidDepartment").setValue(Details.Department);
            that.getView().byId("ReidType").setValue(Details.Type);
            that.getView().byId("ReidDesc").setValue(Details.Desc);
            that.getView().byId("ReidSubDesc").setValue(Details.SubDesc);
            that.getView().byId("ReremBudget").setValue(Details.remBudget);
            that.getView().byId("Repurpose").setValue(Details.purpose);
            that.getView().byId("Reexplanation").setValue(Details.explanation);
            that.getView().byId("RebrExp").setValue(Details.brExp);
            
            that.getView().byId("idInputBudget").setValue(Details.Budget);
            
            selectBudgetId = Details.Budget;
            selectCurr = Amount.CurrencyType;
            selectCurrNum = Amount.Currency;
            //that.getView().byId("ReidBudget").setSelectedKey();
            //that.getView().byId("ManCurrencyType").setValue(Amount.CurrencyType);
            that.getView().byId("Recurrency").setValue(Amount.Currency);
            
            if(Details.relatedParty !== null){
            	that.getView().byId("RerelatedParty").setValue(Details.relatedParty + " - " + Details.relatedPartyId);
            }
          
            if(Details.formType === "Donation"){
            	that.getView().byId("RB4-2").setSelected(true);
            }
            else if(Details.formType === "Related Party"){
            	that.getView().byId("RB4-1").setSelected(true);
            }
            else if(Details.formType === "Domestic Education"){
            	that.getView().byId("RB4-3").setSelected(true);
            }
            else if(Details.formType === "Abroad Education"){
            	that.getView().byId("RB4-4").setSelected(true);
            }
            else if(Details.formType === "Oversea Business Trip"){
            	that.getView().byId("RB4-5").setSelected(true);
            }
            else if(Details.formType === "Domestic Business Trip"){
            	that.getView().byId("RB4-6").setSelected(true);
            }
            else if(Details.formType === "Others"){
            	that.getView().byId("RB4-7").setSelected(true);
            }
            
            var floatTotalAmount = parseFloat(Amount.totalAmount.toString().replace(/\D/g, '')).toFixed(2);
            var floatIdTotalAmount = parseFloat(Amount.totalAmount.toString().replace(/\D/g, '')).toFixed(2);
            var floatTotalCurrAmount = parseFloat(Amount.totalAmountTRY.toString().replace(/\D/g, '')).toFixed(2);
            
            that.getView().byId("RetotalAmount").setValue(floatTotalAmount);
            that.getView().byId("ReidTotalAmount").setValue(floatIdTotalAmount);
            that.getView().byId("RetotalCurrAmount").setValue(floatTotalCurrAmount);
    	
            that.getView().byId("ReCurrencyType").setValue(Amount.CurrencyType);
            //that.getView().byId("ManidBudget").setSelectedKey(2);;

    		var oJsonModel = new sap.ui.model.json.JSONModel();
    		oJsonModel.setData(Installments.row);
    		// console.log(Installments.row.results);
    		that.getView().setModel(oJsonModel, "JModel");
    		this.getView().byId("RemainViewTbl").setModel(this.getView().getModel("JModel"));
    		
    		var oJsonModelIns = new sap.ui.model.json.JSONModel();
    		oJsonModelIns.setData(Installments.row);
    		// console.log(Installments.row.results);
    		that.getView().setModel(oJsonModelIns, "JInsModel");
    		this.getView().byId("RemainViewTbl2").setModel(this.getView().getModel("JInsModel"));
            //that.getView().byId("RetotalCurrAmount").setValue(Amount.ManidTotalAmount);
    		
    		//flow içeriğinin doldurulması begin of ycoskun
    		var aDataFlow = jQuery.ajax({
                type : "GET",
                contentType : "application/json",
                url : "/RESTAdapter/b2b/processLog/*/*/"+dobeln,
                dataType : "json",
                headers: {"x-csrf-token": "Fetch",
    				  "Authorization":"Basic "+btoa(username+":"+password)},
                async: false, 
                success : function(data,textStatus, jqXHR) {
                }

            });
    		var vStatu;
    		if(aDataFlow.responseJSON.T_LOG.item.length === undefined){
    			if(aDataFlow.responseJSON.T_LOG.item.OBJTY === -2){
    				vStatu="Pending Approval";
    			}
    			else{
    				
    			}
    			that.getView().byId("reBudUser").setText(aDataFlow.responseJSON.T_LOG.item.FNAME+" "+aDataFlow.responseJSON.T_LOG.item.LNAME);
        		that.getView().byId("reBudTitle").setText(aDataFlow.responseJSON.T_LOG.item.TITLE);
        		that.getView().byId("reBudDprt").setText(aDataFlow.responseJSON.T_LOG.item.DEPRT);
        		that.getView().byId("reBudEvnt").setText(aDataFlow.responseJSON.T_LOG.item.OBJTY);
        		that.getView().byId("reBudReqDate").setText(aDataFlow.responseJSON.T_LOG.item.DATUM+" "+aDataFlow.responseJSON.T_LOG.item.UZEIT);
    			
    		}
    		else{
    			if(aDataFlow.responseJSON.T_LOG.item[aDataFlow.responseJSON.T_LOG.item.length-1].OBJTY === -2){
    				vStatu="Pending Approval";
    			}
    			else{
    				
    			}
    		      		
        		var oJsonFlowModel = new sap.ui.model.json.JSONModel();
        		oJsonFlowModel.setData(aDataFlow.responseJSON.T_LOG.item);
        		that.getView().setModel(oJsonFlowModel, "oFlowModel");
        		this.getView().byId("ReBudgetFlowTbl").setModel(this.getView().getModel("oFlowModel"));
    		}
    		that.getView().byId("ReBudFlowRequestNum").setValue(dobeln);
    		that.getView().byId("ReBudFlowRequestOwner").setValue(Head.requestOwner);
    		that.getView().byId("ReBudFlowRequestType").setValue(Details.formType);
    		that.getView().byId("ReBudFlowSubject").setValue(Details.subject);
    		that.getView().byId("ReBudFlowStatus").setValue(vStatu);
    		//flow içeriğinin doldurulması end of ycoskun
         
        }
          
    		}
    		catch(err){
    			
    		}	 
    		
    		//budget allocation search help begin of ycoskun

			var budgetModel = new sap.ui.model.json.JSONModel();
			var budgetIdModel = new sap.ui.model.json.JSONModel();
			var selects = [];
			var selectId = [];
			var budgetId ;
		     //"http://dperppo01d.n11.local:50000/RESTAdapter/b2b/SearchHelp/DEPARTMENT="+department+"&INPUT_BUDGET_DEPARTMENT"
		        var aData = jQuery.ajax({
		            type : "GET",
		            contentType : "application/json",
		            url : "/RESTAdapter/b2b/SearchHelp/*&INPUT_BUDGET_DEPARTMENT",
		            dataType : "json",
		            async: false, 
		            success : function(data,textStatus, jqXHR) {
		                oModel.setData({modelData : data}); 
		                // console.log(data);
		                
		                for(var i = 0; i < data.T_RESULT.item.length; i++) {
		                   var text = data.T_RESULT.item[i];	                    
		                    var array = text.STRING.split('@');
		                    budgetId = array[0];
		                    selects.push(array[0]+" - "+array[1]+" - "+array[2]+" - "+array[3]+" - "+array[4]);
		                   // selectId.push(budgetId);
		                    
		                    
		                 }
		               
		                // console.log(selects);
		                
		    			budgetModel.setData(selects);
		    			//budgetIdModel.setData(Id);
		    			
		    			var Budget = that.getView().byId("ReidBudget");
		    		    Budget.setModel(budgetModel, "budgetModel");
		    		    // console.log(Budget);
		    		    
		    			var fText = that.getView().byId('ReidText');
		    			Budget.bindItems("budgetModel>/", fText);
		    			
		                
		            }
		        
		        });
    		//budget allocation search help end of ycoskun
    		
    		//supplier search help begin of 
	        var jsonResult;
	        var aData = jQuery.ajax({
	            type : "GET",
	            contentType : "application/json",
	            url : "/RESTAdapter/b2b/SearchHelp/NAME1*&VENDOR",
	            dataType : "json",
	            async: false, 
	            success : function(data,textStatus, jqXHR) {
	            	
	            	oModel.setData({modelData : data}); 
	                // console.log(data);
	                
	                for(var i = 0; i < data.T_RESULT.item.length; i++) {
	             
		                   var text = data.T_RESULT.item[i];	                    
		                   var array = text.STRING.split('@');
		                   var test = array[0]+" - "+array[1]+" - "+array[2]+" - "+array[3]+" - "+array[4];
		                   jsonResult = {STRING: test};
		                    selectsSupp.push(jsonResult);
		                    
		                		                    
		                 }	
	                
	    			// console.log(selectsSupp);
	    			supplierModel.setData(selectsSupp);
	    	
	    		    
	    			

	                
	            }
	        
	        });		        
	        //end of
	      
		},
		sendAction:function(){
			
			var that = this;
			
			var startDate,endDate,arrayStart,count,arrayEnd;
			
			startDate = that.getView().byId("periodStart").getValue();
			arrayStart = startDate.split(".");
			count = arrayStart[0].length;
			if (count === 1) {
				arrayStart[0] = "0" + arrayStart[0];
			}
			var sTarih = arrayStart[2] + arrayStart[1] + arrayStart[0];
			
			endDate = that.getView().byId("periodEnd").getValue();
			arrayEnd = endDate.split(".");
			count = arrayEnd[0].length;
			if (count === 1) {
				arrayEnd[0] = "0" + arrayEnd[0];
			}
			var eTarih = arrayEnd[2] + arrayEnd[1] + arrayEnd[0];
			
			var vCount, vMonth, vInsAmount;
			for (var i = 0; i < tableList.length; i++) {
				vCount = tableList[i].mAggregations.cells["0"].mProperties.text;
				vMonth = tableList[i].mAggregations.cells["1"].mProperties.value;
				vInsAmount = tableList[i].mAggregations.cells["2"].mProperties.value;

				oInstallments.push({
					rowNumber: vCount,
					Month: vMonth,
					InstallmentAmount: vInsAmount
				});
			}
			// console.log(oInstallments);

			this.onPdfExport();
			
			

			var oHeaders;
			var oToken;
			
			jQuery.ajax({
				  url: "/bpmodata/startprocess.svc/itelligence.com.tr/budget/BPM_Budget_Approval/$metadata",
				  headers: {"x-csrf-token": "Fetch",
					  "Authorization":"Basic "+btoa(username+":"+password)},
				  async: false,
				  method: 'GET'
				}).then(function(data,status,xhr) {
					  oToken = xhr.getResponseHeader('x-csrf-token');
					  oHeaders = {
								"x-csrf-token": oToken
							};
					});
			var oURL = "/bpmodata/startprocess.svc/itelligence.com.tr/budget/BPM_Budget_Approval/StartData";
			
			//mkaya 16.10.2017 
//			if(that.getView().byId("idTotalAmount").getValue() !== that.getView().byId("totalAmount").getValue()){
//				sap.m.MessageToast.show("Lütfen Total Amountları aynı giriniz");
//			}
//			else{
				 setTimeout(function(){	
						var oEntry = {"ProcessStartEvent": {"BudgetApproval": {
						    "Amount": {
						        "CurrencyType": that.getView().byId("CurrencyType").getSelectedKey(),
						        "Currency": selectItem,
						        "totalAmount": that.getView().byId("idTotalAmount").getValue(),
						        "totalAmountTRY": that.getView().byId("totalAmount").getValue(),
						        "approvalNecessary": true
						    },
						    "Details": {
						        "Budget": budgetId,
						        "Department": that.getView().byId("idDepartment").getValue(),
						        "Desc": that.getView().byId("idDesc").getValue(),
						        "SubDesc": that.getView().byId("idSubDesc").getValue(),
						        "Type": that.getView().byId("idType").getValue(),
						        "brExp": that.getView().byId("brExp").getValue(),
						        "explanation": that.getView().byId("explanation").getValue(),
						        "formType": "",//that.getView().byId("formType").getSelectedIndex(),
						        "periodEnd": sTarih,
						        "periodStart": eTarih ,
						        "purpose": that.getView().byId("purpose").getValue(),
						        "relatedParty": that.getView().byId("relatedParty").getSelectedKey(),
						        "remBudget": that.getView().byId("remBudget").getValue(),
						        "subject": that.getView().byId("subject").getValue(),
						        "supplier": that.getView().byId("supplier").getValue()
						    },
						    "Head": {
						        "department": that.getView().byId("department").getValue(),
						        "requestDate": sDate,
						        "requestNum": that.getView().byId("requestNum").getValue(),
						        "requestOwner": that.getView().byId("requestOwner").getValue(),
						        "requestTime": "",
						        "title": that.getView().byId("title").getValue()
						    },
						    "Installments": {"row": oInstallments},
						    "Attachments":{
						    	"Content":imgData,
						    	"FileName":"test"
						    }
						}}};
						jQuery.ajax({
					        type: 'POST',
					        url: oURL,
					        data: JSON.stringify(oEntry),
					        dataType: "json",
					        headers: {
				                "X-CSRF-Token": oToken,
				                "Content-Type": "application/json"              	
				            },
					        success: function(result) {
					        	alert("success");
					        	// console.log(result);
					        }
					    });
				 },2000);
			
//			}
		},
		onAfterRendering: function() {
			
		},
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		oMessageDialog: null,
		bShowResetEnabled: false,
		bIsReseted: false,

		onAddMessageDialogPress: function() {
			var onAddMessageDialogPress = this.getDialogMessage();
			this.bIsReseted = false;

			onAddMessageDialogPress.open();
		},
		getDialogMessage: function() {
			this.oMessageDialog = sap.ui.xmlfragment("zn11_form.view.AddMessageDialog", this);
			this.getView().addDependent(this.oMessageDialog);



			return this.oMessageDialog;
		},
		onAddTo: function(oEvent) {
			/*var oUserToDialog = this.getDialogUser();
			var oUserInfDialog = this.getDialogUserInf();
			var that = this;
			var Model = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZN11_BPM_SRV");
			var oJasonModel = new sap.ui.model.json.JSONModel();

			Model.read("/UserSet", null, null, true,
				function(oData, response) {
					oJasonModel.setData(oData);
					//	// console.log(oData);

				});
			that.getView().setModel(oJasonModel, "JModel");
			that.getView().setModel(oJasonModel, "JsonModel");

			var buttonId = oEvent.getSource().getId();

			if (buttonId === "addButtonTo") {
				sap.ui.getCore().byId("idUserTblTo").setModel(that.getView().getModel("JModel"));
				oUserToDialog.open();
			} else {
				sap.ui.getCore().byId("idUserTblInf").setModel(that.getView().getModel("JsonModel"));
				oUserInfDialog.open();
			}
*/
		},
		getDialogUser: function() {
			if (!this.oUserToDialog) {
				this.oUserToDialog = sap.ui.xmlfragment("zn11_form.view.UserToDialog", this);
				this.getView().addDependent(this.oUserToDialog);
			}

			return this.oUserToDialog;
		},
		getDialogUserInf: function() {
			if (!this.oUserInfDialog) {
				this.oUserInfDialog = sap.ui.xmlfragment("zn11_form.view.UserInfDialog", this);
				this.getView().addDependent(this.oUserInfDialog);
			}

			return this.oUserInfDialog;
		},
		onExit: function() {
			if (this.oUserToDialog) {
				this.oUserToDialog.destroy();
			}
			if (this.oUserInfDialog) {
				this.oUserInfDialog.destroy();
			}
		},
		handleSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("FirstName", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		handleClose: function(oEvent) {
			var aContexts = oEvent.getParameter("edContexts");
			var tableId = oEvent.getSource().getId();

			if (tableId === "idUserTblTo") {
				usersTo.push(aContexts.map(function(oContext) {
					return oContext.getObject().FirstName + " " + oContext.getObject().LastName;
				}).join(", "));
				for (var a = 0; a < usersTo.length; a++) {
					var userTo = usersTo[a];
					multiUserTo = userTo.split(",");
				}

				if (multiUserTo != null) {
					for (var j = 0; j < multiUserTo.length; j++) {
						var vList1 = new sap.m.StandardListItem({
							title: multiUserTo[j]
						});
						sap.ui.getCore().byId("addTbl1").addItem(vList1);
					}
					// console.log(multiUserTo);
				}
			} else if (tableId === "idUserTblInf") {
				usersInf.push(aContexts.map(function(oContext) {
					return oContext.getObject().FirstName + " " + oContext.getObject().LastName;
				}).join(", "));

				for (var b = 0; b < usersInf.length; b++) {
					var userInf = usersInf[b];
					multiUserInf = userInf.split(",");
				}
				if (multiUserInf != null) {
					for (var k = 0; k < multiUserInf.length; k++) {
						var vList2 = new sap.m.StandardListItem({
							title: multiUserInf[k]
						});
						sap.ui.getCore().byId("addTbl2").addItem(vList2);
					}
					// console.log(multiUserInf);
				}
			}
		},
		onCloseDialog: function() {
			this.oMessageDialog.close();
			this.oMessageDialog.destroy();
		},
		handleDelete: function(oEvent) {

			var tableId = oEvent.getSource().getId();
			//delete item

			if (tableId === "addTbl1") {
				var oList1 = sap.ui.getCore().byId("addTbl1");
				var item1 = oEvent.getParameter("listItem");
				oList1.removeItem(item1);
			} else {
				var oList2 = sap.ui.getCore().byId("addTbl2");
				var item2 = oEvent.getParameter("listItem");
				oList2.removeItem(item2);
			}

		},
		onAttachAdd: function() {
			var oAttachAddDialog = this.getDialogAttach();

			oAttachAddDialog.open();

		},
		getDialogAttach: function() {
			if (!this.oAttachAddDialog) {
				this.oAttachAddDialog = sap.ui.xmlfragment("zn11_form.view.AttachDialogBudget", this);
				this.getView().addDependent(this.oAttachAddDialog);
			}

			return this.oAttachAddDialog;
		},

		//Attachment close butonu
		onCloseAttachDialog: function(oEvent) {
			if (!this.oAttachAddDialog) {
				this.oAttachAddDialog = sap.ui.xmlfragment("zn11_form.view.AttachDialogBudget", this.getView().getController());

			}
			var oFileUploader = sap.ui.getCore().byId("fileupload");
			oFileUploader.setValue("");
			this.oAttachAddDialog.close();
			
		
			//kac adet file eklenmiş onu ekrana gösterme
			var form = sap.ui.getCore().byId("simpleFormMessage");
			for (var m = 0; m < attachFiles.length; m++) {
				    var oButton = new sap.ui.commons.Button({
									text: attachFiles[m].name,
									icon: "sap-icon://attachment",
									lite: true,
									width: "60%",
									id: "button"+attachFiles[m].name,
									press: function(oEvent) {
										alert("Dosyalarr!!" + oEvent.getSource().getId());
									
									}
								});
								form.addContent(oButton);
				}
					attachFiles = [];
		},
		//File Upload
		uploadFile: function() {

			var oFileUploader = sap.ui.getCore().byId("fileupload");
			var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
			var form = sap.ui.getCore().byId("simpleFormAttach");
			// console.log(form);

			// console.log(file);

			try {
				if (file) {
					this._bUploading = true;
					var that = this;
					/****************To Fetch CSRF Token*******************/
					var a = "/sap/opu/odata/sap/ZN11_BPM_SRV/";
					var f = {
						headers: {
							"X-Requested-With": "XMLHttpRequest",
							"Content-Type": "application/atom + xml",
							DataServiceVersion: "2.0",
							"x-csrf-token": "Fetch"
						},
						requestUri: a,
						method: "GET"
					};
					var oHeaders;
					var sUrl = "/sap/opu/odata/sap/ZN11_BPM_SRV/";
					var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
					sap.ui.getCore().setModel(oModel);
					OData.request(f, function(data, oSuccess) {
						var oToken = oSuccess.headers['x-csrf-token'];
						oHeaders = {
							"x-csrf-token": oToken,
							"slug": "QF"
						};
						/*	* * * * * * * * * * * * * * * To Fetch CSRF Token * * * * * * * * * * * * * * * * * * * /
/ * * * * * * * * * * * * * * * * * * * To Upload File * * * * * * * * * * * * * * * * * * * * * * * * */
						var oURL = "/sap/opu/odata/sap/ZN11_BPM_SRV" + "/FileSet('" + file.name + "')/$value";
						jQuery.ajax({
							type: 'PUT',
							url: oURL,
							headers: oHeaders,
							cache: false,
							contentType: file.type,
							processData: false,
							data: file,
							success: function() {
								sap.m.MessageToast.show("File Uploaded Successfully");
								oFileUploader.setValue("");
                                
                                attachFiles.push(file);
                                //attach butonları yaratma
								var oButton = new sap.ui.commons.Button({
									text: file.name,
									icon: "sap-icon://attachment",
									lite: true,
									width: "20%",
									id: "button_"+file.name,
									press: function(oEvent) {
										alert("Dosyalarr!!" + oEvent.getSource().getId());
									
									}
								});
								form.addContent(oButton);

							},
							error: function() {
								sap.m.MessageToast.show("File Upload Error!");
							}
						});
					});
				}
			} catch (oException) {
				jQuery.sap.log.error("File upload failed: \n" + oException.message);
			}
                // console.log(attachFiles);
		},
		selectChange:function(oEvent){
			var oThat = this;
			var selectItem = oEvent.oSource.getSelectedItem().getText();
			// console.log(selectItem);
			
			var array = selectItem.split('@');
			budgetId = array[0];
			var department = array[1];
			var type = array[2];
			var desc = array[3];
			var subDesc = array[4];
					
			
			
			oThat.getView().byId("idDepartment").setValue(department);
			oThat.getView().byId("idType").setValue(type);
			oThat.getView().byId("idDesc").setValue(desc);
			oThat.getView().byId("idSubDesc").setValue(subDesc);
			
			
			setTimeout(function(){
				oThat.byId("ReidBudget").setValue(budgetId);
			},10);
				
			
	
	
			
		},
		addListInput: function(oEvent) {
			var oThat = this;
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1;
			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = '0' + dd;
			} else {
				dd = dd.toString();
			}

			if (count !== 0) {
				mm = (mm + count);
				var newMM = mm % 12;
				var newYYYY = Math.floor(mm / 12);
				if (newMM < 10) {
					if (newMM === 0) {
						newMM = 12;
						newYYYY = newYYYY - 1;
					} else {
						newMM = '0' + newMM;
					}
				} else {
					newMM = newMM;
				}
				yyyy = yyyy + newYYYY;
				today = yyyy.toString() + newMM.toString() + dd;

			} else {
				if (mm < 10) {
					mm = '0' + mm;
				}
				today = yyyy.toString() + mm.toString() + dd;
			}

			var oDatePicker1 = new sap.ui.commons.DatePicker();
			oDatePicker1.setYyyymmdd(today);
			count = count + 1;
			idNum = idNum + 1;
			
			var buttonId = "_button" + count;
			var inputId = "_text" + count;

			columnListItemNewLine = new sap.m.ColumnListItem({
				type: sap.m.ListType.Inactive,
				unread: false,
				cells: [
					new sap.m.Label({
						text: idNum,
						editable: false
					}),
					new sap.m.Input({
						type: "Text",
						value: oDatePicker1.getValue(),
						editable: false
					}),
					new sap.m.Input({
						type: "Text",
						value: "",
						id: "_text" + count,
						liveChange: function() {
							var inputNo = 0;
							var toplam = 0;
							for (var a = 0; a < inputArrayId.length; a++) {
								var input = sap.ui.getCore().byId(inputArrayId[a]).getValue();
								inputNo = parseInt(input);
								if (inputNo > 0) {
									toplam = toplam + inputNo;
								}

							}
							// console.log(toplam);
							oThat.getView().byId("idTotalAmount").setValue(toplam);
							var crrType = oThat.getView().byId("currency").getValue();
							oThat.getView().byId("totalCurrAmount").setValue(toplam * crrType);
							//var sCur = parseInt(sKur);
							//oThat.getView().byId("totalCurrAmount").setValue(toplam*sCur);
						}
					}),
					new sap.m.Button({
						icon: "sap-icon://delete",
						width: "30%",
						id: buttonId,
						press: function(oEvent) {
							
							if (oEvent.getSource().getParent().getParent().getItems().length > 0) {
								var row = oEvent.getSource().getParent().getId();
								oEvent.getSource().getParent().getParent().removeItem(row);
								count--;
								idNum--;
								var sButton = "_button" + (count);
								if (count > -1) {
									inputArrayId.splice(count, 1);
								}
								if (count > -1) {
									tableList.splice(count, 1);
								}
								if (count > -1) {
									buttonArrayId.splice(count, 1);
								}
								sap.ui.getCore().byId(sButton).setVisible(true);
							}

						},
						visible: true
					})
				]
			});
			oThat.getView().byId("mainViewTbl").addItem(columnListItemNewLine);
			tableList.push(columnListItemNewLine);
			inputArrayId.push(inputId);
			buttonArrayId.push(buttonId);
			// console.log(buttonArrayId);

			//bır oncekının delete butonunu sil veya gizle
			var oncekiButton;
			if (count === 1) {
				oncekiButton = "_button" + (count);
				sap.ui.getCore().byId(oncekiButton).setVisible(true);
			} else {
				oncekiButton = "_button" + (count - 1);
				sap.ui.getCore().byId(oncekiButton).setVisible(false);
			}
			// console.log(oncekiButton);

		},
		selectChangeCur:function(oEvent){
			var oThat = this;
		 selectItem = oEvent.oSource.getSelectedItem().getText();
				
		       var aData = jQuery.ajax({
		            type : "GET",
		            contentType : "application/json",
		            url : "/RESTAdapter/b2b/ExchangeRate/"+selectItem,
		            dataType : "json",
		            async: false, 
		            success : function(data,textStatus, jqXHR) {
		                oModel.setData({modelData : data}); 
		                sKur = data.E_UKURS;
		                oThat.getView().byId('currency').setValue(sKur);
		                         
		            }
		        
		        });
		},
		selectChange:function(oEvent){
			
			var oThat = this;
			var selectItem = oEvent.oSource.getSelectedItem().getText();
			// console.log(selectItem);
			
			var array = selectItem.split(' - ');
			budgetId = array[0];
			var department = array[1];
			var type = array[2];
			var desc = array[3];
			var subDesc = array[4];
					
			
			
			oThat.getView().byId("ReidDepartment").setValue(department);
			oThat.getView().byId("ReidType").setValue(type);
			oThat.getView().byId("ReidDesc").setValue(desc);
			oThat.getView().byId("ReidSubDesc").setValue(subDesc);
			
			
			setTimeout(function(){
				oThat.byId("ReidBudget").setValue(budgetId);
			},10);
			
			//begin of budget id ye bağlı rem amount cekme
			try{
				var remAmountData = jQuery.ajax({
	                type : "GET",
	                contentType : "application/json",
	                url : "/RESTAdapter/b2b/RemainingBudget/"+ budgetId,
	                dataType : "json",
	                async: false, 
	                success : function(data,textStatus, jqXHR) {
	                }

	            });
	    		var remData = remAmountData.responseJSON.E_BUDGET;
	    		
	    		 oThat.getView().byId('ReremBudget').setValue(remData);
				
				//end of ycoskun
				
			}catch(err){
				
			}	
			//end of budget id ye bağlı rem amount cekme
	
	
			
		},
		handleValueHelpSupplier: function() {
			
			var that = this;
			var supplier;
			var supplierName;
			var jsonSearch;
			var handleClose = function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					
					var title = oSelectedItem.getTitle();
					 var array = title.split(' - ');
					 supplier = array[0];
					 supplierName = array[1];
					that.getView().byId("Resupplier").setValue(supplier+" - "+supplierName);
					//that.additionalInfoValidation();
				}
			};
			if (!this._valueHelpSelectSupplier) {
				this._valueHelpSelectSupplier = new sap.m.SelectDialog("valueHelpSelectSupplier", {
					title: "Supplier",
					items: {
						path: "/",
						sorter: "STRING",
						template: new sap.m.StandardListItem({
							title: "{STRING}",
							description: "{STRING}",
							active: true
						})
					},
					search: function(oEvent) {
						var searchSupp = [];
						var sValue = oEvent.getParameter("value");						
						//supplier search help begin of 	     
				        var aData = jQuery.ajax({
				            type : "GET",
				            contentType : "application/json",
				            url : "/RESTAdapter/b2b/SearchHelp/NAME1*"+sValue+"&VENDOR",
				            dataType : "json",
				            async: false, 
				            success : function(data,textStatus, jqXHR) {
			
				            	oModel.setData({modelData : data}); 
				                // console.log(data);
				                
				                for(var i = 0; i < data.T_RESULT.item.length; i++) {
					                   var text = data.T_RESULT.item[i];	                    					               				            
					                   var array = text.STRING.split('@');
					                   var test = array[0]+" - "+array[1]+" - "+array[2]+" - "+array[3]+" - "+array[4];
					                   jsonSearch = {STRING: test};
					                   
					                   searchSupp.push(jsonSearch);
					                    
					                    
					                 }
					               
				    			// console.log(searchSupp);
				    			searchModel.setData(searchSupp);
				    			that._valueHelpSelectSupplier.setModel(searchModel);
				                
				            }
				        
				        });		        
				        //end of
						/*var oFilter = new sap.ui.model.Filter(
							"STRING",
							sap.ui.model.FilterOperator.Contains, sValue
						);
						oEvent.getSource().getBinding("items").filter([oFilter]);*/
					},
					confirm: handleClose
				});
				this._valueHelpSelectSupplier.setModel(supplierModel);

			} else {
				this._valueHelpSelectSupplier.setModel(supplierModel);
			}
			this._valueHelpSelectSupplier.open();

			
			
		
		},
		setInstallment:function(value){
			
			if (value) {
				var floatValue = parseFloat(value.toString().replace(/\D/g, '')).toFixed(2);
				return floatValue;
			
			} else {
				return value;
			}
			
		},
		sendBackAction:function(){
					
		
			var oHeaders;
			var oToken;
			var oTaskId = TaskInstanceID.slice(-32);
			var that = this;
			var startDate,endDate,arrayStart,count,arrayEnd;
			var sTarih;
			var eTarih;
			var startNok;
			var endNok;
			var counter;
			
			
			var that = this;
			if(oSelectedRadioText === undefined){
				oSelectedRadioText = that.getView().byId("RB4-2").getText();
			}
			
			startDate = that.getView().byId("ReperiodStart").getValue();
			endDate = that.getView().byId("ReperiodEnd").getValue();
			//date'in EN veya TR gelip gelmedğinin kontrolü begin of
			startNok = startDate.slice(1,2);
			endNok = endDate.slice(1,2);
			if(startNok !== "."){
				startNok = startDate.slice(2,3);
				//endNok = endDate.slice(2,3);
			}
			else{
				startNok = startDate.slice(1,2);
				//endNok = endDate.slice(1,2);
			}
			if(endNok !== "."){
				endNok = endDate.slice(2,3);
			}
			else{
				endNok = endDate.slice(1,2);
			}
			//end of
			if(startNok === "."){		
				arrayStart = startDate.split(".");
				count = arrayStart[0].length;
				if (count === 1) {
					arrayStart[0] = "0" + arrayStart[0];
					
				}
				sTarih = arrayStart[2] + arrayStart[1] + arrayStart[0];
				
				
			}
			else{
				arrayStart = startDate.split("/");
				count = arrayStart[0].length;
				
				if(arrayStart[1] === undefined){
					
				}
				else{
					counter = arrayStart[1].length;	
				}
				if (count === 1) {
					arrayStart[0] = "0" + arrayStart[0];
					
				}
				if (counter === 1) {
					arrayStart[1] = "0" + arrayStart[1];
					
				}
				
				sTarih = "20"+arrayStart[2] + arrayStart[0] + arrayStart[1];
				
				
				/*arrayEnd = endDate.split("/");
				count = arrayEnd[0].length;
				if (count === 1) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				eTarih = arrayEnd[2] + arrayEnd[1] + arrayEnd[0];*/
			}
			if(endNok === "."){		
							
				arrayEnd = endDate.split(".");
				count = arrayEnd[0].length;
				
				if (count === 1 ) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				
				eTarih = arrayEnd[2] + arrayEnd[1] + arrayEnd[0];
				
			}
			else{				
				arrayEnd = endDate.split("/");
				count = arrayEnd[0].length;
				if(arrayEnd[1] === undefined){
					
				}
				else{
					counter = arrayEnd[1].length;	
				}		
				if (count === 1) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				if (counter === 1) {
					arrayEnd[1] = "0" + arrayEnd[1];
					
				}
				eTarih = "20"+arrayEnd[2] + arrayEnd[0] + arrayEnd[1];
			}
			
			
		
			jQuery.ajax({
				  url: "/bpmodata/taskdata.svc/"+oTaskId+"/?prefixReservedNames=true",
				  headers: {"x-csrf-token": "Fetch",
					  "Authorization":"Basic "+btoa(username+":"+password)},
				  async: false,
				  method: 'GET'
				}).then(function(data,status,xhr) {
					  oToken = xhr.getResponseHeader('x-csrf-token');
					  oHeaders = {
								"x-csrf-token": oToken
							};
					});
			
			var oPostURL = "/bpmodata/taskdata.svc/"+oTaskId+"/SAPBPMOutputData?prefixReservedNames=true";
			//zdata formatını belirleme begin of
			var oEntryData = {"PersonelCompleteEventTypeOUTPUT": {"PersonelCompleteEvent": zdata
			}};
			
		
			var arraytotalAmount = that.getView().byId("ReidTotalAmount").getValue().split(".");
			var arraytotalAmountTRY = that.getView().byId("RetotalCurrAmount").getValue().split(".");
			var supplierFull = that.getView().byId("Resupplier").getValue().split(" - ");
			var relatedPartyFull = that.getView().byId("RerelatedParty").getValue().split(" - ");

			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.UIAction = "1";
						 
			setTimeout(function(){
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Amount.Currency =  that.getView().byId("RecurrencyV2").getValue();
			},100);		
			setTimeout(function(){
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Amount.CurrencyType = that.getView().byId("ReSelectCurrencyType").getSelectedKey();
			},100);	
		
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Amount.totalAmount = arraytotalAmount[0];
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Amount.totalAmountTRY = arraytotalAmountTRY[0];		
			setTimeout(function(){
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.Budget = budgetId;
			},100);	
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.Department = that.getView().byId("ReidDepartment").getValue();
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.Desc = that.getView().byId("ReidDesc").getValue();
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.SubDesc =  that.getView().byId("ReidSubDesc").getValue();
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.Type = that.getView().byId("ReidType").getValue();
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.brExp = that.getView().byId("RebrExp").getValue();
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.explanation =  that.getView().byId("Reexplanation").getValue();
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.formType = oSelectedRadioText;
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.periodEnd = "20171107";
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.periodStart = "20171102";
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.purpose = that.getView().byId("Repurpose").getValue();
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.relatedParty = relatedPartyFull[1];
			if(relatedPartyFull.length !== 0){				
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.relatedPartyId = relatedPartyFull[0];
			}
		
			
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.remBudget = that.getView().byId("ReremBudget").getValue();
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.subject = that.getView().byId("Resubject").getValue();
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.supplier = supplierFull[1];
			
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Head.requestNum = that.getView().byId("RerequestNum").getValue();
			if(supplierFull.length !== 0){				
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.supplierId = supplierFull[0];
			}
			
			
			//Installment tablosunu gönderme begin of ycoskun
			
			var vCount, vMonth, vInsAmount;
			var oTableIns = this.getView().byId("RemainViewTbl2");
			for (var i = 0; i < oTableIns.mAggregations.items.length; i++) {
				vCount = oTableIns.mAggregations.items[i].mAggregations.cells["0"].mProperties.text;
				vMonth = oTableIns.mAggregations.items[i].mAggregations.cells["1"].mProperties.value;
				vInsAmount = oTableIns.mAggregations.items[i].mAggregations.cells["2"].mProperties.value;
				
				var arrayInsAmount = vInsAmount.split(".");

				oInstallmentsTbl.push({
					rowNumber: vCount,
					Month: vMonth,
					InstallmentAmount: arrayInsAmount[0]
				});
			}
			// console.log(oInstallmentsTbl);
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Installments.row = {"results":oInstallmentsTbl};
			
			//Installment tablosunu gönderme begin of ycoskun

			//end of
			
			//ready durumundaki taskı reserved yapmak begin of 
			var tasksSvcURL = "/bpmodata/tasks.svc";
			var tasksODataModel = new sap.ui.model.odata.ODataModel(tasksSvcURL, false);
			tasksODataModel.create("/Claim?InstanceID='"+TaskInstanceID+"'", null);
			//end of
			
			//Total Amount Kontrolü begin of ycoskun
			if(that.getView().byId("ReidTotalAmount").getValue() !== that.getView().byId("RetotalAmount").getValue()){
				sap.m.MessageToast.show("Please enter the same total amounts");
				 oInstallments = [];
			
			}
			else{
				jQuery.ajax({
			        type: 'POST',
			        url: oPostURL,
			        data: JSON.stringify(oEntryData),
			        dataType: "json",
			        headers: {
		                "X-CSRF-Token": oToken,
		                "Content-Type": "application/json"              	
		            },
			        success: function(result) {
			        	
			        	alert("success");
			        	// console.log(result);
			        	tasksODataModel.refresh(true);
			        	that.onInit();
			        	that.getOwnerComponent().getRouter().navTo("Home");
						window.location.reload();
			        	
			        
			        }
			    });
			}
			

		
		
		},
		selectFormType:function(oEvent){
			
			var that = this;
			oSelectedIndex = oEvent.getParameter("selectedIndex");  
			var oRadioButtonSrc = oEvent.getSource().getAggregation("buttons");  
			oSelectedRadioText = oRadioButtonSrc[oSelectedIndex].getText();
			
			if(oSelectedRadioText !== "Related Party"){
				that.getView().byId("ReidRelatedParty").setVisible(false);
				that.getView().byId("RerelatedParty").setVisible(false);
				that.getView().byId("ReidBudget").setValue(budgetId);
				}
			else{
				that.getView().byId("ReidRelatedParty").setVisible(true);
				that.getView().byId("RerelatedParty").setVisible(true);
				that.getView().byId("ReidBudget").setValue(budgetId);
			}

		},
		displayComment:function(){
			var dialog = new Dialog({
				title: 'Comment',
				type: 'Message',
					content: new Text({
						text: comment
					}),
				beginButton: new Button({
					text: 'OK',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
			
		},
		editForm:function(oEvent){
			
            //that.getView().byId("Manstatus").setValue(Head.status); status doldurulmalı
            
            var that = this; 
            
            //Installment table edit etme begin of ycoskun    
            that.getView().byId("InsTbl1").setVisible(false);
            that.getView().byId("RemainViewTbl").setVisible(false);
            
            that.getView().byId("InsTbl2").setVisible(true);
            that.getView().byId("RemainViewTbl2").setVisible(true);
            //Installment table edit etme end of ycoskun
            
            
            that.getView().byId("ReperiodEnd").setEnabled(true);
            that.getView().byId("ReperiodStart").setEnabled(true);
            that.getView().byId("Resupplier").setEnabled(true);
            that.getView().byId("Resubject").setEnabled(true);  
            that.getView().byId("ReidBudget").setEnabled(true);

            that.getView().byId("ReremBudget").setEnabled(true);
            that.getView().byId("Repurpose").setEnabled(true);
            that.getView().byId("Reexplanation").setEnabled(true);
            that.getView().byId("RebrExp").setEnabled(true);
            
            //that.getView().byId("ManCurrencyType").setValue(Amount.CurrencyType);
            that.getView().byId("Recurrency").setEnabled(true);
            that.getView().byId("RetotalAmount").setEnabled(true);
          
            that.getView().byId("ReidTotalAmount").setEnabled(true);
            that.getView().byId("RetotalCurrAmount").setEnabled(true);
    	
            that.getView().byId("ReCurrencyType").setEnabled(true);
            
            that.getView().byId("RB4-1").setEnabled(true);
            that.getView().byId("RB4-2").setEnabled(true);
            that.getView().byId("RB4-3").setEnabled(true);
            that.getView().byId("RB4-4").setEnabled(true);
            that.getView().byId("RB4-5").setEnabled(true);
            that.getView().byId("RB4-6").setEnabled(true);
            that.getView().byId("RB4-7").setEnabled(true);
            
            that.getView().byId("idInputBudget").setVisible(false);
            that.getView().byId("ReidBudget").setVisible(true);
           // that.getView().byId("ReidBudget").setSelected('2').setSelectedKey('4633');
            
            that.getView().byId("ReLabelBudget").setVisible(false);
            that.getView().byId("ReLabelBudgetSelect").setVisible(true);
            that.getView().byId("ReidBudget").setEnabled(true);
        	setTimeout(function(){
				that.byId("ReidBudget").setValue(selectBudgetId);
			},10);
        	
        	 that.getView().byId("ReLabelCurr").setVisible(false);
             that.getView().byId("ReCurrencyType").setVisible(false);
             that.getView().byId("Recurrency").setVisible(false);
             
             that.getView().byId("ReSelectInputCurr").setVisible(true);
             that.getView().byId("ReSelectCurrencyType").setVisible(true);
             that.getView().byId("RecurrencyV2").setVisible(true);
             
             that.getView().byId("ReSelectCurrencyType").setEnabled(true);
         	setTimeout(function(){
 				that.byId("ReSelectCurrencyType").setValue(selectCurr);
 				that.byId("RecurrencyV2").setValue(selectCurrNum);
 			},10);
            
            //that.getView().byId("ManidBudget").setSelectedKey(2);;

		
		},
		selectChange:function(oEvent){
	
			var oThat = this;
			var selectItem = oEvent.oSource.getSelectedItem().getText();
			// console.log(selectItem);
			
			var array = selectItem.split(' - ');
			budgetId = array[0];
			var department = array[1];
			var type = array[2];
			var desc = array[3];
			var subDesc = array[4];
					
			
			
			oThat.getView().byId("ReidDepartment").setValue(department);
			oThat.getView().byId("ReidType").setValue(type);
			oThat.getView().byId("ReidDesc").setValue(desc);
			oThat.getView().byId("ReidSubDesc").setValue(subDesc);
			
			
			setTimeout(function(){
				oThat.byId("ReidBudget").setValue(budgetId);
			},100);
			
			//begin of budget id ye bağlı rem amount cekme
			try{
				var remAmountData = jQuery.ajax({
	                type : "GET",
	                contentType : "application/json",
	                url : "/RESTAdapter/b2b/RemainingBudget/"+ budgetId,
	                dataType : "json",
	                async: false, 
	                success : function(data,textStatus, jqXHR) {
	                }

	            });
	    		var remData = remAmountData.responseJSON.E_BUDGET;
	    		
	    		 oThat.getView().byId('ReremBudget').setValue(remData);
				
				//end of ycoskun
				
			}catch(err){
				
			}	
			//end of budget id ye bağlı rem amount cekme
	
	
			
		},
		selectChangeCur:function(oEvent){
			var oThat = this;
		 selectItem = oEvent.oSource.getSelectedItem().getText();
	
			
		       var aData = jQuery.ajax({
		            type : "GET",
		            contentType : "application/json",
		            url : "/RESTAdapter/b2b/ExchangeRate/"+selectItem,
		            dataType : "json",
		            async: false, 
		            success : function(data,textStatus, jqXHR) {
		                oModel.setData({modelData : data}); 
		                sKur = data.E_UKURS;
		                oThat.getView().byId('RecurrencyV2').setValue(sKur);
		             
		    			
		                
		            }
		        
		        });
		},
		btnHomeClick:function(){
			this.getOwnerComponent().getRouter().navTo("Home");
			window.location.reload();
		},
		handleUserNamePress: function(event) {
			var that = this;
			var oHeaders;

			var popover = new Popover({

				showHeader: false,

				placement: sap.m.PlacementType.Bottom,

				content: [

					new Button({

						text: 'Feedback',

						type: sap.m.ButtonType.Transparent

					}),

					new Button({

						text: 'Help',

						type: sap.m.ButtonType.Transparent

					}),

					new Button({
						text: 'Logout',
						type: sap.m.ButtonType.Transparent,					
						press:function(){
							
							var oToken;
							var oHeaders;
							window.localStorage.clear();
							document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });						
							that.getOwnerComponent().getRouter().navTo("Route");							
							window.location.reload();
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
							
						}

					})

				]

			}).addStyleClass('sapMOTAPopover sapTntToolHeaderPopover');

			popover.openBy(event.getSource());

		},
		setEventType:function(value){
			
			var eventText;
				if (value === -1) {
					eventText = "Send";
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
				else{
					return value;
				}
		},
		changeInsAmount:function(oEvent){
				
				var that = this;
				var inputNo = 0;
				var toplam = 0;
				var oTable = that.getView().byId("RemainViewTbl2");
					
					for (var a = 0; a < oTable.mAggregations.items.length; a++) {	
						var input = oTable.mAggregations.items[a].mAggregations.cells["2"].mProperties.value;
						//var input = sap.ui.getCore().byId(inputArrayId[a]).getValue();
						inputNo = parseInt(input); 
										
						if (inputNo > 0) {
							toplam = toplam + inputNo;
						}	
						if(input === ""){
							that.getView().byId(inputArrayId[a]).setValue("");
						}
						else{
							var floatInput = parseFloat(inputNo.toString().replace(/\D/g, '')).toFixed(2);
							that.getView().byId(oTable.mAggregations.items[a].mAggregations.cells[2].sId).setValue(floatInput);
						}
						
						

					}
				
				// console.log(toplam);
				that.getView().byId("ReidTotalAmount").setValue(parseFloat(toplam.toString().replace(/\D/g, '')).toFixed(2));
				var crrType = that.getView().byId("RecurrencyV2").getValue();
				var carpim = toplam * crrType;
				that.getView().byId("RetotalCurrAmount").setValue(parseFloat(carpim.toString().replace(/\D/g, '')).toFixed(2));
			
			
			
		},
		changeTotalAmount:function(){
			var that = this;
			var totalAmount = that.getView().byId("RetotalAmount").getValue();
			that.getView().byId("RetotalAmount").setValue(parseFloat(totalAmount.toString().replace(/\D/g, '')).toFixed(2));
			
			
		
		},
		handleValueHelpRelatedParty: function() {
			 //related party alanını getirmek search help begin of 	     
	        var aData = jQuery.ajax({
	            type : "GET",
	            contentType : "application/json",
	            url : "/RESTAdapter/b2b/SearchHelp/*&RELATED_PARTY",
	            dataType : "json",
	            async: false, 
	            success : function(data,textStatus, jqXHR) {
	            	
	            	oModel.setData({modelData : data}); 
	                // console.log(data);
	                
	                for(var i = 0; i < data.T_RESULT.item.length; i++) {
		                   var text = data.T_RESULT.item[i];	                    
		                    var array = text.STRING.split('@');
		                    //budgetId = array[0];	           
		                    selectsRel.push(text);
		                   // selectId.push(budgetId);	                    
		                    
		                 }
		               
	    			// console.log(selectsRel);
	    			relModel.setData(selectsRel);
	                
	            }
	        
	        });		        
	        //end of
			
			var that = this;
			var relatedParty;
			var relatedPartyName;
			
			var handleClose = function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					
					var title = oSelectedItem.getTitle();
					 var array = title.split('@');
					 //supplier = array[0];
					 //supplierName = array[1];
					 relatedParty = array[0];
					 relatedPartyName = array[1];
					that.getView().byId("RerelatedParty").setValue(relatedParty+" - "+relatedPartyName);
					
				}
			};
			if (!this._valueHelpSelectRelatedParty) {
				this._valueHelpSelectRelatedParty = new sap.m.SelectDialog("valueHelpSelectRelatedParty", {
					title: "Related Party",
					items: {
						path: "/",
						sorter: "STRING",
						template: new sap.m.StandardListItem({
							title: "{STRING}",
							description: "{STRING}",
							active: true
						})
					},
					confirm: handleClose
				});
				this._valueHelpSelectRelatedParty.setModel(relModel);

			} else {
				this._valueHelpSelectRelatedParty.setModel(relModel);
			}
			this._valueHelpSelectRelatedParty.open();

			
			
		}

	});

	return CController;

});