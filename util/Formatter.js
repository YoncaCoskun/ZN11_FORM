jQuery.sap.declare("zn11_form.util.Formatter");

zn11_form.util.Formatter = {
		
		setInstallment:function(value){
			if (value) {
				var remData = value.toString().replace(".","")
				var strTotalAmountValue =parseFloat(remData).toFixed(2)
			       .replace(".", ",") 
			       .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
				
				return strTotalAmountValue;
			} else {
				return value;
			}
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
		dateOdataRFCFormat: function(value)
		{
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var dateToString = oDateFormat.format(new Date(value));
			var dateFilterString ="datetime'"+dateToString.toString()+"T20:59'"
			return dateFilterString;
		},
		dateToString: function(value)
		{
			var sValue =value.toString();
			return sValue;
		},
		changeStatus: function(value){
			if (value === -2) {
				value="Pending Approval";
		} else if(value === -1){
				value="Request Owner";
		}
		return value;
		},
	

};