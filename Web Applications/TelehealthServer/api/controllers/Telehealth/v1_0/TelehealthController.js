var passport = require('passport');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = sails.config.myconf;
//****Twilio Client for sending SMS
var twilioClient = require('twilio')(config.twilioSID, config.twilioToken);
//****Send SMS function******
function sendSMS(toNumber, content) {
    return twilioClient.messages.create({
        body: content,
        to: toNumber,
        from: config.twilioPhone
    });
};
module.exports = {
    GetUserDetails: function(req, res) {
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.GetUserDetails.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        var info = HelperService.toJson(req.body.data);
        var uid = info.uid;
        var headers = req.headers;
        var deviceType = headers.systemtype;
        if (!uid || !deviceType || HelperService.const.systemType[deviceType.toLowerCase()] == undefined) {
            var err = new Error("Telehealth.GetUserDetails.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        TelehealthService.FindByUID(uid).then(function(teleUser) {
            if (teleUser) {
                teleUser.getUserAccount().then(function(user) {
                    if (user) {
                        TelehealthService.GetPatientDetails(user.UID, headers).then(function(response) {
                            res.json(response.getCode(), response.getBody());
                        }).catch(function(err) {
                            res.json(err.getCode(), err.getBody());
                        })
                    } else {
                        var err = new Error("Telehealth.GetUserDetails.Error");
                        err.pushError("User Is Not Exist");
                        return res.serverError(ErrorWrap(err));
                    }
                })
            } else {
                var err = new Error("Telehealth.GetUserDetails.Error");
                err.pushError("User Is Not Exist");
                return res.serverError(ErrorWrap(err));
            }
        })
    },
    GetUserAppointments: function(req, res) {
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.GetUserAppointments.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body.data);
        var patientUID = info.uid;
        var limit = info.limit;
        var headers = req.headers;
        if (!patientUID) {
            var err = new Error("Telehealth.GetUserAppointments.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        TelehealthService.GetAppointmentsByPatient(patientUID, limit, headers).then(function(response) {
            res.json(response.getCode(), response.getBody());
        }).catch(function(err) {
            res.json(err.getCode(), err.getBody());
        })
    },
    GetAppointmentDetails: function(req, res) {
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.GetAppointmentDetails.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body.data);
        var apptUID = info.uid;
        var headers = req.headers;
        if (!apptUID) {
            var err = new Error("Telehealth.GetAppointmentDetails.Error");
            err.pushError("Invalid Params");
            return res.serverError(ErrorWrap(err));
        }
        TelehealthService.GetAppointmentDetails(apptUID, headers).then(function(response) {
            res.json(response.getCode(), response.getBody());
        }).catch(function(err) {
            res.json(err.getCode(), err.getBody());
        })
    },
    TelehealthLogout: function(req, res) {
        req.logout();
        res.ok({
            status: "success"
        });
    },
    TelehealthLogin: function(req, res) {
        var deviceId = req.headers.deviceid;
        var deviceType = req.headers.systemtype;
        passport.authenticate('local', function(err, u, info) {
            if ((err) || (!u)) {
                if (!err) var err = info;
                return res.unauthorize(err);
            }
            req.logIn(u, function(err) {
                if (err) res.unauthorize(err);
                else {
                    if (!deviceType || !deviceId || HelperService.const.systemType[deviceType.toLowerCase()] == undefined) {
                        var err = new Error("TelehealthLogin");
                        err.pushError("Invalid Params");
                        return res.serverError(ErrorWrap(err));
                    }
                    res.ok({
                        status: 'success',
                        message: info.message,
                        user: u.user,
                        token: u.token
                    });
                }
            });
        })(req, res);
    },
    UpdateDeviceToken: function(req, res) {
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.UpdateDeviceToken.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body.data);
        var deviceToken = info.devicetoken;
        var deviceId = info.deviceid;
        var deviceType = info.devicetype;
        var uid = info.uid;
        if (deviceToken && uid && deviceType && deviceId) {
            TelehealthService.FindByUID(uid).then(function(teleUser) {
                TelehealthDevice.findOrCreate({
                    where: {
                        TelehealthUserID: teleUser.ID,
                        DeviceID: deviceId,
                        Type: deviceType.toLowerCase() == 'android' ? 'ARD' : 'IOS'
                    },
                    defaults: {
                        UID: UUIDService.GenerateUUID(),
                        DeviceToken: deviceToken
                    }
                }).spread(function(device, created) {
                    device.update({
                        DeviceToken: !created ? deviceToken : device.DeviceToken
                    }).then(function() {
                        res.ok({
                            status: 'success',
                            message: 'Success!'
                        })
                    }).catch(function(err) {
                        res.serverError(ErrorWrap(err));
                    })
                })
            })
        } else {
            var err = new Error("Telehealth.UpdateDeviceToken.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
        }
    },
    RequestActivationCode: function(req, res) {
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.RequestActivationCode.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body.data);
        var phoneNumber = info.phone;
        var deviceId = req.headers.deviceid;
        var deviceType = req.headers.systemtype;
        var phoneRegex = /^\+[0-9]{9,15}$/;
        if (phoneNumber && phoneNumber.match(phoneRegex) && deviceId && deviceType && HelperService.const.systemType[deviceType.toLowerCase()] != undefined) {
            UserAccount.find({
                where: {
                    PhoneNumber: phoneNumber
                }
            }).then(function(user) {
                if (user) {
                    TelehealthService.MakeRequest({
                        path: '/api/user-activation/create-user-activation',
                        method: 'POST',
                        body: {
                            UserUID: user.UID,
                            Type: HelperService.const.systemType[deviceType.toLowerCase()],
                            DeviceID: deviceId
                        },
                        headers: {
                            'DeviceID': req.headers.deviceid,
                            'SystemType': HelperService.const.systemType[deviceType.toLowerCase()]
                        }
                    }).then(function(response) {
                        var data = response.getBody();
                        sendSMS(phoneNumber, "Your REDiMED account verification code is " + data.VerificationCode).then(function(mess) {
                            return res.ok({
                                status: 'success',
                                message: 'Request Verification Code Successfully!'
                            });
                        }, function(error) {
                            return res.serverError(ErrorWrap(error));
                        });
                    }).catch(function(err) {
                        res.serverError(err.getBody());
                    })
                } else {
                    var err = new Error("Telehealth.RequestActivationCode.Error");
                    err.pushError("User Is Not Exist");
                    res.serverError(ErrorWrap(err));
                }
            }).catch(function(err) {
                res.serverError(ErrorWrap(err));
            })
        } else {
            var err = new Error("Telehealth.RequestActivationCode.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
        }
    },
    VerifyActivationCode: function(req, res) {
        if (typeof req.body.data == 'undefined' || !HelperService.toJson(req.body.data)) {
            var err = new Error("Telehealth.VerifyActivationCode.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
            return;
        }
        var info = HelperService.toJson(req.body.data);
        var phoneNumber = info.phone;
        var verifyCode = info.code;
        var deviceId = req.headers.deviceid;
        var deviceType = req.headers.systemtype;
        var phoneRegex = /^\+[0-9]{9,15}$/;
        if (phoneNumber && phoneNumber.match(phoneRegex) && verifyCode && deviceId && deviceType && HelperService.const.systemType[deviceType.toLowerCase()] != undefined) {
            UserAccount.find({
                where: {
                    PhoneNumber: phoneNumber
                }
            }).then(function(user) {
                if (user) {
                    user.getPatient().then(function(patient) {
                        if (patient) {
                            TelehealthService.MakeRequest({
                                path: '/api/user-activation/activation',
                                method: 'GET',
                                params: {
                                    UserUID: user.UID,
                                    SystemType: HelperService.const.systemType[deviceType.toLowerCase()],
                                    DeviceID: deviceId,
                                    VerificationCode: verifyCode
                                },
                                headers: {
                                    'DeviceID': req.headers.deviceid,
                                    'SystemType': HelperService.const.systemType[deviceType.toLowerCase()]
                                }
                            }).then(function(response) {
                                var data = response.getBody();
                                TelehealthUser.findOrCreate({
                                    where: {
                                        UserAccountID: user.ID
                                    },
                                    defaults: {
                                        UID: UUIDService.GenerateUUID()
                                    }
                                }).spread(function(teleUser, created) {
                                    var activationInfo = {
                                        userUID: user.UID,
                                        verifyCode: data.VerificationToken,
                                        patientUID: patient.UID
                                    }
                                    req.body.activationInfo = activationInfo;
                                    req.body.username = 1;
                                    req.body.password = 2;
                                    passport.authenticate('local', function(err, u, info) {
                                        if ((err) || (!u)) {
                                            if (!err) var err = info;
                                            return res.unauthorize(err);
                                        }
                                        req.logIn(u, function(err) {
                                            if (err) res.unauthorize(err);
                                            else {
                                                if (!deviceType || !deviceId || HelperService.const.systemType[deviceType.toLowerCase()] == undefined) {
                                                    var err = new Error("TelehealthLogin");
                                                    err.pushError("Invalid Params");
                                                    return res.serverError(ErrorWrap(err));
                                                }
                                                res.ok({
                                                    status: 'success',
                                                    message: info.message,
                                                    user: u.user,
                                                    token: u.token
                                                });
                                            }
                                        });
                                    })(req, res);
                                }).catch(function(err) {
                                    return res.serverError(ErrorWrap(err));
                                })
                            }).catch(function(err) {
                                return res.serverError(err.getBody());
                            })
                        } else {
                            var err = new Error("Telehealth.VerifyActivationCode.Error");
                            err.pushError("Only Patient Can Logged In");
                            return res.serverError(ErrorWrap(err));
                        }
                    }).catch(function(err) {
                        res.serverError(ErrorWrap(err));
                    })
                } else {
                    var err = new Error("Telehealth.RequestActivationCode.Error");
                    err.pushError("User Is Not Exist");
                    res.serverError(ErrorWrap(err));
                }
            }).catch(function(err) {
                res.serverError(ErrorWrap(err));
            })
        } else {
            var err = new Error("Telehealth.VerifyActivationCode.Error");
            err.pushError("Invalid Params");
            res.serverError(ErrorWrap(err));
        }
    }
}