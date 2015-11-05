var $q = require('q');
var o=require("../HelperService");

/**
 * Validation: 
 * Kiểm tra thông tin user request
 * - User nếu login bằng web thì không cần deviceid
 * - User nếu login bằng device thì cần deviceid
 * Input:
 * 	- userAccess: thông tin user truy cập
 * 		+UserUID
 * 		+SystemType
 * 		+DeviceID (bắt buộc nếu systemtype thuộc mobile system)
 * Output:
 *  - Nếu hợp lệ trả về {status:'success'};
 *  - Nếu không hợp lệ quăng về error;
 */
function Validation(userAccess)
{
	var error=new Error("UserToken.Validation.Error");
	var q=$q.defer();
	try
	{
		var systems=o.getSystems();
		var mobileSystems=o.getMobileSystems();

		//kiểm tra thông tin user request có được cung cấp hay không
		if(!_.isObject(userAccess) || _.isEmpty(userAccess))
		{
			error.pushError("params.notProvided");
			throw error;
		}

		if(!o.checkData(userAccess.UserUID))
		{
			error.pushError("userUID.notProvided");
			throw error;
		}

		//Kiểm tra systemType có được cung cấp hay không,
		//Nếu được cung cấp thì kiểm tra có hợp lệ hay không
		if(!o.checkData(userAccess.SystemType))
		{
			error.pushError("systemType.notProvided");
			throw error;
		}
		else if(systems.indexOf(userAccess.SystemType)>=0)
		{
			//Kiểm tra nếu là mobile system thì cần có deviceId
			if(mobileSystems.indexOf(userAccess.SystemType)>=0 && !userAccess.DeviceID)
			{
				error.pushError('deviceId.notProvided');
				throw error;
			}
		}
		else
		{
			error.pushError("systemType.unknown");
			throw error;
		}
		q.resolve({status:'success'});
	}
	catch(err)
	{
		q.reject(err);
	}
	return q.promise;
};


module.exports={
	
	/**
	 * [MakeUserToken description]
	 * Nếu userAccess chưa có userToken thì tạo userToken
	 * Nếu userAccess đã có userToken thì update userToken
	 * 		Các thông tin sẽ được update: SecretKey,SecretCreatedDate,TokenExpired
	 */
	MakeUserToken:function(userAccess,transaction)
	{
		console.log("=======================MakeUserToken==============================");
		var error=new Error("MakeUserToken.Error");
		return Validation(userAccess)
		.then(function(data){
			return Services.UserAccount.GetUserAccountDetails({UID:userAccess.UserUID},null,transaction)
			.then(function(user){
				if(o.checkData(user))
				{
					//Truy vấn userToken (để xem có tồn tại hay chưa)
					function CheckExist()
					{
						if(userAccess.SystemType==HelperService.const.systemType.website)
						{
							return UserToken.findOne({
								where:{
									UserAccountID:user.ID,
									SystemType:HelperService.const.systemType.website
								}
							},{transaction:transaction});
						}
						else
						{
							return UserToken.findOne({
								where:{
									UserAccountID:user.ID,
									DeviceID:userAccess.DeviceID
								}
							},{transaction:transaction})
						}
					}

					return CheckExist()	
					.then(function(ut){
						if(o.checkData(ut))
						{
							//Nếu userToken đã tồn tại thì update userToken với secret key mới
							//đồng thời cập nhật tokenExpired
							return ut.updateAttributes({
								SecretKey:UUIDService.Create(),
								SecretCreatedDate:new Date(),
								TokenExpired:o.const.authSecretExprired[userAccess.SystemType],
								Enable:'Y',
							},{transaction:transaction})
							.then(function(result){
								return result;
							},function(err){
								o.exlog(err);
								error.pushError("userToken.updateError");
								throw error;
							})
						}
						else
						{
							//Nếu userToken chưa tồn tại thì tạo mới userToken:
							var insertInfo={
								UserAccountID:user.ID,
								SystemType:userAccess.SystemType,
								SecretKey:UUIDService.Create(),
								SecretCreatedDate:new Date(),
								TokenExpired:o.const.authSecretExprired[userAccess.SystemType],
								Enable:'Y',
							};
							//Nếu system type là mobile thì yêu cầu cần có DeviceID
							if(userAccess.SystemType!=HelperService.const.systemType.website)
							{
								insertInfo.DeviceID=userAccess.DeviceID;
							}

							return UserToken.create(insertInfo,{transaction:transaction})
							.then(function(result){
								return result;
							},function(err){
								o.exlog(err);
								error.pushError("userToken.insertError");
								throw error;
							})
						}
					},function(err){
						o.exlog(err);
						error.pushError("userToken.queryError");
						throw error;
					})
				}
				else
				{
					error.pushError("userAccount.notFound");
					throw error;
				}
			},function(err){
				o.exlog(err);
				error.pushError("userAccount.queryError");
				throw error;
			})
		},function(err){
			throw err;
		});
	},

	/**
	 * [GetUserToken description]
	 * Lấy thông tin UserToken
	 */
	GetUserToken:function(userAccess,transaction)
	{
		var error=new Error("GetUserToken.Error");
		return Validation(userAccess)
		.then(function(data){
			return Services.UserAccount.GetUserAccountDetails({UID:userAccess.UserUID},null,transaction)
			.then(function(user){
				function CheckExist()
				{
					if(userAccess.SystemType==HelperService.const.systemType.website)
					{
						return UserToken.findOne({
							where:{
								UserAccountID:user.ID,
								SystemType:HelperService.const.systemType.website
							}
						},{transaction:transaction});
					}
					else
					{
						return UserToken.findOne({
							where:{
								UserAccountID:user.ID,
								DeviceID:userAccess.DeviceID
							}
						},{transaction:transaction})
					}
				}
				return CheckExist()
				.then(function(ut){
					if(o.checkData(ut))
					{
						return ut;
					}
					else
					{
						error.pushError("userToken.notFound");
						throw error;
					}
				},function(err){
					o.exlog(err);
					error.pushError("userToken.queryError");
					throw error;
				})
			},function(err){
				o.exlog(err);
				error.pushError("userAccount.queryError");
				throw error;
			})
			
		},function(err){
			throw err;
		})
	},
}