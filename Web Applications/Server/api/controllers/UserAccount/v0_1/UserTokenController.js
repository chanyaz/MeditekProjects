module.exports={
	CreateUserToken:function(req,res)
	{
		var userToken=req.body;
		Services.UserToken.CreateUserToken(userToken)
		.then(function(data){
			return res.ok(data);
		},function(err){
			return res.serverError(ErrorWrap(err));
		});
	},

	GetSecretKey:function(req,res)
	{
		var userToken=req.body;
		Services.UserToken.GetSecretKey(userToken)
		.then(function(data){
			res.ok(data);
		},function(err){
			return res.serverError(ErrorWrap(err));
		})
	}
}