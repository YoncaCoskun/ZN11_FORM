jQuery.sap.require("sap.ui.model.odata.AnnotationHelper");
sap.ui.define([
			'jquery.sap.global',
			'sap/ui/core/mvc/Controller',
			'sap/ui/model/json/JSONModel',
			"sap/m/MessageToast",
			"sap/m/MessageBox"
		], function(jQuery, Controller, JSONModel, MessageToast, MessageBox) {
			"use strict";

			//var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZHR_144_SRV_01");
			var username;
			var password;
			var unamePas;
			var arrayUserPas;
			var zdata;
			
			var Controller = Controller.extend("zn11_form.controller.Approvals", {
				onAfterRendering: function() {
						var that = this;
						unamePas = atob(window.localStorage["unamePas"]);
						arrayUserPas = unamePas.split(":");
						username = arrayUserPas[0];
						password = arrayUserPas[1];
						
						jQuery.ajax({
			                type : "GET",
			                contentType : "application/json",
			                url : "/bpmodata/tasks.svc/TaskCollection?$filter=Status eq 'READY'",
			                dataType : "json",
			                async: false, 
			                success : function(data,textStatus, jqXHR) {
//			                	 that.getView().byId("apprBudgetNum").setValue(data.d.results.length);
//			                	var JAddBafModel = new sap.ui.model.json.JSONModel();
//			                  	JAddBafModel.setData(data.d.results);
//			                  	JAddBafModel.setSizeLimit(99999999999);
//			        			that.getView().setModel(JAddBafModel, "JAddBafModel");
//			        			that.getView().byId("idNotifBudgetFormTable").setModel(that.getView().getModel("JAddBafModel"));
			                	
			                	 var Budget = [];
			        			 var Payment = [];
			        			 var Expense = [];
			        			 var JAddBafModel = new sap.ui.model.json.JSONModel();
			                   	var JAddPafModel = new sap.ui.model.json.JSONModel();
			                   	var JAddEafModel = new sap.ui.model.json.JSONModel();
			                   	
			            		 for(var j=0; j<data.d.results.length; j++) {
			            			 if(data.d.results[j].TaskDefinitionName === "Budget"){
			            				 Budget.push(data.d.results[j]);
			            			 }else if(data.d.results[j].TaskDefinitionName === "Payment"){
			            				 Payment.push(data.d.results[j]);
			            			 }else if(data.d.results[j].TaskDefinitionName === "Expense"){
			            				 Expense.push(data.d.results[j]);
			            			 }
			            		 
			            		 }
			            		 that.getView().byId("apprBudgetNum").setValue(Budget.length);
			                  	JAddBafModel.setData(Budget);
			                  	JAddBafModel.setSizeLimit(99999999999);
			        			that.getView().setModel(JAddBafModel, "JAddBafModel");
			        			that.getView().byId("idNotifBudgetFormTable").setModel(that.getView().getModel("JAddBafModel"));
			        			
			        			 that.getView().byId("apprPafNum").setValue(Payment.length);
			        			JAddPafModel.setData(Payment);
			        			JAddPafModel.setSizeLimit(99999999999);
			        			that.getView().setModel(JAddPafModel, "JAddPafModel");
			        			that.getView().byId("idNotifPaymentFormTable").setModel(that.getView().getModel("JAddPafModel"));
			        			
			        			 that.getView().byId("apprExpenseNum").setValue(Expense.length);
			        			JAddEafModel.setData(Expense);
			        			JAddEafModel.setSizeLimit(99999999999);
			        			that.getView().setModel(JAddEafModel, "JAddEafModel");
			        			that.getView().byId("idNotifExpenseFormTable").setModel(that.getView().getModel("JAddEafModel"));
			                }

			            });
					},
					
					notifTablePress: function(oEvent){
						var that = this;
						var TaskInstanceID = ""; 					
						var selectItem = ""; 	
						var bindingContext = oEvent.getSource().getBindingContext();
						var preqNo = bindingContext.getProperty("TaskTitle");


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
						
						var aDataForm = jQuery.ajax({
			                type : "GET",
			                contentType : "application/json",
			                url : "/bpmodata/tasks.svc/TaskCollection?$filter=Status eq 'READY'",
			                dataType : "json",
			                async: false, 
			                success : function(data,textStatus, jqXHR) {
			                }

			            });
						for(var j=0; j<aDataForm.responseJSON.d.results.length; j++) {
	            			 if(aDataForm.responseJSON.d.results[j].TaskTitle === preqNo){
	            				TaskInstanceID = aDataForm.responseJSON.d.results[j].InstanceID;   					
	     						selectItem = aDataForm.responseJSON.d.results[j].TaskDefinitionName;
	     						sap.ui.getCore().cSelectItemIndex = j;
	            			 }
	            		 
	            		 }
							
//						var TaskInstanceID = aDataForm.responseJSON.d.results[selectItemIndex].InstanceID;   					
//						var selectItem = aDataForm.responseJSON.d.results[selectItemIndex].TaskDefinitionName;
						
						if(selectItem==="Budget"){
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
					            var uiAction = startTypeINPUT.responseJSON.d.startTypeINPUT.start.UIAction;
					            		if(uiAction===null || uiAction==="1"){
					            			//Baf Onay			
					            			 var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
												oRouter.navTo("manBudget");
					            		}
					            		else if(uiAction==="2"){
					            			//Baf Send Back
					            			 var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
												oRouter.navTo("resendBudget");
					            		}
					            		else if(uiAction==="3"){
					            			//Baf Take Opinion
					            			 var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
												oRouter.navTo("takeOBudget");
					            		}
					            		
								}
						else if(selectItem==="Payment"){
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
				            // console.log(zdata);            					           					        
				            var uiAction = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_PaymentApproval.uiAction;
				            	if(uiAction===null || uiAction==="1" || uiAction==="" || uiAction===undefined){
				            		//Paf Onay
				            		 var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
										oRouter.navTo("manPayment");
				            	}
				            	else if(uiAction==="2"){
				            		//Paf Send Back
				            		 var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
										oRouter.navTo("resendPayment");
				            	}
				            	else if(uiAction==="3" || uiAction==="7"){
				            		//Paf Take Opinion
				            		 var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
										oRouter.navTo("takeOPayment");
				            	}
				            	
						
						}
						else if(selectItem==="Expense"){
							var startTypeINPUT = jQuery.ajax({
				                type : "GET",
				                contentType : "application/json",
				                url : "/bpmodata/taskdata.svc/"+TaskInstanceID+"/InputData('"+TaskInstanceID+"')?$format=json&$expand=startTypeINPUT/start/DO_EAF_Approver/FormDetails,startTypeINPUT/start/DO_EAF_Approver/ExpenseDetails/ExpenseList,startTypeINPUT/start/DO_EAF_Approver/ExpenseDetails/ExpenseList/item,startTypeINPUT/start/DO_EAF_Approver/Opinion,startTypeINPUT/start/DO_EAF_Approver/DO_T_PERSONEL,startTypeINPUT/start/DO_EAF_Approver/ProcessInitiator,startTypeINPUT/start/DO_EAF_Approver/Attachments,startTypeINPUT/start/ProcessInstanceAttributes/ProcessInitiator",
				                dataType : "json",
				                async: false, 
				                success : function(data,textStatus, jqXHR) {					      
				    				var oODataJSONModel = new sap.ui.model.json.JSONModel(data);		
				                }
				            });
				            
				            zdata = startTypeINPUT.responseJSON.d.startTypeINPUT.start;
				            // console.log(zdata);            					           					        
				            var uiAction = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_EAF_Approver.UI_Action;
							//EAF ISLEMLERI
				            
						 	if(uiAction===null || uiAction==="1" || uiAction==="" || uiAction===undefined){
			            		//Eaf Onay
			            		 var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
									oRouter.navTo("manExpense");
			            	}
			            	else if(uiAction==="2"){
			            		//Eaf Send Back
			            		 var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
									oRouter.navTo("resendExpense");
			            	}
			            	else if(uiAction==="3"){
			            		//Eaf Take Opinion
			            		 var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
									oRouter.navTo("takeOExpense");
			            	}
						} 						
					},
					
					formType : function (value) {
	                    	 if(uiAction===null || uiAction==="1" || uiAction==="" || uiAction===undefined){
				            		value = "APPROVE";
				            	}
				            	else if(uiAction==="2"){
				            		value = "SEND BACK";
				            	}
				            	else if(uiAction==="3"){
				            		value = "TAKE OPINION";
				            	}
	                    	 return value;
	                   
	              },
					
					dateConvert : function (value) {
	                     if (value) {
	                           var String=value.substring(value.lastIndexOf("(")+1,value.lastIndexOf(")"));
	                           var intDateVal=parseInt(String);
	                           var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "dd.MM.yyyy - HH:mm"}); 
	                           return oDateFormat.format(new Date(intDateVal));
	                     } else {
	                           return "Never Expires";
	                     }
	              },

					pressColumnBudget:function(oEvent){
						debugger;
						var that = this;
						var vBaf = oEvent.oSource.mAggregations.cells[0].mProperties.text;
						var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
						sap.ui.getCore().cBaf = vBaf ;
						
						sap.m.MessageBox.show(
							       "Do you want to go to the"+" "+vBaf+" "+" Budget Approval Form?", {
								         icon: sap.m.MessageBox.Icon.QUESTION,
								         actions: [sap.m.MessageBox.Action.YES ,sap.m.MessageBox.Action.NO],
								         onClose: function(oAction){
								        	 
								        	 if (oAction === sap.m.MessageBox.Action.YES) {
								        		 var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
													oRouter.navTo("SendItemBaf");
												}
								        	 if (oAction === sap.m.MessageBox.Action.NO) {
													
													
												}
								         },
								         styleClass: bCompact? "sapUiSizeCompact" : ""
								       }

								     );
						
					},
					backApprB:function(oEvent){
						var that = this;
						that.getView().byId("apprBudget").setVisible(true);
						that.getView().byId("apprExpense").setVisible(true);
						that.getView().byId("apprPayment").setVisible(true);
						that.getView().byId("idNotifBudgetFormTable").setVisible(false);
						that.getView().byId("idNotifPaymentFormTable").setVisible(false);
						that.getView().byId("idNotifExpenseFormTable").setVisible(false);
					
					},
					backApprP:function(oEvent){
						var that = this;
						that.getView().byId("apprBudget").setVisible(true);
						that.getView().byId("apprExpense").setVisible(true);
						that.getView().byId("apprPayment").setVisible(true);
						that.getView().byId("idNotifBudgetFormTable").setVisible(false);
						that.getView().byId("idNotifPaymentFormTable").setVisible(false);
						that.getView().byId("idNotifExpenseFormTable").setVisible(false);
					
					},
					backApprE:function(oEvent){
						var that = this;
						that.getView().byId("apprBudget").setVisible(true);
						that.getView().byId("apprExpense").setVisible(true);
						that.getView().byId("apprPayment").setVisible(true);
						that.getView().byId("idNotifBudgetFormTable").setVisible(false);
						that.getView().byId("idNotifPaymentFormTable").setVisible(false);
						that.getView().byId("idNotifExpenseFormTable").setVisible(false);						
					
					},
					apprBudgetTable:function(oEvent){
						var that = this;
						that.getView().byId("idNotifBudgetFormTable").setVisible(true);
						that.getView().byId("apprBudget").setVisible(false);
						that.getView().byId("apprExpense").setVisible(false);
						that.getView().byId("apprPayment").setVisible(false);
						that.getView().byId("idNotifPaymentFormTable").setVisible(false);
						that.getView().byId("idNotifExpenseFormTable").setVisible(false);
					
					},
					apprPaymentTable:function(oEvent){
						var that = this;
						that.getView().byId("idNotifPaymentFormTable").setVisible(true);
						that.getView().byId("idNotifBudgetFormTable").setVisible(false);
						that.getView().byId("idNotifExpenseFormTable").setVisible(false);	
						that.getView().byId("apprPayment").setVisible(false);
						that.getView().byId("apprBudget").setVisible(false);
						that.getView().byId("apprExpense").setVisible(false);
					
					},
					apprExpenseTable:function(oEvent){
						var that = this;
						that.getView().byId("idNotifExpenseFormTable").setVisible(true);
						that.getView().byId("idNotifBudgetFormTable").setVisible(false);
						that.getView().byId("idNotifPaymentFormTable").setVisible(false);
						that.getView().byId("apprBudget").setVisible(false);
						that.getView().byId("apprExpense").setVisible(false);
						that.getView().byId("apprPayment").setVisible(false);
					
					}
					
					});

				return Controller;
			});