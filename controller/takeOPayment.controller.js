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
      var oInstallmentsTblRePay = [];
      var relModel = new sap.ui.model.json.JSONModel();
      var selectsRel = [];
      
      var vOpSndPerNo;
      var vOpSndComment;
      var vOpRcvPerNo;
      var vOpRcvComment;
      
      var twoEntry = [];
      var oModel = new sap.ui.model.json.JSONModel();
      var sKur;
      var selectItem;
      var imgData = "";
      var zdata = [];
      var comment;
      var selectsSupp = [];
      var selectsRel = [];
      var RelatedBudgetTbl= [];
      
      var vOpSndPerNo;
      var vOpSndComment;
      var vOpRcvPerNo;
      var vOpRcvComment;

      var unamePas;
      var arrayUserPas;
      var username;
      var password;
      
      var UIACTION;



      var CController = Controller.extend("zn11_form.controller.takeOPayment", {
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
                url : "/bpmodata/taskdata.svc/"+TaskInstanceID+"/InputData('"+TaskInstanceID+"')?$format=json&$expand=startTypeINPUT/start/DO_PaymentApproval/InvoiceDetails,startTypeINPUT/start/DO_PaymentApproval/FormDetails,startTypeINPUT/start/DO_PaymentApproval/VendorDetails,startTypeINPUT/start/DO_PaymentApproval/PaymentDetails/Installment,startTypeINPUT/start/DO_PaymentApproval/BudgetApprovalForm/RelatedBudgetNo,startTypeINPUT/start/DO_PaymentApproval/Attachments,startTypeINPUT/start/DO_PaymentApproval/Opinion",
                dataType : "json",
                async: false, 
                success : function(data,textStatus, jqXHR) {
      
                        var oODataJSONModel = new sap.ui.model.json.JSONModel(data);

                }

            });
            zdata = startTypeINPUT.responseJSON.d.startTypeINPUT.start;

            
            var Attachments = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.Attachments;
            var BudgetApprovalForm = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.BudgetApprovalForm;
            var FormDetails = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.FormDetails;
            var InvoiceDetails = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.InvoiceDetails;
            var PaymentDetails = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.PaymentDetails;
            var VendorDetails = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.VendorDetails;
            var Opinion = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.Opinion;
            vOpSndPerNo = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.Opinion.OpSndPerNo;
            vOpSndComment = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.Opinion.OpSndComment;
            vOpRcvPerNo = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.Opinion.OpRcvPerNo;
            vOpRcvComment = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.Opinion.OpRcvComment;

            
            var uiAction = zdata.DO_PaymentApproval.uiAction;
            UIACTION = uiAction;
            comment = zdata.DO_PaymentApproval.comment;
            var dobeln = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.FormDetails.requestNumber;
        
        if(uiAction === "3"){
            //Form Details
            that.getView().byId("TakeOPayrequestOwner").setValue(FormDetails.requestOwner);
            that.getView().byId("TakeOPaydepartment").setValue(FormDetails.department);
            that.getView().byId("TakeOPaytitle").setValue(FormDetails.title);
            that.getView().byId("TakeOPayrequestDate").setValue(FormDetails.requestDate);
            that.getView().byId("TakeOPayrequestTime").setValue(FormDetails.requestTime);
            that.getView().byId("TakeOPayrequestNum").setValue(FormDetails.requestNumber);
            that.getView().byId("TakeOPayFormType").setValue(FormDetails.paymentFormType);
            
                  //Invoice Details
            that.getView().byId("TakeOPayInvoiceDate").setValue(InvoiceDetails.invoiceDate);
            that.getView().byId("TakeOPayExpiryDate").setValue(InvoiceDetails.expiryDate);
            that.getView().byId("TakeOPayCurrencyType").setValue(InvoiceDetails.currencyType);
            that.getView().byId("TakeOPayCurrency").setValue(InvoiceDetails.currency);
            that.getView().byId("TakeOPayInvoiceNum").setValue(InvoiceDetails.invoiceNumber);
            
                  //Budget Approval Form
            var JBafModel = new sap.ui.model.json.JSONModel();
            JBafModel.setData(BudgetApprovalForm.RelatedBudgetNo);
            that.getView().setModel(JBafModel, "JBafModel");
      that.getView().byId("TakeOPayBafidTable").setModel(that.getView().getModel("JBafModel"));
            
            
           that.getView().byId("TakeOPayTotalAmount").setValue(BudgetApprovalForm.totalAmount);       
            //that.getView().byId("ManrequestDate").setValue(BudgetApprovalForm.Document);
            
                  //VendorDetails
           that.getView().byId("TakeOPayVenName").setValue(VendorDetails.vendorNr+" - "+VendorDetails.vendorName);
           that.getView().byId("TakeOPayVenAdd").setValue(VendorDetails.vendorAddress);
           that.getView().byId("TakeOPayVenTC").setValue(VendorDetails.vendorVKN);
           that.getView().byId("TakeOPayVenPhone").setValue(VendorDetails.vendorPhone);
           that.getView().byId("TakeOPayConPer").setValue(VendorDetails.vendorContact);     
           that.getView().byId("TakeOPayVenMail").setValue(VendorDetails.vendorMail);
           that.getView().byId("TakeOPayBankName").setValue(VendorDetails.bankName);
           that.getView().byId("TakeOPayIBAN").setValue(VendorDetails.IBAN);
           
            //Payment Details
           that.getView().byId("TakeOPayType").setValue(PaymentDetails.type);
           that.getView().byId("TakeOPaySubject").setValue(PaymentDetails.subject);
           //that.getView().byId("ManPaymentType").setValue(PaymentDetails.paymentType);
         
           var oJsonInstallmentModel = new sap.ui.model.json.JSONModel();
            oJsonInstallmentModel.setData(PaymentDetails.Installment);
            that.getView().setModel(oJsonInstallmentModel, "JInstallmentModel");
      that.getView().byId("TakeOPayInstallementTbl").setModel(that.getView().getModel("JInstallmentModel"));
            
            
             that.getView().byId("TakeOPayInsAmount").setValue(PaymentDetails.installmentAmount);
           that.getView().byId("TakeOPayComment").setValue(PaymentDetails.comment);
           that.getView().byId("TakeOidPayAmount").setValue(PaymentDetails.paymentAmount);
           that.getView().byId("TakeOPayidVatAmount").setValue(PaymentDetails.vatBudgetAmount);
           that.getView().byId("TakeOPayidTax").setValue(PaymentDetails.withholdingTax);
           that.getView().byId("TakeOPayidVatIncAmount").setValue(PaymentDetails.vatIncAmount);
           that.getView().byId("TakeOPayAdvanceInf").setValue(PaymentDetails.advanceInformation);     
           that.getView().byId("TakeOPayAdvAmount").setValue(PaymentDetails.advanceAmount);
           that.getView().byId("TakeOPayNetAmount").setValue(PaymentDetails.netPaymentAmount);
           
           that.getView().byId("idApproveBtnTO").setVisible(false);
           that.getView().byId("idSendBackBtnTO").setVisible(false);
           that.getView().byId("idTakeBtnTO").setVisible(false);
           that.getView().byId("idCancelBtnTO").setVisible(false);
           
           that.getView().byId("idApproveBtnT").setVisible(false);
           that.getView().byId("idSendBackBtnT").setVisible(false);
           that.getView().byId("idTakeBtnT").setVisible(false);
           that.getView().byId("idCancelBtnT").setVisible(false);
           
           
           
        }
        if(uiAction === "7"){
            //Form Details
            that.getView().byId("TakeOPayrequestOwner").setValue(FormDetails.requestOwner);
            that.getView().byId("TakeOPaydepartment").setValue(FormDetails.department);
            that.getView().byId("TakeOPaytitle").setValue(FormDetails.title);
            that.getView().byId("TakeOPayrequestDate").setValue(FormDetails.requestDate);
            that.getView().byId("TakeOPayrequestTime").setValue(FormDetails.requestTime);
            that.getView().byId("TakeOPayrequestNum").setValue(FormDetails.requestNumber);
            that.getView().byId("TakeOPayFormType").setValue(FormDetails.paymentFormType);
            
                  //Invoice Details
            that.getView().byId("TakeOPayInvoiceDate").setValue(InvoiceDetails.invoiceDate);
            that.getView().byId("TakeOPayExpiryDate").setValue(InvoiceDetails.expiryDate);
            that.getView().byId("TakeOPayCurrencyType").setValue(InvoiceDetails.currencyType);
            that.getView().byId("TakeOPayCurrency").setValue(InvoiceDetails.currency);
            that.getView().byId("TakeOPayInvoiceNum").setValue(InvoiceDetails.invoiceNumber);
            
                  //Budget Approval Form
            var JBafModel = new sap.ui.model.json.JSONModel();
            JBafModel.setData(BudgetApprovalForm.RelatedBudgetNo);
            that.getView().setModel(JBafModel, "JBafModel");
      that.getView().byId("TakeOPayBafidTable").setModel(that.getView().getModel("JBafModel"));
            
            
           that.getView().byId("TakeOPayTotalAmount").setValue(BudgetApprovalForm.totalAmount);       
            //that.getView().byId("ManrequestDate").setValue(BudgetApprovalForm.Document);
            
                  //VendorDetails
           that.getView().byId("TakeOPayVenName").setValue(VendorDetails.vendorNr+" - "+VendorDetails.vendorName);
           that.getView().byId("TakeOPayVenAdd").setValue(VendorDetails.vendorAddress);
           that.getView().byId("TakeOPayVenTC").setValue(VendorDetails.vendorVKN);
           that.getView().byId("TakeOPayVenPhone").setValue(VendorDetails.vendorPhone);
           that.getView().byId("TakeOPayConPer").setValue(VendorDetails.vendorContact);     
           that.getView().byId("TakeOPayVenMail").setValue(VendorDetails.vendorMail);
           that.getView().byId("TakeOPayBankName").setValue(VendorDetails.bankName);
           that.getView().byId("TakeOPayIBAN").setValue(VendorDetails.IBAN);
           
            //Payment Details
           that.getView().byId("TakeOPayType").setValue(PaymentDetails.type);
           that.getView().byId("TakeOPaySubject").setValue(PaymentDetails.subject);
           //that.getView().byId("ManPaymentType").setValue(PaymentDetails.paymentType);
         
           var oJsonInstallmentModel = new sap.ui.model.json.JSONModel();
            oJsonInstallmentModel.setData(PaymentDetails.Installment);
            that.getView().setModel(oJsonInstallmentModel, "JInstallmentModel");
      that.getView().byId("TakeOPayInstallementTbl").setModel(that.getView().getModel("JInstallmentModel"));
            
            
             that.getView().byId("TakeOPayInsAmount").setValue(PaymentDetails.installmentAmount);
           that.getView().byId("TakeOPayComment").setValue(PaymentDetails.comment);
           that.getView().byId("TakeOidPayAmount").setValue(PaymentDetails.paymentAmount);
           that.getView().byId("TakeOPayidVatAmount").setValue(PaymentDetails.vatBudgetAmount);
           that.getView().byId("TakeOPayidTax").setValue(PaymentDetails.withholdingTax);
           that.getView().byId("TakeOPayidVatIncAmount").setValue(PaymentDetails.vatIncAmount);
           that.getView().byId("TakeOPayAdvanceInf").setValue(PaymentDetails.advanceInformation);     
           that.getView().byId("TakeOPayAdvAmount").setValue(PaymentDetails.advanceAmount);
           that.getView().byId("TakeOPayNetAmount").setValue(PaymentDetails.netPaymentAmount);
           
           that.getView().byId("idApproveBtnTO").setVisible(true);
           that.getView().byId("idSendBackBtnTO").setVisible(true);
           that.getView().byId("idTakeBtnTO").setVisible(true);
           that.getView().byId("idCancelBtnTO").setVisible(true);

           that.getView().byId("idApproveBtnT").setVisible(true);
           that.getView().byId("idSendBackBtnT").setVisible(true);
           that.getView().byId("idTakeBtnT").setVisible(true);
           that.getView().byId("idCancelBtnT").setVisible(true);
           
           
           
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
        var vStatu;
        if(aDataFlow.responseJSON.T_LOG.item.length === undefined){
              if(aDataFlow.responseJSON.T_LOG.item.OBJTY === -2){
                    vStatu="Pending Approval";
              }
              else{
                    
              }
            that.getView().byId("takeOPayUser").setText(aDataFlow.responseJSON.T_LOG.item.FNAME+" "+aDataFlow.responseJSON.T_LOG.item.LNAME);
           that.getView().byId("takeOPayTitle").setText(aDataFlow.responseJSON.T_LOG.item.TITLE);
            that.getView().byId("takeOPayDprt").setText(aDataFlow.responseJSON.T_LOG.item.DEPRT);
            that.getView().byId("takeOPayEvnt").setText(aDataFlow.responseJSON.T_LOG.item.OBJTY);
        that.getView().byId("takeOPayReqDate").setText(aDataFlow.responseJSON.T_LOG.item.DATUM+" "+aDataFlow.responseJSON.T_LOG.item.UZEIT);
              
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
        this.getView().byId("TakeOPaymentFlowTbl").setModel(this.getView().getModel("oFlowModel"));
        }
        that.getView().byId("TakeOPayFlowRequestNum").setValue(dobeln);
        that.getView().byId("TakeOPayFlowRequestOwner").setValue(FormDetails.requestOwner);
        that.getView().byId("TakeOPayFlowRequestType").setValue(FormDetails.formType);
        that.getView().byId("TakeOPayFlowSubject").setValue(FormDetails.subject);
        that.getView().byId("TakeOPayFlowStatus").setValue(vStatu);
        //flow içeriğinin doldurulması end of ycoskun
            }
            catch(err){
                  
            }     
      
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
            approveAction : function (evt) {
                  

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
                  var oEntryData = {"PaymentCompleteEventTypeOUTPUT": {"PaymentCompleteEvent": zdata
                  }};
                  
                  
            oEntryData.PaymentCompleteEventTypeOUTPUT.PaymentCompleteEvent.DO_PaymentApproval.uiAction = "1";
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
                        
                        alert("success");
                        // console.log(result);
                        
                    
                    }
                });
            },
            rejectAction : function (evt) {
                  

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
                  var oEntryData = {"PaymentCompleteEventTypeOUTPUT": {"PaymentCompleteEvent": zdata
                  }};
                  
            oEntryData.PaymentCompleteEventTypeOUTPUT.PaymentCompleteEvent.DO_PaymentApproval.uiAction = "0";
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
                        
                        alert("success");
                        // console.log(result);
                        
                    
                    }
                });
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
                  zdata.DO_PaymentApproval.comment = vComment;
                  var oEntryData = {"PaymentCompleteEventTypeOUTPUT": {"PaymentCompleteEvent": zdata
                  }};         
            oEntryData.PaymentCompleteEventTypeOUTPUT.PaymentCompleteEvent.DO_PaymentApproval.uiAction = "2";
                  
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
            oCommentDialogClose : function() {        
                  this.oCommentDialog.destroy();
                  this.oCommentDialog = sap.ui.xmlfragment("zn11_form.view.Comment", this.getView().getController());
                  
                  this.oCommentDialog.close();
            },
            onSendBackBtn:function(){
                  if (!this.oCommentDialog) {
                        this.oCommentDialog = sap.ui.xmlfragment("zn11_form.view.Comment", this);
                  }

                  this.oCommentDialog.open();

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
                                    /*    * * * * * * * * * * * * * * * To Fetch CSRF Token * * * * * * * * * * * * * * * * * * * /
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
                  var oEntryData = {"PaymentCompleteEventTypeOUTPUT": {"PaymentCompleteEvent": zdata
                  }};

                  
            oEntryData.PaymentCompleteEventTypeOUTPUT.PaymentCompleteEvent.DO_PaymentApproval.uiAction = "1";
                  
               
      
      
                  
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

                        alert("success");
                        // console.log(result);
                        tasksODataModel.refresh(true);
                        that.onInit();
                        that.getOwnerComponent().getRouter().navTo("Home");
                              window.location.reload();
            
               
                    
                    }
                });
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
                  
                  var that = this;
                  
                  //that.getView().byId("idSendUserTakeO").setValue(vOpRcvPerNo); CommentLastTakeO
                  //that.getView().byId("idSendUserTakeO").setValue(idReceiveCommentTakeO);
                  
                  if(UIACTION === "3"){
                        if (!this.oCommentTakeODialog) {
                              this.oCommentTakeODialog = sap.ui.xmlfragment("zn11_form.view.CommentRcvTakeO", this);
                        }
                        //that.getView().byId("idSendUserTakeO").setValue(vOpSndPerNo);
                        sap.ui.getCore().byId("idSendUserTakeO").setValue(vOpSndPerNo);
                        sap.ui.getCore().byId("idSendCommentTakeO").setValue(vOpSndComment);
                        if(vOpRcvComment !== ""){
                              sap.ui.getCore().byId("idReceiveCommentTakeO").setValue(vOpRcvComment);
                              sap.ui.getCore().byId("idReceiveCommentTakeO").setEnabled(false);
                        }
                        
                        
                        this.oCommentTakeODialog.open();
                        
                  }
                  if(UIACTION === "7"){
                        if (!this.oCommentTakeOLastDialog) {
                              this.oCommentTakeOLastDialog = sap.ui.xmlfragment("zn11_form.view.CommentLastTakeO", this);
                        }
                        //that.getView().byId("idSendUserTakeO").setValue(vOpSndPerNo);
                        sap.ui.getCore().byId("idSendUserTakeOLast").setValue(vOpSndPerNo);
                        sap.ui.getCore().byId("idSendCommentTakeOLast").setValue(vOpSndComment);
                        if(vOpRcvComment !== ""){
                              sap.ui.getCore().byId("idReceiveCommentTakeOLast").setValue(vOpRcvComment);
                              sap.ui.getCore().byId("idReceiveCommentTakeOLast").setEnabled(false);
                        }
                        
                        
                        this.oCommentTakeOLastDialog.open();
                        
                  }
                  
            
      
                  
                  
            },
            oCommentDialogRcvTakeOLastClose:function(){
                  this.oCommentTakeODialog.destroy();
                  this.oCommentTakeODialog = sap.ui.xmlfragment("zn11_form.view.CommentLastTakeO", this.getView().getController());
                  
                  this.oCommentTakeODialog.close();
            },
            oCommentDialogRcvTakeOClose : function() {            
                  this.oCommentTakeODialog.destroy();
                  this.oCommentTakeODialog = sap.ui.xmlfragment("zn11_form.view.CommentRcvTakeO", this.getView().getController());
                  
                  this.oCommentTakeODialog.close();
            },
            editForm:function(oEvent){
                  
            
            var that = this; 
            
          //Form Details
           /* that.getView().byId("RePayrequestOwner").setEnabled(true);
            that.getView().byId("RePaydepartment").setEnabled(true);
            that.getView().byId("RePaytitle").setEnabled(true);
            that.getView().byId("RePayrequestDate").setEnabled(true);
            that.getView().byId("RePayrequestTime").setEnabled(true);
            that.getView().byId("RePayrequestNum").setEnabled(true);*/
            that.getView().byId("RePayFormType").setEnabled(true);
            
                  //Invoice Details
            that.getView().byId("RePayInvoiceDate").setEnabled(true);
            that.getView().byId("RePayExpiryDate").setEnabled(true);
            //that.getView().byId("RePayCurrencyType").setEnabled(true);
            that.getView().byId("RePayCurrency").setEnabled(true);
            that.getView().byId("RePayInvoiceNum").setEnabled(true);
            
                  //Budget Approval Form
            //Budget Approval Form table edit etme begin of ycoskun    
            that.getView().byId("RelatedTbl1").setVisible(false);
            that.getView().byId("RePayBafidTable").setVisible(false);
            
            that.getView().byId("RelatedTbl2").setVisible(true);
            that.getView().byId("RePayBafidTable2").setVisible(true);
            //Budget Approval Form table edit etme end of ycoskun
            
            
                  //VendorDetails
           that.getView().byId("RePayVenName").setEnabled(true);
           /*that.getView().byId("RePayVenAdd").setEnabled(true);
           that.getView().byId("RePayVenTC").setEnabled(true);
           that.getView().byId("RePayVenPhone").setEnabled(true);
           that.getView().byId("RePayConPer").setEnabled(true);     
           that.getView().byId("RePayVenMail").setEnabled(true);
           that.getView().byId("RePayBankName").setEnabled(true);
           that.getView().byId("RePayIBAN").setEnabled(true);*/
           
            //Payment Details
           that.getView().byId("RePayType").setEnabled(true);
           that.getView().byId("RePaySubject").setEnabled(true);
           //that.getView().byId("ManPaymentType").setValue(PaymentDetails.paymentType);
         
 
           //Installement tablosunu edit etme begin of ycoskun
             that.getView().byId("lblInsTbl").setVisible(false);
               that.getView().byId("RePayInstallementTbl").setVisible(false);
               
               that.getView().byId("lblInsTbl2").setVisible(true);
               that.getView().byId("RePayInstallementTbl2").setVisible(true);
               //Installement tablosunu edit etme end of ycoskun
            
             that.getView().byId("RePayInsAmount").setEnabled(true);
           that.getView().byId("RePayComment").setEnabled(true);
           that.getView().byId("ReidPayAmount").setEnabled(true);
           that.getView().byId("RePayidVatAmount").setEnabled(true);
           that.getView().byId("RePayidTax").setEnabled(true);
           that.getView().byId("RePayidVatIncAmount").setEnabled(true);
           that.getView().byId("RePayAdvanceInf").setEnabled(true);     
           that.getView().byId("RePayAdvAmount").setEnabled(true);
           that.getView().byId("RePayNetAmount").setEnabled(true);
           
           
           //radio butonları acmak
           that.getView().byId("ReRB-Down").setEnabled(true);
             that.getView().byId("ReRB-Ins").setEnabled(true);
           
            
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
                        else if (value === 7) {
                            eventText = "Take Opinion Receive";
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

                  
                  
            },
          
            oCommentDialogRcvTakeOClose : function() {            
                  this.oCommentTakeODialog.destroy();
                  this.oCommentTakeODialog = sap.ui.xmlfragment("zn11_form.view.CommentRcvTakeO", this.getView().getController());
                  
                  this.oCommentTakeODialog.close();
            },
            TakeOpinionRcvAction:function(){
                  
                  var that = this;        
                  var rcvComment = sap.ui.getCore().byId("idReceiveCommentTakeO").getValue();
                  var sndUser = sap.ui.getCore().byId("idSendUserTakeO").getValue();
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
                  
                  zdata.DO_PaymentApproval.Opinion.OpRcvComment =  rcvComment;
                  zdata.DO_PaymentApproval.Opinion.OpSndPerNo =  sndUser;
                  //zdata formatını belirleme begin of
                  var oEntryData = {"PaymentCompleteEventTypeOUTPUT": {"PaymentCompleteEvent": zdata
                  }};
                  
            oEntryData.PaymentCompleteEventTypeOUTPUT.PaymentCompleteEvent.DO_PaymentApproval.uiAction = "7";
                  //end of
                  
                  //ready durumundaki taskı reserved yapmak begin of 
                  
                  var tasksSvcURL = "/bpmodata/tasks.svc";
                  var tasksODataRcvModel = new sap.ui.model.odata.ODataModel(tasksSvcURL, false);
                  tasksODataRcvModel.create("/Claim?InstanceID='"+TaskInstanceID+"'", null);
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
                        tasksODataRcvModel.refresh(true);
                        that.onInit();
                        that.getOwnerComponent().getRouter().navTo("Home");
                              window.location.reload();
                    
                    }
                });
                  
                  this.oCommentTakeODialog.destroy();
                        if (!this.oCommentTakeODialog) {
                              this.oCommentTakeODialog = sap.ui.xmlfragment("zn11_form.view.CommentRcvTakeO", this.getView().getController());

                        }
                        this.oCommentTakeODialog.close();
            
            }

      });

      return CController;

});