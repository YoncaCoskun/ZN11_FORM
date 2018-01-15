jQuery.sap.declare("zn11_form.util.ModelBuilder");

zn11_form.util.ModelBuilder = {

	BPM_PREFIX : "SAPBPM",
	BPM_SEPARATOR : "::",

	completeJSONModelAccordingSchema: function (jsonStartEntity, odataSchema, odataEntityName) {
		var odataEntityType = this.findEntityTypeByName(odataSchema.entityType, odataEntityName);
		if (odataEntityType.property) {
			this.convertEdmTimeToDate(jsonStartEntity, odataEntityType);
		}
		// nothing to do if there are no navigation properties
		if (odataEntityType.navigationProperty){
			for (var i = 0; i < odataEntityType.navigationProperty.length; i++) {
				var navigationProperty = odataEntityType.navigationProperty[i];

				var associationSet = this.findAssociationSetByName(odataSchema, navigationProperty.relationship);
				var entitySetName = associationSet.end[1].entitySet;

				var toEntityType = this.findEntityTypeByName(odataSchema.entityType, entitySetName);
				
				if (jsonStartEntity[navigationProperty.name] === null || typeof jsonStartEntity[navigationProperty.name] === "undefined"){
					var multiplicity = this.getMultiplicity(odataSchema, navigationProperty.relationship, navigationProperty.toRole);
					if (multiplicity === "*") {
						jsonStartEntity[navigationProperty.name] = {results: []};
						jsonStartEntity[navigationProperty.name].results.push(this.completeJSONModelAccordingSchema(jsonStartEntity[navigationProperty.name], odataSchema, entitySetName));
					} else {
						jsonStartEntity[navigationProperty.name] = this.createEmptyJSONEntity(odataSchema, toEntityType);
					}
				} else {
					if (jsonStartEntity[navigationProperty.name].hasOwnProperty("__deferred")){
						delete jsonStartEntity[navigationProperty.name];
					} else {
						if(jsonStartEntity[navigationProperty.name].results instanceof Array){
							var resultLength = jsonStartEntity[navigationProperty.name].results.length;
							if(resultLength == 0){
								// empty collection? generate one empty element, since we currently don't generate tables but single fragments
								// Remove if this is not desired.
								jsonStartEntity[navigationProperty.name].results[0] = this.createEmptyJSONEntity(odataSchema, toEntityType);
							}else{
								for (var l = 0; l < jsonStartEntity[navigationProperty.name].results.length; l++){
									this.completeJSONModelAccordingSchema(jsonStartEntity[navigationProperty.name].results[l], odataSchema, entitySetName);
								}
							}
						}else{
							this.completeJSONModelAccordingSchema(jsonStartEntity[navigationProperty.name], odataSchema, entitySetName);
						}
					}
				}
			}
		}
	},
	
	findAssociationSetByName : function(schema, relationName) {
        var relationNameWithPrefix = "SAPBPM" + relationName;
        var entityContainers = schema.entityContainer;
        for (var i = 0; i < entityContainers.length; i++) {
	        var associationSets = entityContainers[i].associationSet;
			for (var j = 0; j < associationSets.length; j++) {
				var associationName = associationSets[j].association;
	            if (relationName === associationName || relationNameWithPrefix === associationName) {
	                return associationSets[j];
	            }
	        }
        }
        return null;
	},
	
	createEmptyJSONEntity : function (oDataSchema, odataEntityType){
		var jsonEntity = {};
		for (var i=0; i<odataEntityType.property.length; i++) {
			var property = odataEntityType.property [i];
			
			if (property.name === "EDM_Key"){
				// skip EDM_Key
				continue;
			}
			if (property.type === "Edm.Time") {
				jsonEntity[property.name] = this.createEdmTimeProperty();
			} else {
				jsonEntity[property.name] = null;	
			}
		}
		
		if (odataEntityType.navigationProperty) {
			for (var i = 0; i < odataEntityType.navigationProperty.length; i++) {
				var navigationProperty = odataEntityType.navigationProperty[i];
				
				var associationSet  = this.findAssociationSetByName(oDataSchema, navigationProperty.relationship);
				var entitySetName = associationSet.end[1].entitySet;

				var toEntityType = this.findEntityTypeByName(oDataSchema.entityType, entitySetName);
				
				var multiplicity = this.getMultiplicity(oDataSchema, navigationProperty.relationship, navigationProperty.toRole);
				if(multiplicity === "1" || multiplicity === "0..1"){
				    jsonEntity[navigationProperty.name] = this.createEmptyJSONEntity(oDataSchema, toEntityType);
				} else if (multiplicity === "*") {
				    jsonEntity[navigationProperty.name] = {results: []};
                    jsonEntity[navigationProperty.name].results.push(this.createEmptyJSONEntity(oDataSchema, toEntityType));
				}
			}
		}
		
		return jsonEntity;
	},
	
	findEntityTypeByName : function (entities, name) {
		for (var i=0; i<entities.length; i++){
			var entity = entities[i];
			if (entity.name === name){
				return entity;
			}
		}
		return null;
	},
	
	getMultiplicity : function (oDataSchema, qualifiedAssociationName, roleName) {
		for (var i = 0; i < oDataSchema.association.length; i++) {
			var association = oDataSchema.association[i];
			if (oDataSchema.namespace + "." + association.name === qualifiedAssociationName) {
				for (var j = 0; j < association.end.length; j++) {
					var end = association.end[j]; 
					if (end.role === roleName) {
						return end.multiplicity; 
					}
				}
			}
		}
		return null;
	},
	
	//for each Array in data we remove empty elements by using removeEmptyEntitiesFromCollection method
	removeEmptyEntitiesFromCollections : function (data) {
		for (var property in data) {
			if (data.hasOwnProperty(property)) {
				var propertyValue = data[property];
				if (propertyValue) {
					if (propertyValue.results instanceof Array) {
						if (propertyValue.hasOwnProperty("results")) {
							this.removeEmptyEntitiesFromCollection(propertyValue.results)
						}
					} else if (typeof propertyValue === "object") {
						this.removeEmptyEntitiesFromCollections(data[property]);
					}
				}
				
			}
		}
	},
	
	removeEmptyEntitiesFromCollection : function (collection) {
		for (var i = 0; i < collection.length; i++) {
			var item = collection[i];
			var isEmpty = true;
			for (var property in item) {
				if (item.hasOwnProperty(property)) {
					var propertyValue = item[property];
					if (propertyValue !== null && typeof propertyValue === "object") {
						// since item has a complex type, we have to check only first item
						this.removeEmptyEntitiesFromCollections(item);
						isEmpty = false;
						break;
					}
					if (propertyValue) {
						isEmpty = false;
						// not break, because we still can find a complex property
					}
				}
			}
			if (isEmpty) {
				collection.splice(i--, 1);
			}
		}
	},
	
	createEdmTimeProperty : function () {
		var property = {};
		property.__edmType = "Edm.Time";
		return property;
	},
	
	//for each property with type Edm.Time convert ms to Date
	convertEdmTimeToDate : function (jsonEntity, odataEntityType) {	
		var propertiesLength = odataEntityType.property.length;
		for (var i = 0; i < propertiesLength; i++) {
			var property = odataEntityType.property[i];
			if (property.type === "Edm.Time") {
				var propertyName = property.name;
				if (!jsonEntity[propertyName]){
					jsonEntity[propertyName] = this.createEdmTimeProperty();
				} else {
					jsonEntity[propertyName].date = new Date(jsonEntity[propertyName].ms);
				}	
			}
		}
	},
	
	//for each property with type Edm.Time set time from the property date.
	setEdmTimeFromConvertedProperty : function (jsonData) {
		for (var property in jsonData) {
			if (jsonData.hasOwnProperty(property)) {
				var propertyValue = jsonData[property];
				if (propertyValue && typeof propertyValue === "object") {
					if (propertyValue["__edmType"] === "Edm.Time") {
						var date = jsonData[property].date;
						if (date) {
							var ISO8601_duration = "PT" + date.getUTCHours() + "H" + date.getUTCMinutes() + "M" + date.getUTCSeconds() + "S"; // to PT00H00M00S
							jsonData[property] = ISO8601_duration;
						} else {
							jsonData[property] = null;
						}
					} else {
						this.setEdmTimeFromConvertedProperty(propertyValue);
					}
				}
			}
		}
	}	
};