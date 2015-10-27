var app = angular.module('app.unAuthentication.register.controller', [
]);

app.controller('registerCtrl', function($scope, $state, FileUploader, toastr, $cookies, doctorService, UnauthenticatedService){
	
	// List country
	UnauthenticatedService.listCountry()
	.then(function(result) {
		$scope.country = result;
		$scope.data.CountryID = 14;
	}, function(err) {});

    // Department List
    doctorService.listDepartment()
    .then(function(result) {
        $scope.department = result;
    }, function(err) {});

	// Check MobilePhone
	$scope.checkUser = function(data) {

		$scope.validateCheck(data)
		.then(function(success) {
			
			UnauthenticatedService.checkUserNameAccount(data)
			.then(function(result) {

				if(result.length > 0) {
					toastr.error('Username already exists');
				} else {

					UnauthenticatedService.checkPhoneUserAccount(data)
					.then(function(result2) {

						if(result2.length > 0) {
							toastr.error('MobilePhone already exists');
						} else {
							
							UnauthenticatedService.checkEmailAccount(data)
							.then(function(result3) {

								if(result3.length > 0) {
									toastr.error('Email already exists');
								} else {

									$scope.step++;
									
								} // end else
							
							}, function(err) {}) // end check email
							
						} // end else

					}, function(err) {}) // end check Mobile

				} // end else

			}) // end check Username
		
		}, function(err) {});
			
	}

    // Check Info
    $scope.save = function(data) {

        $scope.validateInfo(data)
        .then(function(success) {
            
            data.CreatedDate = moment().format('YYYY-MM-DD HH:mm:ss Z');
            data.Type = 'EXTERTAL_PRACTITIONER';

            UnauthenticatedService.createAccount(data)
            .then(function(result) {
                var info = {
                    PhoneNumber: data.PhoneNumber,
                    // PhoneNumber: '+840936767117',
                    content: result.data.VerificationCode
                };

                UnauthenticatedService.sendSms(info)
                .then(function(success) {
                    toastr.success('Register Successfull');
                    $state.go('unAuthentication.login', null, {
                        location: 'replace',
                        reload: true
                    });
                }, function(err) {});
                        
            }, function(err) {});
        }, function(err) {});

    }

	// Back Button
	$scope.btn_back = function(){
		// $scope.show_hide =s true;
		$scope.step--;
	}
	
	$scope.step = 1;

});