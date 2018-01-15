jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.declare("zn11_form.util.ErrorHandler");

zn11_form.util.ErrorHandler = {
		
	retrieveErrorDetails : function (response) {
		var errorDetails = {};
		var responseBody = response && response.responseText;
		try {
			var parsedBody = responseBody && JSON.parse(responseBody);
			errorDetails.odataCode = parsedBody && parsedBody.error && parsedBody.error.code;
		} catch (e) {
			// body might be XML or null -> default error message
		}
		errorDetails.statusCode = response && response.statusCode;
		errorDetails.statusText = response && response.statusText;
		
		return errorDetails;
	},
	
	createErrorMessage : function (odataCode, statusCode, statusText, bundle, bundleErrorMessageTextKey) {
		var errorMessage;
		if (odataCode) {
			errorMessage = bundle.getText("ODATA_ERRMSG_" + odataCode);
		} else {
			// default error message
			errorMessage = bundle.getText(bundleErrorMessageTextKey);
			errorMessage += statusCode ? "\n\n" + statusCode + " " : "";
			errorMessage += statusText ? statusText : "";
		}
		return errorMessage;
	},
	
	handleRequestFailedError : function (response, bundle, bundleErrorDialogTitleKey, bundleErrorMessageTextKey) {
		var errorDetails = this.retrieveErrorDetails(response);
		var failureMsg = this.createErrorMessage(errorDetails.odataCode, errorDetails.statusCode, errorDetails.statusText, bundle, bundleErrorMessageTextKey);
		var failureDialogTitle = bundle.getText(bundleErrorDialogTitleKey);
		sap.m.MessageBox.show(failureMsg, {
			icon : sap.m.MessageBox.Icon.ERROR, 
			title : failureDialogTitle
		});
	}

};