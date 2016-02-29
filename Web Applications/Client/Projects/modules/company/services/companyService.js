angular.module('app.authentication.company.service', [])
.factory("companyService", function(Restangular, $q, toastr) {

	var services = {};
	var api = Restangular.all('api');
	var characterRegex = /^[a-zA-Z0-9\s]{0,255}$/;
	var addressRegex = /^[a-zA-Z0-9\s,'-\/]{0,255}$/;
	var postcodeRegex = /^[0-9]{4}$/;

	// services.getEnableFile = function(data) {
	// 	var instanceApi = api.one('enableFile/'+data.isEnable+'/'+data.fileUID);
	// 	return instanceApi.get();
	// }
	// services.getoneDepartment = function(data) {
	// 	var instanceApi = api.all('getOneDepartment');
	// 	return instanceApi.post({data: data});
	// }

	services.validate = function(info) {
		console.log(info);
		var error = [];
		var q = $q.defer();
		try {

			//validate FirstName
			if('CompanyName' in info){
				if(info.CompanyName){
					if(info.CompanyName.length < 0 || info.CompanyName.length > 255){
						error.push({field:"CompanyName",message:"max length"});
					}
					if(!characterRegex.test(info.CompanyName)){
						error.push({field:"CompanyName",message:"invalid value"});
					}
				}
			}
			else{
				error.push({field:"CompanyName",message:"required"});
			}

			//validate SiteName
			if('CompanySiteSiteName' in info){
				if(info.CompanySiteSiteName){
					if(info.CompanySiteSiteName < 0 || info.CompanySiteSiteName > 255){
						error.push({field:"CompanySiteSiteName",message:"max length"});
					}
					if(!characterRegex.test(info.CompanySiteSiteName)){
						error.push({field:"CompanySiteSiteName",message:"invalid value"});
					}
				}
			}
			else{
				error.push({field:"CompanySiteSiteName",message:"required"});
			}

			//validate Address1
			if('CompanySiteAddress1' in info){
				if(info.CompanySiteAddress1){
					if(info.CompanySiteAddress1.length < 0 || info.CompanySiteAddress1.length > 255){
						error.push({field:"CompanySiteAddress1",message:"max length"});
					}
					if(!addressRegex.test(info.CompanySiteAddress1)){
						error.push({field:"CompanySiteAddress1",message:"invalid value"});
					}
				}
			}
			else {
				error.push({field:"CompanySiteAddress1",message:"required"});
			}

			//validate Address2
			if('CompanySiteAddress2' in info){
				if(info.CompanySiteAddress2){
					if(info.CompanySiteAddress2.length < 0 || info.CompanySiteAddress2.length > 255){
						error.push({field:"CompanySiteAddress2",message:"max length"});
					}
					if(!addressRegex.test(info.CompanySiteAddress2)){
						error.push({field:"CompanySiteAddress2",message:"invalid value"});
					}
				}
			}

			//validate Suburb
			if('CompanySiteSuburb' in info){
				if(info.CompanySiteSuburb){
					if(info.CompanySiteSuburb.length < 0 || info.CompanySiteSuburb.length > 255){
						error.push({field:"CompanySiteSuburb",message:"max length"});
					}
				}
			}
			else {
				error.push({field:"CompanySiteSuburb",message:"required"});
			}

			//validate Postcode
			if('CompanySitePostcode' in info){
				if(info.CompanySitePostcode){
					if(info.CompanySitePostcode.length < 0 || info.CompanySitePostcode.length > 255){
						error.push({field:"CompanySitePostcode",message:"max length"});
					}
					if(!postcodeRegex.test(info.CompanySitePostcode)){
						error.push({field:"CompanySitePostcode",message:"Postcode is a 4 digits number"});
					}
				}
			}
			else{
				error.push({field:"CompanySitePostcode",message:"required"});
			}

			//validate State
			if('CompanySiteState' in info){
				if(info.CompanySiteState){
					if(info.CompanySiteState.length < 0 || info.CompanySiteState.length > 255){
						error.push({field:"CompanySiteState",message:"max length"});
					}
					if(!characterRegex.test(info.CompanySiteState)){
						error.push({field:"CompanySiteState",message:"invalid value"});
					}
				}
			}
			else {
				error.push({field:"CompanySiteState",message:"required"});
			}

			//validate Country
			if('CompanySiteCountry' in info){
				if(info.CompanySiteCountry==null){
					error.push({field:"CompanySiteCountry",message:"required"});
				}
			}
			else {
				error.push({field:"CompanySiteCountry",message:"required"});
			}

			//validate ContactName
			if('CompanySiteContactName' in info){
				if(info.CompanySiteContactName){
					if(info.CompanySiteContactName.length < 0 || info.CompanySiteContactName.length > 255){
						error.push({field:"CompanySiteContactName",message:"max length"});
					}
				}
				// else {
				// 	error.push({field:"ContactName",message:"required"});
				// }
			}

				//validate HomePhoneNumber? hoi a Tan su dung exception
			if('CompanySiteHomePhoneNumber' in info){
				if(info.CompanySiteHomePhoneNumber){
					var auHomePhoneNumberPattern=new RegExp(/^[0-9]{6,10}$/);
					var HomePhone=info.CompanySiteHomePhoneNumber.replace(/[\(\)\s\-]/g,'');
					if(!auHomePhoneNumberPattern.test(HomePhone)){
						error.push({field:"CompanySiteHomePhoneNumber",message:"Phone Number is invalid. The number is a 6-10 digits number"});
					}
				}
			}
			
			//end validate SiteInfo

			if(error.length>0){
				throw error;
			}
			else{
				q.resolve({status:'success'});
			}

		}
		catch(error){
			q.reject(error);
		}
		return q.promise;
	};

	services.createCompany = function(data) {
		var createCompany = api.all('company/create-company');
		return createCompany.post({data:data});
	};

	services.getlist = function(data) {
		var getlist = api.all('company/get-list');
		return getlist.post({data:data});
	};

	services.detailcompany = function(data) {
		var detailcompany = api.all('company/detail-company');
		return detailcompany.post({data:data});
	};

	services.loadDetail = function(data) {
		var loadDetail = api.all('company/load-detail');
		return loadDetail.post({data:data});
	};

	services.create = function(data) {
		var create = api.all('company/create');
		return create.post({data:data});
	};

	services.update = function(data) {
		var update = api.all('company/update');
		return update.post({data:data});
	};

	services.changestatus = function(data) {
		var disable = api.all('company/change-status');
		return disable.post({data:data});
	};

	services.createStaff = function(data) {
		var createStaff = api.all('company/create-staff');
		return createStaff.post({data:data});
	};

	return services;
});