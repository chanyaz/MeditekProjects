var $q = require('q');

//moment
var moment = require('moment');

//generator Password
var generatePassword = require('password-generator');

module.exports = {
	/*
		validation : validate input from client post into server
		input: patient's information
		output: validate patient's information
	*/
	validation : function(data) {
		var q = $q.defer();
		var errors = [];
		//create a error with contain a list errors input
		var err = new Error("ERRORS");
		try {
			//validate FirstName
			if(data.FirstName){
				if(data.FirstName.length < 0 || data.FirstName.length > 50){
					errors.push({field:"FirstName",message:"Patient.FirstName.length"});
					err.pushErrors(errors);
				}
			}

			//validate MiddleName
			if(data.MiddleName){
				if(data.MiddleName.length < 0 || data.MiddleName.length > 100){
					errors.push({field:"MiddleName",message:"Patient.MiddleName.length"});
					err.pushErrors(errors);
				}
			}

			//validate LastName
			if(data.LastName){
				if(data.LastName.length < 0 || data.LastName.length > 50){
					errors.push({field:"LastName",message:"Patient.LastName.length"});
					err.pushErrors(errors);
				}
			}

			//validate Gender
			if(data.Gender){
				if(data.Gender != "F" && data.Gender != "M"){
					errors.push({field:"Gender",message:"Patient.Gender.valuesField"});
					err.pushErrors(errors);
				}
			}

			//validate Address1
			if(data.Address1){
				if(data.Address1.length < 0 || data.Address1.length > 255){
					errors.push({field:"Address1",message:"Patient.Address1.length"});
					err.pushErrors(errors);
				}
			}

			//validate Address2
			if(data.Address2){
				if(data.Address2.length < 0 || data.Address2.length > 255){
					errors.push({field:"Address2",message:"Patient.Address2.length"});
					err.pushErrors(errors);
				}
			}

			//validate Occupation
			if(data.Occupation){
				if(data.Occupation.length < 0 || data.Occupation.length > 255){
					errors.push({field:"Occupation",message:"Patient.Occupation.length"});
					err.pushErrors(errors);
				}
			}

			//validate Suburb
			if(data.Suburb){
				if(data.Suburb.length < 0 || data.Suburb.length > 100){
					errors.push({field:"Suburb",message:"Patient.Suburb.length"});
					err.pushErrors(errors);
				}
			}

			//validate Postcode
			if(data.Postcode){
				if(data.Postcode.length < 0 || data.Postcode.length > 100){
					errors.push({field:"Postcode",message:"Patient.Postcode.length"});
					err.pushErrors(errors);
				}
			}

			//validate Email? hoi a Tan su dung exception
			if(data.Email){
				var EmailPattern=new RegExp(HelperService.regexPattern.email);
				var Email=data.Email.replace(HelperService.regexPattern.phoneExceptChars,'');
				if(!EmailPattern.test(Email)){
					errors.push({field:"Email",message:"Patient.Email.invalid-values"});
					err.pushErrors(errors);
					throw err;
				}
			}

			//validte State
			if(data.State){
				if(data.State.length < 0 || data.State.length > 255){
					errors.push({field:"State",message:"Patient.State.length"});
					err.pushErrors(errors);
				}
			}

			//validate HomePhoneNumber? hoi a Tan su dung exception
			if(data.HomePhoneNumber){
				var auHomePhoneNumberPattern=new RegExp(HelperService.regexPattern.auHomePhoneNumber);
				var HomePhone=data.HomePhoneNumber.replace(HelperService.regexPattern.phoneExceptChars,'');
				if(!auHomePhoneNumberPattern.test(HomePhone)){
					errors.push({field:"HomePhoneNumber",message:"Patient.HomePhoneNumber.invalid-values"});
					err.pushErrors(errors);
					throw err;
				}
			}

			//validate HomePhoneNumber? hoi a Tan su dung exception
			if(data.WorkPhoneNumber){
				var auWorkPhoneNumberPattern=new RegExp(HelperService.regexPattern.auHomePhoneNumber);
				var WorkPhoneNumber=data.WorkPhoneNumber.replace(HelperService.regexPattern.phoneExceptChars,'');
				if(!auWorkPhoneNumberPattern.test(WorkPhoneNumber)){
					errors.push({field:"WorkPhoneNumber",message:"Patient.WorkPhoneNumber.invalid-values"});
					err.pushErrors(errors);
					throw err;
				}
			}

			if(err.getErrors().length>0){
				throw err;
			}

			else{
				q.resolve({status:'success'});
			}
			//q.resolve({status:'success'});

		}
		catch(err){
			q.reject(err);
		}
		return q.promise;
	},

	whereClause : function(data) {
		var whereClause = {};
		whereClause.Patient = {};
		whereClause.UserAccount ={};
		if(data.Search!== null && data.Search!==undefined && data.Search!==''){
			if(data.Search.FirstName){
				whereClause.Patient.FirstName={
					like:'%'+data.Search.FirstName+'%'
				} 
			}
			if(data.Search.MiddleName){
				whereClause.Patient.MiddleName = {
					like:'%'+data.Search.MiddleName+'%'
				}
			}
			if(data.Search.LastName){
				whereClause.Patient.LastName = {
					like:'%'+data.Search.LastName+'%'
				}
			}
			if(data.Search.Gender){
				whereClause.Patient.Gender = {
					like:'%'+data.Search.Gender+'%'
				}
			}
			if(data.Search.Email){
				whereClause.Patient.Email = {
					like:'%'+data.Search.Email+'%'
				}
			}
			if(data.Search.Enable){
				whereClause.Patient.Enable = {
					like:'%'+data.Search.Enable+'%'
				}
			}
			if(data.Search.PhoneNumber){
				whereClause.UserAccount.PhoneNumber = {
					like:'%'+data.Search.PhoneNumber+'%'
				}
				// whereClause.push("UserAccount.PhoneNumber LIKE '%"+data.Search.PhoneNumber+"%'");
			}
		}
		return whereClause;
	},


	/*
		CreatePatient : service create patient
		input: Patient's information
		output: insert Patient's information into table Patient 
	*/
	CreatePatient : function(data) {
		var info = {
			Title           : data.Title,
			FirstName       : data.FirstName,
			MiddleName      : data.MiddleName,
			LastName        : data.LastName,
			DOB             : data.DOB,
			Gender          : data.Gender,
			Occupation      : data.Occupation,
			HomePhoneNumber : data.HomePhoneNumber,
			WorkPhoneNumber : data.WorkPhoneNumber,
			CountryID       : data.CountryID,
			Suburb          : data.Suburb,
			Postcode        : data.Postcode,
			Email           : data.Email,
			UID             : UUIDService.Create(),
			Address1        : data.Address1,
			Address2        : data.Address2,
			State           : data.State,
			Enable          : "Y",
			CreatedDate     : moment(new Date(),'YYYY-MM-DD HH:mm:ss ZZ').toDate()
		};
		return Services.Patient.validation(data)
		.then(function(success){
			if(data.PhoneNumber.substr(0,3)=='+61'){
				return Services.UserAccount.FindByPhoneNumber(data.PhoneNumber);
			}
			else{
				data.PhoneNumber = '+61'+data.PhoneNumber;
				return Services.UserAccount.FindByPhoneNumber(data.PhoneNumber);
			}
			//return Patient.create(data);
		},function(err){
			throw err;
		})
		.then(function(user){
			if(user.length > 0) {
				info.UserAccountID = user[0].ID;
				return Patient.create(info);
			}
			else{
				data.password = generatePassword(12, false);
				var userInfo = {
					UserName    : data.PhoneNumber,
					Email       : data.Email,
					PhoneNumber : data.PhoneNumber,
					Password    : data.password
				};
				userInfo.UID = UUIDService.Create();
				//create UserAccount
				return Services.UserAccount.CreateUserAccount(userInfo)
				.then(function(user){
					info.UserAccountID = user.ID;
					return Patient.create(info);
				},function(err){
					throw err;
				});
			}
		},function(err){
			throw err;
		});
	},


	/*
		SearchPatient : services find patient with condition
		input:patient's information
		output:find patient which was provided information.
	*/
	SearchPatient : function(data) {
		if(data.values!='' && data.values!=null && data.values!=undefined){
			var PhoneNumberPattern1=new RegExp(/^4[0-9]{8}$/);
			var PhoneNumberPattern2=new RegExp(/^(\+61|0061|0)?4[0-9]{8}$/);
			var PhoneNumber=data.values.replace(HelperService.regexPattern.phoneExceptChars,'');
			if(PhoneNumberPattern1.test(PhoneNumber)||PhoneNumberPattern2.test(PhoneNumber)){
				if(data.values.substr(0,3)=='+61'){
					return Services.UserAccount.FindByPhoneNumber(data.values)
					.then(function(user){
						//check if Phone Number is found in table UserAccount, 
						// get UserAccountID to find patient
						if(user!=undefined && user!=null && user!='' && user.length!=0){
							return Patient.findAndCountAll({
								include:[
									{
						            	model: UserAccount,
						            	attributes: ['PhoneNumber'],
								    	required: true
								    }
								],
								where: {
									UserAccountID : user[0].ID
								},
								limit: data.limit,
								offset: data.offset,
							})
							.then(function(result){
								return result;
							},function(err){
								throw err;
							});
						}
						else{
							return null;
						}
					},function(err){
						throw err;
					});
				}
				else{
					data.PhoneNumber = '+61'+data.values;
					return Services.UserAccount.FindByPhoneNumber(data.values)
					.then(function(user){
						//check if Phone Number is found in table UserAccount, 
						// get UserAccountID to find patient
						if(user!=undefined && user!=null && user!='' && user.length!=0){
							return Patient.findAndCountAll({
								include:[
											{
								            	model: UserAccount,
								            	attributes: ['PhoneNumber'],
										    	required: true
										    }
										],
								where: {
									UserAccountID : user[0].ID
								},
								limit: data.limit,
								offset: data.offset,
							})
							.then(function(result){
								return result;
							},function(err){
								throw err;
							});
						}
						else{
							return null;
						}
					},function(err){
						throw err;
					});
				}
			}
			else{
				return Patient.findAndCountAll({
					where: {
						$or :[
								// gom 3 cot FirstName MiddleName LastName lai de search FullName
								//dung concat sequelize
								Sequelize.where(Sequelize.fn("concat", Sequelize.col("FirstName"), ' ', Sequelize.col("MiddleName"), ' ', Sequelize.col("LastName")), {
						        	like: '%'+data.values+'%'
								}),

								{
									FirstName:{
										$like: '%'+data.values+'%'
									}
								},

								{	
									MiddleName:{
										$like: '%'+data.values+'%'
									}
								},

								{
									LastName:{
										$like: '%'+data.values+'%'
									}
								},

								{
									UID : data.values
								},

								{
									Gender: {
										$like: '%'+data.values+'%'
									}
								},

								{
									Email: {
										$like: '%'+data.values+'%'
									}
								},

								{
									Enable: data.values
								}
					  		]
					},
					limit: data.limit,
					offset: data.offset,
				})
				.then(function(result){
					return result;
				},function(err){
					throw err;
			})
			}
		}
		else {
			return Patient.findAndCountAll({
				include:[
					{
		            	model: UserAccount,
		            	attributes: ['PhoneNumber'],
				    	required: true
				    }
				],
				limit: data.limit,
				offset: data.offset,
			})
			.then(function(result){
				return result;
			},function(err){
				throw err;
			});
		}
	},


	/*
		UpdatePatient : service update a patient
		input:patient's information
		output:update patient into table Patient
	*/
	UpdatePatient : function(data) {
		data.ModifiedDate = new Date();
		var DOB = moment(data.DOB,'YYYY-MM-DD HH:mm:ss ZZ').toDate();
		//get data not required
		var patientInfo={
			ID              : data.ID,
			Title           : data.Title,
			FirstName       : data.FirstName,
			MiddleName      : data.MiddleName,
			LastName        : data.LastName,
			DOB             : DOB,
			Gender          : data.Gender,
			Address1        : data.Address1,
			Address2        : data.Address2,
			Enable          : data.Enable,
			Suburb          : data.Suburb,
			Postcode        : data.Postcode,
			State           : data.State,
			Email           : data.Email,
			Occupation      : data.Occupation,
			HomePhoneNumber : data.HomePhoneNumber,
			WorkPhoneNumber : data.WorkPhoneNumber,
			CreatedDate     : data.CreatedDate,
			CreatedBy       : data.CreatedBy,
			ModifiedDate    : data.ModifiedDate,
			ModifiedBy      : data.ModifiedBy
		};

		//get data required ( if data has values, get it)
		if(data.UserAccountID)  patientInfo.UserAccountID = data.UserAccountID;
		if(data.CountryID)  patientInfo.CountryID = data.CountryID;
		if(data.UID)  patientInfo.UID = data.UID;
		return Services.Patient.validation(data)
		.then(function(success){
			return Patient.update(patientInfo,{
				where:{
					UID : patientInfo.UID
				}
			});
		}, function(err){
			throw err;
		});
	},


	/*
		GetPatient : service get a patient with condition
		input:useraccount's UID
		output: get patient's information.
	*/
	GetPatient : function(data) {
		return Services.UserAccount.GetUserAccountDetails(data)
		.then(function(user){
			//check if UserAccount is found in table UserAccount, get UserAccountID to find patient
			if(user!=undefined && user!=null && user!='' && user.length!=0){
				return Patient.findAll({
					where: {
						UserAccountID : user.ID
					},
					include: [
						{
			            	model: Country,
			                attributes: [ 'ShortName'],
			                required: true
			            },{
			            	model: UserAccount,
			            	attributes: ['PhoneNumber'],
			            	required: true
			            }
					]
				});
			}
			else{
				return null;
			}
		},function(err){
			throw err;
		});
	},
	
	/*
		DetailPatient: service get patient detail by patient's UID
		input: Patient's UID
		output: get patient's detail
	*/
	DetailPatient : function(data) {
		return Patient.findAll({
			where:{
				UID : data.UID
			},
			include:[
				{
	            	model: UserAccount,
	            	attributes: ['PhoneNumber','ID','UID'],
			    	required: true
			    }
			]
		})
		.then(function(result){
			return result;
		},function(err){
			throw err;
		});
	},

	/*
		LoadListPatient : service get list patient
		input: amount patient
		output: get list patient from table Patient
	*/
	LoadListPatient : function(data){
		var resLimit = (data.limit)? data.limit : 10;
		var resOffset = (data.offset)? data.offset : 0;
		var whereClause = Services.Patient.whereClause(data);
		return Patient.findAndCountAll({
			include:[
				{
		           	model: UserAccount,
		          	attributes: ['PhoneNumber'],
				   	required: true,
				   	where:{
				   		$or: whereClause.UserAccount
				   	}
			    }
			],
			limit  : resLimit,
			offset : resOffset,
			order  : data.order,
			// where  : UserAccount.PhoneNumber='+456456'
			// where  : whereClause
			where: {
				$or: whereClause.Patient
				
			}
		})
		.then(function(result){
			return result;
		},function(err){
			throw err;
		});
			
		// else {
		// 	return Patient.findAndCountAll({
		// 		include:[
		// 			{
		//             	model: UserAccount,
		//             	attributes: ['PhoneNumber'],
		// 		    	required: true
		// 		    }
		// 		],
		// 		limit  : resLimit,
		// 		offset : resOffset,
		// 		order  : data.order
		// 	})
		// 	.then(function(result){
		// 		return result;
		// 	},function(err){
		// 		var error = new Error("SERVER ERROR");
		// 		var errors = [];
		// 		errors.push({message:"LoadListPatient.findAll.error"});
		// 		error.pushErrors(errors);
		// 		throw error;
		// 	})
		// }
	},

	CheckPatient : function(data) {
		var info = {};
		return Services.Patient.validation(data)
		.then(function(success){
			if(data.PhoneNumber!=undefined && data.PhoneNumber!=null && data.PhoneNumber!=''){
				data.PhoneNumber = data.PhoneNumber.substr(0,3)=="+61"?data.PhoneNumber:"+61"+data.PhoneNumber;
				return Services.UserAccount.FindByPhoneNumber(data.PhoneNumber)
				.then(function(user){
					if(user!==undefined && user!==null && user!=='' && user.length!==0){
						info.Email = user[0].Email;
						info.PhoneNumber = user[0].PhoneNumber;
						return Patient.findAll({
								where :{
									UserAccountID : user[0].ID
								}
							});
		
					}
					else
						return ({
							isCheck:false
						});
				},function(err){
					throw err;
				})
				.then(function(result){
					if(result!==undefined && result!==null && result!=='' && result.length!==0 && result.isCheck!==false){
						return ({
							isCheck:true
						});
					}
					else
						return ({
							isCheck:false,
							data: {
								Email : info.Email,
								PhoneNumber: info.PhoneNumber
							}
						});
				},function(err){
					throw err;
				});
			}
			else{
				var error = new Error("CheckPatient.error");
				error.pushErrors("invalid.PhoneNumber");
				throw error;
			}
		},function(err){
			throw err;
		})
	}


	// DeletePatient : function(patientID) {
	// 	return Patient.destroy({
	// 		where : {
	// 			ID : patientID
	// 		}
	// 	});
	// }

};