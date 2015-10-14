var app = angular.module('app.authentication.controller', [
	
]);

app.controller('authenticationCtrl', function($rootScope,$scope,$state,$cookies,AuthenticationService,toastr){
	console.log('authenticationCtrl');
	$rootScope.countries = [];
	$scope.logout = function(){
		AuthenticationService.logout().then(function(){
			var cookies = $cookies.getAll();
			angular.forEach(cookies, function (v, k) {
			    $cookies.remove(k);
			});
			$state.go("unAuthentication.login", null, {
                location: "replace",
                reload: true
            });
		}, function(err) {
            toastr.error(err.data.message, "Error");
        })
	}
	AuthenticationService.getListCountry().then(function(result){
		$rootScope.countries = result.data;
	},function(err){
		toastr.error("error data country","ERROR");
	});

	$rootScope.states = [
		{ name: 'Victoria' },
		{ name: 'New South Wales' },
		{ name: 'Queensland' },
		{ name: 'Austria Capital Territory' },
		{ name: 'Northern Territory' },
		{ name: 'Western Australia' },
		{ name: 'Tasmania' }
	];

	$rootScope.insurers = [
		{name: 'Insurer Company'},
		{name: 'Mineral Resources'},
		{name: 'Mesa Minerals'}
	];
	$rootScope.Account_types = [
		{name: 'Titanium Privilege Account'},
		{name: '3-in-1 Account'},
		{name: 'Silver Savings Account'}
	];
});

