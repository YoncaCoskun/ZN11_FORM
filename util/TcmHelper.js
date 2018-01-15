jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.declare("zn11_form.util.TcmHelper");

zn11_form.util.TcmHelper = {

	tcmSvcURL : "/bpmodata/tasks.svc",
	
	/**
	 * Function to claim a BPM Task with the specified Task Instance ID
	 */
	claimTask : function (taskInstanceId, successHandler, failureHandler) {
		// create ODataModel for BPM Tasks OData service
		var oDataSettings = ManagerAppComp.Component.prototype.oDataSettings;
		var tasksODataModel = new sap.ui.model.odata.v2.ODataModel(this.tcmSvcURL, oDataSettings);
		
		var parameters = {		
			urlParameters : "InstanceID='" + taskInstanceId + "'",
			success : successHandler,
			error : failureHandler
		};
		
		// send request to BPM Tasks OData service to claim the Task
		tasksODataModel.create("/Claim", null, parameters);
	}, 
	
	/**
	 * Function to release a BPM Task with the specified Task Instance ID
	 */
	releaseTask : function (taskInstanceId, successHandler, failureHandler) {
		// create ODataModel for BPM Tasks OData service
		var oDataSettings = ManagerAppComp.Component.prototype.oDataSettings;
		var tasksODataModel = new sap.ui.model.odata.v2.ODataModel(this.tcmSvcURL, oDataSettings);
	
		var parameters = {		
			urlParameters : "InstanceID='" + taskInstanceId + "'",
			success : successHandler,
			error : failureHandler
		};
		
		// send request to BPM Tasks OData service to release the Task
		tasksODataModel.create("/Release", null, parameters);
	}
};