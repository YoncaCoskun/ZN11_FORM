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
			
			var filterArr = {
					"Request Number": "BAFNO",
					"Request Date": "RQDAT",
					"Type": "TYPEE",
					"Status": "STATU"
				};
			var tableArr = ["BAFNO", "RQDAT", "TYPEE", "STATU"];

			var Controller = Controller.extend("zn11_form.controller.sendItemList", {
					onAfterRendering: function() {
						var that = this;
						unamePas = atob(window.localStorage["unamePas"]);
						arrayUserPas = unamePas.split(":");
						username = arrayUserPas[0];
						password = arrayUserPas[1];
						
						jQuery.ajax({
			                type : "GET",
			                contentType : "application/json",
			                url : "/RESTAdapter/b2b/findObject/"+username+"/BAF/",
			                dataType : "json",
			                async: false, 
			                success : function(data,textStatus, jqXHR) {
			                	that.getView().byId("siIconBudget").setCount(data.T_BAF.item.length);
			                  	var JAddBafModel = new sap.ui.model.json.JSONModel();
			                  	JAddBafModel.setData(data.T_BAF.item);
			                  	JAddBafModel.setSizeLimit(99999999999);
			        			that.getView().setModel(JAddBafModel, "JAddBafModel");
			        			that.getView().byId("idBudgetFormTable").setModel(that.getView().getModel("JAddBafModel"));
			                }

			            });
						
						jQuery.ajax({
			                type : "GET",
			                contentType : "application/json",
			                url : "/RESTAdapter/b2b/findObject/"+username+"/PAF/",
			                dataType : "json",
			                async: false, 
			                success : function(data,textStatus, jqXHR) {
			                	that.getView().byId("siIconPaf").setCount(data.T_PAF.item.length);
			                  	var JAddPafModel = new sap.ui.model.json.JSONModel();
			                  	JAddPafModel.setData(data.T_PAF.item);
			                  	JAddPafModel.setSizeLimit(99999999999);
			        			that.getView().setModel(JAddPafModel, "JAddPafModel");
			        			that.getView().byId("idPaymentFormTable").setModel(that.getView().getModel("JAddPafModel"));
			                }

			            });
						
						jQuery.ajax({
			                type : "GET",
			                contentType : "application/json",
			                url : "/RESTAdapter/b2b/findObject/"+username+"/EAF/",
			                dataType : "json",
			                async: false, 
			                success : function(data,textStatus, jqXHR) {
			                	that.getView().byId("siIconExpense").setCount(data.T_EAF.item.length);
			                  	var JAddEafModel = new sap.ui.model.json.JSONModel();
			                  	JAddEafModel.setData(data.T_EAF.item);
			                  	JAddEafModel.setSizeLimit(99999999999);
			        			that.getView().setModel(JAddEafModel, "JAddEafModel");
			        			that.getView().byId("idExpenseFormTable").setModel(that.getView().getModel("JAddEafModel"));
			                }

			            });
						
						this.mGroupFunctions = {
								RQDAT: function(oContext) {
									var name = oContext.getProperty("RQDAT");
									return {
										key: name,
										text: name
									};
								},
								TYPEE: function(oContext) {
									var name = oContext.getProperty("TYPEE");
									return {
										key: name,
										text: name
									};
								}
							};
						try{
							var oLabel = new sap.m.Label("labelId",{}).addStyleClass("labelStyle");
						
						
						var oInput = new sap.m.Input({
							width: "90%",
							change: function(oEvent) {
								var oValue = oEvent.getParameter("value");
								if(oValue==="APPROVED"){
									oValue = "A";
				            	}else if(oValue==="REJECTED"){
				            		oValue = "R";
				            	}else if(oValue==="SEND BACK"){
				            		oValue = "U";
				            	}else if(oValue==="DRAFT"){
				            		oValue = "D";
				            	}else if(oValue==="CREATE"){
				            		oValue = "C";
				            	}
								var oBindingPath = sap.ui.getCore().byId("labelId").getText();
								oBindingPath = filterArr[oBindingPath];
								var oFilter = new sap.ui.model.Filter(oBindingPath, "Contains", oValue);
								var oItems = oTable.getBinding("items");
								oItems.filter(oFilter);
								oResposivePopover.close();
							}
						});
						oLabel.setLabelFor(oInput);
						var oHBox = new sap.m.HBox({
							items: [oLabel, oInput]
						}).addStyleClass("HBoxStyle");
						var oResposivePopover = new sap.m.ResponsivePopover({
							title: "Filter",
							placement: "Bottom",
							content: [oHBox]
						});
						var oTable = that.getView().byId("idBudgetFormTable");
						oTable.addEventDelegate({
							onAfterRendering: function() {
								var oHeader = this.$().find('.sapMListTblHeaderCell'); //Get hold of table header elements
								for (var i = 0; i < oHeader.length; i++) {
									var oID = oHeader[i].id;
									$('#' + oID).click(function(oEvent) { //Attach Table Header Element Event
										var oTarget = oEvent.currentTarget; //Get hold of Header Element
										var oLabelText = oTarget.childNodes[0].textContent; //Get Column Header text
										oLabel.setText(oLabelText);
										oResposivePopover.openBy(oTarget);
										jQuery.sap.delayedCall(100, null, function() { //To highlight the entered input value
											var oInput = oResposivePopover.getContent()[0].getItems()[1];
											var oInputInner = oInput.$().find('.sapMInputBaseInner')[0].select();
										})
									})
								}
							}
						}, oTable);
							}catch(err){
							
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
					pressColumnBudget:function(oEvent){
						var that = this;
						var vBaf = oEvent.oSource.mAggregations.cells[0].mProperties.text;
						var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
						sap.ui.getCore().cBaf = vBaf ;
						
						 var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							oRouter.navTo("SendItemBaf");
						
					},
					pressColumnPaf:function(oEvent){
						var that = this;
						var vPaf = oEvent.oSource.mAggregations.cells[0].mProperties.text;
						var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
						sap.ui.getCore().cPaf = vPaf ;
						
						 var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							oRouter.navTo("SendItemPaf");
						
					},
					pressColumnEaf:function(oEvent){
						var that = this;
						var vEaf = oEvent.oSource.mAggregations.cells[0].mProperties.text;
						var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
						sap.ui.getCore().cEaf = vEaf ;
						
						 var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							oRouter.navTo("SendItemEaf");
						
					},
					_getDialog: function() {
						if (!this._oDialogs) {
							this._oDialogs = sap.ui.xmlfragment("zn11_form.view.setDialog", this);
							this.getView().addDependent(this._oDialogs);
						}
						return this._oDialogs;
					},
					handleOpenDialog: function() {
						this._getDialog().open();
					},
					handleConfirms: function() {
						for (var i = 0; i < 4; i++) {
							var selected = sap.ui.getCore().byId("s" + tableArr[i]).getSelected();
							this.getView().byId(tableArr[i]).setVisible(selected);
						}

					},

					dialogClose: function() {
						this._oDialogs.close();
						this._oDialogs.destroy();
					},

					handleConfirm: function(oEvent) {

						var oView = this.getView();
						var oTable = oView.byId("idBudgetFormTable");

						var mParams = oEvent.getParameters();
						var oBinding = oTable.getBinding("items");

						// apply sorter to binding
						// (grouping comes before sorting)
						var sPath;
						var bDescending;
						var vGroup;
						var aSorters = [];
						if (mParams.groupItem) {
							sPath = mParams.groupItem.getKey();
							bDescending = mParams.groupDescending;
							vGroup = this.mGroupFunctions[sPath];
							aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));
						}
						sPath = mParams.sortItem.getKey();
						bDescending = mParams.sortDescending;
						aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
						oBinding.sort(aSorters);

						// apply filters to binding
						var aFilters = [];
						jQuery.each(mParams.filterItems, function(i, oItem) {
							var aSplit = oItem.getKey().split("___");
							var sPath = aSplit[0];
							var sOperator = aSplit[1];
							var sValue1 = aSplit[2];
							var sValue2 = aSplit[3];
							var oFilter = new Filter(sPath, sOperator, sValue1, sValue2);
							aFilters.push(oFilter);
						});
						oBinding.filter(aFilters);

						// update filter bar
						// oView.byId("vsdFilterBar").setVisible(aFilters.length > 0);
						// oView.byId("vsdFilterLabel").setText(mParams.filterString);
					},

					handleViewSettingsDialogButtonPressed: function(oEvent) {
						if (!this._oDialog) {
							this._oDialog = sap.ui.xmlfragment("zn11_form.view.Dialog", this);
						}
						// toggle compact style
						jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
						this._oDialog.open();
					},

					
					});

				return Controller;
			});