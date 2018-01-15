jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");
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
	'sap/ui/model/odata/v2/ODataModel'

], function(MessagePopover, MessagePopoverItem, Link, jQuery, Fragment, Controller, JSONModel, AnnotationHelper, Popover, Button,ODataModel) {

	"use strict";
	

	var unamePas;
	var arrayUserPas;
	var username;
	var password;
	var vTaskTitle;
	var aMockMessages=[];
	var zdata;
	var oToken; 	
	var oHeaders;

	var CController = Controller.extend("zn11_form.controller.Home", {
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
			var	oLink;
			
			try{
				var persData = jQuery.ajax({
	                type : "GET",
	                contentType : "application/json",
	                url : "/RESTAdapter/b2b/SearchHelp/PERNR="+username+"&PERSONEL",
	                dataType : "json",
	                async: false, 
	                success : function(data,textStatus, jqXHR) {
	                }

	            });
	    		var personelData = persData.responseJSON.T_RESULT.item.STRING;  		
	    		 var arrayPers = personelData.split('@');
	    		 var department = arrayPers[2];
	    		 
	    		 that.getView().byId('idButtonUser').setText(username+"-"+arrayPers[0] + " " + arrayPers[1]);
	    		
				
				
			}catch(err){
				
			}
             
    		//Hangi Forma gideceğinin bilgisini almak begin of ycoskun

//    		oLink = new sap.m.Link({
//    					text: "Please go to Form",
//    					press:function(oEvent){
//    						
//    						var array = oEvent.getSource().getId().split("-");
//    						var selectItemIndex = array[2];
//
//    						var oHeaders;
//    						var oToken; 						
//    						jQuery.ajax({
//    							  url: "/bpmodata/startprocess.svc/itelligence.com.tr/budget/BPM_Budget_Approval/$metadata",
//    							  headers: {"x-csrf-token": "Fetch",
//    								  "Authorization":"Basic "+btoa(username+":"+password)},
//    							  async: false,
//    							  method: 'GET'
//    							}).then(function(data,status,xhr) {
//    								  oToken = xhr.getResponseHeader('x-csrf-token');
//    								  oHeaders = {
//    											"x-csrf-token": oToken
//    										};
//    								});
//    						
//    						// Baf mı Paf mı Eaf mı olduğunu bulmak için begin of ycoskun
//    						var aDataForm = jQuery.ajax({
//    			                type : "GET",
//    			                contentType : "application/json",
//    			                url : "/bpmodata/tasks.svc/TaskCollection?$filter=Status eq 'READY'",
//    			                dataType : "json",
//    			                async: false, 
//    			                success : function(data,textStatus, jqXHR) {
//    			                }
//
//    			            });
//    						var TaskInstanceID = aDataForm.responseJSON.d.results[selectItemIndex].InstanceID;   					
//    						var selectItem = aDataForm.responseJSON.d.results[selectItemIndex].TaskDefinitionName;
//    						sap.ui.getCore().cSelectItemIndex = selectItemIndex;
//    						if(selectItem==="Budget"){
//    							  var startTypeINPUT = jQuery.ajax({
//  					                type : "GET",
//  					                contentType : "application/json",
//  					                url : "/bpmodata/taskdata.svc/"+ TaskInstanceID +"/InputData('"+ TaskInstanceID +"')?$format=json&$expand=startTypeINPUT/start/DO_BudgetApproval/Installments/row,startTypeINPUT/start/DO_BudgetApproval/Head,startTypeINPUT/start/DO_BudgetApproval/Details,startTypeINPUT/start/DO_BudgetApproval/Amount,startTypeINPUT/start/DO_BudgetApproval/Attachments,startTypeINPUT/start/DO_BudgetApproval/Opinion",
//  					                dataType : "json",
//  					                async: false, 
//  					                success : function(data,textStatus, jqXHR) {        					      
//  					    				var oODataJSONModel = new sap.ui.model.json.JSONModel(data);      		
//  					                }
//  					            });
//  					            
//  					            zdata = startTypeINPUT.responseJSON.d.startTypeINPUT.start;
//  					            // console.log(zdata);            					           					        
//  					            var uiAction = startTypeINPUT.responseJSON.d.startTypeINPUT.start.UIAction;
//  					            		if(uiAction===null || uiAction==="1"){
//  					            			//Baf Onay					  
//  					            			that.getOwnerComponent().getRouter().navTo("manBudget");
//  					            		}
//  					            		else if(uiAction==="2"){
//  					            			//Baf Send Back
//  					            			that.getOwnerComponent().getRouter().navTo("resendBudget");
//  					            		}
//  					            		else if(uiAction==="3"){
//  					            			//Baf Take Opinion
//  					            			that.getOwnerComponent().getRouter().navTo("takeOBudget");
//  					            		}
//    								}
//    						else if(selectItem==="Payment"){
//   							 	var startTypeINPUT = jQuery.ajax({
//					                type : "GET",
//					                contentType : "application/json",
//					                url : "/bpmodata/taskdata.svc/"+TaskInstanceID+"/InputData('"+TaskInstanceID+"')?$format=json&$expand=startTypeINPUT/start/DO_PaymentApproval/InvoiceDetails,startTypeINPUT/start/DO_PaymentApproval/FormDetails,startTypeINPUT/start/DO_PaymentApproval/VendorDetails,startTypeINPUT/start/DO_PaymentApproval/PaymentDetails/Installment,startTypeINPUT/start/DO_PaymentApproval/BudgetApprovalForm/RelatedBudgetNo,startTypeINPUT/start/DO_PaymentApproval/Attachments,startTypeINPUT/start/DO_PaymentApproval/Opinion",
//					                dataType : "json",
//					                async: false, 
//					                success : function(data,textStatus, jqXHR) {					      
//					    				var oODataJSONModel = new sap.ui.model.json.JSONModel(data);		
//					                }
//					            });
//					            
//					            zdata = startTypeINPUT.responseJSON.d.startTypeINPUT.start;
//					            // console.log(zdata);            					           					        
//					            var uiAction = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.uiAction;
//					            	if(uiAction===null || uiAction==="1" || uiAction==="" || uiAction===undefined){
//					            		//Paf Onay
//					            		that.getOwnerComponent().getRouter().navTo("manPayment");
//					            	}
//					            	else if(uiAction==="2"){
//					            		//Paf Send Back
//					            		that.getOwnerComponent().getRouter().navTo("resendPayment");
//					            	}
//					            	else if(uiAction==="3"){
//					            		//Paf Take Opinion
//					            		that.getOwnerComponent().getRouter().navTo("takeOPayment");
//					            	}
//   						
//    						}
//    						else if(selectItem==="Expense"){
//    							var startTypeINPUT = jQuery.ajax({
//					                type : "GET",
//					                contentType : "application/json",
//					                url : "/bpmodata/taskdata.svc/"+TaskInstanceID+"/InputData('"+TaskInstanceID+"')?$format=json&$expand=startTypeINPUT/start/DO_EAF_Approver/FormDetails,startTypeINPUT/start/DO_EAF_Approver/ExpenseDetails/ExpenseList,startTypeINPUT/start/DO_EAF_Approver/ExpenseDetails/ExpenseList/item,startTypeINPUT/start/DO_EAF_Approver/Opinion,startTypeINPUT/start/DO_EAF_Approver/DO_T_PERSONEL,startTypeINPUT/start/DO_EAF_Approver/ProcessInitiator,startTypeINPUT/start/DO_EAF_Approver/Attachments,startTypeINPUT/start/ProcessInstanceAttributes/ProcessInitiator",
//					                dataType : "json",
//					                async: false, 
//					                success : function(data,textStatus, jqXHR) {					      
//					    				var oODataJSONModel = new sap.ui.model.json.JSONModel(data);		
//					                }
//					            });
//					            
//					            zdata = startTypeINPUT.responseJSON.d.startTypeINPUT.start;
//					            // console.log(zdata);            					           					        
//					            var uiAction = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_EAF_Approver.UI_Action;
//    							//EAF ISLEMLERI
//					            
//    						 	if(uiAction===null || uiAction==="1" || uiAction==="" || uiAction===undefined){
//				            		//Eaf Onay
//				            		that.getOwnerComponent().getRouter().navTo("manExpense");
//				            	}
//				            	else if(uiAction==="2"){
//				            		//Eaf Send Back
//				            		that.getOwnerComponent().getRouter().navTo("resendExpense");
//				            	}
//				            	else if(uiAction==="3"){
//				            		//Eaf Take Opinion
//				            		that.getOwnerComponent().getRouter().navTo("takeOExpense");
//				            	}
//    						} 						
//    						// Baf mı Paf mı Eaf mı olduğunu bulmak için begin of ycoskun
//    					},
//    					target: "_blank"
//    				});
  			
    		//Hangi Forma gideceğinin bilgisini almak end of ycoskun

//			var oMessageTemplate = new sap.m.MessageItem({
//				type: 'Information',
//				title: '{title}',
//				description: '{description}',
//				subtitle: '{subtitle}',
//				counter: '{counter}',
//				markupDescription: "{markupDescription}",
//				link: oLink
//			});
			
//			var oHeaders;
//			var oToken; 	
//			
			jQuery.ajax({
				  url: "/bpmodata/startprocess.svc/itelligence.com.tr/budget/BPM_Budget_Approval/$metadata",
				  headers: {"x-csrf-token": "Fetch",
					  "Authorization":"Basic "+btoa(username+":"+password)
					  },
				  async: false,
				  method: 'GET'
				}).then(function(data,status,xhr) {
					  oToken = xhr.getResponseHeader('x-csrf-token');
					  oHeaders = {
								"x-csrf-token": oToken
							};
					});
			
			
			var aDataTasks = jQuery.ajax({
                type : "GET",
                contentType : "application/json",
                url : "/bpmodata/tasks.svc/TaskCollection?$filter=Status eq 'READY'",
                dataType : "json",
                async: false, 
                success : function(data,textStatus, jqXHR) {
                	
                	// console.log(data);
                }

            });
	
	  		try{

	  			
	  			var countMsg=0;
    			for (var i = 0; i < aDataTasks.responseJSON.d.results.length; i++) {
    				var array = aDataTasks.responseJSON.d.results[i].CreatedOn.split("(");
                	var arrayCreateOn = array[1].split(")");
                	var vCreateOn = parseInt(arrayCreateOn[0]);
                	var date = new Date(vCreateOn);
                	var vTitle;
                	var name;
                	aDataTasks.responseJSON.d.results[i].CreatedOn = date;
                	
                	/*if(aData.responseJSON.d.results[i].TaskDefinitionName === "Budget"){
    					TaskInstanceID = aData.responseJSON.d.results[i].InstanceID;
    					name = "Budget";
    				}
    				else if(aData.responseJSON.d.results[i].TaskDefinitionName === "ManagerApprove"){
    					TaskInstanceID = aData.responseJSON.d.results[i].InstanceID;
    					name = "ManagerApprove";
    				}
*/
                	aMockMessages.push({
						title: aDataTasks.responseJSON.d.results[i].TaskTitle ,
						description: aDataTasks.responseJSON.d.results[i].Status,
						subtitle:  aDataTasks.responseJSON.d.results[i].CreatedOn,
						counter: i+1,
						link: oLink
					});
                	countMsg=countMsg+1;
                	 
    				
    			}  
    			that.getView().byId('idButtonMsg').setText(countMsg);
	  		}
    		catch(err){
    			
    		}
//
//			
//
//			var oModel = new JSONModel();
//			oModel.setData(aMockMessages);
//
//			this._oMessageView = new sap.m.MessageView({
//				items: {
//					path: "/",
//					template: oMessageTemplate
//				}
//			});
//
//			this._oMessageView.setModel(oModel);
//
//			var oCloseButton =  new sap.m.Button({
//				text: "Close",
//				press: function () {
//					that._oPopover.close();
//				}
//			});
//
//			var oPopoverFooter = new sap.m.Bar({
//				contentRight: oCloseButton
//			});
//
//			var oPopoverToolbar = new sap.m.Toolbar({
//				content: [
//					new sap.m.ToolbarSpacer(),
//					new sap.ui.core.Icon({
//						color: "#bb0000",
//						src: "sap-icon://message-information"}),
//					new sap.m.Text({
//						text: "Messages"
//					}),
//					new sap.m.ToolbarSpacer()
//				]
//			});
//
//			this._oPopover = new sap.m.Popover({
//				showHeader: true,
//				customHeader: oPopoverToolbar,
//				contentWidth: "600px",
//				contentHeight: "440px",
//				verticalScrolling: false,
//				modal: true,
//				content: [
//					this._oMessageView
//				],
//				footer: oPopoverFooter
//			});
//		
    		 var aData = jQuery.ajax({
    		       type : 'GET',
    		       contentType : "application/json",
    		       url : "/bpmodata/tasks.svc/SubstitutionRuleCollection",
    		       dataType : "json",
    		       async: false, 
    		       success : function(data,textStatus, jqXHR) {
    		    	   
    		    	   sap.ui.getCore().byId("__xmlview1--tileDelegations").setValue(data.d.results.length);
    		    	  
    		           
    		       }

    		   });
			
			
    		sap.ui.getCore().busyDialog1.close();
		},
		
		dateConvert : function (value) {
			if (value) {
				var String=value.substring(value.lastIndexOf("(")+1,value.lastIndexOf(")"));
				var intDateVal=parseInt(String);
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd.MM.yyyy"}); 
				return oDateFormat.format(new Date(intDateVal));
			} else {
				return "Never Expires";
			}
		},
		onPressAddDelegation: function() {
            if (!this._oDialogList) {
                  this._oDialogList = sap.ui.xmlfragment("zn11_form.view.DelegationList", this);
            }
            this.getView().addDependent(this._oDialogList);

            this._oDialogList.addStyleClass(this.getOwnerComponent().getContentDensityClass());
            var substitutionRuleCollectionJsonModel = new sap.ui.model.json.JSONModel();

            var aData = jQuery.ajax({
       type : 'GET',
       contentType : "application/json",
       url : "/bpmodata/tasks.svc/SubstitutionRuleCollection",
       dataType : "json",
       async: false, 
       success : function(data,textStatus, jqXHR) {
           substitutionRuleCollectionJsonModel.setData(data);
           
       }

   });
            

            this._oDialogList.open();
            this._oDialogList.setModel(substitutionRuleCollectionJsonModel);

     },
     onPressCloseDelegationsListDialog: function() {
            this._oDialogList.close();
     },
     onPressDelegationOptionsDialog: function() {
            if (!this._oDialogDelegationOptions) {
                  this._oDialogDelegationOptions = sap.ui.xmlfragment("zn11_form.view.DelegationOptions", this);
            }
            this.getView().addDependent(this._oDialogDelegationOptions);

     this._oDialogDelegationOptions.addStyleClass(this.getOwnerComponent().getContentDensityClass());
            
            var userSelectionSearchInputJsonModel = new sap.ui.model.json.JSONModel();

            var oToken;
            var oHeaders;
            var aData = jQuery.ajax({
       type : 'GET',
       contentType : "application/json",
       url : "/bpmodata/tasks.svc/SearchUsers",
       dataType : "json",
       async: false, 
       success : function(data,textStatus, jqXHR) {
           userSelectionSearchInputJsonModel.setData(data);
           
       }

   });
            

            if (this._oDialogList) {

                  this._oDialogList.close();

            }
            
            sap.ui.getCore().byId("idInputDelegatedTo").setModel(userSelectionSearchInputJsonModel);

            this._oDialogDelegationOptions.open();

     },

     closeDialogDelegationOptions: function() {
            this._oDialogDelegationOptions.close();
            this.onPressAddDelegation();
     },
     showProcessValueHelpDialog: function() {
            if (!this._oDialogProcessList) {
                  this._oDialogProcessList = sap.ui.xmlfragment("zn11_form.view.Process", this);
            }
            this.getView().addDependent(this._oDialogProcessList);

            this._oDialogProcessList.addStyleClass(this.getOwnerComponent().getContentDensityClass());

            this._oDialogProcessList.open();
     },
     _handleProcessValueHelpSearch: function() {

     },
     _handleProcessValueHelpClose: function() {

     },
     handleDelegatedToValueHelp: function() {
            var that = this;

            if (!this._oDialogDelegatedToDialog) {
                  this._oDialogDelegatedToDialog = sap.ui.xmlfragment("zn11_form.view.DelegatedTo", this);
            }
            this.getView().addDependent(this._oDialogDelegatedToDialog);

     this._oDialogDelegatedToDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
            jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogDelegatedToDialog);

            var userSelectionSearchHelpJsonModel = new sap.ui.model.json.JSONModel();

            var oToken;
            var oHeaders;
            var aData = jQuery.ajax({
       type : 'GET',
       contentType : "application/json",
       url : "/bpmodata/tasks.svc/SearchUsers",
       dataType : "json",
       async: false, 
       success : function(data,textStatus, jqXHR) {
           userSelectionSearchHelpJsonModel.setData(data);
           
       }

   });
            this._oDialogDelegatedToDialog.setModel(userSelectionSearchHelpJsonModel);
            
            this._oDialogDelegatedToDialog.open();
     },
     _handleDelegatedToValueHelpSearch: function(oEvent) {
            
            var sValue = oEvent.getParameter("value");
            var oFilter = new sap.ui.model.Filter("DisplayName", sap.ui.model.FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);

     },
     _handleDelegatedToValueHelpClose: function(oEvent)
     {
            var aContexts = oEvent.getParameter("selectedItem");
            
            if (aContexts)
                  {
                   sap.ui.getCore().byId("idInputDelegatedTo").setValue(aContexts.getTitle());
                   sap.ui.getCore().byId("idInputTempUserId").setValue(aContexts.getInfo());                           
                  }

     },
     selectCheckBoxNeverExpires: function() {
            var checkBoxNeverExpires = sap.ui.getCore().byId("idCheckBoxNeverExpires");
            var dateTimePickerDelegationExpire = sap.ui.getCore().byId("dateTimePickerDelegationExpire");

            if (checkBoxNeverExpires.getSelected() === true) {
                  dateTimePickerDelegationExpire.setEnabled(false);
                  dateTimePickerDelegationExpire.setValue("");
            } else {
                  dateTimePickerDelegationExpire.setEnabled(true);
            }

     },
     onPressApplicationDelegation: function() {

     },
     handleChangeDateTimePickerDelegationExpire: function() {

     },
     selectCheckFullControl: function() {
            var checkFullControl = sap.ui.getCore().byId("idCheckFullControl");
            var buttonApplicationDelegation = sap.ui.getCore().byId("idButtonApplicationDelegation");

            if (checkFullControl.getSelected() === true) {
                  buttonApplicationDelegation.setEnabled(false);

            } else {
                  buttonApplicationDelegation.setEnabled(true);
            }
     },
     onPressIconDeleteDelegatedPerson: function(oEvent)
     {
            var selectedPath=oEvent.getSource().getParent().getBindingContext().getPath()
            var idx = parseInt(selectedPath.substring(selectedPath.lastIndexOf('/') + 1));
            var delegationListTableData = sap.ui.getCore().byId("idDelegationListTable").getModel().getData();
            var substitutionRuleID= delegationListTableData.d.results[idx].SubstitutionRuleID;
            var dialogWarningRemoveDelegationList = new sap.m.Dialog({
                  title: 'Warning',
                  type: 'Message',
                  state: 'Warning',
                  content: new sap.m.Text({
                         text: 'Do you want to remove selected delegation?'
                  }),
                  beginButton: new sap.m.Button({
                         text: 'OK',
                         press: function () {
                                
                                
                          // var aData = jQuery.ajax({
                           // type : 'POST',
                          //  contentType : "application/json",
                          //  url : "/bpmodata/tasks.svc/SubstitutionRuleCollection?SubstitutionRuleID='"+substitutionRuleID+"'",
                          //  dataType : "json",
                          //  async: false, 
                          //  success : function(results) {
                                
                           //     dialogWarningRemoveDelegationList.close();
                                
                           // }

                        //});
                     var sURL = "/bpmodata/tasks.svc";
                     var oDeleteModel = new ODataModel(sURL,true);
                     oDeleteModel.create("/DeleteSubstitutionRule",
                              null,
                              {
                              urlParameters : {
                                    "SubstitutionRuleID" : "'"+substitutionRuleID+"'",
                              }, 
                        success:function(oData,oResponse) {
                        	dialogWarningRemoveDelegationList.close();
                              },
                              error : function(oError) {
                              }
                              });    
                                
                         }
                  }),
                  endButton: new sap.m.Button({
                         text: 'Cancel',
                         press: function () {
                                dialogWarningRemoveDelegationList.close();
                         }
                  }),
                  afterClose: function() {
                	  var aData = jQuery.ajax({
           		       type : 'GET',
           		       contentType : "application/json",
           		       url : "/bpmodata/tasks.svc/SubstitutionRuleCollection",
           		       dataType : "json",
           		       async: false, 
           		       success : function(data,textStatus, jqXHR) {
           		    	   
           		    	   sap.ui.getCore().byId("__xmlview1--tileDelegations").setValue(data.d.results.length);
           		    	  
           		           
           		       }

           		   });
                         dialogWarningRemoveDelegationList.destroy();
                  }
            });

            dialogWarningRemoveDelegationList.open();
     },


     onPressSuggestionDelegatedTo: function(oEvent)
     {
            var aContext =oEvent.getParameter("selectedItem").getBindingContext();
            if(aContext)
                  {
                         sap.ui.getCore().byId("idInputTempUserId").setValue(aContext.getObject().UniqueName);
                  }
     },
     onPressSaveDelegationOptions: function()
     {
            var beginDate = sap.ui.getCore().byId("dateTimePickerDelegationStart").getValue();
            var endDate = sap.ui.getCore().byId("dateTimePickerDelegationExpire").getValue();
            var Mode = "'RECEIVE_TASKS'";
            var isEnabled =sap.ui.getCore().byId("idCheckIsEnabled").getSelected();
            var userId= sap.ui.getCore().byId("idInputTempUserId").getValue();
            
            var oHeaders;
            var oToken;  
            var sURL = "/bpmodata/tasks.svc";
                        //"?BeginDate=datetime'"+beginDate+"T00:00'&IsEnabled='"+isEnabled+"'&Mode='"+Mode+"'&User='"+userId+"'&EndDate=datetime'"+endDate+"T00:00'";
            var oCreateModel = new ODataModel(sURL,true);
            oCreateModel.create("/CreateSubstitutionRule",
                        null,
                        {
                  
                  urlParameters : {
                        "BeginDate" : "datetime'"+beginDate+"T00:00'",
                        "EndDate" : "datetime'"+endDate+"T00:00'",
                        "Mode" : Mode,
                        "User" : "'"+userId+"'",
                        "IsEnabled" : "'"+isEnabled+"'",
                  }                 ,     
                  success:function(oData,oResponse) {
                	  var that = this;
                	  that.closeDialogDelegationOptions();
                        },
                        error : function(oError) {
                        }
                        });
//            jQuery.ajax({
//                    url: "/bpmodata/tasks.svc/CreateSubstitutionRule?BeginDate=datetime'"+beginDate+"T00:00'&IsEnabled='"+isEnabled+"'&Mode='"+Mode+"'&User='"+userId+"'&EndDate=datetime'"+endDate+"T00:00'",
//                    //headers: {"x-csrf-token": "Fetch",
//                    //       "Authorization":"Basic "+btoa(username+":"+password)
//                    //       },
//                    async: false,
//                    crossDomain: true,
//                    method: 'POST',
//                  contentType : "application/atom+xml,application/atomsvc+xml,application/xml"
//                  }).then(function(data,status,xhr) {
//                           oToken = xhr.getResponseHeader('x-csrf-token');
//                           oHeaders = {
//                                              "x-csrf-token": oToken
//                                
//                                       };
//                         });

     },


		handlePopoverPress: function (oEvent) {
			this._oPopover.openBy(oEvent.getSource());
		},

		onItemSelect: function(oEvent) {

			var item = oEvent.getParameter('item');

			var viewId = this.getView().getId();

			sap.ui.getCore().byId(viewId + "--pageContainer").to(viewId + "--" + item.getKey());

		},
		findLink:function(){
			alert("find linkkk!!");
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

		handlePopover: function(oEvent) {

			oMessagePopover1.openBy(oEvent.getSource());

		},

		onSideNavButtonPress: function() {

			var viewId = this.getView().getId();

			var toolPage = sap.ui.getCore().byId(viewId + "--toolPage");

			var sideExpanded = toolPage.getSideExpanded();

			this._setToggleButtonTooltip(sideExpanded);

			toolPage.setSideExpanded(!toolPage.getSideExpanded());

		},

		_setToggleButtonTooltip: function(bLarge) {

			var toggleButton = this.getView().byId('sideNavigationToggleButton');

			if (bLarge) {

				toggleButton.setTooltip('Large Size Navigation');

			} else {

				toggleButton.setTooltip('Small Size Navigation');

			}

		},

		onChangeEditMode: function(oEvent) {

			var oView = this.getView();

			var bFlag = !oView.byId("idCategory").getContextEditable();

			oView.byId("idProductId").setContextEditable(bFlag);

			oView.byId("idName").setContextEditable(bFlag);

			oView.byId("idCategory").setContextEditable(bFlag);

			oView.byId("idDescription").setContextEditable(bFlag);

			oView.byId("idPrice").setContextEditable(bFlag);

			oView.byId("idStatus").setContextEditable(bFlag);

			oView.byId("idQuantity").setContextEditable(bFlag);

			oView.byId("idPassword").setContextEditable(bFlag);

			oView.byId("idCreationDate").setContextEditable(bFlag);

			oView.byId("idLastChanged").setContextEditable(bFlag);

			oView.byId("idAvailableSince").setContextEditable(bFlag);

		},

		onChangeEnabledMode: function(oEvent) {

			var oView = this.getView();

			var bFlag = !oView.byId("idCategory").getEnabled();

			oView.byId("idProductId").setEnabled(bFlag);

			oView.byId("idName").setEnabled(bFlag);

			oView.byId("idCategory").setEnabled(bFlag);

			oView.byId("idDescription").setEnabled(bFlag);

			oView.byId("idPrice").setEnabled(bFlag);

			oView.byId("idStatus").setEnabled(bFlag);

			oView.byId("idQuantity").setEnabled(bFlag);

			oView.byId("idPassword").setEnabled(bFlag);

			oView.byId("idCreationDate").setEnabled(bFlag);

			oView.byId("idLastChanged").setEnabled(bFlag);

			oView.byId("idAvailableSince").setEnabled(bFlag);

		},

		btnHomeClick: function()

			{

				var navCon = this.getView().byId("navContainer");
					navCon.to(this.getView().byId("idHomePage"), "slide");

			},

		btnBudgetClick: function()

		{
			var navCon = this.getView().byId("navContainer");
			navCon.to(this.getView().byId("idBudgetPage"), "slide");

		},
		btnSendItemsClick:function(){
			var navCon = this.getView().byId("navContainer");
			navCon.to(this.getView().byId("idSendItemPage"), "slide");
			
		},
		btnApprovalsClick:function(){
			var navCon = this.getView().byId("navContainer");
			navCon.to(this.getView().byId("idApprovalsItemPage"), "slide");
			
		},
		btnNotifClick:function(){
			var navCon = this.getView().byId("navContainer");
			navCon.to(this.getView().byId("idNotifItemPage"), "slide");
			
		},
		btnManBudgetClick: function()
		{
			//var navCon = this.getView().byId("navContainer");
			//navCon.to(this.getView().byId("idManBudgetPage"), "slide");
		},
		btnManPaymentClick:function(){
			
		},

		btnExpenseClick: function()

		{

			var navCon = this.getView().byId("navContainer");

			navCon.to(this.getView().byId("idExpensePage"), "slide");

		},

		btnPaymentClick: function()

		{

			var navCon = this.getView().byId("navContainer");

			navCon.to(this.getView().byId("idPaymentPage"), "slide");

		},
		btnResendBudgetClick: function()

		{
			var navCon = this.getView().byId("navContainer");
			navCon.to(this.getView().byId("idResendBudgetPage"), "slide");

		},
		btnTakeOBudgetClick: function()

		{
			var navCon = this.getView().byId("navContainer");
			navCon.to(this.getView().byId("idTakeOBudgetPage"), "slide");

		},
		btnTakeOPaymentClick: function()

		{
			var navCon = this.getView().byId("navContainer");
			navCon.to(this.getView().byId("idTakeOPaymentPage"), "slide");

		},
		btnTakeOExpenseClick: function()

		{
			var navCon = this.getView().byId("navContainer");
			navCon.to(this.getView().byId("idTakeOExpensePage"), "slide");

		},

	});

	return CController;

});