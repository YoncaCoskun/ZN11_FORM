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
	var dobeln;
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


	var CController = Controller.extend("zn11_form.controller.manBudget", {
		Formatter: Formatter,
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
			
			//belli kullanıcılarda br exp'in acık olması durumu begin of ycoskun
		      jQuery.ajax({
	                type : "GET",
	                contentType : "application/json",
	                url : "/RESTAdapter/b2b/personelQuery/"+username,
	                dataType : "json",
	                headers: {"x-csrf-token": "Fetch",
						  "Authorization":"Basic "+btoa(username+":"+password)},
	                async: false, 
	                success : function(data,textStatus, jqXHR) {
	                	if(data.T_PERSONEL.item.BAF_RELEASE === "06" || data.T_PERSONEL.item.BAF_RELEASE === "02"){
	                		 //edit etme begin of ycoskun
	                        //Installment table edit etme begin of ycoskun    
	                        that.getView().byId("ManInsTbl1").setVisible(false);
	                        that.getView().byId("ManmainViewTbl").setVisible(false);
	                        
	                        that.getView().byId("ManInsTbl2").setVisible(true);
	                        that.getView().byId("ManmainViewTbl2").setVisible(true);
	                        //Installment table edit etme end of ycoskun
	                        
	                        
	                        that.getView().byId("ManperiodEnd").setEnabled(true);
	                        that.getView().byId("ManperiodStart").setEnabled(true);
	                        that.getView().byId("Mansupplier").setEnabled(true);
	                        that.getView().byId("Mansubject").setEnabled(true);  
	                        that.getView().byId("ManidBudget").setEnabled(true);

	                        that.getView().byId("ManremBudget").setEnabled(true);
	                        that.getView().byId("Manpurpose").setEnabled(true);
	                        that.getView().byId("Manexplanation").setEnabled(true);
	                        that.getView().byId("ManbrExp").setEnabled(true);
	                        
	                        //that.getView().byId("ManCurrencyType").setValue(Amount.CurrencyType);
	                        that.getView().byId("Mancurrency").setEnabled(true);
	                        that.getView().byId("MantotalAmount").setEnabled(true);
	                      
	                        that.getView().byId("ManidTotalAmount").setEnabled(true);
	                        that.getView().byId("MantotalCurrAmount").setEnabled(true);
	                	
	                        that.getView().byId("ManCurrencyType").setEnabled(true);
	                        
	                        that.getView().byId("RB3-1").setEnabled(true);
	                        that.getView().byId("RB3-2").setEnabled(true);
	                        that.getView().byId("RB3-3").setEnabled(true);
	                        that.getView().byId("RB3-4").setEnabled(true);
	                        that.getView().byId("RB3-5").setEnabled(true);
	                        that.getView().byId("RB3-6").setEnabled(true);
	                        that.getView().byId("RB3-7").setEnabled(true);
	                        
	                        that.getView().byId("ManLabelBudget").setVisible(false);
	                        that.getView().byId("ManidBudget").setVisible(false);
	                        that.getView().byId("ManLabelBudgetSelect").setVisible(true);
	                        that.getView().byId("ManidBudgetSel").setVisible(true);
	                       // that.getView().byId("ReidBudget").setSelected('2').setSelectedKey('4633');

	                        //that.getView().byId("ManLabelBudget").setVisible(true);
	                       // that.getView().byId("ManLabelBudgetSelect").setEnabled(true);
	                        that.getView().byId("ManidBudgetSel").setEnabled(true);
	                    	setTimeout(function(){
	            				that.byId("ManidBudget").setValue(selectBudgetId);
	            			},10);
	                    	
	                    	 //that.getView().byId("ManLabelCurr").setVisible(false);
	                         that.getView().byId("ManCurrencyType").setVisible(false);
	                     	that.getView().byId("ManCurrencyTypeLbl").setVisible(false);
	                     	that.getView().byId("MancurrencyCurr").setVisible(false); 
	                  
	                         that.getView().byId("ManSelectInputCurr").setVisible(true);
	                         that.getView().byId("ManSelectCurrencyType").setVisible(true);
	                         that.getView().byId("ManSelectCurrencyType").setEnabled(true);
	                         that.getView().byId("Mancurrency").setVisible(true);
	                         //that.getView().byId("ManSelectCurrencyType").setVisible(true);
	                         //that.getView().byId("MancurrencyV2").setVisible(true);
	                         
	                         that.getView().byId("ReSelectCurrencyType").setEnabled(true);
	                     	/*setTimeout(function(){
	             				that.byId("ManSelectInputCurr").setValue(selectCurr);
	             				that.byId("MancurrencyCurr").setValue(selectCurrNum);
	             			},10);*/
	                        
	                     	
	                     	that.getView().byId("ManrelatedParty").setVisible(false);
	                     	that.getView().byId("MarelatedParty").setVisible(false);
	                     	
	                     
	                    	
	                     	
	                    	
	 
	                	}
	                	
	                }

	            });			
		  	//belli kullanıcılarda br exp'in acık olması durumu end of ycoskun

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
                url : "/bpmodata/taskdata.svc/"+ TaskInstanceID +"/InputData('"+ TaskInstanceID +"')?$format=json&$expand=startTypeINPUT/start/DO_BudgetApproval/Installments/row,startTypeINPUT/start/DO_BudgetApproval/Head,startTypeINPUT/start/DO_BudgetApproval/Details,startTypeINPUT/start/DO_BudgetApproval/Amount,startTypeINPUT/start/DO_BudgetApproval/Attachments,startTypeINPUT/start/DO_BudgetApproval/Opinion",
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
        var Amount = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Amount;
        var Head = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Head;
        var Details = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Details;
        var Installments = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Installments;
        
        
        var uiAction = startTypeINPUT.responseJSON.d.startTypeINPUT.start.UIAction;
        dobeln = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BELN;
        
        if(uiAction !== "2" || uiAction !== "3"){
        that.getView().byId("ManrequestOwner").setValue(Head.requestOwner);
        that.getView().byId("Mandepartment").setValue(Head.department);
        that.getView().byId("Mantitle").setValue(Head.title);
        that.getView().byId("ManrequestNum").setValue(dobeln);
        that.getView().byId("ManrequestDate").setValue(Head.requestDate);
        that.getView().byId("ManrequestTime").setValue(Head.requestTime);
        //that.getView().byId("Manstatus").setValue(Head.status); status doldurulmalı
        
        
        that.getView().byId("ManperiodEnd").setValue(Details.periodEnd);
        that.getView().byId("ManperiodStart").setValue(Details.periodStart);
        that.getView().byId("Mansupplier").setValue(Details.supplier);
        that.getView().byId("Mansubject").setValue(Details.subject);     
        that.getView().byId("ManidBudget").setValue(Details.Budget);
	
        that.getView().byId("ManidDepartment").setValue(Details.Department);
        that.getView().byId("ManidType").setValue(Details.Type);
        that.getView().byId("ManidDesc").setValue(Details.Desc);
        that.getView().byId("ManidSubDesc").setValue(Details.SubDesc);
        that.getView().byId("ManremBudget").setValue(Details.remBudget);
        that.getView().byId("Manpurpose").setValue(Details.purpose);
        that.getView().byId("Manexplanation").setValue(Details.explanation);
        that.getView().byId("ManbrExp").setValue(Details.brExp);
        
        //that.getView().byId("ManCurrencyType").setValue(Amount.CurrencyType);
        that.getView().byId("Mancurrency").setValue(Amount.Currency);
        
        if(Details.relatedParty !== ""){
        	that.getView().byId("ManrelatedParty").setVisible(true);
        	that.getView().byId("MarelatedParty").setVisible(true);
        	that.getView().byId("MarelatedParty").setEnabled(false);
        	that.getView().byId("MarelatedParty").setValue(Details.relatedParty);
        }
        else{
        	that.getView().byId("ManrelatedParty").setVisible(false);
        	that.getView().byId("MarelatedParty").setVisible(false);
        	that.getView().byId("MarelatedParty").setEnabled(true);
        }
      
        if(Details.formType === "Donation"){
        	that.getView().byId("RB3-2").setSelected(true);
        }
        else if(Details.formType === "Related Party"){
        	that.getView().byId("RB3-1").setSelected(true);
        }
        else if(Details.formType === "Domestic Education"){
        	that.getView().byId("RB3-3").setSelected(true);
        }
        else if(Details.formType === "Abroad Education"){
        	that.getView().byId("RB3-4").setSelected(true);
        }
        else if(Details.formType === "Oversea Business Trip"){
        	that.getView().byId("RB3-5").setSelected(true);
        }
        else if(Details.formType === "Domestic Business Trip"){
        	that.getView().byId("RB3-6").setSelected(true);
        }
        else if(Details.formType === "Others"){
        	that.getView().byId("RB3-7").setSelected(true);
        }
        
//        var floatTotalAmount = parseFloat(Amount.totalAmount.toString().replace(/\D/g, '')).toFixed(2);
//        var floatIdTotalAmount = parseFloat(Amount.totalAmount.toString().replace(/\D/g, '')).toFixed(2);
//        var floatTotalCurrAmount = Amount.totalAmountTRY.toString();
		
		var vfloatTotalCurrAmount = parseFloat(Amount.totalAmountTRY) * parseFloat(Amount.Currency);
		vfloatTotalCurrAmount = vfloatTotalCurrAmount.toString().replace(".","")
		var floatTotalCurrAmount = parseFloat(vfloatTotalCurrAmount).toFixed(2)
	       .replace(".", ",") 
	       .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        
        that.getView().byId("MantotalAmount").setValue(Formatter.setInstallment(Amount.totalAmount));
        that.getView().byId("ManidTotalAmount").setValue(Formatter.setInstallment(Amount.totalAmount));
        that.getView().byId("MantotalCurrAmount").setValue(floatTotalCurrAmount);
        that.getView().byId("MancurrencyCurr").setValue(Amount.Currency);
        that.getView().byId("ManCurrencyType").setValue(Amount.CurrencyType);
        //that.getView().byId("ManidBudget").setSelectedKey(2);;

		var oJsonModel = new sap.ui.model.json.JSONModel();
		oJsonModel.setData(Installments.row);
		// console.log(Installments.row.results);
		that.getView().setModel(oJsonModel, "JModel");
		this.getView().byId("ManmainViewTbl").setModel(this.getView().getModel("JModel"));
		
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
			that.getView().byId("ManBudgetFlowTbl2").setVisible(true);
			that.getView().byId("ManBudgetFlowTbl").setVisible(false);
			if(aDataFlow.responseJSON.T_LOG.item.OBJTY === -2){
				vStatu="Pending Approval";
			}
			if(aDataFlow.responseJSON.T_LOG.item.OBJTY === -1){
				vStatu="Request Owner";
			}
			else{
				
			}
			that.getView().byId("manBudUserId").setText(aDataFlow.responseJSON.T_LOG.item.PERNR);
			that.getView().byId("manBudUser").setText(aDataFlow.responseJSON.T_LOG.item.FNAME+" "+aDataFlow.responseJSON.T_LOG.item.LNAME);
    		that.getView().byId("manBudTitle").setText(aDataFlow.responseJSON.T_LOG.item.TITLE);
    		that.getView().byId("manBudDprt").setText(aDataFlow.responseJSON.T_LOG.item.DEPRT);
    		that.getView().byId("manBudEvnt").setText(vStatu);
    		that.getView().byId("manBudReqDate").setText(aDataFlow.responseJSON.T_LOG.item.DATUM+" "+aDataFlow.responseJSON.T_LOG.item.UZEIT);
			
		}
		else{
			that.getView().byId("ManBudgetFlowTbl2").setVisible(false);
			that.getView().byId("ManBudgetFlowTbl").setVisible(true);
			if(aDataFlow.responseJSON.T_LOG.item[aDataFlow.responseJSON.T_LOG.item.length-1].OBJTY === -2){
				vStatu="Pending Approval";
			}
			if(aDataFlow.responseJSON.T_LOG.item[aDataFlow.responseJSON.T_LOG.item.length-1].OBJTY === -1){
				vStatu="Request Owner";
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
		that.getView().byId("ManBudFlowStatus").setValue(vStatu);
		//flow içeriğinin doldurulması end of ycoskun
        }
        
  	  
    		
    		var aAttachData = jQuery.ajax({
                type : "GET",
                contentType : "application/json",
                url : "/RESTAdapter/b2b/getAttachment/*&"+dobeln,
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
			var oEntryData = {"PersonelCompleteEventTypeOUTPUT": {"PersonelCompleteEvent": zdata
			}};
			
			if(vUIAction === "4"){
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.UIAction = "4";
					//Budget Details
				/*oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.periodStart = sTarih;
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.periodEnd = eTarih;
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.supplier = that.getView().byId("supplier").getValue();
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.supplierId = that.getView().byId("idSuppVis").getValue();
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.subject = that.getView().byId("subject").getValue();
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.Budget = budgetId;
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.Department = that.getView().byId("idDepartment").getValue();
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.Type = that.getView().byId("idType").getValue();
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.Desc = that.getView().byId("idDesc").getValue();
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.SubDesc = that.getView().byId("idSubDesc").getValue();
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.remBudget = that.getView().byId("remBudget").getValue();
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.purpose = that.getView().byId("purpose").getValue();
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.explanation = that.getView().byId("explanation").getValue();
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.formType = oSelectedFormType;
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.DO_BudgetApproval.Details.brExp = that.getView().byId("brExp").getValue();		*/
					//Budget Amount
	
			}
			else{
				oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.UIAction = "1";
			}
			
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
			var oEntryData = {"PersonelCompleteEventTypeOUTPUT": {"PersonelCompleteEvent": zdata
			}};
			
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.UIAction = "0";
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
		onPdfExport: function() {
			//var oURL = "/RESTAdapter/BudgetApproval/Attachment";
			var doc;
				
			 html2canvas($('#__panel1'), {
		            onrendered: function(canvas) { 
		                 imgData = canvas.toDataURL(
		                    'application/pdf');     
		                 doc = new jsPDF('1', 'mm', [242, 700]);
		                doc.addImage(imgData, 'PNG',  0, 0);
		                doc.save('doc.pdf');
		            }
		        });
			 
			/* setTimeout(function(){				
			 var FileData = {"MT_UI_BudgetApproval_Attachment": {
			        "FileContent": imgData,
			        "FileName": "doc.png"
			    }}
				
			 jQuery.ajax({
			        type: 'POST',
			        url: oURL,
			        data: JSON.stringify(FileData),
			        dataType: "json",
			        headers: {
		                "Content-Type": "application/json"              	
		            },
			        success: function(result) {
			        	alert("Success");
			        }
			    });
			 },1000);*/
			 
		},			
		setFormat:function(value){
			if (value) {
				/*var array = value.split('@');
				budgetId = array[0];
				department = array[1];
				type = array[2];
				desc = array[3];
				subDesc = array[4];*/
				//var array = value.split('@');
				//budgetID = array[0];
				return value;
			
			} else {
				return value;
			}
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

			// 			var oModel = new JSONModel(jQuery.sap.getModulePath("zn11_form/mockserver", "/Products.json"));
			// 			this.getView().setModel(oModel);

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
				oThat.byId("ManidBudget").setValue(budgetId);
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
					
			
			
			oThat.getView().byId("ManidDepartment").setValue(department);
			oThat.getView().byId("ManidType").setValue(type);
			oThat.getView().byId("ManidDesc").setValue(desc);
			oThat.getView().byId("ManidSubDesc").setValue(subDesc);
			
			
			setTimeout(function(){
				oThat.byId("ManidBudget").setValue(budgetId);
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
	    		
	    		 oThat.getView().byId('ManremBudget').setValue(remData);
				
				//end of ycoskun
				
			}catch(err){
				
			}	
			//end of budget id ye bağlı rem amount cekme
	
	
			
		},
		handleValueHelpSupplier: function() {
			var that = this;
			var supplier;
			var handleClose = function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					
					var title = oSelectedItem.getTitle();
					 var array = title.split('@');
					 supplier = array[0];
					that.getView().byId("Mansupplier").setValue(supplier);
					//that.additionalInfoValidation();
				}
			};
			if (!this._valueHelpSelectDialogOkulAd) {
				this._valueHelpSelectDialogOkulAd = new sap.m.SelectDialog("valueHelpSelectDialogOkulAd", {
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
					                   searchSupp.push(text);
					                   // selectId.push(budgetId);
					                    
					                    
					                 }
					               
				    			// console.log(searchSupp);
				    			searchModel.setData(searchSupp);
				    			that._valueHelpSelectDialogOkulAd.setModel(searchModel);
				                
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
				this._valueHelpSelectDialogOkulAd.setModel(supplierModel);

			} else {
				this._valueHelpSelectDialogOkulAd.setModel(supplierModel);
			}
			this._valueHelpSelectDialogOkulAd.open();

			
			
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
			zdata.DO_BudgetApproval.Details.comment = vComment;
			var oEntryData = {"PersonelCompleteEventTypeOUTPUT": {"PersonelCompleteEvent": zdata
			}};		
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.UIAction = "2";
			
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
//		setInstallment:function(value){
//			if (value) {
//				var floatValue = parseFloat(value.toString().replace(/\D/g, '')).toFixed(2);
//				return floatValue;
//			
//			} else {
//				return value;
//			}
//		},
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
			
			zdata.DO_BudgetApproval.Opinion.OpSndPerNo = username ;
			zdata.DO_BudgetApproval.Opinion.OpSndComment = sap.ui.getCore().byId("idSendComment").getValue();
			zdata.DO_BudgetApproval.Opinion.OpRcvPerNo =  sap.ui.getCore().byId("idSendUser").getValue();
			zdata.DO_BudgetApproval.Opinion.OpRcvComment =  sap.ui.getCore().byId("idReceiveComment").getValue();
			//zdata formatını belirleme begin of
			var oEntryData = {"PersonelCompleteEventTypeOUTPUT": {"PersonelCompleteEvent": zdata
			}};
			
			oEntryData.PersonelCompleteEventTypeOUTPUT.PersonelCompleteEvent.UIAction = "3";
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
			
			
		}



	});

	return CController;

});