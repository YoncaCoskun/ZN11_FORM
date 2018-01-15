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
	'sap/ui/model/resource/ResourceModel',
	'sap/m/MessageToast',
	'sap/ui/model/Filter',
	'sap/m/MessageBox',
	'sap/ui/commons/TextField'

], function(MessagePopover, MessagePopoverItem, Link, jQuery, Fragment, Controller, JSONModel, AnnotationHelper, Popover, Button,
		ResourceModel, MessageToast, Filter,MessageBox,TextField) {

	"use strict";
	var imgData = "";
	var usersTo = [];
	var multiUserTo = [];
	var usersInf = [];
	var multiUserInf = [];
	var attachFiles = [];
	var username;
	var password;
	var unamePas;
	var arrayUserPas;
	var sDate;
	var sTime;
	var selectItem;
	var oModel = new sap.ui.model.json.JSONModel();
	var oSelectedRadioText;
	var oSelectedIndex;
	var oSelectedIndexPaid;
	var oSelectedPaidText;
	var sKur;
	var vUSD;
	var vTotalAmountKur;
	var tableExpList = [];
	
	var oExpenseList = [];
	
	var inputIdRem;
	var countRem = 0;
	var inputArrayRem = [];
	
	var columnListItemExpList;
	
	var Attachments = [];
	var jModel = new sap.ui.model.json.JSONModel();
	var attTableData = {};
	
	var CController = Controller.extend("zn11_form.controller.Expense", {

		model: new sap.ui.model.json.JSONModel(),

		onAfterRendering: function() {
			
			var oThat = this;
			unamePas = atob(window.localStorage["unamePas"]);
			arrayUserPas = unamePas.split(":");
			username = arrayUserPas[0];
			password = arrayUserPas[1];
			
			//begin of startdata personel department cekme
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
	    		 
	    		 oThat.getView().byId('ExprequestOwner').setValue(arrayPers[0] + " " + arrayPers[1]);
	    		 oThat.getView().byId('Expdepartment').setValue(arrayPers[2]);
	    		 oThat.getView().byId('Exptitle').setValue(arrayPers[3]);
				
				//end of ycoskun
				
			}catch(err){
				
			}
			
			 //begin of ycoskun Request Date otomatik getirme
   		 var today = new Date();
   		 var dd = today.getDate();
   		 var mm = today.getMonth()+1; 
   		 var yyyy = today.getFullYear();
   		 
   		 var hour = today.getHours();
   		 var min = today.getMinutes();
   		 var sec = today.getSeconds();
   		 var time = hour + ":" + min;

   		 
   	
   		 if(dd<10) {
   		     dd = '0'+dd
   		 } 

   		 if(mm<10) {
   		     mm = '0'+mm
   		 } 

   		 today = dd + '/' + mm + '/' + yyyy;
   		 sDate = yyyy.toString()+mm.toString()+dd;
   		 sTime = hour.toString()+':'+min.toString()+':'+sec.toString();
   		 oThat.getView().byId('ExprequestDate').setValue(today);
   		 oThat.getView().byId('ExprequestTime').setValue(sTime);
   		 //end of ycoskun	
   		 
   		jModel.setData(Attachments);
		this.getView().byId("insExpense").setModel(jModel)
			
		},
		
		addRow : function(oArg){
			
			
			Attachments.push({Name : ''});
			jModel.refresh();//which will add the new record
		},
		
		deleteRow : function(oArg){
			var deleteRecord = oArg.getSource().getBindingContext().getObject();
			for(var i=0;i<Attachments.length;i++){
				if(Attachments[i] == deleteRecord )
						{
						//	pop this._data.Products[i] 
					Attachments.splice(i,1); //removing 1 record from i th index.
							jModel.refresh();
							break;//quit the loop
						}
			}
		},
		
		handleValueChange: function(oEvent) {
			MessageToast.show("Added " + oEvent.getParameter("newValue") + "");
			
			
			
			this.handleUploadPress();
		},
		
		
		handleUploadComplete: function(oEvent) {
			 var fileValue = oEvent.getParameter("response");

			    fileuploader = oEvent.getSource(),

			    type = oEvent.getParameter("response").split(";base64")[0].split("data:")[1];
		},

		handleUploadPress: function() {
				var that = this;
				var oFileUploader = that.getView().byId("fileuploadExpense");
				var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
				var form = sap.ui.getCore().byId("simpleFormAttach");
				
				var fileNames = file.name.split(".");
				var fileTypes = file.type.split("/");

function getBase64(file) {
   var reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = function () {
	Attachments.push({
    	"Content":reader.result,
    	"FileName":fileNames[0],
    	"FileType":fileTypes[1]});
	
   };
   reader.onerror = function (error) {
     // console.log('Error: ', error);
   };
}

var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
getBase64(file);
setTimeout(function(){
	jModel.refresh();
},500);

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
			var oUserToDialog = this.getDialogUser();
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
			var aContexts = oEvent.getParameter("selectedContexts");
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
				this.oAttachAddDialog = sap.ui.xmlfragment("zn11_form.view.AttachDialogExpense", this);
				this.getView().addDependent(this.oAttachAddDialog);
			}

			return this.oAttachAddDialog;
		},

		//Attachment close butonu
		onCloseAttachDialogExpense: function(oEvent) {
			if (!this.oAttachAddDialog) {
				this.oAttachAddDialog = sap.ui.xmlfragment("zn11_form.view.AttachDialogExpense", this.getView().getController());

			}
			var oFileUploader = sap.ui.getCore().byId("fileuploadExpense");
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
					id: "button" + attachFiles[m].name,
					press: function(oEvent) {
						alert("Dosyalarr!!" + oEvent.getSource().getId());

					}
				});
				form.addContent(oButton);
			}
			attachFiles = [];
		},
		//File Upload
		uploadFileExpense: function() {

			var oFileUploader = sap.ui.getCore().byId("fileuploadExpense");
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
									id: "button_" + file.name,
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
		sendAction:function(){

			
			var that = this;
			var oHeaders;
			var oToken;
			
			jQuery.ajax({
				  url: "/bpmodata/startprocess.svc/itelligence.com.tr/expense/Expense_Approval/$metadata",
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
			var oURL = "/bpmodata/startprocess.svc/itelligence.com.tr/expense/Expense_Approval/StartData";	
			
			if(oSelectedRadioText === undefined){
				oSelectedRadioText = that.getView().byId("ExpRel-1").getText();
			}
			if(oSelectedPaidText === undefined){
				oSelectedPaidText = that.getView().byId("ExpPaid-1").getText();
			}
			var hesap = parseInt(that.getView().byId("ExpTotalAmount").getValue())/parseInt(vUSD);
			
			vTotalAmountKur = hesap.toString();

		//Expense List array'i doldurma begin of ycoskun
			var vDate, vDescp, vAmount,vTax,vRelBudgetNo;
			
			for (var i = 0; i < tableExpList.length; i++) {
				vDate = tableExpList[i].mAggregations.cells["0"].mProperties.value;
				vDescp = tableExpList[i].mAggregations.cells["1"].mProperties.value;
				vAmount = tableExpList[i].mAggregations.cells["2"].mProperties.value;
				vTax = tableExpList[i].mAggregations.cells["3"].mProperties.value;
				vRelBudgetNo = tableExpList[i].mAggregations.cells["4"].mProperties.value;
				
				if(vTax === "0"){
					vTax="V0";
				}
				else if(vTax === "1"){
					vTax="V3";
				}
				else if(vTax === "8"){
					vTax="V1";
				}
				else if(vTax === "18"){
					vTax="V2";
				}
				var arrayStart,count;
				var sTarih;
				var startNok;
				var counter;
				var sTarih;

				//date'in EN veya TR gelip gelmedğinin kontrolü begin of
				startNok = vDate.slice(1,2);

				if(startNok !== "."){
					startNok = vDate.slice(2,3);
				}
				else{
					startNok = vDate.slice(1,2);
				}
				
				//end of
				if(startNok === "."){		
					arrayStart = vDate.split(".");
					count = arrayStart[0].length;
					if (count === 1) {
						arrayStart[0] = "0" + arrayStart[0];
						
					}
					sTarih = arrayStart[2] + arrayStart[1] + arrayStart[0];
					
					
				}
				else{
					arrayStart = vDate.split("/");
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

				}				
				oExpenseList.push({
					Date: sTarih,
					Description: vDescp,
					Amount: vAmount,
					TaxCategory:vTax,
					RelatedBudgetNumber:vRelBudgetNo
				});
			}
			
			try{
				html2canvas($('#__panel2'), {
		            onrendered: function(canvas) { 
		                 imgData = canvas.toDataURL('application/pdf');     
		            }
		        });
			}catch(err){
				html2canvas($('#__panel3'), {
		            onrendered: function(canvas) { 
		                 imgData = canvas.toDataURL(
		                    'application/pdf');     
		            }
		        });
			}
			
		//Expense List array'i doldurma end of ycoskun	
			
				 setTimeout(function(){	
					 Attachments.push({
							"Content":imgData,
					    	"FileName":"SCREENSHOT",
					    	"FileType":"PNG"
						});
						var oEntry = {
								"ProcessStartEvent": {"ExpenseApproval": {
								    "FormDetails": {
								        "RequestOwner": that.getView().byId("ExprequestOwner").getValue(),
								        "RequestNumber": "",
								        "Department": that.getView().byId("Expdepartment").getValue(),
								        "RequestDate": that.getView().byId("ExprequestDate").getValue(),
								        "RequestTime": "",
								        "Title": that.getView().byId("Exptitle").getValue(),
								        "Status": ""
								    	},
								    "ExpenseDetails": {
								        "CurrencyType": that.getView().byId("ExpCurrencyType").getSelectedKey(),
								        "Currency": that.getView().byId("ExpCurrency").getValue(),
								        "ExpenseList": {"Item": oExpenseList}
								    },
								    "TotalAmount": that.getView().byId("ExpTotalAmount").getValue(),
								    "TotalAmountUSD": vTotalAmountKur,
								    "ExpRelWith": oSelectedRadioText,
								    "ExpPaidBy": oSelectedPaidText,
								    "Attachments":{"item": Attachments},
								    "Opinion": {
								        "OpRcvCode": "",
								        "OpRcvComment": "",
								        "OpRcvDepartment": "",
								        "OpRcvName": "",
								        "OpRcvPerNo": "",
								        "OpRcvSurname": "",
								        "OpRcvTitle": "",
								        "OpSndCode": "",
								        "OpSndComment": "",
								        "OpSndDepartment": "",
								        "OpSndName": "",
								        "OpSndPerNo": "",
								        "OpSndSurname": "",
								        "OpSndTitle": ""
								    }
								    
								}}
						};
					
						jQuery.ajax({
					        type: 'POST',
					        url: oURL,
					        data: JSON.stringify(oEntry),
					        dataType: "json",
					        Cookie: 'csrftoken='+ oToken,
					        headers: {
				                "X-CSRF-Token": oToken,
				                "Content-Type": "application/json"              	
				            },
					        success: function(result) {
					        	
					        	// console.log(result);					 				     	
					    		var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
					    	
					    		var onBusyDialogPress = that.getDialogBusy();	
					    		onBusyDialogPress.open();  		
					    	
								jQuery.sap.delayedCall(3000, that, function () {
									onBusyDialogPress.close();								
									
									sap.m.MessageBox.show(
										       "Form escalated to senior manager..", {
											         icon: sap.m.MessageBox.Icon.SUCCESS,
											         actions: [sap.m.MessageBox.Action.OK],
											         onClose: function(oAction){
											        	 if (oAction === sap.m.MessageBox.Action.OK) {
																that.getOwnerComponent().getRouter().navTo("Home");
																window.location.reload();
															}
											         },
											         styleClass: bCompact? "sapUiSizeCompact" : ""
											       }

											     );
									
									
								});	
							
									
										
								
							
								
								
			
					        }
					    });
						
				 },2000);
				 
		        
			
		
		
		},
		getDialogBusy: function() {
			this.oBusyDialog = sap.ui.xmlfragment("zn11_form.view.BusyDialog", this);
			this.getView().addDependent(this.oBusyDialog);


			return this.oBusyDialog;
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
		                vUSD = data.E_USD;
		                oThat.getView().byId('ExpCurrency').setValue(sKur);
		             
		    			
		                
		                }
		        
		        });
		},
		selectFormType:function(oEvent){
			
			var that = this;
			oSelectedIndex = oEvent.getParameter("selectedIndex");  
			var oRadioButtonSrc = oEvent.getSource().getAggregation("buttons");  
			oSelectedRadioText = oRadioButtonSrc[oSelectedIndex].getText();
		

		},
		selectFormTypePaid:function(oEvent){
			
			var that = this;
			oSelectedIndexPaid = oEvent.getParameter("selectedIndex");  
			var oRadioButtonSrc = oEvent.getSource().getAggregation("buttons");  
			oSelectedPaidText = oRadioButtonSrc[oSelectedIndex].getText();
		

		},
		onAddExpList:function(){
			
			var that = this;
			countRem = countRem + 1;
			inputIdRem = "textt" + countRem;
			var onAddBudgetDialogPress;
			
			columnListItemExpList = new sap.m.ColumnListItem({
			 				type: sap.m.ListType.Inactive,
			 				unread: false,
			 				cells: [
			 					new sap.m.DatePicker({
			 						value:"",
			 						width:"6rem"
			 					}),
			 					new sap.ui.commons.TextField({	
			 						value: "",
			 						width:"5rem",
			 						liveChange: function(oEvent) {},
			 						change:function(oEvent){}
			 					}),
			 					new sap.ui.commons.TextField({	
			 						value: "",
			 						width:"5rem",
			 						liveChange: function(oEvent) {},
			 						change:function(oEvent){}
			 					}),
			 					new sap.ui.commons.TextField({	
			 						value: "",
			 						width:"3rem",
			 						liveChange: function(oEvent) {},
			 						change:function(oEvent){}
			 					}),
			 					new sap.m.Input({
			 						value: "",
			 						width:"9rem",
			 						id:inputIdRem,
			 						editable:false,
			 						showValueHelp:true,
			 						valueHelpRequest:function(){
			 							onAddBudgetDialogPress = that.getDialogAddBudget();
			 							// Expense için BAF Formlarının getirilmesi begin of ycoskun
			 							jQuery.ajax({
			 				                type : "GET",
			 				                contentType : "application/json",
			 				                url : "/RESTAdapter/b2b/findObject/"+username+"/BAF/",
			 				                dataType : "json",
			 				                async: false, 
			 				                success : function(data,textStatus, jqXHR) {
			 				                	
			 				                  	var JAddBafModel = new sap.ui.model.json.JSONModel();
			 				                  	JAddBafModel.setData(data.T_BAF.item);
			 				        			that.getView().setModel(JAddBafModel, "JAddBafModel");
			 				        			sap.ui.getCore().byId("idAddBudgetPaymentFormTable").setModel(that.getView().getModel("JAddBafModel"));
			 				                }

			 				            });
			 							//Expense için BAF Formlarının getirilmesi end of ycoskun 
			 							onAddBudgetDialogPress.open();
			 							
			 						}
			 					}),
			 				]
			 			});
			 			
			 			that.getView().byId("expListTbl").addItem(columnListItemExpList);
			 			tableExpList.push(columnListItemExpList);
			 			inputArrayRem.push(inputIdRem);	 
			 			that.getView().byId("checkRelNo").setVisible(true);
			 			that.getView().byId("checkRelNo").setSelected(false);

				
		
			 //aynı bafın eklenme kontrolü end of ycoskun
				
			
			that.onAddBudgetDialogPress.destroy();
	
			
		},
		handleCancelBaf:function(){
			var that = this;
			this.onAddBudgetDialogPress.destroy();
		},
		getDialogAddBudget: function() {
			var that = this;
			that.onAddBudgetDialogPress = sap.ui.xmlfragment("zn11_form.view.AddBudgetPaymentForm", that);
			that.getView().addDependent(that.onAddBudgetDialogPress);

			return that.onAddBudgetDialogPress;
		},
		selectCheckRel:function(){	
			
			var that = this;
			var selectRelNo = that.getView().byId("checkRelNo").getSelected();
			var vBafNo;
			
			if(selectRelNo === true){
				for (var a = 0; a < inputArrayRem.length; a++) {	
						sap.ui.getCore().byId(inputArrayRem[a]).setEditable(true);
				}			
			}
			else{
				for (var a = 0; a < inputArrayRem.length; a++) {	
					sap.ui.getCore().byId(inputArrayRem[a]).setEditable(false);
			}
			}
			
		},
		handleCloseBaf: function(oEvent) {
			var that = this;
			var vBafNo;
			var aContexts = oEvent.getParameter("selectedContexts");

			if (aContexts && aContexts.length) {
				vBafNo = aContexts.map(function(oContext) { return oContext.getObject().BAFNO; }).join(", ");
			}
			for (var a = 0; a < inputArrayRem.length; a++) {	
				sap.ui.getCore().byId(inputArrayRem[a]).setValue(vBafNo);
			}	
			
			
		}

	});

	return CController;

});