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
	
	var comment;

	var unamePas;
	var arrayUserPas;
	var username;
	var password;



	var CController = Controller.extend("zn11_form.controller.resendExpense", {
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
          var dobeln = zdata.DO_EAF_Approver.DO_BELN;
          comment = vEFormDetails.Comment;
        
        if(uiAction === "2"){
	
            //Form Details
            that.getView().byId("ReExprequestOwner").setValue(vEFormDetails.RequestOwner);  
            that.getView().byId("ReExpdepartment").setValue(vEFormDetails.Department);   
            that.getView().byId("ReExptitle").setValue(vEFormDetails.Title);   
            that.getView().byId("ReExprequestNum").setValue(dobeln);   
            that.getView().byId("ReExprequestDate").setValue(vEFormDetails.RequestDate);   
            that.getView().byId("ReExprequestTime").setValue(vEFormDetails.RequestTime);  
            that.getView().byId("ReExpstatus").setValue("In-Progress"); 
            
            //Expense Details   
            that.getView().byId("ReExpCurrencyType").setValue(vExpenseDetails.CurrencyType); 
            that.getView().byId("ReExpCurrency").setValue(vExpenseDetails.Currency); 
            that.getView().byId("ReExpTotalAmount").setValue(vExpenseDetails.TotalAmount); 
            		//Expense List tablosunu almak icin begin of ycoskun
            var oJsonExpListModel = new sap.ui.model.json.JSONModel();
            oJsonExpListModel.setData(vExpenseDetails.ExpenseList.item);
    		that.getView().setModel(oJsonExpListModel, "JExpModel");
    		that.getView().byId("ReexpListTbl").setModel(that.getView().getModel("JExpModel"));	
            		//Expense List tablosunu almak icin end of ycoskun
            		
            
            //Expense Type   
            if(vExpRelWith === "Travel"){
            	that.getView().byId("ReExpRel-1").setSelected(true);
            }
            else{
            	that.getView().byId("ReExpRel-2").setSelected(true);
            }
            
            if(vExpPaid === "Corporate Credit Card"){
            	that.getView().byId("ReExpPaid-1").setSelected(true);
            }
            else{
            	that.getView().byId("ReExpPaid-2").setSelected(true);
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
          
    		}
    		catch(err){
    			
    		}	 
	
		},
		sendAction:function(){},
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
            that.getView().byId("ExpList1").setVisible(false);
            that.getView().byId("ReexpListTbl").setVisible(false);
            
            that.getView().byId("ExpList2").setVisible(true);
            that.getView().byId("ReexpListTbl2").setVisible(true);
            //Installment table edit etme end of ycoskun
            
            
          //Form Details
            /*that.getView().byId("ReExprequestOwner").setEnabled(true);  
            that.getView().byId("ReExpdepartment").setEnabled(true);   
            that.getView().byId("ReExptitle").setEnabled(true);   
            that.getView().byId("ReExprequestNum").setEnabled(true);   
            that.getView().byId("ReExprequestDate").setEnabled(true);   
            that.getView().byId("ReExprequestTime").setEnabled(true);  
            that.getView().byId("ReExpstatus").setEnabled(true); */
            
            //Expense Details   
            that.getView().byId("ReExpCurrencyType").setEnabled(true); 
            that.getView().byId("ReExpTotalAmount").setEnabled(true);
            
            		
            
            //Expense Type   
            	that.getView().byId("ReExpRel-1").setEnabled(true);
            	that.getView().byId("ReExpRel-2").setEnabled(true);
            
            	that.getView().byId("ReExpPaid-1").setEnabled(true);
            	that.getView().byId("ReExpPaid-2").setEnabled(true);
            
            


		
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

	});

	return CController;

});