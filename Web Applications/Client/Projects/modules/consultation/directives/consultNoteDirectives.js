var app = angular.module('app.authentication.consultation.directives.consultNoteDirectives', []);
app.directive('consultNote', function(consultationServices, $modal, $cookies, $state, $stateParams, toastr, $timeout, FileUploader, $rootScope) {
    return {
        restrict: 'E',
        scope: {
            consultationuid: '='
        },
        templateUrl: "modules/consultation/directives/templates/consultNoteDirectives.html",
        controller: function($scope) {
            $scope.checkRoleUpdate = true;
            $scope.DataPrintPDF = null;
            var Window;
            if ($cookies.getObject('userInfo').roles[0].RoleCode == 'INTERNAL_PRACTITIONER') {
                $scope.checkRoleUpdate = false;
            };
            $scope.requestInfo = {
                UID: $stateParams.UID,
                Consultations: [{
                    FileUploads: [],
                    ConsultationData: []
                }],

            }
            $scope.FileUploads = [];
            $scope.requestOther = {};
            $scope.CheckUpdate = true;
            $timeout(function() {
                App.initAjax();
            })
            var uploader = $scope.uploader = new FileUploader({
                url: o.const.uploadFileUrl,
                withCredentials: true,
                alias: 'uploadFile'
            });
            $scope.SendRequestUploadFile = function() {
                console.log('uploader', uploader);
                uploader.uploadAll();
            }
            uploader.filters.push({
                name: 'customFilter',
                fn: function(item /*{File|FileLikeObject}*/ , options) {
                    return this.queue.length < 10;
                }
            });
            uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
                //console.info('onWhenAddingFileFailed', item, filter, options);
            };
            uploader.onAfterAddingFile = function(fileItem) {
                //console.info('onAfterAddingFile', fileItem);
            };
            uploader.onAfterAddingAll = function(addedFileItems) {
                //console.info('onAfterAddingAll', addedFileItems);
            };
            uploader.onBeforeUploadItem = function(item) {
                item.headers.systemtype = 'WEB';
                item.headers.Authorization = ('Bearer ' + $cookies.get("token"));
                item.headers.userUID = $cookies.getObject('userInfo').UID;
                item.headers.fileType = 'MedicalImage';
                item.formData[0] = {};
                item.formData[0].userUID = $cookies.getObject('userInfo').UID;
                item.formData[0].fileType = 'MedicalImage';
                console.info('onBeforeUploadItem', item);
            };
            uploader.onProgressItem = function(fileItem, progress) {
                //console.info('onProgressItem', fileItem, progress);
            };
            uploader.onProgressAll = function(progress) {
                //console.info('onProgressAll', progress);
            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                console.info('onSuccessItem', fileItem, response, status, headers);
            };
            uploader.onErrorItem = function(fileItem, response, status, headers) {
                // console.info('onErrorItem', fileItem, response, status, headers);
                if (Boolean(headers.requireupdatetoken) === true) {
                    $rootScope.getNewToken();
                }
            };
            uploader.onCancelItem = function(fileItem, response, status, headers) {
                //console.info('onCancelItem', fileItem, response, status, headers);
            };
            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                console.info('onCompleteItem', fileItem, response, status, headers);
                if (Boolean(headers.requireupdatetoken) === true) {
                    $rootScope.getNewToken();
                }
                if (response.status == 'success') {
                    if (!$scope.requestInfo.Consultations[0].FileUploads) {
                        $scope.requestInfo.Consultations[0].FileUploads = [];
                    };
                    $scope.requestInfo.Consultations[0].FileUploads.push({
                        UID: response.fileUID
                    });
                };
            };
            uploader.onCompleteAll = function() {
                if ($scope.CheckUpdate) {
                    $scope.createConsultation();
                } else {
                    $scope.updateConsultation();
                }
            };

            $scope.ConsultationData;
            $scope.$watch('consultationuid', function(newValue, oldValue) {
                if (newValue !== undefined) {
                    consultationServices.detailConsultation(newValue).then(function(response) {
                        console.log(response)
                        $scope.requestInfo = null;
                        $scope.requestOther = {};
                        if (response.data !== null) {
                            $scope.DataPrintPDF = angular.copy(response.data)
                            $scope.loadData(response.data);
                        } else {
                            toastr.error("Detail Empty");
                            $scope.Reset();
                        };
                    }, function(err) {
                        o.loadingPage(false);
                        toastr.error('Detail Consultation Fail');
                    });
                };
            });
            $scope.PrintPDF = function() {
                o.loadingPage(true);
                var ConsultationDataTemp = [];
                for (var key in $scope.requestInfo.Consultations[0].ConsultationData) {
                    var newkey = key.split("__").join(" ");
                    var res = newkey.split(".");
                    var otherkey = res[2] + res[3] + 'Other';
                    var object = {
                        Section: res[0],
                        Category: res[1],
                        Type: res[2],
                        Name: res[3],
                        Value: ($scope.requestInfo.Consultations[0].ConsultationData[key].Value == 'OtherProvider') ? $scope.requestOther[otherkey] : $scope.requestInfo.Consultations[0].ConsultationData[key].Value,
                        FileUploads: $scope.requestInfo.Consultations[0].ConsultationData[key].FileUploads
                    };
                    var isExist = false;

                    ConsultationDataTemp.forEach(function(valueTemp, keyTemp) {
                        if (object.Value !== null) {
                            if (valueTemp.Section == object.Section &&
                                valueTemp.Category == object.Category &&
                                valueTemp.Type == object.Type &&
                                valueTemp.Name == object.Name) {
                                isExist = true;
                            }
                        } else {
                            isExist = true;
                        };
                    });
                    if (!isExist) {
                        if (object.Value !== null && object.Value !== "") {
                            ConsultationDataTemp.push(object);
                        };
                    };
                };
                consultationServices.getPatientDetail($stateParams.UIDPatient).then(function(response) {
                    var PDFData = null;
                    var postData = []
                    var PDFData = angular.copy(ConsultationDataTemp);
                    PDFData.forEach(function(valueTemp, keyTemp) {
                        var object = {
                            value: valueTemp.Value,
                            name: valueTemp.Name
                        };
                        postData.push(object)
                    })

                    var firstname = {
                        name: "firstname",
                        value: response.data[0].FirstName
                    }
                    postData.push(firstname)
                    var lastname = {
                        name: "lastname",
                        value: response.data[0].LastName
                    }
                    postData.push(lastname)
                    var DOB = {
                        name: "DOB",
                        value: response.data[0].DOB
                    }
                    postData.push(DOB)
                    var gender = {
                        name: "gender",
                        value: response.data[0].Gender
                    }
                    postData.push(gender)
                    var consultationdate = {
                        name: "consultation_date",
                        value: moment().format('DD/MM/YYYY')
                    }
                    postData.push(consultationdate)
                    var dataPost = {
                        printMethod: "jasper",
                        templateUID: "consult_note",
                        data: postData
                    }
                    consultationServices.PrintPDF(dataPost).then(function(responsePrintPDF) {
                        o.loadingPage(false);
                        console.log(responsePrintPDF)
                        var blob = new Blob([responsePrintPDF.data], {
                            type: 'application/pdf'
                        });
                        saveAs(blob, "ConsultationNote_" + response.data[0].FirstName + response.data[0].LastName);
                    }, function(err) {
                        o.loadingPage(false);
                        toastr.error("Print PDF Fail");
                    });
                }, function(err) {
                    o.loadingPage(false);
                    toastr.error("Print PDF Fail");
                });
            }
            $scope.Reset = function() {
                $state.go("authentication.consultation.detail.consultNote", {}, {
                    reload: true
                });
            }
            $scope.loadData = function(data) {
                $timeout(function() {
                    $.uniform.update();
                }, 0);
                $scope.CheckUpdate = false;
                $scope.FileUploads = angular.copy(data.FileUploads);
                $scope.requestInfo = {
                    UID: $stateParams.UID,
                    Consultations: [{
                        UID: data.UID,
                        ConsultationData: []
                    }]
                }
                $scope.Temp = angular.copy(data.ConsultationData);
                $scope.Temp.forEach(function(valueRes, indexRes) {
                    if (valueRes != null && valueRes != undefined) {
                        var keyClinicalDetail = valueRes.Section + '.' + valueRes.Category + '.' + valueRes.Type + '.' + valueRes.Name;
                        keyClinicalDetail = keyClinicalDetail.split(" ").join("__");
                        var keyOther = valueRes.Type + valueRes.Name;
                        if (keyOther != 0) {
                            keyOther = keyOther.split(" ").join("");
                        }
                        $scope.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail] = {};
                        if (valueRes.Name == 'US' || valueRes.Name == 'MRI' || valueRes.Name == 'PetScan' || valueRes.Name == 'CT') {
                            if (valueRes.Value !== 'WD' && valueRes.Value !== 'ENVISION' && valueRes.Value !== 'INSIGHT') {
                                $scope.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail].Value = 'OtherProvider';
                                $scope.requestOther[keyOther + 'Other'] = valueRes.Value;
                            } else {
                                $scope.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail].Value = valueRes.Value;
                            };
                        } else {
                            $scope.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail].Value = valueRes.Value;
                        };

                        $scope.requestInfo.Consultations[0].ConsultationData[keyClinicalDetail].FileUploads = valueRes.FileUploads;
                        $scope.requestOther[keyOther] = true;
                    }
                })
                $scope.ConsultationData = data.ConsultationData;
                $scope.requestInfo.Consultations[0].FileUploads = $scope.FileUploads;
            }

            $scope.Create = function() {
                (($scope.uploader.queue.length > 0) ? $scope.SendRequestUploadFile() : $scope.createConsultation());
            }
            $scope.Update = function() {
                (($scope.uploader.queue.length > 0) ? $scope.SendRequestUploadFile() : $scope.updateConsultation());
            }
            $scope.createConsultation = function() {
                $scope.ConsultationDataCreate();
                if ($scope.requestInfo.Consultations[0].ConsultationData.length !== 0 || $scope.requestInfo.Consultations[0].FileUploads.length !== 0) {
                    if ($scope.requestInfo.Consultations[0].FileUploads.length !== 0 && $scope.requestInfo.Consultations[0].ConsultationData.length == 0) {
                        var FileUploads = {
                            Category: "Appointment",
                            FileUploads: null,
                            Name: "FileUploads",
                            Section: "Consultation Details",
                            Type: "FileUploads",
                            Value: $scope.requestInfo.Consultations[0].FileUploads.length
                        }
                        $scope.requestInfo.Consultations[0].ConsultationData.push(FileUploads);
                    }
                    console.log('$scope.requestInfo', $scope.requestInfo)
                    o.loadingPage(true);
                    consultationServices.createConsultation($scope.requestInfo).then(function(response) {
                        o.loadingPage(false);
                        consultationServices.detailConsultation(response.data[0].UID).then(function(response) {
                            $scope.checkRoleUpdate = false;
                            $scope.requestInfo = null;
                            $scope.requestOther = {};
                            if (response.data !== null) {
                                $scope.DataPrintPDF = angular.copy(response.data)
                                $scope.loadData(response.data);
                            } else {
                                toastr.error("Detail Empty");
                                $scope.Reset();
                            };
                        }, function(err) {
                            o.loadingPage(false);
                            toastr.error('Detail Consultation Fail');
                        });
                        if (response == 'success') {
                            o.loadingPage(false);
                            $state.go("authentication.consultation.detail", {
                                UID: $stateParams.UID,
                                UIDPatient: $stateParams.UIDPatient
                            });
                            toastr.success("Success");
                        };
                    }, function(err) {
                        o.loadingPage(false);
                        toastr.error('Create Consultation Fail');
                    });
                } else {
                    toastr.error("Please input data");
                };
            }
            $scope.updateConsultation = function() {
                $scope.ConsultationUpdate();
                var UID = angular.copy($scope.requestInfo.Consultations[0].UID);
                o.loadingPage(true);
                consultationServices.updateConsultation($scope.requestInfo).then(function(response) {
                    if (response == 'success') {
                        o.loadingPage(false);
                        consultationServices.detailConsultation(UID).then(function(response) {
                            $scope.uploader.clearQueue();
                            $scope.requestInfo = null;
                            $scope.requestOther = {};
                            if (response.data !== null) {
                                toastr.success('Update Success');
                                $scope.loadData(response.data);
                            } else {
                                toastr.error("data error");
                            };
                        });
                    };
                }, function(err) {
                    o.loadingPage(false);
                    toastr.error('update Consultation Fail');
                });
            }
            $scope.ConsultationDataCreate = function() {
                var ConsultationDataTemp = [];
                for (var key in $scope.requestInfo.Consultations[0].ConsultationData) {
                    var newkey = key.split("__").join(" ");
                    var res = newkey.split(".");
                    var otherkey = res[2] + res[3] + 'Other';
                    var object = {
                        Section: res[0],
                        Category: res[1],
                        Type: res[2],
                        Name: res[3],
                        Value: ($scope.requestInfo.Consultations[0].ConsultationData[key].Value == 'OtherProvider') ? $scope.requestOther[otherkey] : $scope.requestInfo.Consultations[0].ConsultationData[key].Value,
                        FileUploads: $scope.requestInfo.Consultations[0].ConsultationData[key].FileUploads
                    };
                    var isExist = false;

                    ConsultationDataTemp.forEach(function(valueTemp, keyTemp) {
                        if (object.Value !== null) {
                            if (valueTemp.Section == object.Section &&
                                valueTemp.Category == object.Category &&
                                valueTemp.Type == object.Type &&
                                valueTemp.Name == object.Name) {
                                isExist = true;
                            }
                        } else {
                            isExist = true;
                        };
                    });
                    if (!isExist) {
                        if (object.Value !== null && object.Value !== "") {
                            ConsultationDataTemp.push(object);
                        };
                    };
                };
                $scope.requestInfo.Consultations[0].ConsultationData = ConsultationDataTemp;
                $scope.requestInfo.Consultations[0].FileUploads = $scope.requestInfo.Consultations[0].FileUploads.concat($scope.FileUploads);
            }
            $scope.ConsultationUpdate = function() {
                var ConsultationDataTemp = [];
                for (var key in $scope.requestInfo.Consultations[0].ConsultationData) {
                    var newkey = key.split("__").join(" ");
                    var res = newkey.split(".");
                    var otherkey = res[2] + res[3] + 'Other';
                    var object = {
                        Section: res[0],
                        Category: res[1],
                        Type: res[2],
                        Name: res[3],
                        Value: ($scope.requestInfo.Consultations[0].ConsultationData[key].Value == 'OtherProvider') ? $scope.requestOther[otherkey] : $scope.requestInfo.Consultations[0].ConsultationData[key].Value,
                        FileUploads: $scope.requestInfo.Consultations[0].ConsultationData[key].FileUploads
                    };
                    var isExist = false;
                    $scope.ConsultationData.forEach(function(valueTemp, keyTemp) {
                        if (valueTemp.Section == object.Section &&
                            valueTemp.Category == object.Category &&
                            valueTemp.Type == object.Type &&
                            valueTemp.Name == object.Name) {
                            if (object.Value !== null) {
                                valueTemp.Value = object.Value;
                                valueTemp.FileUploads = object.FileUploads;
                                object = valueTemp;
                                ConsultationDataTemp.push(object);
                            };

                        };
                    });
                    ConsultationDataTemp.forEach(function(valueTemp, keyTemp) {
                        if (object.Value !== null) {
                            if (valueTemp.Section == object.Section &&
                                valueTemp.Category == object.Category &&
                                valueTemp.Type == object.Type &&
                                valueTemp.Name == object.Name) {
                                valueTemp.Value = object.Value;
                                isExist = true;
                            };
                        } else {
                            isExist = true;
                        }
                    });
                    if (!isExist) {
                        if (object.Value !== null) {
                            ConsultationDataTemp.push(object);
                        };
                    };
                };
                $scope.requestInfo.Consultations[0].ConsultationData = ConsultationDataTemp;
            }
            $scope.cancel = function() {
                $state.go("authentication.consultation.detail", {
                    UID: $stateParams.UID,
                    UIDPatient: $stateParams.UIDPatient
                });
            }
            $scope.CheckBox = function(data, type) {
                if (!$scope.requestInfo[type]) {
                    if ($scope.requestInfo.Consultations[0].ConsultationData[data] !== undefined) {
                        $scope.requestInfo.Consultations[0].ConsultationData[data].Value = null;
                    } else {
                        $scope.requestInfo.Consultations[0].ConsultationData[data] = {}
                        if ($scope.requestInfo.Consultations[0].ConsultationData[data].Value == undefined) {
                            $scope.requestInfo.Consultations[0].ConsultationData[data].Value = null;
                        };
                    };

                };
            }
            $scope.showImage = function(UID) {
                var LinkUID = UID;
                var modalInstance = $modal.open({
                    templateUrl: 'showImageTemplate',
                    controller: 'showImageController',
                    windowClass: 'app-modal-window-full',
                    resolve: {
                        LinkUID: function() {
                            return LinkUID;
                        }
                    }
                });
                modalInstance.result.then(function(data) {
                    $modalInstance.close('err');
                });
            };
            $scope.closeWindow = function(fileInfo) {
                Window.close();
            }
            $scope.RemoveDrawing = function(index) {
                $scope.FileUploads.splice(index, 1);
            }
            $scope.AddDrawing = function(data) {
                if (typeof(Window) == 'undefined' || Window.closed) {
                    window.refreshCode = $rootScope.refreshCode;
                    Window = window.open($state.href("blank.drawing.home"), "", "fullscreen=0");
                } else {
                    Window.focus();
                }
            }
        }
    };
});

app.controller('showDrawingController', function($scope, $modalInstance, toastr, data, CommonService, $cookies) {
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };

    $scope.drawingData = {
        userUID: $cookies.getObject('userInfo').UID,
        fileType: 'MedicalDrawing'
    };
    $scope.drawingAction = function(fileInfo) {
        $modalInstance.close(fileInfo);
    }
});
