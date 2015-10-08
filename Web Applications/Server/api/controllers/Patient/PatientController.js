module.exports = {
	/*
		CreatePatient : create a new patient
		input: Patient's information
		output: insert Patient's information into table Patient 
	*/
	CreatePatient : function(req, res) {
		var data = req.body.data;
		Services.Patient.CreatePatient(data)
		.then(function(info){
			res.ok({status:200, message:"success"});
		})
		.catch(function(err){
			res.serverError({status:500, message:ErrorWrap(err)});
		});
	},

	/*
		SearchPatient : find patient with condition
		input: Patient's name or PhoneNumber
		output: get patient's list which was found in client 
	*/
	SearchPatient : function(req, res) {
		var data = req.body.data;
		Services.Patient.SearchPatient(data)
		.then(function(info){
			if(info!==undefined && info!==null && info.length > 0)
				res.ok({status:200, message:"success", data:info});
			else
				res.notFound({status:404,message:"not Found"});
		})
		.catch(function(err){
			res.serverError({status:500,message:ErrorWrap(err)});
		});
	},


	/*
		UpdatePatient : update patient's information
		input: patient's information updated
		output: update patient'infomation into table Patient 
	*/
	UpdatePatient : function(req, res) {
		var data = req.body.data;
		Services.Patient.UpdatePatient(data)
		.then(function(result){
			if(result[0] > 0)
				res.ok({status:200,message:"success"});
			else
				res.notFound({status:404,message:"not Found"});
		})
		.catch(function(err){
			return res.serverError({status:500,message:ErrorWrap(err)});
		});
	},

	/*
		GetPatient get a patient with condition
		input:  UserAccount's UID
		output: Patient's information of Patient's ID if patient has data.
	*/
	GetPatient : function(req, res) {
		var data = req.body.data;
		Services.Patient.GetPatient(data)
		.then(function(info){
			if(info!==null && info!==undefined){
				res.ok({status:200, message:"success", data:info});
			} else {
				res.notFound({status:404, message:"not Found"});
			}
		})
		.catch(function(err){
			res.serverError({status:500,message:ErrorWrap(err)});
		});
	},

	/*
		DeletePatient : disable patient who was deleted.
		input: Patient's ID
		output: attribute Enable of Patient will receive value "N" in table Patient 
	*/
	DeletePatient : function(req, res) {
		var ID = req.body.data;
		var patientInfo = {
			ID     : ID,
			Enable : "N"
		}
		Services.Patient.UpdatePatient(patientInfo)
		.then(function(result){
			if(result===0)
				res.notFound({status:404, message:"not Found"});
			else
				res.ok({status:200,message:"success"});
		})
		.catch(function(err){
			res.serverError({status:500, message:ErrorWrap(err)});
		});
	},

	/*
		LoadListPatient: load list patient
		input: amount patient
		output: get list patient from table Patient
	*/
	LoadListPatient : function(req, res) {
		var data = req.body.data;
		var limit = data.limit;
		var offset = data.offset;
		Services.Patient.LoadListPatient(limit, offset)
		.then(function(result){
			if(result!==undefined && result!==null && result!=='')
				res.ok({status:200,message:"success",data:result});
			else
				res.notFound({status:404,message:"not found"});
		})
		.catch(function(err){
			res.serverError({status:500,message:ErrorWrap(err)});
		});
	}
};