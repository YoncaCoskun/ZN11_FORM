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
      var oSelectedIndex;
      var oSelectedRadioText;
      //var budgetID;
      /*var budgetId;
      var department;
      var type;
      var desc;
      var subDesc;*/
      var twoEntry = [];
      var oModel = new sap.ui.model.json.JSONModel();
      var sKur;
      var selectItem;
      var imgData = "";
      var zdata = [];
      var doBeln;

      var unamePas;
      var arrayUserPas;
      var username;
      var password;
      
      var vpaf = sap.ui.getCore().cPaf;


      var CController = Controller.extend("zn11_form.controller.SendItemPaf", {
            serviceUrl : "/bpmodata/taskdata.svc/",
            bpmPrefixParameter : "?prefixReservedNames=true",
            
            oDataSettings : {
                  json : true,
                  useBatch : false,
                  disableHeadRequestForToken : true
            },
            
            model: new sap.ui.model.json.JSONModel(),
            onInit: function() {},  
            onAfterRendering: function() {
                  debugger;
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
                url : "/RESTAdapter/b2b/findObject/"+username+"/PAF/"+vpaf,
                dataType : "json",
                async: false, 
                success : function(data,textStatus, jqXHR) {
                  
                }

            });
      
            try{

                  //Form Details
            that.getView().byId("SendItemPayrequestOwner").setValue(aData.responseJSON.T_PAF.item.PERNR);
            that.getView().byId("SendItemPaydepartment").setValue(aData.responseJSON.T_PAF.item.DEPBG);
            that.getView().byId("SendItemPaytitle").setValue(aData.responseJSON.T_PAF.item.PRFSN);
            that.getView().byId("SendItemPayrequestDate").setValue(aData.responseJSON.T_PAF.item.RQDAT);
            that.getView().byId("SendItemPayrequestTime").setValue(aData.responseJSON.T_PAF.item.RQTIM);
            that.getView().byId("SendItemPayrequestNum").setValue(vpaf);
            that.getView().byId("SendItemPayFormType").setValue(aData.responseJSON.T_PAF.item.PFTYP);
            
                  //Invoice Details
            that.getView().byId("SendItemPayInvoiceDate").setValue(aData.responseJSON.T_PAF.item.INVDT);
            that.getView().byId("SendItemPayExpiryDate").setValue(aData.responseJSON.T_PAF.item.EXPDT);
            that.getView().byId("SendItemPayCurrencyType").setValue(aData.responseJSON.T_PAF.item.CURRC);
            that.getView().byId("SendItemPayCurrency").setValue(aData.responseJSON.T_PAF.item.EXCRT);
            that.getView().byId("SendItemPayInvoiceNum").setValue(aData.responseJSON.T_PAF.item.INVNO);
           
                  //Budget Approval Form          
            var JPafRebafModel = new sap.ui.model.json.JSONModel();
            JPafRebafModel.setData(aData.responseJSON.T_PAF_REBAF.item);
            that.getView().setModel(JPafRebafModel, "JPafRebafModel");
      that.getView().byId("SendItemPayBafidTable").setModel(that.getView().getModel("JPafRebafModel"));
            
      that.getView().byId("SendItemPayTotalAmount").setValue(aData.responseJSON.T_PAF.item.TOAMO);       
            //that.getView().byId("ManrequestDate").setValue(BudgetApprovalForm.Document);
            
                  //VendorDetails
           that.getView().byId("SendItemPayVenName").setValue(aData.responseJSON.T_PAF.item.VNDNM);
          
           var vendor = aData.responseJSON.T_PAF.item.VNDNO;
           
           jQuery.ajax({
                        type : "GET",
                        contentType : "application/json",
                        url : "/RESTAdapter/VendorInfo/"+vendor+"",
                        dataType : "json",
                        async: false, 
                        success : function(data,textStatus, jqXHR) {
                              debugger;
                              
                              // console.log(data);

                               that.getView().byId("SendItemPayVenTC").setValue(data.E_TCKN);
                             that.getView().byId("SendItemPayVenPhone").setValue(data.E_PHONE);
                             that.getView().byId("SendItemPayConPer").setValue(data.E_CONTACT);     
                             that.getView().byId("SendItemPayVenMail").setValue(data.E_EMAIL);
                             that.getView().byId("SendItemPayBankName").setValue(data.E_BANK);
                             that.getView().byId("SendItemPayIBAN").setValue(data.E_IBAN);
                             that.getView().byId("SendItemPayVenAdd").setValue(data.E_ADDRESS);
                              //that.getView().byId("PaySwiftCode").setValue();
                            
                  
                            
                        }
                    
                    }); 
           
            //Payment Details
           that.getView().byId("SendItemPayType").setValue(aData.responseJSON.T_PAF.item.INVNO);
           that.getView().byId("SendItemPaySubject").setValue(aData.responseJSON.T_PAF.item.INVNO);
           //that.getView().byId("ManPaymentType").setValue(PaymentDetails.paymentType);
         
         var oJsonInstallmentModel = new sap.ui.model.json.JSONModel();
            oJsonInstallmentModel.setData(aData.responseJSON.T_PAF_INST.item);
            that.getView().setModel(oJsonInstallmentModel, "JInstallmentModel");
      that.getView().byId("SendItemPayInstallementTbl").setModel(that.getView().getModel("JInstallmentModel"));
            
             that.getView().byId("SendItemPayInsAmount").setValue(aData.responseJSON.T_PAF.item.INAMO);
           that.getView().byId("SendItemPayComment").setValue(aData.responseJSON.T_PAF.item.SUBJC);
           that.getView().byId("SendItemidPayAmount").setValue(aData.responseJSON.T_PAF.item.PYAMO);
           that.getView().byId("SendItemPayidVatAmount").setValue(aData.responseJSON.T_PAF.item.VBAMO);
           that.getView().byId("SendItemPayidTax").setValue(aData.responseJSON.T_PAF.item.WHTAX);
           that.getView().byId("SendItemPayidVatIncAmount").setValue(aData.responseJSON.T_PAF.item.VIAMO);
           that.getView().byId("SendItemPayAdvanceInf").setValue(aData.responseJSON.T_PAF.item.ADINF);     
           that.getView().byId("SendItemPayAdvAmount").setValue(aData.responseJSON.T_PAF.item.ADAMO);
           that.getView().byId("SendItemPayNetAmount").setValue(aData.responseJSON.T_PAF.item.NPAMO);
    
           
                  //flow içeriğinin doldurulması begin of ycoskun
                  var aDataFlow = jQuery.ajax({
                  type : "GET",
                  contentType : "application/json",
                  url : "/RESTAdapter/b2b/processLog/*/*/"+vpaf,
                  dataType : "json",
                  headers: {"x-csrf-token": "Fetch",
                                "Authorization":"Basic "+btoa(username+":"+password)},
                  async: false, 
                  success : function(data,textStatus, jqXHR) {
                  }

              });
                  var vStatu;
                  if(aDataFlow.responseJSON.T_LOG.item.length === undefined){
                        that.getView().byId("SendItemPaymentFlowTbl2").setVisible(true);
                        that.getView().byId("SendItemPaymentFlowTbl").setVisible(false);
                        if(aDataFlow.responseJSON.T_LOG.item.OBJTY === -2){
                              vStatu="Pending Approval";
                        }
                        if(aDataFlow.responseJSON.T_LOG.item.OBJTY === -1){
                              vStatu="Request Owner";
                        }
                        else{
                              
                        }
                  that.getView().byId("senditemPayUserId").setText(aDataFlow.responseJSON.T_LOG.item.PERNR);
                  that.getView().byId("senditemPayUser").setText(aDataFlow.responseJSON.T_LOG.item.FNAME+" "+aDataFlow.responseJSON.T_LOG.item.LNAME);
            that.getView().byId("senditemPayTitle").setText(aDataFlow.responseJSON.T_LOG.item.TITLE);
            that.getView().byId("senditemPayDprt").setText(aDataFlow.responseJSON.T_LOG.item.DEPRT);
                  that.getView().byId("senditemPayEvnt").setText(vStatu);
            that.getView().byId("senditemPayReqDate").setText(aDataFlow.responseJSON.T_LOG.item.DATUM+" "+aDataFlow.responseJSON.T_LOG.item.UZEIT);
                        
                  }
                  else{
                        that.getView().byId("SendItemPaymentFlowTbl2").setVisible(false);
                        that.getView().byId("SendItemPaymentFlowTbl").setVisible(true);
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
            this.getView().byId("SendItemPaymentFlowTbl").setModel(this.getView().getModel("oFlowModel"));
                  }
                  that.getView().byId("SendItemPayFlowRequestNum").setValue(vpaf);
            that.getView().byId("SendItemPayFlowRequestOwner").setValue(aData.responseJSON.T_PAF.item.PERNR);
                  that.getView().byId("SendItemPayFlowRequestType").setValue();
            that.getView().byId("SendItemPayFlowSubject").setValue(aData.responseJSON.T_PAF.item.SUBJC);
                  that.getView().byId("SendItemPayFlowStatus").setValue("");
                  //flow içeriğinin doldurulması end of ycoskun
           
            
                  var aAttachData = jQuery.ajax({
                      type : "GET",
                      contentType : "application/json",
                      url : "/RESTAdapter/b2b/getAttachment/*&"+vpaf,
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
          		this.getView().byId("idSendItemAttachTablePaf").setModel(this.getView().getModel("oJsonAttachModel"));
            }
            catch(err){
                  
            }     
      
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
                            eventText = "Completed";
                            return eventText;                   
                      } 
                        else{
                              return value;
                        }
            },
            
            onAttachWatch: function(oEvent){
                  var bindingContext = oEvent.getSource().getBindingContext();
                    var preqNo = bindingContext.getProperty("FILENAME");
                    var preqName = bindingContext.getProperty("FILETYPE");
                    var aAttachDown = jQuery.ajax({
                        type : "GET",
                        contentType : "application/json",
                        url : "/RESTAdapter/b2b/getAttachment/"+preqNo+"&"+vpaf,
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
                  
            },
            btnHomeClick:function(){
                  this.getOwnerComponent().getRouter().navTo("Home");
                  window.location.reload();
            },




      });

      return CController;

});