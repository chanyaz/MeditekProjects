var Config = require('config');

module.exports = {
	formCreate: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				url: Config.apiUrl+'eformtemplate/create',
				data: data,
				success: resolve
			})	
		});
		return p;
	},
	formList: function(){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'GET',
				url: Config.apiUrl+'eformtemplate/list',
				success: resolve
			})	
		})
		return p;
	},
	formSave: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eformtemplate/save',
				success: resolve
			})	
		})
		return p;
	},
	formDetail: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eformtemplate/detail',
				success: resolve
			})	
		})
		return p;
	},
	formUpdate: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eformtemplate/update',
				success: resolve
			})	
		})
		return p;
	},
	formRemove: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eformtemplate/remove',
				success: resolve
			})
		})
		return p;
	},
	preFormDetail: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'GET',
				url: Config.apiServerUrl+'api/appointment-wa-detail/eform/'+data.UID,
				success: resolve
			})	
		})
		return p;
	},
	formClientSave: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eform/save',
				success: resolve
			})	
		})
		return p;
	},
	formClientList: function(){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'GET',
				url: Config.apiUrl+'eform/list',
				success: resolve
			})	
		})
		return p;
	},
	formClientRemove: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eform/remove',
				success: resolve
			})	
		})
		return p;
	},
	formClientDetail: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eform/detail',
				success: resolve
			})	
		})
		return p;	
	},
	formClientUpdate: function(data){
		var p = new Promise(function(resolve, reject){
			$.ajax({
				type: 'POST',
				data: data,
				url: Config.apiUrl+'eform/update',
				success: resolve
			})	
		})
		return p;	
	}
}