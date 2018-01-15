sap.ui.define(function() {
	"use strict";

	var Formatter = {

			setFormat:function(value){
				if (value) {
					var array = value.split('@');
					var budgetId = array[0];
				} else {
					return value;
				}
			}
	};

	return Formatter;

}, /* bExport= */ true);