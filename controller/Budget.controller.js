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
	'sap/m/MessageBox',
	'sap/ui/commons/TextField'
], function(MessagePopover, MessagePopoverItem, Link, jQuery, Fragment, Controller, JSONModel, AnnotationHelper, Popover, Button,
	ResourceModel, MessageToast, Filter,MessageBox,TextField) {
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
	//var columnListItemNewLine;
	var inputArrayId = [];
	var buttonArrayId = [];
	var tableList = [];
	var oInstallments = [];
	var sDate;
	var sTime;
	var TaskInstanceID;
	var supplierModel = new sap.ui.model.json.JSONModel();
	var idSuppVis;

	var relModel = new sap.ui.model.json.JSONModel();
	var searchModel = new sap.ui.model.json.JSONModel();
	var searchModelRel = new sap.ui.model.json.JSONModel();

	var oSelectedRadioText;
	var oSelectedIndex;
	var vUSD;

	var twoEntry = [];
	var oModel = new sap.ui.model.json.JSONModel();
	var sKur;
	var selectItem;
	var imgData = "";
	var zdata = [];
	var selectsSupp = [];
	

	var selectsRel = [];
	
	var unamePas;
	var arrayUserPas;
	var username;
	var password;
	
	var Attachments = [];
	var jModel = new sap.ui.model.json.JSONModel();
	var attTableData = {};
	
	var CController = Controller.extend("zn11_form.controller.Budget", {
		serviceUrl : "/bpmodata/taskdata.svc/",
		bpmPrefixParameter : "?prefixReservedNames=true",
		
		oDataSettings : {
			json : true,
			useBatch : false,
			disableHeadRequestForToken : true
		},

		model: new sap.ui.model.json.JSONModel(),
		onAfterRendering: function() {
           
			sap.ui.getCore().busyDialog1.open();
			var oThat = this;
			unamePas = atob(window.localStorage["unamePas"]);
			arrayUserPas = unamePas.split(":");
			username = arrayUserPas[0];
			password = arrayUserPas[1];
			 this.monthNames = ["January", "February", "March", "April", "May", "June",
	                                "July", "August", "September", "October", "November", "December" ];
			
			
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
	    		 
	    		 oThat.getView().byId('requestOwner').setValue(arrayPers[0] + " " + arrayPers[1]);
	    		 oThat.getView().byId('department').setValue(arrayPers[2]);
	    		 //oThat.getView().byId('requestNum').setValue(arrayPers[0]);
	    		 oThat.getView().byId('title').setValue(arrayPers[3]);
				
				//end of ycoskun
				
			}catch(err){
				
			}
			
			
			var budgetModel = new sap.ui.model.json.JSONModel();
			var budgetIdModel = new sap.ui.model.json.JSONModel();
			var selects = [];
			var selectId = [];
			var budgetId ;
		     //"http://dperppo01d.n11.local:50000/RESTAdapter/b2b/SearchHelp/DEPARTMENT="+department+"&INPUT_BUDGET_DEPARTMENT"
		        var aData = jQuery.ajax({
		            type : "GET",
		            contentType : "application/json",
		            url : "/RESTAdapter/b2b/SearchHelp/*&INPUT_BUDGET_DEPARTMENT",
		            dataType : "json",
		            async: false, 
		            success : function(data,textStatus, jqXHR) {
		                oModel.setData({modelData : data}); 
		                // console.log(data);
		                
		                for(var i = 0; i < data.T_RESULT.item.length; i++) {
		                   var text = data.T_RESULT.item[i];	                    
		                    var array = text.STRING.split('@');
		                    budgetId = array[0];
		                    selects.push({
		                    	name:array[1]+" - "+array[2]+" - "+array[3]+" - "+array[4]+" - "+array[0]
		                    });
		                   // selectId.push(budgetId);	                    		                    
		                 }		               
		                // console.log(selects);
		                budgetModel.setSizeLimit(999999);
		    			budgetModel.setData(selects);
		    			oThat.getView().setModel(budgetModel,"budgetModel");
		    			
//		    			//budgetIdModel.setData(Id);
//		    			budgetModel.setProperty("/comboBoxValue", "");
//		    			budgetModel.setProperty("/comboBoxKey", "");
//		                
//		    			var Budget = oThat.getView().byId("idBudget");
//		    		    Budget.setModel(budgetModel, "budgetModel");
//		    		    // console.log(Budget);
//		    		    
//		    			var fText = oThat.getView().byId('idText');
//		    			Budget.bindItems("budgetModel>/", fText);
		    			
		            }
		        
		        });
		        
		        
				//supplier search help begin of 
		        var jsonResult;
		      
		
		        var aData = jQuery.ajax({
		            type : "GET",
		            contentType : "application/json",
		            url : "/RESTAdapter/b2b/SearchHelp/NAME1*&VENDOR",
		            dataType : "json",
		            async: false, 
		            success : function(data,textStatus, jqXHR) {
		            	oModel.setData({modelData : data}); 
		                // console.log(data);
		                
		                for(var i = 0; i < data.T_RESULT.item.length; i++) {
		             
			                   var text = data.T_RESULT.item[i];	                    
			                   var array = text.STRING.split('@');
			                   var test = array[1];
			                   var id = array[0];
			           
			                   
			                   jsonResult = {
			                		   name: test,
			                		   id: id};
			 
			                   
			                    selectsSupp.push(jsonResult);
			                 
			                    
			                    
			                		                    
			                 }	
		                
		    			// console.log(selectsSupp);
		    			supplierModel.setData(selectsSupp);
		    			
		    		
		    	
		    		    
		    			

		                
		            }
		        
		        });		        
		        //end of
		      //supplier search help begin of 	     
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
			                    selectsRel.push({
			                    			name: array[1],
			                    			id: array[0]});
			                   // selectId.push(budgetId);	                    
			                    
			                 }
			               
		    			// console.log(selectsRel);
		    			relModel.setData(selectsRel);
		                
		            }
		        
		        });		        
		        //end of
		      
		    
	    		 
//	    		 begin of ycoskun Request Date otomatik getirme
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
	    		 sTime = hour.toString()+':'+min.toString();
	    		 oThat.getView().byId('requestDate').setValue(dd+"/"+mm.toString()+"/"+yyyy.toString());
	    		 oThat.getView().byId('requestTime').setValue(hour +":"+ min);
	    		 
	    		 var today = new Date();
	    		 var dd = today.getDate();
	    		 var mm = today.getMonth(); 
	    		 var yyyy = today.getFullYear();
	    		 
	    		 oThat.getView().byId("periodStart").setMinDate(new Date(yyyy, mm, dd + 7));
	    		 oThat.getView().byId("periodStart").setDateValue(new Date(yyyy, mm, dd + 7));
	    		 
	    		 oThat.getView().byId("periodEnd").setMinDate(new Date(yyyy, mm, dd + 7));
	    		 oThat.getView().byId("periodEnd").setDateValue(new Date(yyyy, mm, dd + 7));
	    		
	//----------------------------------------------------------------------------------------    		 
	    		 //begin of Installements input alanlarının otomatik açılması

//	 			var oThat = this;
//	 			var today = new Date();
//	 			var mm = today.getMonth() + 1;
//	 	   		var yyyy = today.getFullYear();
//	 			var monthCount = (12 - parseInt(mm)) + 1;
//	 		//	var mount, year;
//	 			var date;
//	 			var count = 0;
//	 			var inputId;
//	 			var inputId2;
//	 			
//	 	
//	 			// console.log(mm);
//	 			
//	 			for (var k = 0; k < monthCount ; k++) {
//	 				idNum = idNum + 1;
//	 				count = count + 1;
//	 				inputId = "_text" + count;
//	 				
//	 				if(mm < 10) {
//	 		   		     mm = '0'+mm
//	 		   		     date = mm;
//	 				}
//	 				else{
//	 					date = mm.toString();
//	 				}
//	 				
//	 				// console.log(date);
//	 				
//		 			var columnListItemNewLine = new sap.m.ColumnListItem({
//		 				type: sap.m.ListType.Inactive,
//		 				unread: false,
//		 				cells: [
//		 					new sap.m.Label({
//		 						text: idNum,
//		 						editable: false
//		 					}),
//		 					new sap.m.DatePicker({
//		 						value: this.formatDate(date),
//		 						editable: false
//		 					}),
//		 					new sap.ui.commons.TextField({	
//		 						value: "",
//		 						id:inputId,
//		 						liveChange: function(oEvent) {
//
//		 						},
//		 						change:function(oEvent){
//		 							var inputNo = 0;
//		 							var toplam = 0;
//		 								
//		 								for (var a = 0; a < inputArrayId.length; a++) {	
//		 									var inputId = sap.ui.getCore().byId(inputArrayId[a]);
//			 								var input = inputId.mProperties.value;
//		 									//var input = sap.ui.getCore().byId(inputArrayId[a]).getValue();
//			 								inputNo = parseInt(input); 
//			 								
//			 						
//			 								if (inputNo > 0) {
//			 									toplam = toplam + inputNo;
//			 								}	
//			 								if(input === ""){
//			 									sap.ui.getCore().byId(inputArrayId[a]).setValue("");
//			 								}
//			 								else{
//
//			 									var floatInput = parseFloat(inputNo.toString().replace(/\D/g, '')).toFixed(2);
//				 								sap.ui.getCore().byId(inputArrayId[a]).setValue(floatInput);
//			 								}
//			 								
//			 								
//
//			 							}
//		 							
//		 							// console.log(toplam);
//		 							oThat.getView().byId("idTotalAmountTemp").setValue(parseFloat(toplam.toString().replace(/\D/g, '')).toFixed(2));
//		 							var crrType = oThat.getView().byId("currency").getValue();
//		 							var carpim = toplam * crrType;
//		 							oThat.getView().byId("totalCurrAmount").setValue(parseFloat(carpim.toString().replace(/\D/g, '')).toFixed(2));
//		 						
//		 						
//		 						}
//		 					})
//		 				]
//		 			});
//		 			//oText.setModel(oXModel);
////		 			oThat.getView().byId("mainViewTbl").addItem(columnListItemNewLine);
//		 			inputArrayId.push(inputId);
//		 			mm = parseInt(mm) + 1;
//		 			tableList.push(columnListItemNewLine);
//	 			} 			
//	    		 //end of  Installements input alanlarının otomatik açılması
//	//-----------------------------------------------------------------------------------------	        
	 			
	 			
					
					
					jModel.setData(Attachments);
					this.getView().byId("ins").setModel(jModel)
					sap.ui.getCore().busyDialog1.close();
		},
		
		handleValueHelp : function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"zn11_form.view.Dialogs",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}

			// create a filter for the binding
			this._valueHelpDialog.getBinding("items").filter([new Filter(
				"name",
				sap.ui.model.FilterOperator.Contains, sInputValue
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		_handleValueHelpSearch : function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"name",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpClose : function (evt) {
			var that = this;
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
			that.selectChange(oSelectedItem.getTitle());
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
		
		
		handleUploadComplete: function(oEvent) {
			 var fileValue = oEvent.getParameter("response");

			    fileuploader = oEvent.getSource(),

			    type = oEvent.getParameter("response").split(";base64")[0].split("data:")[1];
		},

		handleUploadPress: function() {
				var that = this;
				var oFileUploader = that.getView().byId("fileupload");
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

// console.log(Attachments);


		},

		handleTypeMissmatch: function(oEvent) {
			var aFileTypes = oEvent.getSource().getFileType();
			jQuery.each(aFileTypes, function(key, value) {aFileTypes[key] = "*." +  value;});
			var sSupportedFileTypes = aFileTypes.join(", ");
			MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
									" is not supported. Choose one of the following types: " +
									sSupportedFileTypes);
		},

		handleValueChange: function(oEvent) {
			MessageToast.show("Added " + oEvent.getParameter("newValue") + "");
			
//			Attachments.push({FileName : oEvent.getParameter("newValue")});
			
			
			this.handleUploadPress();
		},

		
		approveAction : function (evt) {
			/*
			
			var odataModel = this.getView().getModel("odataModel");
			var jsonModel = this.getView().getModel();

			zn11_form.util.ModelBuilder.setEdmTimeFromConvertedProperty(data);
			zn11_form.util.ModelBuilder.removeEmptyEntitiesFromCollections(data);
			var outputData = {ManagerAppCompleteEventTypeOUTPUT : {ManagerAppCompleteEvent :  zdata }}; 

			var bundle = this.getView().getModel("i18n").getResourceBundle();
			
			var createParameters = {
				success : function() {
					// post was successful, either close window or show success message
					window.close();
					// in case close does not work due to security reasons
					
				},
				error : function(oEvent) {
					// show failure message
				}
			};
			
			odataModel.create("/SAPBPMOutputData", outputData, createParameters);	*/
		},	
    	onSaveChange: function() { 
    		/*
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
    		TaskInstanceID = aData.responseJSON.d.results["0"].InstanceID;
            
    	
    		var serviceUrlWithPrefix = this.serviceUrl + TaskInstanceID + this.bpmPrefixParameter;
    		var odataModel = new sap.ui.model.odata.v2.ODataModel(serviceUrlWithPrefix, this.oDataSettings);
    		
            var startTypeINPUT = jQuery.ajax({
                type : "GET",
                contentType : "application/json",
                url : "/bpmodata/taskdata.svc/"+ TaskInstanceID +"/InputData('"+ TaskInstanceID +"')?$format=json&$expand=startTypeINPUT/start/DO_BudgetApproval/Installments/row,startTypeINPUT/start/DO_BudgetApproval/Head,startTypeINPUT/start/DO_BudgetApproval/Details,startTypeINPUT/start/DO_BudgetApproval/Amount",
                dataType : "json",
                async: false, 
                success : function(data,textStatus, jqXHR) {
      
    				var oODataJSONModel = new sap.ui.model.json.JSONModel(data);
    				oODataJSONModel.setDefaultBindingMode("TwoWay");
    				oODataJSONModel.setSizeLimit(100);
    				that.getView().setModel(oODataJSONModel);
    				// eases the access for the controller
    				that.getView().setModel(odataModel, "odataModel");
                }

            });
            zdata = startTypeINPUT.responseJSON.d.startTypeINPUT.start;
        var Amount = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Amount;
        var Head = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Head;
        var Details = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Details;
        var Installments = startTypeINPUT.responseJSON.d.startTypeINPUT.start.DO_BudgetApproval.Installments;
        
        that.getView().byId("idDepartment").setValue(Details.Department),
        that.getView().byId("idDesc").setValue(Details.Desc),
        that.getView().byId("idSubDesc").setValue(Details.SubDesc),
        that.getView().byId("idType").setValue(Details.Type),
        that.getView().byId("brExp").setValue(Details.brExp),
        that.getView().byId("explanation").setValue(Details.explanation),
        that.getView().byId("periodEnd").setValue(Details.periodEnd),
        that.getView().byId("periodStart").setValue(Details.periodStart),
        that.getView().byId("purpose").setValue(Details.purpose),
        that.getView().byId("remBudget").setValue(Details.remBudget),
        that.getView().byId("subject").setValue(Details.subject),
        that.getView().byId("supplier").setValue(Details.supplier)
          
            
         */   
		},
		
		
        onPdfExportOld: function() {
            var doc;
                  
            var vizFrame = this.getView().byId("panelBUD");

            var svg = vizFrame.getDomRef().getElementsByTagName("svg")[0];

            var canvas = document.createElement("canvas");

            canvas.setAttribute("width", [242]);

            canvas.setAttribute("height", [700]);

            var context = canvas.getContext("2d");

            var imageObj = new Image();

            imageObj.onload = function() {

                context.drawImage(imageObj, 0, 0);

                var a = document.createElement('a');

                a.setAttribute("download", "pic_name.png");

                a.setAttribute("href", canvas.toDataURL());

                a.click();
            }
            
      },    
		selectFormType:function(oEvent){
			var that = this;
			oSelectedIndex = oEvent.getParameter("selectedIndex");  
			var oRadioButtonSrc = oEvent.getSource().getAggregation("buttons");  
			oSelectedRadioText = oRadioButtonSrc[oSelectedIndex].getText();
			
			if(oSelectedRadioText !== "Related Party"){
				that.getView().byId("idRelatedParty").setVisible(false);
				that.getView().byId("relatedParty").setVisible(false);
				that.getView().byId("idBudget").setValue(budgetId);
				}
			else{
				that.getView().byId("idRelatedParty").setVisible(true);
				that.getView().byId("relatedParty").setVisible(true);
				that.getView().byId("idBudget").setValue(budgetId);
			}
			setTimeout(function(){
				that.byId("idBudget").setValue(budgetId);
			},1);

		},
		validateForm:function(){
			
			
			if (this.byId("periodStart").getValue() === "") {
				this.byId("periodStart").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("periodStart").setValueState(sap.ui.core.ValueState.None);
			}
			if (this.byId("periodEnd").getValue() === "") {
				this.byId("periodEnd").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("periodEnd").setValueState(sap.ui.core.ValueState.None);
			}
			if (this.byId("supplier").getValue() === "") {
				this.byId("supplier").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("supplier").setValueState(sap.ui.core.ValueState.None);
			}
			if (this.byId("subject").getValue() === "") {
				this.byId("subject").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("subject").setValueState(sap.ui.core.ValueState.None);
			}
			if (this.byId("idBudget").getValue() === "") {
				this.byId("idBudget").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("idBudget").setValueState(sap.ui.core.ValueState.None);
			}
			if (this.byId("remBudget").getValue() === "") {
				this.byId("remBudget").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("remBudget").setValueState(sap.ui.core.ValueState.None);
			}
			if (this.byId("purpose").getValue() === "") {
				this.byId("purpose").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("purpose").setValueState(sap.ui.core.ValueState.None);
			}
			if (this.byId("explanation").getValue() === "") {
				this.byId("explanation").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("explanation").setValueState(sap.ui.core.ValueState.None);
			}
			if (this.byId("totalAmount").getValue() === "") {
				this.byId("totalAmount").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("totalAmount").setValueState(sap.ui.core.ValueState.None);
			}
			if (this.byId("idTotalAmount").getValue() === "") {
				this.byId("idTotalAmount").setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("idTotalAmount").setValueState(sap.ui.core.ValueState.None);
			}
//			if (this.byId("CurrencyType").getValue() === "") {
//				this.byId("CurrencyType").setValueState(sap.ui.core.ValueState.Error);
//			} else {
//				this.byId("CurrencyType").setValueState(sap.ui.core.ValueState.None);
//			}
			
			if (this.byId("idTotalAmount").getValueState() === sap.ui.core.ValueState.Error ||
					this.byId("totalAmount").getValueState() === sap.ui.core.ValueState.Error ||
					this.byId("explanation").getValueState() === sap.ui.core.ValueState.Error ||
					this.byId("purpose").getValueState() === sap.ui.core.ValueState.Error ||
					this.byId("remBudget").getValueState() === sap.ui.core.ValueState.Error ||
					this.byId("idBudget").getValueState() === sap.ui.core.ValueState.Error ||
					this.byId("subject").getValueState() === sap.ui.core.ValueState.Error ||
//					this.byId("CurrencyType").getValueState() === sap.ui.core.ValueState.Error ||
					this.byId("supplier").getValueState() === sap.ui.core.ValueState.Error ||
					this.byId("periodStart").getValueState() === sap.ui.core.ValueState.Error ||
					this.byId("periodEnd").getValueState() === sap.ui.core.ValueState.Error) {
				sap.m.MessageToast.show("There are errors in the form. Please correct!");
			}else{
				if(this.byId("idTotalAmountTemp").getValue() === "0,00"){
					this.sendAction();
				}else{
				sap.m.MessageToast.show("Installment Payment Table Value Error!");
				}
			}
			
			
			
		},
		sendAction:function(){
			
			var that = this;
			sap.ui.getCore().busyDialog1.open();
			
			
		
			var startDate,endDate,arrayStart,count,arrayEnd;
			var sTarih;
			var eTarih;
			var startNok;
			var endNok;
			var counter;
			oInstallments = [];
			
			startDate = that.getView().byId("periodStart").getValue();
			endDate = that.getView().byId("periodEnd").getValue();
			//date'in EN veya TR gelip gelmedğinin kontrolü begin of
			startNok = startDate.slice(1,2);
			endNok = endDate.slice(1,2);
			if(startNok !== "."){
				startNok = startDate.slice(2,3);
			}
			else{
				startNok = startDate.slice(1,2);
			}
			if(endNok !== "."){
				endNok = endDate.slice(2,3);
			}
			else{
				endNok = endDate.slice(1,2);
			}
			//end of
			if(startNok === "."){		
				arrayStart = startDate.split(".");
				count = arrayStart[0].length;
				if (count === 1) {
					arrayStart[0] = "0" + arrayStart[0];
					
				}
				sTarih = arrayStart[2] + arrayStart[1] + arrayStart[0];
				
				
			}
			else{
				arrayStart = startDate.split("/");
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
			if(endNok === "."){		
							
				arrayEnd = endDate.split(".");
				count = arrayEnd[0].length;
				
				if (count === 1 ) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				
				eTarih = arrayEnd[2] + arrayEnd[1] + arrayEnd[0];
				
			}
			else{				
				arrayEnd = endDate.split("/");
				count = arrayEnd[0].length;
				if(arrayEnd[1] === undefined){
					
				}
				else{
					counter = arrayEnd[1].length;	
				}		
				if (count === 1) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				if (counter === 1) {
					arrayEnd[1] = "0" + arrayEnd[1];
					
				}
				eTarih = "20"+arrayEnd[2] + arrayEnd[0] + arrayEnd[1];
			}
			
			var tempInstallmentTableArr=this.getView().byId("idBudgetInstallmentTable").getModel().getData();
            
            $.each(tempInstallmentTableArr.items, function(i) {

                  oInstallments.push({
                         rowNumber: tempInstallmentTableArr.items[i].index.toString(),
                         Month: that.stringToMonth(tempInstallmentTableArr.items[i].month),
                         InstallmentAmount: tempInstallmentTableArr.items[i].amount.toString()
                  });

            });

		
//			var vCount, vMonth, vInsAmount;
//			for (var i = 0; i < tableList.length; i++) {
//				vCount = tableList[i].mAggregations.cells["0"].mProperties.text;
//				vMonth = tableList[i].mAggregations.cells["1"].mProperties.value;
//				vInsAmount = tableList[i].mAggregations.cells["2"].mProperties.value;
//				
//				var arrayInsAmount = vInsAmount.split(".");
//
//				oInstallments.push({
//					rowNumber: vCount,
//					Month: vMonth,
//					InstallmentAmount: arrayInsAmount[0]
//				});
//			}
			// console.log(oInstallments);

			
			
			
		
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
			var oURL = "/bpmodata/startprocess.svc/itelligence.com.tr/budget/BPM_Budget_Approval/StartData";
			
			var selectedRadio;
			var that = this;
			if(oSelectedRadioText === undefined){
				oSelectedRadioText = that.getView().byId("RB3-7").getText();
			}

//			var a = that.getView().byId("idTotalAmount").getValue().split(".");
//			var b = that.getView().byId("totalAmount").getValue().split(",");
			//mkaya 16.10.2017 
//		if(a[1] !== b[1]){
//				sap.m.MessageToast.show("Please enter the same total amounts");
//				 oInstallments = [];
//			
//			}
//		else{
			//"Currency": sKur olarak degılde sımdılık try olarak yolla
			var arraytotalAmount = that.getView().byId("idTotalAmount").getValue();
			var arraytotalAmountTRY = that.getView().byId("totalAmount").getValue();
			var doc;
			
			try{
				html2canvas($('#__xmlview2--panelBUD'), {
		            onrendered: function(canvas) { 
		                 imgData = canvas.toDataURL('application/pdf');     
//		                 doc = new jsPDF('1', 'mm', [242, 700]);
//		                doc.addImage(imgData, 'PNG',  0, 0);
//		                doc.save('doc.pdf');
		            }
		        });
			}catch(err){
				html2canvas($('#__xmlview3--panelBUD'), {
		            onrendered: function(canvas) { 
		                 imgData = canvas.toDataURL(
		                    'application/pdf');     
//		                 doc = new jsPDF('1', 'mm', [242, 700]);
//		                doc.addImage(imgData, 'PNG',  0, 0);
//		                doc.save('doc.pdf');
		            }
		        });
			}
			
			var sendtotalAmount = arraytotalAmount.split(",");
			var totalAmountTRY = arraytotalAmountTRY.split(",");
			
				 setTimeout(function(){	
					 Attachments.push({
							"Content":imgData,
					    	"FileName":"SCREENSHOT",
					    	"FileType":"PNG"
						});
						var oEntry = {"ProcessStartEvent": {"BudgetApproval": {
						    "Amount": {
//						        "CurrencyType": that.getView().byId("CurrencyType").getSelectedKey(),
//						        "Currency": that.getView().byId("currency").getValue(),
//						        "totalAmount": parseInt(arraytotalAmount).toString(),
//						        "totalAmountTRY": parseInt(arraytotalAmountTRY).toString()+".00",
////						        "totalAmountUSD": parseInt(arraytotalAmountTRY).toString(),
//						        "totalAmountUSD": parseInt(parseInt(arraytotalAmountTRY) / vUSD).toString(),
//						        "approvalNecessary": true
						        "CurrencyType": that.getView().byId("CurrencyType").getSelectedKey(),
						        "Currency": that.getView().byId("currency").getValue(),
						        "totalAmount": sendtotalAmount[0].replace(".",""),
						        "totalAmountTRY": totalAmountTRY[0].replace(".",""),
						        "totalAmountUSD": (parseFloat(arraytotalAmountTRY.replace(".","").replace(",","")) / vUSD).toFixed(2).toString(),
						        "approvalNecessary": true
						    },
						    "Details": {
						        "Budget": budgetId,
						        "Department": that.getView().byId("idDepartment").getValue(),
						        "Desc": that.getView().byId("idDesc").getValue(),
						        "SubDesc": that.getView().byId("idSubDesc").getValue(),
						        "Type": that.getView().byId("idType").getValue(),
						        "brExp": that.getView().byId("brExp").getValue(),
						        "explanation": that.getView().byId("explanation").getValue(),
						        "formType": oSelectedRadioText,
						        "periodEnd": eTarih,
						        "periodStart": sTarih,
						        "purpose": that.getView().byId("purpose").getValue(),				        
						        "relatedParty": that.getView().byId("relatedParty").getValue(),
						        "relatedPartyId": that.getView().byId("idRelatedPartyVis").getValue(),
						        "remBudget": that.getView().byId("remBudget").getValue(),
						        "subject": that.getView().byId("subject").getValue(),
						        "supplier": that.getView().byId("supplier").getValue(),
						        "supplierId":idSuppVis
						    },
						    "Head": {
						        "department": that.getView().byId("department").getValue(),
						        "requestDate": sDate,
						        "requestNum": "",
						        "requestOwner": that.getView().byId("requestOwner").getValue(),
						        "requestTime": sTime,
						        "title": that.getView().byId("title").getValue(),
						        "process":"C"
						    },
						    "Installments": {"row": oInstallments},
						    "Attachments":{"item": Attachments},
//						    "Attachments":{"item": [{
//						                            	"Content":imgData,
//												    	"FileName":"SCREENSHOT",
//												    	"FileType":"PNG"
//						                            }]
//						    },
						    "Opinion":{
						    	"OpSndPerNo":"",
						    	"OpSndComment":"",
						    	"OpRcvPerNo":"",
						    	"OpRcvComment":""
						    }
						}}};
					
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
//					        	that.onPdfExport();
					        	// console.log(result);					 				     	
//					    		var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
					    		//var oBusyDialog = this.getView().byId("BusyDialog");
					    		//oBusyDialog.open();
					    	
//					    		var onBusyDialogPress = that.getDialogBusy();	
//					    		onBusyDialogPress.open();  		
					    		
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
								var finalFormId = data.T_BAF.item.length-1 ;
								sap.ui.getCore().cBaf = data.T_BAF.item[finalFormId].BAFNO;
								sap.m.MessageToast.show("Form escalated to Senior Manager..");
//								 that.getOwnerComponent().getRouter().navTo("SendItemBaf");
								 var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
									oRouter.navTo("SendItemBaf");
//								that.getRouter().navTo("SendItemBaf", true);
								
					                }

					            });
					    	
//								jQuery.sap.delayedCall(2000, that, function () {
//									sap.ui.getCore().getOwnerComponent().getRouter().navTo("SendItemBaf");
//									onBusyDialogPress.close();								
									
//									sap.m.MessageBox.show(
//										       "Form escalated to Senior Manager..", {
//											         icon: sap.m.MessageBox.Icon.SUCCESS,
//											         actions: [sap.m.MessageBox.Action.OK],
//											         onClose: function(oAction){
//											        	 if (oAction === sap.m.MessageBox.Action.OK) {
////																that.getOwnerComponent().getRouter().navTo("Home");
////																window.location.reload();
//                                                             that.getRouter().navTo("SendItemBaf", true);
////											        			sap.ui.getCore().getOwnerComponent().getRouter().navTo("SendItemBaf");
//															}
//											         },
////											         styleClass: bCompact? "sapUiSizeCompact" : ""
//											       }
//
//											     );
									
									
//								});	
							
									
										
								
							
								
								
			
					        }
					    });
						sap.ui.getCore().busyDialog1.close();
				 },3000);
				 
		        
				
//		}
		},
		getDialogBusy: function() {
			this.oBusyDialog = sap.ui.xmlfragment("zn11_form.view.BusyDialog", this);
			this.getView().addDependent(this.oBusyDialog);


			return this.oBusyDialog;
		},
		resetValue:function(){			
			 //begin of ycoskun Request Date otomatik getirme
	     var that = this;
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
   		 sTime = hour+min+sec;
   		that.getView().byId('requestDate').setValue(today);
   		that.getView().byId('requestTime').setValue(time);
   		 //end of ycoskun
   		 
   		oInstallments=[];
    	that.getView().byId("periodStart").setValue("");
    	that.getView().byId("periodEnd").setValue("");
    	that.getView().byId("supplier").setValue("");
    	that.getView().byId("subject").setValue("");
    	that.getView().byId("idBudget").setValue("");
    	that.getView().byId("idDepartment").setValue("");
    	that.getView().byId("idType").setValue("");
    	that.getView().byId("idDesc").setValue("");
    	that.getView().byId("idSubDesc").setValue("");
    	that.getView().byId("remBudget").setValue("");
    	that.getView().byId("purpose").setValue("");				        	
    	that.getView().byId("explanation").setValue("");
    	that.getView().byId("brExp").setValue("");
    	that.getView().byId("currency").setValue("");
    	that.getView().byId("totalAmount").setValue("");
    	that.getView().byId("idTotalAmountTemp").setValue("");
    	that.getView().byId("totalCurrAmount").setValue("");
    	that.getView().byId("CurrencyType").setValue("");
    	that.getView().byId("relatedParty").setValue("");
    
    	for (var a = 0; a < inputArrayId.length; a++) {	
			sap.ui.getCore().byId(inputArrayId[a]).setValue("");			

    	}
		
 
    	
    		
			
		},
		/*sendActionOLD: function() {
			var that = this;
			var BudgetApproval = {};
			var ProcessStartEvent = {};
			var eInstallments = {};
			var Installments = {
					row: []
				};
			var Head = {};
			var Details = {};
			var Amount = {};
			var oneEntry = [];
			var oEntry = [];
			

			Head.requestOwner = that.getView().byId("requestOwner").getValue();
			Head.department = that.getView().byId("department").getValue();
			Head.title = that.getView().byId("title").getValue();
			Head.requestNum = that.getView().byId("requestNum").getValue();
			Head.requestDate = that.getView().byId("requestDate").getValue();
			Head.requestTime = that.getView().byId("requestTime").getValue();
			Head.requestTime = that.getView().byId("status").getValue();
			
			oEntry.Head = Head;
			
			Details.Department = that.getView().byId("idDepartment").getValue();
			Details.Type = that.getView().byId("idType").getValue();
			Details.Desc = that.getView().byId("idDesc").getValue();
			Details.SubDesc = that.getView().byId("idSubDesc").getValue();
			Details.Budget = that.getView().byId("idBudget").getSelectedKey();
			Details.periodStart = that.getView().byId("periodStart").getValue();
			Details.periodEnd = that.getView().byId("periodEnd").getValue();
			Details.supplier = that.getView().byId("supplier").getValue();
			Details.subject = that.getView().byId("subject").getValue();
			Details.remBudget = that.getView().byId("remBudget").getValue();
			Details.purpose = that.getView().byId("purpose").getValue();
			Details.explanation = that.getView().byId("explanation").getValue();
			Details.formType = that.getView().byId("formType").getSelectedIndex();
			Details.relatedParty = that.getView().byId("relatedParty").getSelectedKey();
			Details.brExp = that.getView().byId("brExp").getValue();
			
			oEntry.Details = Details;
			
			
			
			Amount.CurrencyType = that.getView().byId("CurrencyType").getSelectedKey();
			Amount.currency = that.getView().byId("currency").getValue();
			Amount.totalAmount = that.getView().byId("totalAmount").getValue();
			Amount.totalAmountTRY = that.getView().byId("totalAmount").getValue();
			
			oEntry.Amount = Amount;
			
			
			
			oEntry.Installments = oInstallments;
			
			oneEntry.BudgetApproval = oEntry;
			twoEntry.ProcessStartEvent = oneEntry;
			
		
			
		},
		*/
			
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
		
			var that = this;
			if(sap.ui.getCore().GOREV_KODU === "02" || sap.ui.getCore().GOREV_KODU === "06"){
				that.getView().byId("brExp").setEnabled(true);
			}else{
				that.getView().byId("brExp").setEnabled(false);
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
			try{
			var selectItem = oEvent.oSource.mProperties.value;
			}catch(err){
				var selectItem = oEvent;
			}
			// console.log(selectItem);
			
			var array = selectItem.split(' - ');
			budgetId = array[4];
			var department = array[0];
			var type = array[1];
			var desc = array[2];
			var subDesc = array[3];
					
			
			
			oThat.getView().byId("idDepartment").setValue(department);
			oThat.getView().byId("idType").setValue(type);
			oThat.getView().byId("idDesc").setValue(desc);
			oThat.getView().byId("idSubDesc").setValue(subDesc);
			
			
			setTimeout(function(){
				oThat.byId("idBudget").setValue(selectItem);
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
	    		var remData = parseFloat(remAmountData.responseJSON.E_BUDGET);
	    		var strTotalAmountValue =remData.toFixed(2)
			       .replace(".", ",") 
			       .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
	    		 oThat.getView().byId('remBudget').setValue(strTotalAmountValue);
				
				//end of ycoskun
				
			}catch(err){
				
			}	
			//end of budget id ye bağlı rem amount cekme
	
	
			
		},
		addListInput: function(oEvent) {
			/*var oThat = this;

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
					new sap.m.DatePicker({
						type: "Text",
						value: "",
						valueFormat : "MM-yyyy",
						displayFormat : "MM-yyyy",
						editable: true
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
			// console.log(oncekiButton);*/

		},
//		selectChangeCurOld:function(oEvent){
//			var oThat = this;
//		 selectItem = oEvent.oSource.getSelectedItem().getText();
//	
//			
//		       var aData = jQuery.ajax({
//		            type : "GET",
//		            contentType : "application/json",
//		            url : "/RESTAdapter/b2b/ExchangeRate/"+selectItem,
//		            dataType : "json",
//		            async: false, 
//		            success : function(data,textStatus, jqXHR) {
//		                oModel.setData({modelData : data}); 
//		                sKur = data.E_UKURS;
//		                vUSD = data.E_USD;
//		                oThat.getView().byId('currency').setValue(sKur);
//		             
//		    			
//		                
//		            }
//		        
//		        });
//				
//		this.getView().byId("totalCurrAmount").setValue(parseFloat(this.getView().byId("idTotalAmount").getValue()) * parseFloat(this.getView().byId("currency").getValue()) );
//
//		},
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
                     oThat.getView().byId('currency').setValue(sKur.slice(0, 4));
                  
                         
                     
                 }
             
             });
                  
            
            if(this.getView().byId("totalCurrAmount").getValue()!=="")
               {
               var currentValue = parseFloat(this.getView().byId("idTotalAmount").getValue().replace(/[^0-9\,-]+/g,"")) * parseFloat(this.getView().byId("currency").getValue());
               var strCurrentVal = currentValue.toFixed(2)
                   .replace(".", ",") 
                   .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
     this.getView().byId("totalCurrAmount").setValue(strCurrentVal);
               }
     },

		handleValueHelpSupplier: function() {
			var that = this;
			var supplier;
			var supplierName;
			var jsonSearch;
	
			var handleClose = function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
					 supplier = oSelectedItem.getDescription();
					 supplierName = oSelectedItem.getTitle();
					that.getView().byId("supplier").setValue(supplierName);
					idSuppVis  = supplier;
					//that.additionalInfoValidation();
				}
			};
			if (!this._valueHelpSelectSupplier) {
				this._valueHelpSelectSupplier = new sap.m.SelectDialog("valueHelpSelectSupplier", {
					title: "Supplier",
					items: {
						path: "/",
						sorter: "name",
						template: new sap.m.StandardListItem({
							title: "{name}",
							description: "{id}",
							active: true
						})
					},
					search: function(oEvent) {
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sValue);
						oEvent.getSource().getBinding("items").filter(oFilter);
						
//						var searchSupp = [];
						
//						var sValue = oEvent.getParameter("value").toUpperCase();	
//						//supplier search help begin of 	     
//				        var aData = jQuery.ajax({
//				            type : "GET",
//				            contentType : "application/json",
//				            url : "/RESTAdapter/b2b/SearchHelp/NAME1*"+sValue+"&VENDOR",
//				            dataType : "json",
//				            async: false, 
//				            success : function(data,textStatus, jqXHR) {
//			
//				            	oModel.setData({modelData : data}); 
//				                // console.log(data);
//				                
//				                for(var i = 0; i < data.T_RESULT.item.length; i++) {
//					                   var text = data.T_RESULT.item[i];	                    					               				            
//					                   var array = text.STRING.split('@');
//					                   var test = array[1];
//					                   var id = array[0];
//					                   jsonResult = {
//					                		   name: test,
//					                		   id: id};
//					                    selectsSupp.push(jsonResult);
//					                 }
//					               
//				    			// console.log(searchSupp);
//				    			searchModel.setData(searchSupp);
//				    	
//				    			that._valueHelpSelectSupplier.setModel(searchModel);
//				    		
				                
//				            }
				        
//				        });		        
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
		changeDate:function(){
			
			 var tempArrayList = {
	                                        items: []
	                                };
	                        
	         this.getView().byId("idTotalAmountTemp").setValue("");
	                        this.getView().byId("idTotalAmount").setValue("");
	                        this.getView().byId("totalCurrAmount").setValue("");
	                        var budgetApprovalJsonModel = new sap.ui.model.json.JSONModel();
	                        budgetApprovalJsonModel.setData(tempArrayList);
	                        this.getView().byId("idBudgetInstallmentTable").setModel(budgetApprovalJsonModel);
	                        this.getView().byId("totalAmount").setValue("");
	                        this.getView().byId("CurrencyType").setSelectedKey("0");
	                        this.getView().byId("currency").setValue("");
			
			var that = this;
			var startDate,endDate,arrayStart,count,arrayEnd;
			var sTarih;
			var eTarih;
			var startNok;
			var endNok;
			var counter;
			
			startDate = that.getView().byId("periodStart").getValue();
			endDate = that.getView().byId("periodEnd").getValue();
			//date'in EN veya TR gelip gelmedğinin kontrolü begin of
			startNok = startDate.slice(1,2);
			endNok = endDate.slice(1,2);
			if(startNok !== "."){
				startNok = startDate.slice(2,3);
				//endNok = endDate.slice(2,3);
			}
			else{
				startNok = startDate.slice(1,2);
				//endNok = endDate.slice(1,2);
			}
			if(endNok !== "."){
				endNok = endDate.slice(2,3);
			}
			else{
				endNok = endDate.slice(1,2);
			}
			//end of
			if(startNok === "."){		
				arrayStart = startDate.split(".");
				count = arrayStart[0].length;
				if (count === 1) {
					arrayStart[0] = "0" + arrayStart[0];
					
				}
				sTarih = arrayStart[2] + arrayStart[1] + arrayStart[0];
				
				
				/*arrayEnd = endDate.split(".");
				count = arrayEnd[0].length;
				if (count === 1) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				eTarih = arrayEnd[2] + arrayEnd[1] + arrayEnd[0];*/
				
			}
			else{
				arrayStart = startDate.split("/");
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
				
				
				/*arrayEnd = endDate.split("/");
				count = arrayEnd[0].length;
				if (count === 1) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				eTarih = arrayEnd[2] + arrayEnd[1] + arrayEnd[0];*/
			}
			if(endNok === "."){		
							
				arrayEnd = endDate.split(".");
				count = arrayEnd[0].length;
				
				if (count === 1 ) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				
				eTarih = arrayEnd[2] + arrayEnd[1] + arrayEnd[0];
				
			}
			else{				
				arrayEnd = endDate.split("/");
				count = arrayEnd[0].length;
				if(arrayEnd[1] === undefined){
					
				}
				else{
					counter = arrayEnd[1].length;	
				}		
				if (count === 1) {
					arrayEnd[0] = "0" + arrayEnd[0];
					
				}
				if (counter === 1) {
					arrayEnd[1] = "0" + arrayEnd[1];
					
				}
				eTarih = "20"+arrayEnd[2] + arrayEnd[0] + arrayEnd[1];
			}
			
			if(startDate !== ""){
				 var date = new Date();
	    		 var mm = date.getMonth()+1; 
	    	
	    		 if(mm<10) {
	    		     mm = '0'+mm
	    		 } 

	    		 date = mm;
	
			/*	if( parseInt(arrayStart[1]) !==  parseInt(date)){
					var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
					MessageBox.error(
						"Budget Period Start Date should be the same month",
						{
							styleClass: bCompact ? "sapUiSizeCompact" : ""
						}
					);	
				}*/
			}
			
			if(endDate === "" || startDate === ""){
		
			}
			else{
				if( parseInt(sTarih) >= parseInt(eTarih) ){		
					var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
							MessageBox.error(
								"Budget Period Start Date cannot be less than the Budget Period End Date",
								{
									styleClass: bCompact ? "sapUiSizeCompact" : ""
								}
							);				
				}
				if( parseInt(arrayStart[2]) !== parseInt(arrayEnd[2]) ){		
					var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
							MessageBox.error(
								"Budget Period Start Date and Budget Period End Date should be the same year",
								{
									styleClass: bCompact ? "sapUiSizeCompact" : ""
								}
							);
						
					
				}
			}
	
			
		},
		changeTotalAmount:function(){
			var that = this;
			var totalAmount = that.getView().byId("totalAmount").getValue().replace(/\./g, '');	
			totalAmount = totalAmount.replace(/,/g, '');
			if(totalAmount.length>11 && totalAmount.length<=14){
				var finalTA = totalAmount.slice(-14, -11)+"."+totalAmount.slice(-11, -8)+"."+totalAmount.slice(-8, -5)+"."+totalAmount.slice(-5, -2)+","+totalAmount.slice(-2);
				}else if(totalAmount.length>8 && totalAmount.length<=11){
					var finalTA = totalAmount.slice(-11, -8)+"."+totalAmount.slice(-8, -5)+"."+totalAmount.slice(-5, -2)+","+totalAmount.slice(-2);
				}else if(totalAmount.length>5 && totalAmount.length<=8){
					var finalTA = totalAmount.slice(-8, -5)+"."+totalAmount.slice(-5, -2)+","+totalAmount.slice(-2);
				}else if(totalAmount.length>2 && totalAmount.length<=5){
					var finalTA = totalAmount.slice(-5, -2)+","+totalAmount.slice(-2);
				}else if(totalAmount.length>0 && totalAmount.length<=2){
					var finalTA = totalAmount.slice(-2);
				}
			that.getView().byId("totalAmount").setValue(finalTA);
				
//			var nf = new Intl.NumberFormat(["en-US"], {  
//			    minFractionDigits: 2
//			});  
//
//			var that = this;
//			var totalAmount = that.getView().byId("totalAmount").getValue();
//			
//			that.getView().byId("totalAmount").setValue(nf.format(totalAmount));
		},
		getDialogComment: function() {
			this.oCommentDialog = sap.ui.xmlfragment("zn11_form.view.Comment", this);
			this.getView().addDependent(this.oCommentDialog);

			// 			var oModel = new JSONModel(jQuery.sap.getModulePath("zn11_form/mockserver", "/Products.json"));
			// 			this.getView().setModel(oModel);

			return this.oCommentDialog;
		},
		handleValueHelpRelatedParty: function() {
			var that = this;
			var relatedParty;
			var relatedPartyName;
			var jsonSearchRel;
			
			var handleClose = function(oEvent) {
				var oSelectedItem = oEvent.getParameter("selectedItem");
				if (oSelectedItem) {
//					var title = oSelectedItem.getTitle();
//					 var array = title.split('@');
					 //supplier = array[0];
					 //supplierName = array[1];
					 relatedParty = oSelectedItem.getDescription();
					 relatedPartyName = oSelectedItem.getTitle();
					that.getView().byId("relatedParty").setValue(relatedPartyName);
					that.getView().byId("idRelatedPartyVis").setValue(relatedParty);
					
				}
			};
			if (!this._valueHelpSelectRelatedParty) {
				this._valueHelpSelectRelatedParty = new sap.m.SelectDialog("valueHelpSelectRelatedParty", {
					title: "Related Party",
					items: {
						path: "/",
						sorter: "name",
						template: new sap.m.StandardListItem({
							title: "{name}",
							description: "{id}",
							active: true
						})
					},
					search: function(oEvent) {
						var sValue = oEvent.getParameter("value");
						var oFilter = new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, sValue);
						oEvent.getSource().getBinding("items").filter(oFilter);
//						var searchRelParty = [];						
//						var vSearchRel = oEvent.getParameter("value").toUpperCase();	
//						//supplier search help begin of 	     
//				        var aData = jQuery.ajax({
//				            type : "GET",
//				            contentType : "application/json",
//				            url : "/RESTAdapter/b2b/SearchHelp/NAME1*"+vSearchRel+"&RELATED_PARTY",
//				            dataType : "json",
//				            async: false, 
//				            success : function(data,textStatus, jqXHR) {
//			
//				            	oModel.setData({modelData : data}); 
//				                // console.log(data);
//				                
//				                for(var i = 0; i < data.T_RESULT.item.length; i++) {
//					                   var text = data.T_RESULT.item[i];	                    					               				            
//					                   var array = text.STRING.split('@');
//					                   var test = array[0] + " - "+ array[1];
//					                 
//					                   jsonSearchRel = {STRING: test};
//					               
//					                   searchRelParty.push(jsonSearchRel);		                    
//					                    
//					                 }
//					               
//				    			// console.log(searchRelParty);
//				    			searchModelRel.setData(searchRelParty);
//				    	
//				    			that._valueHelpSelectRelatedParty.setModel(searchModelRel);
//				    		
//				                
//				            }
//				        
//				        });		        
				        //end of					
					},
					confirm: handleClose
				});
				this._valueHelpSelectRelatedParty.setModel(relModel);

			} else {
				this._valueHelpSelectRelatedParty.setModel(relModel);
			}
			this._valueHelpSelectRelatedParty.open();

			
			
		},
		formatSupp:function(value){
			var suppValue;
			var array;
			
			//var suppValue;
			if (value) {	
				array = value.STRING.split('@');
				suppValue = array[1];
		
				
			
			} 
			return suppValue;
		},
		formatDate:function(value){
			if (value) {	
				if(value === "01"){
					value = "January";
				}
				else if(value === "02"){
					value = "February";
				}
				else if(value === "03"){
					value = "March";
				}
				else if(value === "04"){
					value = "April";
				}
				else if(value === "05"){
					value = "May";
				}
				else if(value === "06"){
					value = "June";
				}
				else if(value === "07"){
					value = "July";
				}
				else if(value === "08"){
					value = "August";
				}
				else if(value === "09"){
					value = "September";
				}
				else if(value === "10"){
					value = "October";
				}
				else if(value === "11"){
					value = "November";
				}
				else if(value === "12"){
					value = "December";
				}
		
				return value;
			
			} 
			
		},
		changeBudgetTotalAmount: function() {
			var that = this;
			var tempArrayList = {
					items: []
				};
			
			var budgetAmountModelList = {
				items: []
			};
			this.getView().byId("idTotalAmountTemp").setValue("");
			this.getView().byId("idTotalAmount").setValue("");
			this.getView().byId("totalCurrAmount").setValue("");
			var budgetApprovalJsonModel = new sap.ui.model.json.JSONModel();
			budgetApprovalJsonModel.setData(tempArrayList);
			if(this.getView().byId("CurrencyType").mProperties.selectedKey == "" || this.getView().byId("CurrencyType").mProperties.selectedKey == undefined)
				{
					
				var dialogCurrencyTypeError = new sap.m.Dialog({
					title: "Error",
					type: "Message",
					state: "Error",
					content: new sap.m.Text({
						text: "Currency Area must not be empty!"
					}),
					beginButton: new sap.m.Button({
						text: "OK",
						press: function() {
							dialogCurrencyTypeError.close();
							that.getView().byId("totalAmount").setValue("");
						}
					}),
					afterClose: function() {
						dialogCurrencyTypeError.destroy();
						that.getView().byId("totalAmount").setValue("");
					}
				});

				dialogCurrencyTypeError.open();
				}

				
			else
				{
				var totalAmountValue= parseFloat(this.getView().byId("totalAmount").getValue());
				var strTotalAmountValue =totalAmountValue.toFixed(2)
			       .replace(".", ",") 
			       .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
				this.getView().byId("totalAmount").setValue(strTotalAmountValue);
				
				this.getView().byId("idBudgetInstallmentTable").setModel(budgetApprovalJsonModel);
				var beginDate = new Date(this.getView().byId("periodStart").getValue());
				var endDate = new Date(this.getView().byId("periodEnd").getValue());
				var requestDate= new Date(this.getView().byId("requestDate").getValue());
				var monthArray = this.diffMonths(beginDate, endDate, requestDate);

				$.each(monthArray, function(i) {

					budgetAmountModelList.items.push({
						index: parseInt(i + 1),
						month: monthArray[i],
						amount: 0
					});

				});
				budgetApprovalJsonModel.setData(budgetAmountModelList);
				this.getView().byId("idBudgetInstallmentTable").setModel(budgetApprovalJsonModel);
				}
				
		},
		onPressChangeTheInstallmentAmount: function(oEvent) {
            var that=this;
            var newChangedInputValue = parseFloat((oEvent.getParameters().newValue).replace(/[^0-9\,-]+/g,""));
            var nItemNo = oEvent.getSource().getParent().getBindingContext().getObject().index;
            var index = parseInt(nItemNo - 1);
            var totalAmount =  parseFloat(this.getView().byId("totalAmount").getValue().replace(/[^0-9\,-]+/g,""));
            var totalAmountCheck =this.getView().byId("idTotalAmountTemp").getValue();
            var InstallmentAMountTable = this.getView().byId("idBudgetInstallmentTable").getModel();

            if (totalAmountCheck === ""|| totalAmountCheck===NaN) {
                  totalAmountCheck = totalAmount;
                  this.getView().byId("idTotalAmountTemp").setValue(totalAmount);
                  
            }
            if(!newChangedInputValue)
            {
            InstallmentAMountTable.setProperty("/items/" + index + "/amount", 0);
            var tempArr=this.getView().byId("idBudgetInstallmentTable").getModel().getData();
            var totalSum =0;
            for(var i=0; i<tempArr.items.length;i++)
            {
                  totalSum=parseFloat(totalSum) + parseFloat(tempArr.items[i].amount);
            }
            try{
            	  var checkvalue = parseFloat(this.getView().byId("totalAmount").getValue().replace(/[^0-9\,-]+/g,"")) - parseFloat(totalSum.replace(/[^0-9\,-]+/g,""));
                  
            }catch(err){
            	  var checkvalue = totalAmount - totalSum;
                  
            }
               var strCheckvalue=checkvalue.toFixed(2)
            .replace(".", ",") 
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
            this.getView().byId("idTotalAmountTemp").setValue(strCheckvalue);
            var strTotalSum = totalSum.toFixed(2)
            .replace(".", ",") 
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
            this.getView().byId("idTotalAmount").setValue(strTotalSum);
            var totalCurrAmount =parseFloat(totalSum.replace(/[^0-9\,-]+/g,"")) * parseFloat(this.getView().byId("currency").getValue().replace(/[^0-9\,-]+/g,""));
            var strTotalCurrAmount =totalCurrAmount.toFixed(2)
            .replace(".", ",") 
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
            this.getView().byId("totalCurrAmount").setValue(strTotalCurrAmount);
            
            
            }
            if (parseFloat(newChangedInputValue) <= parseFloat((totalAmountCheck.toString()).replace(/[^0-9\,-]+/g,""))) {
                  
                         InstallmentAMountTable.setProperty("/items/" + index + "/amount", newChangedInputValue);
                         
                         var currentValue= parseFloat(oEvent.getParameters().newValue.replace(/[^0-9\,-]+/g,""));
                         var strCurrentValue=currentValue.toFixed(2)
                         .replace(".", ",") 
                         .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
                         
                         sap.ui.getCore().byId(oEvent.getSource().sId).setValue(strCurrentValue);
                  
                  var tempArr=this.getView().byId("idBudgetInstallmentTable").getModel().getData();
                  var totalSum =0;
                  for(var i=0; i<tempArr.items.length;i++)
                  {
                         totalSum=parseFloat(totalSum) + parseFloat(tempArr.items[i].amount);
                  }
                  
                  var checkvalue = parseFloat(this.getView().byId("totalAmount").getValue().replace(/[^0-9\,-]+/g,"")) - parseFloat(totalSum);
                  var strCheckvalue=checkvalue.toFixed(2)
                   .replace(".", ",") 
                   .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
                  this.getView().byId("idTotalAmountTemp").setValue(strCheckvalue);
                  var strTotalSum = totalSum.toFixed(2)
                   .replace(".", ",") 
                   .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
                  this.getView().byId("idTotalAmount").setValue(strTotalSum);
                  var totalCurrAmount =parseFloat(totalSum) * parseFloat(this.getView().byId("currency").getValue());
                  var strTotalCurrAmount =totalCurrAmount.toFixed(2)
                   .replace(".", ",") 
                   .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
                  this.getView().byId("totalCurrAmount").setValue(strTotalCurrAmount);
                  
                  
                  
            } else {
            	sap.m.MessageToast.show("You have entered more values. Please check");
                  newChangedInputValue = "";
                  sap.ui.getCore().byId(oEvent.getSource().sId).setValue("");

            }
            
//            console.log(this.getView().byId("idBudgetInstallmentTable").getModel());

     },

//		onPressChangeTheInstallmentAmount: function(oEvent) {
//			var that=this;
//			var newChangedInputValue = oEvent.getParameters().newValue;
//			var nItemNo = oEvent.getSource().getParent().getBindingContext().getObject().index;
//			var index = parseInt(nItemNo - 1);
//			var totalAmount = this.getView().byId("totalAmount").getValue();
//			var totalAmountCheck = this.getView().byId("idTotalAmountTemp").getValue();
//			var InstallmentAMountTable = this.getView().byId("idBudgetInstallmentTable").getModel();
//
//			if (totalAmountCheck === "") {
//				totalAmountCheck = totalAmount;
//				this.getView().byId("idTotalAmountTemp").setValue(totalAmount);
//				
//			}
//			if(newChangedInputValue=="")
//			{
//			InstallmentAMountTable.setProperty("/items/" + index + "/amount", 0);
//			var tempArr=this.getView().byId("idBudgetInstallmentTable").getModel().getData();
//			var totalSum =0;
//			for(var i=0; i<tempArr.items.length;i++)
//			{
//				totalSum=parseFloat(totalSum) + parseFloat(tempArr.items[i].amount);
//			}
//			
//			var checkvalue = parseFloat(this.getView().byId("totalAmount").getValue()) - parseFloat(totalSum);
//			var strCheckvalue=checkvalue.toFixed(2)
//		       .replace(".", ",") 
//		       .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
//			this.getView().byId("idTotalAmountTemp").setValue(strCheckvalue);
//			var strTotalSum = totalSum.toFixed(2)
//		       .replace(".", ",") 
//		       .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
//			this.getView().byId("idTotalAmount").setValue(strTotalSum);
//			var totalCurrAmount =parseFloat(totalSum) * parseFloat(this.getView().byId("currency").getValue());
//			var strTotalCurrAmount =totalCurrAmount.toFixed(2)
//		       .replace(".", ",") 
//		       .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
//			this.getView().byId("totalCurrAmount").setValue(strTotalCurrAmount);
//			
//			
//			}
//			if (parseFloat(newChangedInputValue) <= parseFloat(totalAmountCheck)) {
//				
//					InstallmentAMountTable.setProperty("/items/" + index + "/amount", newChangedInputValue);
//					
//					var currentValue= parseFloat(oEvent.getParameters().newValue);
//					var strCurrentValue=currentValue.toFixed(2)
//				       .replace(".", ",") 
//				       .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
//					
//					sap.ui.getCore().byId(oEvent.getSource().sId).setValue(strCurrentValue);
//				
//				var tempArr=this.getView().byId("idBudgetInstallmentTable").getModel().getData();
//				var totalSum =0;
//				for(var i=0; i<tempArr.items.length;i++)
//				{
//					totalSum=parseFloat(totalSum) + parseFloat(tempArr.items[i].amount);
//				}
//				
//				var checkvalue = parseFloat(this.getView().byId("totalAmount").getValue()) - parseFloat(totalSum);
//				var strCheckvalue=checkvalue.toFixed(2)
//			       .replace(".", ",") 
//			       .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
//				this.getView().byId("idTotalAmountTemp").setValue(strCheckvalue);
//				var strTotalSum = totalSum.toFixed(2)
//			       .replace(".", ",") 
//			       .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
//				this.getView().byId("idTotalAmount").setValue(strTotalSum);
//				var totalCurrAmount =parseFloat(totalSum) * parseFloat(this.getView().byId("currency").getValue());
//				var strTotalCurrAmount =totalCurrAmount.toFixed(2)
//			       .replace(".", ",") 
//			       .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
//				this.getView().byId("totalCurrAmount").setValue(strTotalCurrAmount);
//				
//				
//				
//			} else {
//				newChangedInputValue = "";
//				sap.ui.getCore().byId(oEvent.getSource().sId).setValue("");
//
//			}
//			
//			console.log(this.getView().byId("idBudgetInstallmentTable").getModel());
//
//		},
		diffMonths: function(from, to, requestDat) {
			var that = this;
			var arr = [];
			var datFrom = new Date(from);
			var datTo = new Date(to);
			var requestDat = new Date(requestDat);
			var fromYear = datFrom.getFullYear();
			var toYear = datTo.getFullYear();
			var requestYear =requestDat.getFullYear();
			var diffYear = (12 * (toYear - fromYear)) + datTo.getMonth();
			if (fromYear !== toYear) {
				var dialogBudgetYearComparison = new sap.m.Dialog({
					title: "Error",
					type: "Message",
					state: "Error",
					content: new sap.m.Text({
						text: "Start Year, End Year and Request Date Year Must be Same!"
					}),
					beginButton: new sap.m.Button({
						text: "OK",
						press: function() {
							dialogBudgetYearComparison.close();
							that.getView().byId("totalAmount").setValue("");
						}
					}),
					afterClose: function() {
						dialogBudgetYearComparison.destroy();
						that.getView().byId("totalAmount").setValue("");
					}
				});

				dialogBudgetYearComparison.open();
			} else if (datTo < datFrom) {
				var dialogBudgetYearGreaterComparison = new sap.m.Dialog({
					title: "Error",
					type: "Message",
					state: "Error",
					content: new sap.m.Text({
						text: "The End Year Must be Greater than the Start Year!"
					}),
					beginButton: new sap.m.Button({
						text: "OK",
						press: function() {
							dialogBudgetYearGreaterComparison.close();
							that.getView().byId("totalAmount").setValue("");
						}
					}),
					afterClose: function() {
						dialogBudgetYearGreaterComparison.destroy();
						that.getView().byId("totalAmount").setValue("");
					}
				});

				dialogBudgetYearGreaterComparison.open();
			} else {

				for (var i = datFrom.getMonth(); i <= diffYear; i++) {
					arr.push(this.monthNames[i % 12] + " " + Math.floor(fromYear + (i / 12)));
				}

				return arr;
			}

		},
		
		stringToMonth:function(value){
            var monthIndex="";
            if (value) { 
                  if(value.includes("January")===true){
                         monthIndex = "January";
                  }
                  else if(value.includes("February")===true){
                         monthIndex = "February";
                  }
                  else if(value.includes("March")===true){
                         monthIndex = "March";
                  }
                  else if(value.includes("April")===true){
                         monthIndex = "April";
                  }
                  else if(value.includes("May")===true){
                         monthIndex = "May";
                  }
                  else if(value.includes("June")===true){
                         monthIndex = "June";
                  }
                  else if(value.includes("July")===true){
                         monthIndex = "July";
                  }
                  else if(value.includes("August")===true){
                         monthIndex = "August";
                  }
                  else if(value.includes("September")===true){
                         monthIndex = "September";
                  }
                  else if(value.includes("October")===true){
                         monthIndex = "October";
                  }
                  else if(value.includes("November")===true){
                         monthIndex = "November";
                  }
                  else if(value.includes("December")===true){
                         monthIndex = "December";
                  }
     
                  return monthIndex;
            
            } 
            
     },



	});

	return CController;

});