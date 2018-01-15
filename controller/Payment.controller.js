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
'jquery.sap.global',
'sap/m/Dialog',
'sap/ui/model/Filter',
'sap/m/MessageBox',
'sap/ui/commons/TextField'
], function(MessagePopover, MessagePopoverItem, Link, jQuery, Fragment, Controller, JSONModel, AnnotationHelper, Popover, Button, Dialog,Filter,MessageBox,TextField) {
            "use strict";
            var inputArrayIdChange = [];
            var toplam = 0;
      var usersTo = [];
      var multiUserTo = [];
      var usersInf = [];
      var multiUserInf = [];
      var attachFiles = [];
      var imgData = "";
      var sDate;
      var sTime;
      var payFormType;
      var exTarih;
      var inTarih;
      var oInstallments = [];
      var RelatedBudgetNoArray = [];
      var imgData = "";
      var vendorModel = new sap.ui.model.json.JSONModel();
      var searchVendorModel = new sap.ui.model.json.JSONModel();
      var selectsSupp = [];
      var selectsRel = [];
      var oModel = new sap.ui.model.json.JSONModel();
      var selectItem;
      var inputArrayId = [];
      var inputArrayIdy = [];
      var tableListInstallment =[];
      var tableListRelatedNo = [];
      var oSelectedIndex;
      var inputArrayRem = [];
      var vExpStatu;
      var tableRelatedJson = new sap.ui.model.json.JSONModel();
      var vUSD;
      var sKur;
      var sDate;
      var inputIdIns ;
      var countIns=0;
      var unamePas;
      var arrayUserPas;
      var username;
      var password;
      var payFormType;
      var currencyKur;
      var oSelectedRadioText;
      var payType;
      var payAdvanceInf;
      var inputRem;
      var inputUsed;
      var countRem = 0;
      var countUsed = 0;
      var vInsCount = 0;
      var Attachments = [];
      var inputArrayIdRem = []; 
      var inputArrayIdUsed = [];
      var jaModel = new sap.ui.model.json.JSONModel();
      var idInputBaf;
      var countBaf;
      var inputArrayIdBaf=[];
      
      var toplamUsedBaf =0;

      var columnListItemNewLine;
      var columnListInsNewLine;
      var count = 0;

      var filterArr = {
                  "Request Number": "BAFNO",
                  "Request Owner": "PERNR",
                  "Request Date": "RQDAT",
                  "Type": "TYPEE",
                  "Status": "STATU"
            };
      var inputArrayIdIns = [];
      var inputArrayIdDate = [];
      var inputArrayIdVat = [];
      
      var CController = Controller.extend("zn11_form.controller.Payment", {
                        model: new sap.ui.model.json.JSONModel(),

                        onAfterRendering: function() {
                  unamePas = atob(window.localStorage["unamePas"]);
                  arrayUserPas = unamePas.split(":");
                  username = arrayUserPas[0];
                  password = arrayUserPas[1];
                  /*var array = document.cookie.split(";");
                  var usernamePassword = (atob(array[1])).split(":");
                  username = usernamePassword[0];
                  password = usernamePassword[1];*/
                  
                  var that = this;
                  
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
                   
                   that.getView().byId('PayrequestOwner').setValue(arrayPers[0] + " " + arrayPers[1]);
                   that.getView().byId('Paydepartment').setValue(arrayPers[2]);
                   //oThat.getView().byId('requestNum').setValue(arrayPers[0]);
                   that.getView().byId('Paytitle').setValue(arrayPers[3]);
                        
                        //end of ycoskun
                   
                    
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
                                           var test = array[0]+" - "+array[1];
                                           jsonResult = {STRING: test};
                                            selectsSupp.push(jsonResult);
                                            
                                                                    
                                         }      
                                  
                                    // console.log(selectsSupp);
                                    vendorModel.setData(selectsSupp);
                        
                                  
                                    

                                  
                              }
                          
                          });               
                          //end of
                        
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
             that.getView().byId('PayrequestDate').setValue(today);
             that.getView().byId('PayrequestTime').setValue(sTime);
             //end of ycoskun 
             
             
             //Payment Type'ın seçim durumu begin of ycoskun            
            var selectDownType = that.getView().byId("RB-Down").getSelected();
            if(selectDownType=== true){
                  that.getView().byId("PayInsAmount").setEnabled(false);
                  that.getView().byId("InsAdd").setVisible(false);
//                that.getView().byId("InsDelete").setVisible(false);
            }
            else{
                  that.getView().byId("PayInsAmount").setEnabled(false);
                  that.getView().byId("InsAdd").setVisible(true);
//                that.getView().byId("InsDelete").setVisible(true);
                  
            }
            //Payment Type'ın seçim durumu end of ycoskun
            
            //advance inf secımınde yapılacaklar begin of ycoskun
            var selectAdvanceInf = that.getView().byId("PayAdvanceInf").getSelectedKey();
            if(selectAdvanceInf === "YES"){
                  that.getView().byId("PayAdvAmount").setEnabled(true);
                  that.getView().byId("PayNetAmount").setEnabled(true);
            }
            else if(selectAdvanceInf === "NO"){
                  that.getView().byId("PayAdvAmount").setEnabled(false);
                  that.getView().byId("PayNetAmount").setEnabled(false);
            }
            else{
                  that.getView().byId("PayAdvAmount").setEnabled(false);
                  that.getView().byId("PayNetAmount").setEnabled(false);
            }

      //advance inf secımınde yapılacaklar end of ycoskun
            
            //default exprydate için statunun 0 getirilmesi
            vExpStatu = "0";

            jaModel.setData(Attachments);
            this.getView().byId("ins").setModel(jaModel)
            },
            fixedSizeDialog: null,
      
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
                  var oUserToDialog = this.getDialogUser();
                  var oUserInfDialog = this.getDialogUserInf();
                  var that = this;
                  var Model = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZN11_BPM_SRV");
                  var oJasonModel = new sap.ui.model.json.JSONModel();

                  Model.read("/UserSet", null, null, true,
                        function(oData, response) {
                              oJasonModel.setData(oData);
                              //    // console.log(oData);

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
        clickPaymentType: function(oEvent) {
            
            var that = this;
            oSelectedIndex = oEvent.getParameter("selectedIndex");  
            var oRadioButtonSrc = oEvent.getSource().getAggregation("buttons");  
            oSelectedRadioText = oRadioButtonSrc[oSelectedIndex].getText();
            
            var selectDown = that.getView().byId("RB-Down").getSelected();

            if (selectDown === true) {
                  debugger;
                  //Payment type down payment ise installment amount display ve Installment tablosunun add delete butonu kapalı halde gelir.
                  that.getView().byId("PayInsAmount").setEnabled(false);
                  that.getView().byId("InsAdd").setVisible(false);
                  that.byId("TableInsPay").setVisible(false);
//                that.getView().byId("InsDelete").setVisible(false);
            } else {
                  //countIns = countIns +1;
                        this._data = {
                              Products: [
                              ]
                        };
                        //this.jModel = new sap.ui.model.json.JSONModel();
                        //this.jModel.setData(this._data);

                        //this.byId("TableInsPay").setModel(this.jModel);
                        
                  that.getView().byId("PayInsAmount").setEnabled(false);
                  that.getView().byId("InsAdd").setVisible(true);
                  that.byId("TableInsPay").setVisible(true);
//                that.getView().byId("InsDelete").setVisible(true);
            
            }

      },
      handleValueHelpAdvanceAmount:function(){
        var oAdvanceDialog = this.getDialogAdvance();
        var that = this;
                  // Payment için BAF Formlarının getirilmesi begin of ycoskun
                  jQuery.ajax({
              type : "GET",
              contentType : "application/json",
              url : "/RESTAdapter/b2b/findObject/"+username+"/PAF/",
              dataType : "json",
              async: false, 
              success : function(data,textStatus, jqXHR) {
                        debugger;
                  var JAddPafModel = new sap.ui.model.json.JSONModel();
                  JAddPafModel.setData(data.T_PAF.item);
                        that.getView().setModel(JAddPafModel, "JAddPafModel");
                  sap.ui.getCore().byId("idpopAdvanceTable").setModel(that.getView().getModel("JAddPafModel"));
                        
              }

          });
        
        oAdvanceDialog.open();
      },
      onCloseDialogAdvance: function() {
            this.oAdvanceDialog.close();
            this.oAdvanceDialog.destroy();
      },
      getDialogAdvance:function(){
                        this.oAdvanceDialog = sap.ui.xmlfragment("zn11_form.view.AdvanceAmount", this);
                        this.getView().addDependent(this.oAdvanceDialog);
                  

                  return this.oAdvanceDialog;
      },
            deleteRows: function(oArg) {
                  countIns = countIns-1;
//                var delId = countIns -1;
//                delId= "__button18-__xmlview4--TableInsPay-"+delId;
//                var delbtn = sap.ui.getCore().byId(delId);
//                delbtn.setVisible(true);
//                sap.ui.getCore().byID(delId).setVisible(false);
                  var deleteRecord = oArg.getSource().getBindingContext().getObject();
                  var insAmount,fark;
                  insAmount = this.getView().byId("PayInsAmount").getValue();
                  for (var i = 0; i < this._data.Products.length; i++) {
                        if (this._data.Products[i] == deleteRecord) {
                              debugger;
                              fark = parseFloat(insAmount) - parseFloat(deleteRecord.PTAmount);
                              inputArrayIdChange.splice(i,1);
                              toplam = fark;
                              this.getView().byId("PayInsAmount").setValue(fark);
                              //    pop this._data.Products[i] 
                              this._data.Products.splice(i, 1); //removing 1 record from i th index.
                              this.jModel.refresh();
                              break; //quit the loop
                        }
                  }
            },
      
            handleClose: function(oEvent) {
                  /*
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
                  */
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
                        this.oAttachAddDialog = sap.ui.xmlfragment("zn11_form.view.AttachDialogPayment", this);
                        this.getView().addDependent(this.oAttachAddDialog);
                  }

                  return this.oAttachAddDialog;
            },
                        //Attachment close butonu
            onCloseAttachDialogPayment: function(oEvent) {
                  if (!this.oAttachAddDialog) {
                        this.oAttachAddDialog = sap.ui.xmlfragment("zn11_form.view.AttachDialogPayment", this.getView().getController());

                  }
                  var oFileUploader = sap.ui.getCore().byId("fileuploadPayment");
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

                  var oFileUploader = sap.ui.getCore().byId("fileuploadPayment");
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
            onAddBudget: function() {
                  var that = this;
                  var onAddBudgetDialogPress = this.getDialogAddBudget();
                  
                  // Payment için BAF Formlarının getirilmesi begin of ycoskun
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
                        
//                      sap.ui.getCore().byId("idAddBudgetPaymentFormTable-searchField").setVisible(false);
//                      var oLabel = new sap.m.Label("labelId",{}).addStyleClass("labelStyle");
//                      var oInput = new sap.m.Input({
//                            width: "90%",
//                            change: function(oEvent) {
//                                  var oBindingPath = sap.ui.getCore().byId("labelId").getText();
//                                  oBindingPath = filterArr[oBindingPath];
//                                  var oFilter = new sap.ui.model.Filter(oBindingPath, "Contains", oValue);
//                                  var oItems = oTable.getBinding("items");
//                                  oItems.filter(oFilter);
//                                  oResposivePopover.close();
//                            }
//                      });
//                      oLabel.setLabelFor(oInput);
//                      var oHBox = new sap.m.HBox({
//                            items: [oLabel, oInput]
//                      }).addStyleClass("HBoxStyle");
//                      var oResposivePopover = new sap.m.ResponsivePopover({
//                            title: "Filter",
//                            placement: "Bottom",
//                            content: [oHBox]
//                      });
//                      var oTable = sap.ui.getCore().byId("idAddBudgetPaymentFormTable");
//                      oTable.addEventDelegate({
//                            onAfterRendering: function() {
//                                  var oHeader = this.$().find('.sapMListTblHeaderCell'); //Get hold of table header elements
//                                  for (var i = 0; i < oHeader.length; i++) {
//                                        var oID = oHeader[i].id;
//                                        $('#' + oID).click(function(oEvent) { //Attach Table Header Element Event
//                                              var oTarget = oEvent.currentTarget; //Get hold of Header Element
//                                              var oLabelText = oTarget.childNodes[0].textContent; //Get Column Header text
//                                              oLabel.setText(oLabelText);
//                                              oResposivePopover.openBy(oTarget);
//                                              jQuery.sap.delayedCall(100, null, function() { //To highlight the entered input value
//                                                    var oInput = oResposivePopover.getContent()[0].getItems()[1];
//                                                    var oInputInner = oInput.$().find('.sapMInputBaseInner')[0].select();
//                                              })
//                                        })
//                                  }
//                            }
//                      }, oTable);
                }

            });
                  //Payment için BAF Formlarının getirilmesi end of ycoskun  

                  onAddBudgetDialogPress.open();
            },
            getDialogAddBudget: function() {
                  this.onAddBudgetDialogPress = sap.ui.xmlfragment("zn11_form.view.AddBudgetPaymentForm", this);
                  this.getView().addDependent(this.onAddBudgetDialogPress);

                  
                  return this.onAddBudgetDialogPress;
            },
            sendAcceptAction:function(){
                  
                  //this.onPdfExport();

      
            //Installement array'i doldurma begin of ycoskun
                  var vInstallement, vExpdt, vVatInclAmount;
                  
                  debugger;
                  for (var i = 0; i < tableListInstallment.length; i++) {
                        vInstallement = tableListInstallment[i].mAggregations.cells["0"].mProperties.value;
                        vExpdt = tableListInstallment[i].mAggregations.cells["1"].mProperties.value;
                        vVatInclAmount = tableListInstallment[i].mAggregations.cells["2"].mProperties.value;
                        
                        oInstallments.push({
                              installement: vInstallement,
                              expdt: vExpdt,
                              vatInclAmount: vVatInclAmount
                        });
                  }
                  var doc;
                  try{
                        html2canvas($('#__panel2'), {
                        onrendered: function(canvas) { 
                             imgData = canvas.toDataURL(
                                'application/pdf');     
                             doc = new jsPDF('1', 'mm', [242, 700]);
                            doc.addImage(imgData, 'PNG',  0, 0);
//                          doc.save('doc.pdf');
                        }
                    });
                  }catch(err){
                        html2canvas($('#__panel1'), {
                        onrendered: function(canvas) { 
                             imgData = canvas.toDataURL(
                                'application/pdf');     
                             doc = new jsPDF('1', 'mm', [242, 700]);
                            doc.addImage(imgData, 'PNG',  0, 0);
//                          doc.save('doc.pdf');
                        }
                    });
                  }
                  
                  // console.log(oInstallments);
                  //Installement array'i doldurma end of ycoskun
                  
                  //Related Budget No array doldurma begin of ycoskun
                  
                  var vBudgetNumber, vTotalBAF, vUsedBAF,vUsedAmount,vRemainAmount;
                  for (var i = 0; i < tableListRelatedNo.length; i++) {
                        vBudgetNumber = tableListRelatedNo[i].mAggregations.cells["0"].mProperties.text;
                        vTotalBAF = tableListRelatedNo[i].mAggregations.cells["1"].mProperties.value;
                        vUsedBAF = tableListRelatedNo[i].mAggregations.cells["2"].mProperties.value;
                        vUsedAmount = tableListRelatedNo[i].mAggregations.cells["3"].mProperties.value;
                        vRemainAmount = tableListRelatedNo[i].mAggregations.cells["4"].mProperties.value;
                  
                  RelatedBudgetNoArray.push({
                            budgetNumber: vBudgetNumber,
                        totalBAF:vTotalBAF,
                        usedBAF:vUsedBAF,
                        usedAmount: vUsedAmount,
                        remainAmount: vRemainAmount
                  });
                  }
                  //Related Budget No array doldurma end of ycoskun

                  
                  var oHeaders;
                  var oToken;
                  var that = this;
      
                  
      
                        
                  jQuery.ajax({
                          url: "/bpmodata/startprocess.svc/n11.com/dc_n11_paf_onay_pr/PaymentApprovalProcess/$metadata",
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
                  var oURL = "/bpmodata/startprocess.svc/n11.com/dc_n11_paf_onay_pr/PaymentApprovalProcess/StartData/";
                  
                  var arrayVendor = that.getView().byId("PayVenName").getValue().split(" - ");
                  var totalAmountUsd = that.getView().byId('PayTotalAmount').getValue();
                  var totalUSD = parseInt(parseFloat(totalAmountUsd/vUSD)).toString();
                  
                  if(oSelectedRadioText === undefined){
                        oSelectedRadioText = that.getView().byId("RB-Down").getText();
                  }
                  if(payType === undefined){
                        payType = that.getView().byId("idEmp").getText();
                  }
                  if(payAdvanceInf === undefined){
                        payAdvanceInf = that.getView().byId("anwEmp").getText();
                  }
                  
                  //PAF KONTROL->Paymount Amount = Installment Amount - VAT amount kontrolü begin of ycoskun                 
                  var insAmount = that.getView().byId("PayInsAmount").getValue();
                  var vatAmount = that.getView().byId("PayidAmount").getValue();
                  var fark = parseInt(insAmount)- parseInt(vatAmount);
                  var paymentAmount = that.getView().byId("idPayAmount").getValue();
                  
                   if(oSelectedRadioText === "Installment Payment"){
                	   //begin of ycoskun kontrol 12012017
                	   debugger;
                	    var VinsAmount, VvatIncAmount;
                        VinsAmount = that.getView().byId("PayInsAmount").getValue();
                        VvatIncAmount = that.getView().byId("PayidVatIncAmount").getValue();
                        if(parseFloat(VinsAmount) !== parseFloat(VvatIncAmount)){
                        	 var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
                             sap.m.MessageBox.show(
                                          "Installement Amount should be equal Vat Inc. Amount..", {
                                                  icon: sap.m.MessageBox.Icon.ERROR,
                                                  actions: [sap.m.MessageBox.Action.OK],
                                                  onClose: function(oAction){
                                                      
                                                      if (oAction === sap.m.MessageBox.Action.OK) {
                                                                       
                                                                 }
                                                  },
                                                  styleClass: bCompact? "sapUiSizeCompact" : ""
                                                }

                       );         
                        }
                        //end of ycoskun kontrol 12012017
                        if(parseInt(paymentAmount) !== fark){
                                    var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
                                    sap.m.MessageBox.show(
                                                 "Payment Amount is not equal to Installement Amount and VAT Amount is difference..", {
                                                         icon: sap.m.MessageBox.Icon.ERROR,
                                                         actions: [sap.m.MessageBox.Action.OK],
                                                         onClose: function(oAction){
                                                             
                                                             if (oAction === sap.m.MessageBox.Action.OK) {
                                                                              
                                                                        }
                                                         },
                                                         styleClass: bCompact? "sapUiSizeCompact" : ""
                                                       }

                              );                      
                         }
                        else{
                              sap.ui.getCore().busyDialog1.open();
                              setTimeout(function(){ 
                                    Attachments.push({
                                                "Content":imgData,
                                          "FileName":"SCREENSHOT",
                                          "FileType":"PNG"
                                          });
                                          var oEntry = {"ProcessStartEvent": {"PaymentApproval": 
                                          {
                                                "uiAction": "",
                                                "comment": "",
                                                "InvoiceDetails": {
                                                      "expiryDate": exTarih,
                                                      "currencyType": selectItem,
                                                      "currency": that.getView().byId('PayCurrency').getValue(),
                                                      "invoiceNumber": that.getView().byId('PayInvoiceNum').getValue(),
                                                      "invoiceDate": inTarih,
                                                      "expiryDateStatus": vExpStatu
                                                },
                                                "FormDetails": {
                                                      "requestNumber": "",
                                                      "requestDate": sDate,
                                                      "requestTime": "",
                                                      "requestOwner": that.getView().byId('PayrequestOwner').getValue(),
                                                      "department": that.getView().byId('Paydepartment').getValue(),
                                                      "title": that.getView().byId('Paytitle').getValue(),
                                                      "status": "",
                                                      "paymentFormType": payFormType,
                                                   },
                                                  "VendorDetails": {
                                                      "vendorNr": arrayVendor[0],
                                                      "vendorName": arrayVendor[1],
                                                      "vendorContact": that.getView().byId('PayConPer').getValue(),
                                                      "vendorVKN": that.getView().byId('PayVenTC').getValue(),
                                                      "vendorAddress": that.getView().byId('PayVenAdd').getValue(),
                                                      "vendorMail": that.getView().byId('PayVenMail').getValue(),
                                                      "vendorPhone": that.getView().byId('PayVenPhone').getValue(),
                                                      "IBAN": that.getView().byId('PayIBAN').getValue(),
                                                      "swiftCode": "",
                                                      "bankName": that.getView().byId('PayBankName').getValue()
                                                   },
                                                   "PaymentDetails": {
                                                        "totalAmountUSD":totalUSD,
                                                      "advanceAmount": that.getView().byId('PayAdvAmount').getValue(),
                                                      "installmentAmount": that.getView().byId('PayInsAmount').getValue(),
                                                      "advanceInformation": payAdvanceInf,
                                                      "subject": that.getView().byId("PaySubject").getValue(),
                                                      "type": payType,
                                                      "paymentAmount": that.getView().byId('idPayAmount').getValue(),
                                                      "paymentType": oSelectedRadioText,
                                                      "netPaymentAmount": that.getView().byId('PayNetAmount').getValue(),
                                                      "vatIncAmount": that.getView().byId('PayidVatIncAmount').getValue(),
                                                      "withholdingTax": that.getView().byId('PayidTax').getValue(),
                                                      "vatBudgetAmount": that.getView().byId('PayidAmount').getValue(),
                                                      "comment": that.getView().byId('PayComment').getValue(),
                                                      "Installment": that._data.Products
                                                   },
                                                   "BudgetApprovalForm": {
                                                      "totalAmount": that.getView().byId('PayTotalAmount').getValue(),
                                                      "RelatedBudgetNo": RelatedBudgetNoArray,
                                                      "Document": "",
                                                      },
                                                      "Attachments":{"item": Attachments},
                                                   "Opinion":{
                                                      "OpSndPerNo":"",
                                                      "OpSndComment":"",
                                                      "OpRcvPerNo":"",
                                                      "OpRcvComment":""
                                                    }
                                                }
                                                      
                                                  }
                                                };
                                          
                        
                                          jQuery.ajax({
                                            type: 'POST',
                                            url: oURL,
                                            data: JSON.stringify(oEntry),
                                            dataType: "json",
                                            headers: {
                                              "X-CSRF-Token": oToken,
                                              "Content-Type": "application/json"                    
                                          },
                                            success: function(result) {
                                                
                                                
                                                // console.log(result);
                                                oInstallments=[];
                                                RelatedBudgetNoArray=[];


                                                
                                                //that.onPdfExport();
                                                // console.log(result);                                                      
//                                              var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
                                                //var oBusyDialog = this.getView().byId("BusyDialog");
                                                //oBusyDialog.open();
                                          
//                                              var onBusyDialogPress = that.getDialogBusy();   
//                                              onBusyDialogPress.open();           
                                          
                                                                                          
                                                            
//                                                          sap.m.MessageBox.show(
//                                                                 "Form escalated to senior manager..", {
//                                                                         icon: sap.m.MessageBox.Icon.SUCCESS,
//                                                                         actions: [sap.m.MessageBox.Action.OK],
//                                                                         onClose: function(oAction){
//                                                                             
//                                                                             if (oAction === sap.m.MessageBox.Action.OK) {
//                                                                                   var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
//                                                                                              oRouter.navTo("SendItemPaf");
//                                                                                        }
//                                                                         },
//                                                                         styleClass: bCompact? "sapUiSizeCompact" : ""
//                                                                       }
      //
//                                                                     );
                                                            
                                                                         
                                                //that.resetValue();
                                                unamePas = atob(window.localStorage["unamePas"]);
                                                      arrayUserPas = unamePas.split(":");
                                                      username = arrayUserPas[0];
                                                      password = arrayUserPas[1];
                                                      
                                                      jQuery.ajax({
                                                    type : "GET",
                                                    contentType : "application/json",
                                                    url : "/RESTAdapter/b2b/findObject/"+username+"/PAF/",
                                                    dataType : "json",
                                                    async: false, 
                                                    success : function(data,textStatus, jqXHR) {
                                                      var finalFormId = data.T_PAF.item.length-1 ;
                                                      sap.ui.getCore().cPaf = data.T_PAF.item[finalFormId].PAFNO;
                                                      sap.m.MessageToast.show("Form escalated to Senior Manager..");
//                                                    that.getOwnerComponent().getRouter().navTo("SendItemBaf");
                                                      var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                                            oRouter.navTo("SendItemPaf");
//                                                    that.getRouter().navTo("SendItemBaf", true);
                                                      
                                                    }

                                                });
                                            }
                                        });
                                          sap.ui.getCore().busyDialog1.close();
                              },5000);
                              
                         }
                    
                   }
                  else{
                        sap.ui.getCore().busyDialog1.open();
                        setTimeout(function(){ 
                              Attachments.push({
                                          "Content":imgData,
                                    "FileName":"SCREENSHOT",
                                    "FileType":"PNG"
                                    });
                                    var oEntry = {"ProcessStartEvent": {"PaymentApproval": 
                                    {
                                          "uiAction": "",
                                          "comment": "",
                                          "InvoiceDetails": {
                                                "expiryDate": exTarih,
                                                "currencyType": selectItem,
                                                "currency": that.getView().byId('PayCurrency').getValue(),
                                                "invoiceNumber": that.getView().byId('PayInvoiceNum').getValue(),
                                                "invoiceDate": inTarih,
                                                "expiryDateStatus": vExpStatu
                                          },
                                          "FormDetails": {
                                                "requestNumber": "",
                                                "requestDate": sDate,
                                                "requestTime": "",
                                                "requestOwner": that.getView().byId('PayrequestOwner').getValue(),
                                                "department": that.getView().byId('Paydepartment').getValue(),
                                                "title": that.getView().byId('Paytitle').getValue(),
                                                "status": "",
                                                "paymentFormType": payFormType,
                                             },
                                            "VendorDetails": {
                                                "vendorNr": arrayVendor[0],
                                                "vendorName": arrayVendor[1],
                                                "vendorContact": that.getView().byId('PayConPer').getValue(),
                                                "vendorVKN": that.getView().byId('PayVenTC').getValue(),
                                                "vendorAddress": that.getView().byId('PayVenAdd').getValue(),
                                                "vendorMail": that.getView().byId('PayVenMail').getValue(),
                                                "vendorPhone": that.getView().byId('PayVenPhone').getValue(),
                                                "IBAN": that.getView().byId('PayIBAN').getValue(),
                                                "swiftCode": "",
                                                "bankName": that.getView().byId('PayBankName').getValue()
                                             },
                                             "PaymentDetails": {
                                                  "totalAmountUSD":totalUSD,
                                                "advanceAmount": that.getView().byId('PayAdvAmount').getValue(),
                                                "installmentAmount": that.getView().byId('PayInsAmount').getValue(),
                                                "advanceInformation": payAdvanceInf,
                                                "subject": that.getView().byId("PaySubject").getValue(),
                                                "type": payType,
                                                "paymentAmount": that.getView().byId('idPayAmount').getValue(),
                                                "paymentType": oSelectedRadioText,
                                                "netPaymentAmount": that.getView().byId('PayNetAmount').getValue(),
                                                "vatIncAmount": that.getView().byId('PayidVatIncAmount').getValue(),
                                                "withholdingTax": that.getView().byId('PayidTax').getValue(),
                                                "vatBudgetAmount": that.getView().byId('PayidAmount').getValue(),
                                                "comment": that.getView().byId('PayComment').getValue(),
                                                "Installment": oInstallments
                                             },
                                             "BudgetApprovalForm": {
                                                "totalAmount": that.getView().byId('PayTotalAmount').getValue(),
                                                "RelatedBudgetNo": RelatedBudgetNoArray,
                                                "Document": "",
                                                },
                                                "Attachments":{"item": Attachments},
                                             "Opinion":{
                                                "OpSndPerNo":"",
                                                "OpSndComment":"",
                                                "OpRcvPerNo":"",
                                                "OpRcvComment":""
                                              }
                                          }
                                                
                                            }
                                          };
                                    
                  
                                    jQuery.ajax({
                                      type: 'POST',
                                      url: oURL,
                                      data: JSON.stringify(oEntry),
                                      dataType: "json",
                                      headers: {
                                        "X-CSRF-Token": oToken,
                                        "Content-Type": "application/json"                    
                                    },
                                      success: function(result) {
                                          
                                          
                                          // console.log(result);
                                          oInstallments=[];
                                          RelatedBudgetNoArray=[];


                                          
                                          //that.onPdfExport();
                                          // console.log(result);                                                      
//                                        var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
                                          //var oBusyDialog = this.getView().byId("BusyDialog");
                                          //oBusyDialog.open();
                                    
//                                        var onBusyDialogPress = that.getDialogBusy();      
//                                        onBusyDialogPress.open();           
                                    
                                                                                    
                                                      
//                                                    sap.m.MessageBox.show(
//                                                           "Form escalated to senior manager..", {
//                                                                   icon: sap.m.MessageBox.Icon.SUCCESS,
//                                                                   actions: [sap.m.MessageBox.Action.OK],
//                                                                   onClose: function(oAction){
//                                                                       
//                                                                       if (oAction === sap.m.MessageBox.Action.OK) {
//                                                                             var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
//                                                                                        oRouter.navTo("SendItemPaf");
//                                                                                  }
//                                                                   },
//                                                                   styleClass: bCompact? "sapUiSizeCompact" : ""
//                                                                 }
//
//                                                               );
                                                      
                                                                   
                                          //that.resetValue();
                                          unamePas = atob(window.localStorage["unamePas"]);
                                                arrayUserPas = unamePas.split(":");
                                                username = arrayUserPas[0];
                                                password = arrayUserPas[1];
                                                
                                                jQuery.ajax({
                                              type : "GET",
                                              contentType : "application/json",
                                              url : "/RESTAdapter/b2b/findObject/"+username+"/PAF/",
                                              dataType : "json",
                                              async: false, 
                                              success : function(data,textStatus, jqXHR) {
                                                var finalFormId = data.T_PAF.item.length-1 ;
                                                sap.ui.getCore().cPaf = data.T_PAF.item[finalFormId].PAFNO;
                                                sap.m.MessageToast.show("Form escalated to Senior Manager..");
//                                              that.getOwnerComponent().getRouter().navTo("SendItemBaf");
                                                var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
                                                      oRouter.navTo("SendItemPaf");
//                                              that.getRouter().navTo("SendItemBaf", true);
                                                
                                              }

                                          });
                                      }
                                  });
                                    sap.ui.getCore().busyDialog1.close();
                        },5000);
                  }    
                  //PAF KONTROL->Paymount Amount = Installment Amount - VAT amount kontrolü end of ycoskun
                  
                   
            
            
            },
            getDialogBusy: function() {
                  this.oBusyDialog = sap.ui.xmlfragment("zn11_form.view.BusyDialog", this);
                  this.getView().addDependent(this.oBusyDialog);


                  return this.oBusyDialog;
            },
            onPdfExport: function() {
                  var oURL = "/RESTAdapter/BudgetApproval/Attachment";
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
                  
                   setTimeout(function(){                   
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
                  },1000);
                  
            },
            selectChangeFormType:function(oEvent){
                  
                  var oThat = this;
                  payFormType = oEvent.oSource.getSelectedItem().getText();
                  // console.log(payFormType);

                  if(payFormType === "Self Employment Invoice"){
                        oThat.getView().byId("PayidTax").setEnabled(true);
                        oThat.getView().byId("PayidVatIncAmount").setValue("");
                  }
                  else{
                        oThat.getView().byId("PayidTax").setEnabled(false);
                  }
                  oThat.getView().byId("PayFormType").setValue(payFormType);
                  
                  
            

            },
            selectAdvanceInf:function(oEvent){
                  
                  var oThat = this;
                  payAdvanceInf = oEvent.oSource.getSelectedItem().getText();
                  // console.log(payFormType);

                  
                  oThat.getView().byId("PayAdvanceInf").setValue(payAdvanceInf);
                  
                  if(payAdvanceInf === "YES"){
                        oThat.getView().byId("PayAdvAmount").setEnabled(true);
                        oThat.getView().byId("PayNetAmount").setEnabled(true);
                  }
                  else if(payAdvanceInf === "NO"){
                        oThat.getView().byId("PayAdvAmount").setEnabled(false);
                        oThat.getView().byId("PayNetAmount").setEnabled(false);
                  }
            

            },
            selectPayType:function(oEvent){
                  
                  var oThat = this;
                  payType = oEvent.oSource.getSelectedItem().getText();
                  
                  oThat.getView().byId("PayType").setValue(payType);
            

            },
            changeDate:function(){
                  
                  var that = this;
                  var expiryDate,invoiceDate,arrayStart,count,arrayEnd;
                  var exNok;
                  var inNok;
                  var counter;
                  var firstDate;
                  var secondDate;
                  

                  expiryDate = that.getView().byId("PayExpiryDate").getValue();
                  invoiceDate = that.getView().byId("PayInvoiceDate").getValue();
                  
                  //date'in EN veya TR gelip gelmedğinin kontrolü begin of
                  exNok = expiryDate.slice(1,2);
                  inNok = invoiceDate.slice(1,2);
                  
                  if(inNok !== "."){
                        inNok = invoiceDate.slice(2,3);
                  }
                  else{
                        inNok = invoiceDate.slice(1,2);
                  }
                  if(exNok !== "."){
                        exNok = expiryDate.slice(2,3);
                  }
                  else{
                        exNok = expiryDate.slice(1,2);
                  }
                  //end of
            

                  if(inNok === "."){            
                                          
                        arrayEnd = invoiceDate.split(".");
                        count = arrayEnd[0].length;
                        
                        if (count === 1 ) {
                              arrayEnd[0] = "0" + arrayEnd[0];
                              
                        }
                        
                        inTarih = arrayEnd[2] + arrayEnd[1] + arrayEnd[0];
                        secondDate = new Date(parseInt(arrayEnd[2]),parseInt(arrayEnd[1]),parseInt(arrayEnd[0]));
                        
                  }
                  else{                   
                        arrayEnd = invoiceDate.split("/");
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
                        inTarih = "20"+arrayEnd[2] + arrayEnd[0] + arrayEnd[1];
                        secondDate = new Date(parseInt("20"+arrayEnd[2]),parseInt(arrayEnd[0]),parseInt(arrayEnd[1]));
                  }     
                        
                  if(exNok === "."){            
                        
                        arrayEnd = expiryDate.split(".");
                        count = arrayEnd[0].length;
                        
                        if (count === 1 ) {
                              arrayEnd[0] = "0" + arrayEnd[0];
                              
                        }
                        
                        exTarih = arrayEnd[2] + arrayEnd[1] + arrayEnd[0];
                        firstDate = new Date(parseInt(arrayEnd[2]),parseInt(arrayEnd[1]),parseInt(arrayEnd[0]));
                        
                  }
                  else{                   
                        arrayEnd = expiryDate.split("/");
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
                        exTarih = "20"+arrayEnd[2] + arrayEnd[0] + arrayEnd[1];
                        firstDate = new Date(parseInt("20"+arrayEnd[2]),parseInt(arrayEnd[0]),parseInt(arrayEnd[1]));
                  }
                  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
                  var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
                  
                  if(diffDays >= 28){
                        vExpStatu = "0";
                  }
                  else{
                        vExpStatu = "1";
                  }
            },

            onPdfExport: function() {
                  
                  /*var oURL = "/RESTAdapter/BudgetApproval/Attachment";
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
                  
                   setTimeout(function(){                   
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
                  var oURL = "/RESTAdapter/BudgetApproval/Attachment";
                  var doc;

                  html2canvas($('#__panel1'), {
                        onrendered: function(canvas) {
                              imgData = canvas.toDataURL(
                                    'application/pdf');
                              doc = new jsPDF('1', 'mm', [242, 700]);
                              doc.addImage(imgData, 'PNG', 0, 0);
                              doc.save('doc.pdf');
                        }
                  });

            /*    setTimeout(function() {
                        var FileData = {
                              "MT_UI_BudgetApproval_Attachment": {
                                    "FileContent": imgData,
                                    "FileName": "doc.png"
                              }
                        }

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
                  }, 1000);*/
                  
            },
            handleValueHelpVendor:function(){
                  
                  var that = this;
                  var vendor;
                  var vendorName;
                  var jsonSearch;
                  var handleClose = function(oEvent) {
                        var oSelectedItem = oEvent.getParameter("selectedItem");
                        if (oSelectedItem) {
                              
                              var title = oSelectedItem.getTitle();
                              var array = title.split(' - ');
                              vendor = array[0];
                              vendorName = array[1];
                              that.getView().byId("PayVenName").setValue(vendor+" - "+vendorName);
                              
                              //VENDOR bilgilerinin getirilmesi begin of ycoskun                      
                              var jsonVendorResult;
                          var aDataVendor = jQuery.ajax({
                              type : "GET",
                              contentType : "application/json",
                              url : "/RESTAdapter/VendorInfo/"+vendor+"",
                              dataType : "json",
                              async: false, 
                              success : function(data,textStatus, jqXHR) {
                                    
                                    // console.log(data);
                                    that.getView().byId("PayVenAdd").setValue(data.E_ADDRESS);
                                    that.getView().byId("PayVenTC").setValue(data.E_TCKN);
                                    that.getView().byId("PayVenPhone").setValue(data.E_PHONE);
                                    that.getView().byId("PayConPer").setValue(data.E_CONTACT);
                                    that.getView().byId("PayVenMail").setValue(data.E_EMAIL);
                                    that.getView().byId("PayBankName").setValue(data.E_BANK);
                                    that.getView().byId("PayIBAN").setValue(data.E_IBAN);
                                    //that.getView().byId("PaySwiftCode").setValue();
                                  
                        
                                  
                              }
                          
                          }); 
                              //vendor bilgilerinin getirilmesi end of ycoskun
                              
                              //that.additionalInfoValidation();
                        }
                  };
                  if (!this._valueHelpSelectVendor) {
                        this._valueHelpSelectVendor = new sap.m.SelectDialog("valueHelpSelectVendor", {
                              title: "Vendor",
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
                                                 var test = array[0]+" - "+array[1];
                                                 jsonSearch = {STRING: test};
                                                 
                                                 searchSupp.push(jsonSearch);
                                                  
                                                  
                                               }
                                             
                                          // console.log(searchSupp);
                                          searchVendorModel.setData(searchSupp);
                                          that._valueHelpSelectVendor.setModel(searchVendorModel);
                                        
                                    }
                                
                                });               
                              },
                              confirm: handleClose
                        });
                        this._valueHelpSelectVendor.setModel(vendorModel);

                  } else {
                        this._valueHelpSelectVendor.setModel(vendorModel);
                  }
                  this._valueHelpSelectVendor.open();

            },
            formatSupp:function(value){
                        
                  var suppValue;
                  var array;
                  
                  //var suppValue;
                  if (value) {      
                        array = value.STRING.split('@');
                        suppValue = array[0] + " - " + array[1] + " - " + array[2] + " - " + array[3] + " - " + array[4];
            
                        
                  
                  } 
                  return suppValue;
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
                            currencyKur = sKur;
                            oThat.getView().byId('PayCurrency').setValue(sKur);
                         
                              
                            
                        }
                    
                    });
            
            },
            changeInvoice:function(){
                  
                  var that = this;
                  var vInvoiceDate,arrayStart,count,arrayEnd;
                  var inNok;
                  var counter;
                  
                  vInvoiceDate = that.getView().byId("PayInvoiceDate").getValue();
                  
                  //date'in EN veya TR gelip gelmedğinin kontrolü begin of
                  inNok = vInvoiceDate.slice(1,2);
            
                  if(inNok !== "."){
                        inNok = vInvoiceDate.slice(2,3);    
                  }
                  else{
                        inNok = vInvoiceDate.slice(1,2);
                  }
      
                  //end of
                  if(inNok === "."){            
                        arrayStart = vInvoiceDate.split(".");
                        count = arrayStart[0].length;
                        if (count === 1) {
                              arrayStart[0] = "0" + arrayStart[0];
                              
                        }
                        inTarih = arrayStart[2] + arrayStart[1] + arrayStart[0];                      
                        
                  }
                  else{
                        arrayStart = vInvoiceDate.split("/");
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
                        
                        inTarih = "20"+arrayStart[2] + arrayStart[0] + arrayStart[1];
                        
                  }
                  
                  //invoice date verilip expriy date'in servis ile alınması begin of ycoskun
              var aData = jQuery.ajax({
                  type : "GET",
                  contentType : "application/json",
                  url : "/RESTAdapter/InvoiceDate/"+inTarih,
                  dataType : "json",
                  async: false, 
                  success : function(data,textStatus, jqXHR) {
                        
                        oModel.setData({modelData : data}); 
                      // console.log(data.E_FDATE);                   
                      that.getView().byId("PayExpiryDate").setValue(data.E_FDATE);
                    
                      var expiryDate,arrayStart,count,arrayEnd;
                        var exNok;
                        var counter;
                          expiryDate = data.E_FDATE;
                          
                        //date'in EN veya TR gelip gelmedğinin kontrolü begin of
                        exNok = expiryDate.split("-");
      
                        exTarih = exNok[0] + exNok[1] + exNok[2];
                        
        
                  }
              
              }); 
                  
                  //invoice date verilip expriy date'in servis ile alınması end of ycoskun
              
                  
                  
            },
            handleCloseBaf: function(oEvent) {
                  
                  var that = this;
                  var vBafNo;
                  var vTotalBaf,vUsedBaf,vUsedAmount,vRemAmount,vTotal;
                  var aContexts = oEvent.getParameter("selectedContexts");
                  var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
            
      
                  var inputIdy;
            
                  
           
                  var IdRem,totalStr;
      
                  if (aContexts && aContexts.length) {
                        vBafNo = aContexts.map(function(oContext) { return oContext.getObject().BAFNO; }).join(", ");
                  }
                  
                  //aynı bafın eklenme kontrolü begin of ycoskun
                  var vBudgetNumber;
                  for (var i = 0; i < tableListRelatedNo.length; i++) {
                        
                        vBudgetNumber = tableListRelatedNo[i].mAggregations.cells["0"].mProperties.text;
                        if(vBudgetNumber === vBafNo){
                              sap.m.MessageBox.show(
                                     "Please do not enter the same Budget approval number ..", {
                                             icon: sap.m.MessageBox.Icon.SUCCESS,
                                             actions: [sap.m.MessageBox.Action.OK],
                                             onClose: function(oAction){
                                                 
                                                 if (oAction === sap.m.MessageBox.Action.OK) {
                                                            }
                                             },
                                             styleClass: bCompact? "sapUiSizeCompact" : ""
                                           }

                                         );
                              that.onAddBudgetDialogPress.destroy();
                              return;
                        }
                  }
                              oEvent.getSource().getBinding("items").filter([]);
                              
                              //BafNo ile total amoun ve used amount Bulmak
                              jQuery.ajax({
                            type : "GET",
                            contentType : "application/json",
                            url : "/RESTAdapter/BAFBudget/"+vBafNo,
                            dataType : "json",
                            async: false, 
                            success : function(data,textStatus, jqXHR) {
                              
                              vTotalBaf = data.E_TOBAF;
                              vUsedBaf = data.E_USBAF; 
                              debugger;
                              toplamUsedBaf = toplamUsedBaf + parseFloat(vUsedBaf);
                              that.getView().byId("PayUsedBaf").setValue(parseFloat(toplamUsedBaf.toString()));
                                    
                            }

                        });                     
                                    countRem = countRem + 1;
                                    countUsed = countUsed + 1;
                                    inputRem = "_text_" + countRem;
                                    inputUsed = "text__" + countUsed;
                                    
                                    countBaf = countBaf + 1;
                                    idInputBaf = "text_0" + countBaf;
                                   columnListItemNewLine = new sap.m.ColumnListItem({
//                                       type: sap.m.ListType.Active,
                                         press: function(oEvent){
                                               
//                                             var oList1 = that.getView().byId("idPayRelatedNoTbl");
//                                             var item1 = oEvent.getParameters();
//                                             oList1.removeItem(item1);
                       
                                          
                                          },
                                         unread: false,
                                         cells: [
                                                new sap.m.Link({ 
                                               text: vBafNo,          //text for button
                                      press : function(oEvent) { 
                                          var preqNo = oEvent.getSource().getText();
                                                 var aAttachDown = jQuery.ajax({
                                                     type : "GET",
                                                     contentType : "application/json",
                                                     url : "/RESTAdapter/b2b/getAttachment/SCREENSHOT&"+preqNo,
                                                     dataType : "json",
                                                     headers: {"x-csrf-token": "Fetch",
                                                                   "Authorization":"Basic "+btoa(username+":"+password)},
                                                     async: false, 
                                                      success : function(data,textStatus, jqXHR) {
                                                     }

                                                 });
                                                 
                                                 
                                                 
                                                  download(aAttachDown.responseJSON.E_CONTENT, preqNo+".PNG", "image/png");
                                 
                                       }
                                               }),
                                               new sap.ui.commons.TextField({      
                                                     value: vTotalBaf,
                                                     width:"6rem",
                                                     liveChange: function(oEvent) {

                                                     },
                                                     change:function(oEvent){
                                                           
                                                      }
                                               }),
                                               new sap.ui.commons.TextField({      
                                                     value: vUsedBaf,
                                                     width:"6rem",
                                                     liveChange: function(oEvent) {

                                                     },
                                                     change:function(oEvent){
                                                    	 
                                                           
                                                      }
                                               }),
                                               new sap.ui.commons.TextField({      
                                                     value: "",
                                                     width:"6rem",
                                                     id:inputUsed,
                                                     liveChange: function(oEvent) {

                                                     },
                                                     change:function(oEvent){
                                               
                                                            var inputNo = 0;
                                                           var inputNoRem = 0;
                                                           var toplam = 0;
                                                                 
                                                                  for (var a = 0; a < inputArrayIdUsed.length; a++) {     
                                                                       var inputId = sap.ui.getCore().byId(inputArrayIdUsed[a]);
                                                                       var input = inputId.mProperties.value;
                                                                       //var input = sap.ui.getCore().byId(inputArrayId[a]).getValue();
                                                                       inputNo = parseInt(input); 
                                                                        
                                                            
                                                                        if (inputNo > 0) {
                                                                             toplam = toplam + inputNo;
                                                                       }     
                                                                       if(input === ""){
                                                                             sap.ui.getCore().byId(inputArrayIdUsed[a]).setValue("");
                                                                       }
                                                                       else{
                                                                             var floatInput = parseFloat(inputNo.toString().replace(/\D/g, '')).toFixed(2);
                                                                             sap.ui.getCore().byId(inputArrayIdUsed[a]).setValue(floatInput);
                                                                       }
                                                                       debugger;
                                                                       var totalBaf = oEvent.getSource().oParent.mAggregations.cells[1].mProperties.value;
                                                                       var usedBaf = oEvent.getSource().oParent.mAggregations.cells[2].mProperties.value;
                                                                       var usedAmount = oEvent.getSource().oParent.mAggregations.cells[3].mProperties.value;
                                                                       if(parseInt(usedBaf) + parseInt(usedAmount) <= parseInt(totalBaf) ){
                                                                             var total = parseInt(totalBaf) - (parseInt(usedBaf) + parseInt(usedAmount));
                                                                             var totalFormat = parseFloat(total.toString().replace(/\D/g, '')).toFixed(2);
                                                                       sap.ui.getCore().byId(oEvent.getSource().oParent.mAggregations.cells[4].sId).setValue(totalFormat);
                                                                       }
                                                                       else{
                                                                             sap.m.MessageToast.show("Please enter Used Amount smaller than Total Amount");
                                                                             sap.ui.getCore().byId(inputArrayIdUsed[a]).setValue("");
                                                                             return;
                                                                       }                      
                                                                 }                                                          
                                                            // console.log(toplam);
                                                     that.getView().byId("PayTotalAmount").setValue(parseFloat(toplam.toString().replace(/\D/g, '')).toFixed(2));
                                                           
                                                            
                                                            //begin of ycoskun 09012017 payamount hesaplama
                                                           var hesap;
                                                           var vCurr = parseFloat(that.getView().byId('PayCurrency').getValue());
                                                           if(selectItem === "USD" || selectItem === "EUR" || selectItem === "GBP"){
                                                                 hesap = toplam/vCurr ;
                                                                 that.getView().byId("idPayAmount").setValue(hesap.toFixed(2));
                                                           }
                                                           else{
                                                                 debugger;
                                                             that.getView().byId("idPayAmount").setValue(parseFloat(toplam.toString().replace(/\D/g, '')).toFixed(2));
                                                           }
                                                           //end of ycoskun 09012017 payamount hesaplama
                                                                                         
                                                                  
                                                      }
                                               }),
                                               new sap.ui.commons.TextField({      
                                                     value: "",
                                                     editable:false,
                                                     width:"6rem",
                                                     id:inputRem,
                                                     liveChange: function(oEvent) {

                                                     },
                                                     change:function(oEvent){
                                               
                                                      }
                                               })
                                         ]
                                   });
                                     that.getView().byId("idPayRelatedNoTbl").addItem(columnListItemNewLine);
                                   inputArrayIdRem.push(inputRem);     
                                    inputArrayIdUsed.push(inputUsed);
                                   tableListRelatedNo.push(columnListItemNewLine);

                        
            
                  //aynı bafın eklenme kontrolü end of ycoskun
                        
                  
                  this.onAddBudgetDialogPress.destroy();
                  
            },
            handleClosePaf: function(oEvent) {
                  
                  var that = this;
                  var vPafNo;
                  var vAdvanceAmount = 0;
                  var vatIncAmount;
                  var payNetAmount;
                  var usamo;
                  var aContexts = oEvent.getParameter("selectedContexts");
                  var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
                  
            

                  if (aContexts && aContexts.length) {
                        vPafNo = aContexts.map(function(oContext) { return oContext.getObject().PAFNO; }).join(", ");
                  }
                  jQuery.ajax({
                type : "GET",
                contentType : "application/json",
                url : "/RESTAdapter/b2b/findObject/"+username+"/PAF/"+vPafNo,
                dataType : "json",
                async: false, 
                success : function(data,textStatus, jqXHR) {
                  debugger;
                   for (var a = 0; a < data.T_PAF_REBAF.item.length; a++) { 
                         usamo = data.T_PAF_REBAF.item[a].USAMO;
                         if(usamo === ""){
                               usamo = 0;
                         }
                         vAdvanceAmount = vAdvanceAmount + usamo;
                         
                   }
                   that.getView().byId("PayAdvAmount").setValue(vAdvanceAmount);
                   vatIncAmount = that.getView().byId("PayidVatIncAmount").getValue();
                   if(vatIncAmount === ""){
                         vatIncAmount = 0;
                   }
                   payNetAmount = parseFloat(vAdvanceAmount) + parseFloat(vatIncAmount);           
                   that.getView().byId("PayNetAmount").setValue(payNetAmount);
                   
                   
                
   
                }

            });
                  this.oAdvanceDialog.destroy();
                  
            },
            changeVatInc:function(){
                  var that = this;
                  var vVatIncAmount;
                  var vPayNetAmount;
                  var vAdvanceAmnt;
                  vVatIncAmount = that.getView().byId("PayidVatIncAmount").getValue();
                  vAdvanceAmnt = that.getView().byId("PayAdvAmount").getValue();
                  if(vAdvanceAmnt === ""){
                        vAdvanceAmnt = 0;
             }
                  vPayNetAmount = parseFloat(vVatIncAmount) + parseFloat(vAdvanceAmnt);
                  
                  var selAdvanceInf = that.getView().byId("PayAdvanceInf").getSelectedKey();
                  if( selAdvanceInf === "YES"){
                        that.getView().byId("PayNetAmount").setValue(vPayNetAmount);
                  }
                  
            },
            deleteItemPressed : function(evt) {
            	debugger;
                var data = this.byId("idPayRelatedNoTbl").getItems();
                var oTable = this.byId("idPayRelatedNoTbl");
                var sItems = oTable.getSelectedItems();
                var that = this;
                
                var vUsedBaf = parseFloat(sItems["0"].mAggregations.cells["2"].mProperties.value);
                var vUsedAmountF = parseFloat(sItems["0"].mAggregations.cells["3"].mProperties.value);
                var vUsedAmounttoplam = parseFloat(that.getView().byId("PayTotalAmount").getValue());
                
                var vFarkUsedBaf = toplamUsedBaf - vUsedBaf;
                var vFarkUsedAmount = vUsedAmounttoplam - vUsedAmountF;
                
                if (sItems.length == 0) {
                    alert("Please Select a row to Delete");
                    return;
                } else {
                  for ( var i = sItems.length - 1; i >= 0; i--) {
                      var path = sItems[i].mAggregations.cells[0].sId.slice(-1);
                      var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));                               
                      oTable.removeItem(idx);
                  }
                }
                oTable.removeSelections();
                
                that.getView().byId("PayUsedBaf").setValue(vFarkUsedBaf);
                that.getView().byId("PayTotalAmount").setValue(vFarkUsedAmount);
                
            },
            handleCancelBaf:function(){
                  this.onAddBudgetDialogPress.destroy();
            },
            handleCancelPaf:function(){
                  this.oAdvanceDialog.destroy();
            },
        AddInstallment:function(){
            countIns = countIns +1;
            vInsCount = vInsCount + 1;
            inputIdIns = "text__" + countIns;
            if(vInsCount >= 7){
                  sap.m.MessageBox.show("Installments table must be less than 7 row!");
                  return;
            }
            
                  this._data.Products.push({
                        	 installement: countIns.toString(),
                             expdt: '',
                             vatInclAmount: ''
                  });

                  this.jModel = new sap.ui.model.json.JSONModel();
                  this.jModel.setData(this._data);

                  this.byId("TableInsPay").setModel(this.jModel);
                  //this.jModel.refresh(); //which will add the new record
//                var delId = countIns -1;
//                delId= "__button18-__xmlview4--TableInsPay-"+delId;
//                var delbtn = sap.ui.getCore().byId();
//                delbtn.setVisible(false);
//                sap.ui.getCore().byID(delId).setVisible(false);
                  debugger;
                  inputArrayIdChange.push(inputIdIns);
      },

            
      PTAmountChange:function(oEvent){
          debugger;
          var that = this;
                var inputNo = 0;
                
                      
                      for (var a = 0; a < inputArrayIdChange.length; a++) { 
                            var inputIdAr = oEvent.getSource().getId().split("-");
                            var inputId = parseInt(inputIdAr[4]) + parseInt(a);
                            var inputArrayFull = inputIdAr[0]+"-"+inputIdAr[1]+"-"+inputIdAr[2]+"-"+inputIdAr[3]+"-"+inputId.toString();
                            
                            var selPayType;
                            var incAmount;
                            var vatAmount;
                            
                            var inputValue = sap.ui.getCore().byId(inputArrayFull).getValue();
                            debugger;

                            //var input = sap.ui.getCore().byId(inputArrayId[a]).getValue();
                            inputNo = parseFloat(inputValue); 
                            
                
                            if (inputNo > 0) {
                                  toplam = toplam + inputNo;
                            that.getView().byId("PayInsAmount").setValue(toplam);
                            incAmount = parseFloat(toplam);
                            if(that.getView().byId("PayidAmount").getValue() === ""){
                              vatAmount = 0;
                            }
                            else{
                              vatAmount = that.getView().byId("PayidAmount").getValue();
                            }
                            selPayType = that.getView().byId("PayFormType").getSelectedKey();
                            if(selPayType !== "selfType"){                          
                                  that.getView().byId("PayidVatIncAmount").setValue(vatAmount+incAmount);
                            }
                            }     
                            if(inputValue === ""){
                                  sap.ui.getCore().byId(inputArrayFull).setValue("");
                            }
                            else{
                                  var floatInput = parseFloat(inputNo);
                                  sap.ui.getCore().byId(inputArrayFull).setValue(floatInput);
                            }
                            
                            

                      }                                         
                // console.log(toplam);
          
                
          },

            AddInstallmentOld:function(){
                  var that = this;
                  
                  countIns = countIns +1;
                  vInsCount = vInsCount + 1;
                  inputIdIns = "text__" + countIns;
                  
                  if(vInsCount >= 7){
                        var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
                        sap.m.MessageBox.show(
                                     "Please do not pass 6 installments row..", {
                                             icon: sap.m.MessageBox.Icon.ERROR,
                                             actions: [sap.m.MessageBox.Action.OK],
                                             onClose: function(oAction){
                                                 
                                                 if (oAction === sap.m.MessageBox.Action.OK) {
                                                                  
                                                            }
                                             },
                                             styleClass: bCompact? "sapUiSizeCompact" : ""
                                           }

                  );    
                  }
                  else{
                        
                        columnListInsNewLine = new sap.m.ColumnListItem({
                             type: sap.m.ListType.Inactive,
                             unread: false,
                             cells: [
                                   new sap.ui.commons.TextField({      
                                          value: vInsCount,
                                          editable:false,
                                          liveChange: function(oEvent) {},
                                          change:function(oEvent){},
                                          width:"8rem"
                                   }),
                                   new sap.m.DatePicker({
                                         value:"",
                                         width:"8rem"
                                   }),
                                   new sap.ui.commons.TextField({      
                                         value: "",
                                         width:"8rem",
                                         id:inputIdIns,
                                         liveChange: function(oEvent) {
                                               
                                          },
                                         change:function(oEvent){
                                        	 debugger;
                                               var inputNo = 0;
                                         
                                                 toplam = 0;
                                                     
                                                      for (var a = 0; a < inputArrayId.length; a++) {   
                                                           var inputId = sap.ui.getCore().byId(inputArrayId[a]);
                                                           var input = inputId.mProperties.value;
                                                           //var input = sap.ui.getCore().byId(inputArrayId[a]).getValue();
                                                           inputNo = parseInt(input); 
                                                            
                                                
                                                            if (inputNo > 0) {
                                                                 toplam = toplam + inputNo;
                                                           }     
                                                           if(input === ""){
                                                                 sap.ui.getCore().byId(inputArrayId[a]).setValue("");
                                                           }
                                                           else{
                                                                 var floatInput = parseFloat(inputNo.toString().replace(/\D/g, '')).toFixed(2);
                                                                 sap.ui.getCore().byId(inputArrayId[a]).setValue(floatInput);
                                                           
                                                                  
                                                            }
                                                           
                                                            

                                                     }                                         
                                               // console.log(toplam);
                                         that.getView().byId("PayInsAmount").setValue(parseFloat(toplam.toString().replace(/\D/g, '')).toFixed(2));
                                               
                                          }
                                   })
                             ]
                       });
                       
                        that.getView().byId("TableInsPay").addItem(columnListInsNewLine);
                       inputArrayId.push(inputIdIns);
                       
                        tableListInstallment.push(columnListInsNewLine);
                        debugger;
                  }
      
            },
            changePayType:function(){
                  
                  var that = this;
                  //VAT Incl. Amount= Installment amount + VAT Amount (self employment invoice seçilmemişse) vat amuntu hesapla begin of ycoskun         
                  var VvatIncAmount = that.getView().byId("PayidVatIncAmount").getValue();
                  var VinsAmount = that.getView().byId("PayInsAmount").getValue();
                  var VvatAmount = that.getView().byId("PayidAmount").getValue();
                  var VpaymentAmount = that.getView().byId("idPayAmount").getValue();
                  var VwTax = that.getView().byId("PayidTax").getValue();
                  var Vtoplam = parseInt(VinsAmount) + parseInt(VvatAmount);
                  var VtoplamVat = (parseInt(VpaymentAmount) + parseInt(VvatAmount))- parseInt(VwTax);
                  
                  that.getView().byId("PayidTax").setValue(parseFloat(VwTax.toString().replace(/\D/g, '')).toFixed(2));
                  
                   if(payFormType !== "Self Employment Invoice"){
                        that.getView().byId("PayidVatIncAmount").setValue(parseFloat(Vtoplam.toString().replace(/\D/g, '')).toFixed(2));

                  }
                  else{
                        that.getView().byId("PayidVatIncAmount").setValue("");
                        // VAT Incl. Amount = Payment Amount + VAT Amount - Witholding tax (self employment invoice seçilmişse)
                        that.getView().byId("PayidVatIncAmount").setValue(parseFloat(VtoplamVat.toString().replace(/\D/g, '')).toFixed(2));
                  }
                              
            //VAT Incl. Amount= Installment amount + VAT Amount (self employment invoice seçilmemişse) vat amuntu hesapla end of ycoskun
            
            },
            changePayVAT:function(){
            	debugger;
                  var that = this;
                  var top;
                  var vatAmount = that.getView().byId("PayidAmount").getValue();                
                  var insAmount = that.getView().byId("PayInsAmount").getValue();        
            
            	if(vatAmount === ""){
            		vatAmount = 0;
            	    
            	}
            	if(insAmount === ""){
            		insAmount = 0;
            	    
            	}
            	top = parseFloat(vatAmount) + parseFloat(insAmount);
            	
            	 that.getView().byId("PayidAmount").setValue(parseFloat(vatAmount.toString().replace(/\D/g, '')).toFixed(2));
            	 that.getView().byId("PayidVatIncAmount").setValue(parseFloat(top.toString().replace(/\D/g, '')).toFixed(2));
                  
            },
            addRow : function(oArg){
                  
                  
                  Attachments.push({Name : ''});
                  jaModel.refresh();//which will add the new record
            },
            
            deleteRow : function(oArg){
                  var deleteRecord = oArg.getSource().getBindingContext().getObject();
                  for(var i=0;i<Attachments.length;i++){
                        if(Attachments[i] == deleteRecord )
                                    {
                                    //    pop this._data.Products[i] 
                              Attachments.splice(i,1); //removing 1 record from i th index.
                                          jaModel.refresh();
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
                        var oFileUploader = that.getView().byId("fileuploadPayment");
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
      jaModel.refresh();
},500);

// console.log(Attachments);


            },

            handleTypeMissmatch: function(oEvent) {
                  var aFileTypes = oEvent.getSource().getFileType();
                  jQuery.each(aFileTypes, function(key, value) {aFileTypes[key] = "*." +  value;});
                  var sSupportedFileTypes = aFileTypes.join(", ");
                  sap.m.MessageToast.show("The file type *." + oEvent.getParameter("fileType") +
                                                      " is not supported. Choose one of the following types: " +
                                                      sSupportedFileTypes);
            },

            handleValueChange: function(oEvent) {
                  sap.m.MessageToast.show("Added " + oEvent.getParameter("newValue") + "");
                  
//                Attachments.push({FileName : oEvent.getParameter("newValue")});
                  
                  
                  this.handleUploadPress();
            },

            handleSearchBaf:function(oEvent)
            {
                  var filters = [];
                  var sValue = oEvent.getParameter("value");
                  var sValueString = sValue.toString();
                  debugger;
                  var oBinding = oEvent.getSource().getBinding("items");
                  filters = [ 
                        new sap.ui.model.Filter("BAFNO", sap.ui.model.FilterOperator.Contains, sValueString),
                        new sap.ui.model.Filter("DEPPR", sap.ui.model.FilterOperator.Contains, sValueString),
                        new sap.ui.model.Filter("TITLE", sap.ui.model.FilterOperator.Contains, sValueString),
                        new sap.ui.model.Filter("RQDAT", sap.ui.model.FilterOperator.EQ, sValueString),
                        new sap.ui.model.Filter("BPSTA", sap.ui.model.FilterOperator.EQ, sValueString),
                        new sap.ui.model.Filter("BPEND", sap.ui.model.FilterOperator.EQ, sValueString)
                      ];
                  oBinding.filter(new sap.ui.model.Filter(filters, false));
            },

      
      
      });

                  return CController;

            });