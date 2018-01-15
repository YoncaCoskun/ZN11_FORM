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
			var NotifFirstModel = new sap.ui.model.json.JSONModel();
			var NotifSecModel = new sap.ui.model.json.JSONModel();

			var Controller = Controller.extend("zn11_form.controller.Notifications", {
				onAfterRendering: function() {
						var that = this;
						unamePas = atob(window.localStorage["unamePas"]);
						arrayUserPas = unamePas.split(":");
						username = arrayUserPas[0];
						password = arrayUserPas[1];
						
						jQuery.ajax({
			                type : "GET",
			                contentType : "application/json",
			                url : "/RESTAdapter/b2b/processLog/"+username+"/*/*",
			                dataType : "json",
			                async: false, 
			                success : function(data,textStatus, jqXHR) {
			                	
			                	NotifFirstModel.setData(data.T_LOG.item);
			                	NotifFirstModel.setSizeLimit(99999);
//			                  	that.getView().setModel(JAddBafModel, "JAddBafModel");
//			        			that.getView().byId("idNotifsBudgetFormTable").setModel(that.getView().getModel("JAddBafModel"));
			        			
			                }

			            });
						
						var country = NotifFirstModel.oData;
		           		 
	        			var a = [];
		           		 var b = [];
		           		 for(var i=0; i<country.length; i++) {
		           		   if(a.indexOf(country[i].OBJNO) === -1) {
		           		     a.push(country[i].OBJNO);
		           		   }
		           		 }
		           		 for(var j=0; j<a.length; j++) {
		           		   var object = {};
		           		   object.OBJNO = a[j];
		           		   b.push(object);
		           		 }
		           		 var PrdhaModel = new sap.ui.model.json.JSONModel();
		           		 

		                	var Budget = [];
		        			 var Payment = [];
		        			 var Expense = [];
		        			 var JAddBafModel = new sap.ui.model.json.JSONModel();
		                   	var JAddPafModel = new sap.ui.model.json.JSONModel();
		                   	var JAddEafModel = new sap.ui.model.json.JSONModel();
		                   	
		            		 for(var j=0; j<b.length; j++) {
		            			 if(b[j].OBJNO.slice(5, 8) === "BAF"){
		            				 Budget.push(b[j]);
		            			 }else if(b[j].OBJNO.slice(5, 8) === "PAF"){
		            				 Payment.push(b[j]);
		            			 }else if(b[j].OBJNO.slice(5, 8) === "EAF"){
		            				 Expense.push(b[j]);
		            			 }
		            		 
		            		 }
		            		 that.getView().byId("apprBudgetNum").setValue(Budget.length);
		                  	JAddBafModel.setData(Budget);
		                  	JAddBafModel.setSizeLimit(99999999999);
		        			that.getView().setModel(JAddBafModel, "JAddBafModel");
		        			that.getView().byId("idNotifsBudgetFormTable").setModel(that.getView().getModel("JAddBafModel"));
		        			
		        			 that.getView().byId("apprPafNum").setValue(Payment.length);
		        			JAddPafModel.setData(Payment);
		        			JAddPafModel.setSizeLimit(99999999999);
		        			that.getView().setModel(JAddPafModel, "JAddPafModel");
		        			that.getView().byId("idNotifsPafFormTable").setModel(that.getView().getModel("JAddPafModel"));
		        			
		        			 that.getView().byId("apprExpenseNum").setValue(Expense.length);
		        			JAddEafModel.setData(Expense);
		        			JAddEafModel.setSizeLimit(99999999999);
		        			that.getView().setModel(JAddEafModel, "JAddEafModel");
		        			that.getView().byId("idNotifsExpenseFormTable").setModel(that.getView().getModel("JAddEafModel"));
		           		  
		           		
//		           		 PrdhaModel.setData(b);
//		           		that.getView().setModel(PrdhaModel, "NotifFirstModel");
//	        			that.getView().byId("idNotifsBudgetFormTable").setModel(that.getView().getModel("NotifFirstModel"));
					},
					statusObjty : function (value) {
							if(value===1){
			            		value = "APPROVED";
			            	}else if(value===0){
			            		value = "REJECTED";
			            	}else if(value===2){
			            		value = "SEND BACK";
			            	}else if(value===3){
			            		value = "TAKE OPINION";
			            	}else if(value===-2){
			            		value = "PENDING";
			            	}else if(value===-1){
			            		value = "CREATE";
			            	}else if(value===4){
			            		value = "EDITED";
			            	}
			            	else if(value===5){
			            		value = "COMPLETED";
			            	}
                   	 return value;
                  
						},
						backNotifB:function(oEvent){
							var that = this;
							that.getView().byId("idNotifsBudgetFormTable").setVisible(true);
							that.getView().byId("idNotifDetailTableB").setVisible(false);
						
						},
						backNotifP:function(oEvent){
							var that = this;
							that.getView().byId("idNotifsPafFormTable").setVisible(true);
							that.getView().byId("idNotifDetailTableP").setVisible(false);
						
						},
						backNotifE:function(oEvent){
							var that = this;
							that.getView().byId("idNotifsExpenseFormTable").setVisible(true);
							that.getView().byId("idNotifDetailTableE").setVisible(false);
						
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
						
						pressColumnBudget:function(oEvent){
							var that = this;
							that.getView().byId("idNotifsBudgetFormTable").setVisible(false);
							that.getView().byId("idNotifDetailTableB").setVisible(true);
							var vBaf = oEvent.oSource.mAggregations.cells[0].mProperties.text;
							that.getView().byId("notifDetTitleB").setText(vBaf+" Details");
							
							jQuery.ajax({
				                type : "GET",
				                contentType : "application/json",
				                url : "/RESTAdapter/b2b/processLog/*/*/"+vBaf+"",
				                dataType : "json",
				                async: false, 
				                success : function(data,textStatus, jqXHR) {
				                	
				                
				           		  
				                	NotifSecModel.setData(data.T_LOG.item);
				                  	NotifSecModel.setSizeLimit(99999);
				                  	that.getView().setModel(NotifSecModel, "NotifSecModel");
				        			that.getView().byId("idNotifDetailTableB").setModel(that.getView().getModel("NotifSecModel"));
				        			
				                }

				            });
							
						},
						pressColumnPaf:function(oEvent){
							var that = this;
							that.getView().byId("idNotifsPafFormTable").setVisible(false);
							that.getView().byId("idNotifDetailTableP").setVisible(true);
							var vBaf = oEvent.oSource.mAggregations.cells[0].mProperties.text;
							that.getView().byId("notifDetTitleP").setText(vBaf+" Details");
							
							jQuery.ajax({
				                type : "GET",
				                contentType : "application/json",
				                url : "/RESTAdapter/b2b/processLog/*/*/"+vBaf+"",
				                dataType : "json",
				                async: false, 
				                success : function(data,textStatus, jqXHR) {
				                	
				                
				           		  
				                	NotifSecModel.setData(data.T_LOG.item);
				                  	NotifSecModel.setSizeLimit(99999);
				                  	that.getView().setModel(NotifSecModel, "NotifSecModel");
				        			that.getView().byId("idNotifDetailTableP").setModel(that.getView().getModel("NotifSecModel"));
				        			
				                }

				            });
							
						},
						pressColumnExpense:function(oEvent){
							var that = this;
							that.getView().byId("idNotifsExpenseFormTable").setVisible(false);
							that.getView().byId("idNotifDetailTableE").setVisible(true);
							var vBaf = oEvent.oSource.mAggregations.cells[0].mProperties.text;
							that.getView().byId("notifDetTitleE").setText(vBaf+" Details");
							
							jQuery.ajax({
				                type : "GET",
				                contentType : "application/json",
				                url : "/RESTAdapter/b2b/processLog/*/*/"+vBaf+"",
				                dataType : "json",
				                async: false, 
				                success : function(data,textStatus, jqXHR) {
				                	
				                
				           		  
				                	NotifSecModel.setData(data.T_LOG.item);
				                  	NotifSecModel.setSizeLimit(99999);
				                  	that.getView().setModel(NotifSecModel, "NotifSecModel");
				        			that.getView().byId("idNotifDetailTableE").setModel(that.getView().getModel("NotifSecModel"));
				        			
				                }

				            });
			           		
						},
					pressColumnBudgetOld:function(oEvent){
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
						
						that.getView().byId("notifHome").setVisible(true);
						that.getView().byId("notifBudgetPanel").setVisible(false);
						that.getView().byId("idNotifsBudgetFormTable").setVisible(false);
						that.getView().byId("idNotifsPafFormTable").setVisible(false);
						that.getView().byId("idNotifsExpenseFormTable").setVisible(false);
					},
					backApprP:function(oEvent){
						var that = this;
						that.getView().byId("notifHome").setVisible(true);
						that.getView().byId("notifBudgetPanel").setVisible(false);
						that.getView().byId("idNotifsBudgetFormTable").setVisible(false);
						that.getView().byId("idNotifsPafFormTable").setVisible(false);
						that.getView().byId("idNotifsExpenseFormTable").setVisible(false);
						
					},
					backApprE:function(oEvent){
						var that = this;
						that.getView().byId("notifHome").setVisible(true);
						that.getView().byId("notifBudgetPanel").setVisible(false);
						that.getView().byId("idNotifsBudgetFormTable").setVisible(false);
						that.getView().byId("idNotifsPafFormTable").setVisible(false);
						that.getView().byId("idNotifsExpenseFormTable").setVisible(false);
						
					
					},
					apprBudgetTable:function(oEvent){
						var that = this;
						
						that.getView().byId("notifHome").setVisible(false);
						that.getView().byId("notifBudgetPanel").setVisible(true);
						that.getView().byId("idNotifsBudgetFormTable").setVisible(true);
						that.getView().byId("idNotifsPafFormTable").setVisible(false);
						that.getView().byId("idNotifsExpenseFormTable").setVisible(false);
					
					},
					apprPaymentTable:function(oEvent){
						var that = this;
						
						that.getView().byId("notifHome").setVisible(false);
						that.getView().byId("notifBudgetPanel").setVisible(true);
						that.getView().byId("idNotifsPafFormTable").setVisible(true);
						that.getView().byId("idNotifsBudgetFormTable").setVisible(false);
						that.getView().byId("idNotifsExpenseFormTable").setVisible(false);
					
					},
					apprExpenseTable:function(oEvent){
						var that = this;
						
						that.getView().byId("notifHome").setVisible(false);
						that.getView().byId("notifBudgetPanel").setVisible(true);
						that.getView().byId("idNotifsExpenseFormTable").setVisible(true);
						that.getView().byId("idNotifsBudgetFormTable").setVisible(false);
						that.getView().byId("idNotifsPafFormTable").setVisible(false);
					
					}
					
					});

				return Controller;
			});