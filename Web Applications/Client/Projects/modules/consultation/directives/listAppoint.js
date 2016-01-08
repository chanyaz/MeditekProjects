var app = angular.module('app.authentication.consultation.directives.listAppoint', []);
app.directive('listAppoint', function(consultationServices, $modal, $cookies, $state, $stateParams) {
    return {
        restrict: 'E',
        templateUrl: "modules/consultation/directives/templates/listAppoint.html",
        link: function(scope, ele, attr) {

            var Init = function() {
                scope.searchObject = {
                    Limit: 20,
                    Offset: 0,
                    currentPage: 1,
                    maxSize: 5,
                    Filter: [{
                        Appointment: {
                            Enable: 'Y'
                        }
                    }, {
                        TelehealthAppointment: {
                            Type: 'TEL'
                        }

                    }],
                    Order: [{
                        Appointment: {
                            CreatedDate: 'DESC',
                            FromTime: null
                        }
                    }],
                    Search: [{
                        PatientAppointment: {
                            FullName: null
                        }
                    }, {
                        Doctor: {
                            FullName: null
                        }
                    }],
                    Range: [{
                        Appointment: {
                            CreatedDate: [null, null],
                            FromTime: [null, null]
                        }
                    }]
                };
                scope.searchObjectMap = angular.copy(scope.searchObject);
                scope.load();
            };
            scope.Status = {
                apptStatus: Consualtation.apptStatus
            }
            scope.SetPage = function() {
                scope.searchObjectMap.Offset = (scope.searchObjectMap.currentPage - 1) * scope.searchObjectMap.Limit;
                scope.load();
            };
            scope.load = function() {
                o.loadingPage(true);
                scope.searchObjectMapTemp = angular.copy(scope.searchObjectMap);
                consultationServices.listAppointment(scope.searchObjectMapTemp).then(function(response) {
                    o.loadingPage(false);
                    scope.consultation = response.rows;
                    console.log(scope.consultation)
                    scope.CountRow = response.count;
                });
            }
            Init();
            scope.toggle = true;

            scope.Detail = function(data) {
                console.log('data',data)
                var data = {
                    UID: data.UID,
                    UIDPatient: (data.Patients.length == 0) ? 'e.x.ex':data.Patients[0].UID
                };
                $state.go("authentication.consultation.detail", {
                    data: data
                });
            };
            scope.toggleFilter = function() {
                scope.toggle = scope.toggle === false ? true : false;
            };
        }
    };
})
