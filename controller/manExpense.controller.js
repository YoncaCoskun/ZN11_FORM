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
	'sap/m/MessageBox'
], function(MessagePopover, MessagePopoverItem, Link, jQuery, Fragment, Controller, JSONModel, AnnotationHelper, Popover, Button,
	ResourceModel, MessageToast, Filter,MessageBox) {
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
	var dobeln;

	var unamePas;
	var arrayUserPas;
	var username;
	var password;
	var vUIAction;


	var CController = Controller.extend("zn11_form.controller.manExpense", {
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
                url : "/bpmodata/tasks.svc/TaskCollection?$filter=Status eq 'READY'",
                dataType : "json",
                headers: {"x-csrf-token": "Fetch",
					  "Authorization":"Basic "+btoa(username+":"+password)},
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
                url : "/bpmodata/taskdata.svc/"+TaskInstanceID+"/InputData('"+TaskInstanceID+"')?$format=json&$expand=startTypeINPUT/start/DO_EAF_Approver/FormDetails,startTypeINPUT/start/DO_EAF_Approver/ExpenseDetails/ExpenseList,startTypeINPUT/start/DO_EAF_Approver/ExpenseDetails/ExpenseList/item,startTypeINPUT/start/DO_EAF_Approver/Opinion,startTypeINPUT/start/DO_EAF_Approver/DO_T_PERSONEL,startTypeINPUT/start/DO_EAF_Approver/ProcessInitiator,startTypeINPUT/start/DO_EAF_Approver/Attachments,startTypeINPUT/start/ProcessInstanceAttributes/ProcessInitiator",
                dataType : "json",
                headers: {"x-csrf-token": "Fetch",
					  "Authorization":"Basic "+btoa(username+":"+password)},
                async: false, 
                success : function(data,textStatus, jqXHR) {    
    				var oODataJSONModel = new sap.ui.model.json.JSONModel(data);
                }

            });
            
            zdata = startTypeINPUT.responseJSON.d.startTypeINPUT.start;
            // console.log(zdata);
        var vEFormDetails = zdata.DO_EAF_Approver.FormDetails;
        var vExpenseDetails = zdata.DO_EAF_Approver.ExpenseDetails;
        
        //Expense Type icin
        var vExpRelWith = zdata.DO_EAF_Approver.ExpRelWith;
        var vExpPaid = zdata.DO_EAF_Approver.ExpPaid;
    
        var uiAction = zdata.DO_EAF_Approver.UI_Action;
        dobeln = zdata.DO_EAF_Approver.DO_BELN;

        
        if(uiAction !== "2" || uiAction !== "3"){
        	
        	
        //Form Details
        that.getView().byId("ManExprequestOwner").setValue(vEFormDetails.RequestOwner);  
        that.getView().byId("ManExpdepartment").setValue(vEFormDetails.Department);   
        that.getView().byId("ManExptitle").setValue(vEFormDetails.Title);   
        that.getView().byId("ManExprequestNum").setValue(dobeln);   
        that.getView().byId("ManExprequestDate").setValue(vEFormDetails.RequestDate);   
        that.getView().byId("ManExprequestTime").setValue(vEFormDetails.RequestTime);  
        that.getView().byId("ManExpstatus").setValue("In-Progress"); 
        
        //Expense Details   
        that.getView().byId("ManExpCurrencyType").setValue(vExpenseDetails.CurrencyType); 
        that.getView().byId("ManExpCurrency").setValue(vExpenseDetails.Currency); 
        that.getView().byId("ManExpTotalAmount").setValue(vExpenseDetails.TotalAmount); 
        		//Expense List tablosunu almak icin begin of ycoskun
        var oJsonExpListModel = new sap.ui.model.json.JSONModel();
        oJsonExpListModel.setData(vExpenseDetails.ExpenseList.item);
		that.getView().setModel(oJsonExpListModel, "JExpModel");
		that.getView().byId("ManexpListTbl").setModel(that.getView().getModel("JExpModel"));	
        		//Expense List tablosunu almak icin end of ycoskun
        		
        
        //Expense Type   
        if(vExpRelWith === "Travel"){
        	that.getView().byId("ManExpRel-1").setSelected(true);
        }
        else{
        	that.getView().byId("ManExpRel-2").setSelected(true);
        }
        
        if(vExpPaid === "Corporate Credit Card"){
        	that.getView().byId("ManExpPaid-1").setSelected(true);
        }
        else{
        	that.getView().byId("ManExpPaid-2").setSelected(true);
        }
        
		
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
		/*var vStatu;
		if(aDataFlow.responseJSON.T_LOG.item.length === undefined){
			if(aDataFlow.responseJSON.T_LOG.item.OBJTY === -2){
				vStatu="Pending Approval";
			}
			else{
				
			}
			that.getView().byId("manBudUser").setText(aDataFlow.responseJSON.T_LOG.item.FNAME+" "+aDataFlow.responseJSON.T_LOG.item.LNAME);
    		that.getView().byId("manBudTitle").setText(aDataFlow.responseJSON.T_LOG.item.TITLE);
    		that.getView().byId("manBudDprt").setText(aDataFlow.responseJSON.T_LOG.item.DEPRT);
    		that.getView().byId("manBudEvnt").setText(aDataFlow.responseJSON.T_LOG.item.OBJTY);
    		that.getView().byId("manBudReqDate").setText(aDataFlow.responseJSON.T_LOG.item.DATUM+" "+aDataFlow.responseJSON.T_LOG.item.UZEIT);
			
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
    		this.getView().byId("ManBudgetFlowTbl").setModel(this.getView().getModel("oFlowModel"));
		}
		that.getView().byId("ManBudFlowRequestNum").setValue(dobeln);
		that.getView().byId("ManBudFlowRequestOwner").setValue(Head.requestOwner);
		that.getView().byId("ManBudFlowRequestType").setValue(Details.formType);
		that.getView().byId("ManBudFlowSubject").setValue(Details.subject);
		that.getView().byId("ManBudFlowStatus").setValue(vStatu);*/
		
		//flow içeriğinin doldurulması end of ycoskun
        }      
    	var oJsonAttachModel = new sap.ui.model.json.JSONModel();
		oJsonAttachModel.setData(aAttachData.responseJSON.E_ATTACHMENTS);
		that.getView().setModel(oJsonAttachModel, "oJsonAttachModel");
		this.getView().byId("idManAttachTableEx").setModel(this.getView().getModel("oJsonAttachModel"));
    		}
    		catch(err){
    			
    		}	        
		},	
		
		onAttachWatch: function(oEvent){
			 var bindingContext = oEvent.getSource().getBindingContext();
			  var preqNo = bindingContext.getProperty("FILENAME");
			  var preqName = bindingContext.getProperty("FILETYPE");
			  var aAttachDown = jQuery.ajax({
		            type : "GET",
		            contentType : "application/json",
		            url : "/RESTAdapter/b2b/getAttachment/"+preqNo+"&"+dobeln,
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
		selectFormType:function(){
			var that = this;
			oSelectedIndex = oEvent.getParameter("selectedIndex");  
			var oRadioButtonSrc = oEvent.getSource().getAggregation("buttons");  
			oSelectedRadioText = oRadioButtonSrc[oSelectedIndex].getText();
			
			if(oSelectedRadioText !== "Related Party"){
				that.getView().byId("ManidRelatedParty").setVisible(false);
				that.getView().byId("ManrelatedParty").setVisible(false);
				that.getView().byId("ManidBudget").setValue(budgetId);
				}
			else{
				that.getView().byId("ManidRelatedParty").setVisible(true);
				that.getView().byId("ManrelatedParty").setVisible(true);
				that.getView().byId("ManidBudget").setValue(budgetId);
			}

		
		},		
		approveAction : function (evt) {	
			var oHeaders;
			var oToken;
			var oTaskId = TaskInstanceID.slice(-32);
			var that = this;

			
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
			var oEntryData = {"ExpenseCompleteEventTypeOUTPUT": {"ExpenseCompleteEvent": zdata
			}};
			
		
				oEntryData.ExpenseCompleteEventTypeOUTPUT.ExpenseCompleteEvent.DO_EAF_Approver.UI_Action = "1";
			
			
			//end of 
			
			//ready durumundaki taskı reserved yapmak begin of 
			var tasksSvcURL = "/bpmodata/tasks.svc";
			var tasksODataModel = new sap.ui.model.odata.ODataModel(tasksSvcURL, false);
			tasksODataModel.create("/Claim?InstanceID='"+TaskInstanceID+"'", null);
			//end of
			
			
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

		        	sap.m.MessageToast.show("Successfully");
		        	// console.log(result);
		        	tasksODataModel.refresh(true);
		        	that.onInit();
		        	that.getOwnerComponent().getRouter().navTo("Home");
					window.location.reload();
		   
		        
		        }
		    });
		},
		
		rejectAction : function (evt) {
			var that = this;
			var username,password;
			var oHeaders;
			var oToken;
			var oTaskId = TaskInstanceID.slice(-32);

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
			var oEntryData = {"ExpenseCompleteEventTypeOUTPUT": {"ExpenseCompleteEvent": zdata
			}};
			
			oEntryData.ExpenseCompleteEventTypeOUTPUT.ExpenseCompleteEvent.DO_EAF_Approver.UI_Action = "0";
			//end of
			
			//ready durumundaki taskı reserved yapmak begin of 
			var tasksSvcURL = "/bpmodata/tasks.svc";
			var tasksODataModel = new sap.ui.model.odata.ODataModel(tasksSvcURL, false);
			tasksODataModel.create("/Claim?InstanceID='"+TaskInstanceID+"'", null);
			//end of
			
			
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
		        	sap.m.MessageToast.show("Successfully");
		        	// console.log(result);
		        	tasksODataModel.refresh(true);
		        	that.onInit();
		        	that.getOwnerComponent().getRouter().navTo("Home");
					window.location.reload();
		        
		        }
		    });
		},			
		onAfterRendering: function() {
			
		},
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
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
				oThat.byId("ManidBudget").setValue(budgetId);
			},10);
				
			
	
	
			
		},
		sendBackAction:function(){
			
			var vComment = sap.ui.getCore().byId("idComment").getValue();	
			var oHeaders;
			var oToken;
			var oTaskId = TaskInstanceID.slice(-32);
			var that = this;
	
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
			zdata.DO_EAF_Approver.FormDetails.Comment = vComment;
			var oEntryData = {"ExpenseCompleteEventTypeOUTPUT": {"ExpenseCompleteEvent": zdata
			}};		
			oEntryData.ExpenseCompleteEventTypeOUTPUT.ExpenseCompleteEvent.DO_EAF_Approver.UI_Action = "2";
			
			//end of
			
			//ready durumundaki taskı reserved yapmak begin of 
			var tasksSvcURL = "/bpmodata/tasks.svc";
			var tasksODataModel = new sap.ui.model.odata.ODataModel(tasksSvcURL, false);
			tasksODataModel.create("/Claim?InstanceID='"+TaskInstanceID+"'", null);
			//end of
			
			
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
		        	// console.log(result);
		        	var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
	    			MessageBox.success(
	    				"Form sended.",
	    				{
	    					styleClass: bCompact ? "sapUiSizeCompact" : ""
	    				}
	    			);
		        	tasksODataModel.refresh(true);
		        	that.onInit();
		        	that.getOwnerComponent().getRouter().navTo("Home");
					window.location.reload();
		        	
		        	
		        
		        }
		    });	
			 this.oCommentDialog.destroy();
				if (!this.oCommentDialog) {
					this.oCommentDialog = sap.ui.xmlfragment("zn11_form.view.Comment", this.getView().getController());

				}
				this.oCommentDialog.close();
		},
		onSendBackBtn:function(){
			if (!this.oCommentDialog) {
				this.oCommentDialog = sap.ui.xmlfragment("zn11_form.view.Comment", this);
			}

			this.oCommentDialog.open();

			},
		oCommentDialogClose : function() {		
			this.oCommentDialog.destroy();
			this.oCommentDialog = sap.ui.xmlfragment("zn11_form.view.Comment", this.getView().getController());
			
			this.oCommentDialog.close();
		},
		setInstallment:function(value){
			if (value) {
				var floatValue = parseFloat(value.toString().replace(/\D/g, '')).toFixed(2);
				return floatValue;
			
			} else {
				return value;
			}
		},
		TakeOpinionAction:function(){
			var that = this;
			var oHeaders;
			var oToken;
			
			var oTaskId = TaskInstanceID.slice(-32);
			
	
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
			
			zdata.DO_EAF_Approver.Opinion.OpSndPerNo = username ;
			zdata.DO_EAF_Approver.Opinion.OpSndComment = sap.ui.getCore().byId("idSendComment").getValue();
			zdata.DO_EAF_Approver.Opinion.OpRcvPerNo =  sap.ui.getCore().byId("idSendUser").getValue();
			zdata.DO_EAF_Approver.Opinion.OpRcvComment =  sap.ui.getCore().byId("idReceiveComment").getValue();
			//zdata formatını belirleme begin of
			var oEntryData = {"ExpenseCompleteEventTypeOUTPUT": {"ExpenseCompleteEvent": zdata
			}};
			
			oEntryData.ExpenseCompleteEventTypeOUTPUT.ExpenseCompleteEvent.DO_EAF_Approver.UI_Action = "3";
			//end of
			
			//ready durumundaki taskı reserved yapmak begin of 
			var tasksSvcURL = "/bpmodata/tasks.svc";
			var tasksODataModel = new sap.ui.model.odata.ODataModel(tasksSvcURL, false);
			tasksODataModel.create("/Claim?InstanceID='"+TaskInstanceID+"'", null);
			//end of
			
			
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
		        	var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
		        	MessageBox.success(
		    				"Form sended.",
		    				{
		    					styleClass: bCompact ? "sapUiSizeCompact" : ""
		    				}
		    			);
		        	// console.log(result);
		        	tasksODataModel.refresh(true);
		        	that.onInit();
		        	that.getOwnerComponent().getRouter().navTo("Home");
					window.location.reload();
		        
		        }
		    });
			 this.oCommentTakeODialog.destroy();
			 this.oCommentTakeODialog = sap.ui.xmlfragment("zn11_form.view.CommentTakeO", this.getView().getController());
			
			 this.oCommentTakeODialog.close();
		},
		onTakeOpinionBtn:function(){
	
			if (!this.oCommentTakeODialog) {
				this.oCommentTakeODialog = sap.ui.xmlfragment("zn11_form.view.CommentTakeO", this);
			}

			this.oCommentTakeODialog.open();

			},
		oCommentDialogTakeOClose : function() {		
			 this.oCommentTakeODialog.destroy();
			 this.oCommentTakeODialog = sap.ui.xmlfragment("zn11_form.view.CommentTakeO", this.getView().getController());
			
			 this.oCommentTakeODialog.close();
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
				else{
					return value;
				}
		},
		handleValueHelpSendUser: function() {
			
			var that = this;
			var vPersonelNo;
	;
			var jsonResult;
			var selectsUser=[];

			jQuery.ajax({
                type : "GET",
                contentType : "application/json",
                url : "/RESTAdapter/b2b/personelQuery",
                dataType : "json",
                headers: {"x-csrf-token": "Fetch",
					  "Authorization":"Basic "+btoa(username+":"+password)},
                async: false, 
                success : function(data,textStatus, jqXHR) {
                	
	            	oModel.setData({modelData : data}); 
	                // console.log(data);
	                
	                for(var i = 0; i < data.T_PERSONEL.item.length; i++) {                    
		                   var test = data.T_PERSONEL.item[i].PERSONEL_NO+" - "+data.T_PERSONEL.item[i].PERSONEL_ADI+" - "+data.T_PERSONEL.item[i].PERSONEL_SOYADI+" - "+data.T_PERSONEL.item[i].DEPARTMAN+" - "+data.T_PERSONEL.item[i].TITLE;
		                   jsonResult = {STRING: test};
		                    selectsUser.push(jsonResult);
		                    
		                		                    
		                 }	
	                
	    			// console.log(selectsUser);
	    			sendUserModel.setData(selectsUser);
                }

            });
    		
			var handleClose = function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					
					var title = oSelectedItem.getTitle();
					 var array = title.split(' - ');
					 vPersonelNo = array[0];
					sap.ui.getCore().byId("idSendUser").setValue(vPersonelNo);
				}
			};
			if (!this._valueHelpSelectUser) {
				this._valueHelpSelectUser = new sap.m.SelectDialog("valueHelpSelectUser", {
					title: "Users",
					items: {
						path: "/",
						sorter: "STRING",
						template: new sap.m.StandardListItem({
							title: "{STRING}",
							description: "",
							active: true
						})
					},
					search: function(oEvent) {
						
					},
					confirm: handleClose
				});
				this._valueHelpSelectUser.setModel(sendUserModel);

			} else {
				this._valueHelpSelectUser.setModel(sendUserModel);
			}
			this._valueHelpSelectUser.open();

			
			
		},
		editForm:function(){
				var that = this;
				that.getView().byId("ManbrExp").setEnabled(true);
			
			
		},
		onSendBackBtn:function(){
			if (!this.oCommentDialog) {
				this.oCommentDialog = sap.ui.xmlfragment("zn11_form.view.Comment", this);
			}

			this.oCommentDialog.open();

		},
		oCommentDialogClose : function() {		
			this.oCommentDialog.destroy();
			this.oCommentDialog = sap.ui.xmlfragment("zn11_form.view.Comment", this.getView().getController());
			
			this.oCommentDialog.close();
		}



	});

	return CController;

});