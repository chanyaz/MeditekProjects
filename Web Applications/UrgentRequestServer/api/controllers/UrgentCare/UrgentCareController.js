module.exports = {
    /*
        ReceiveRequest
        input: patient's datarmation
        output: - success: send status success for patient
                - fail: send status error for patient
    */
    ReceiveRequest: function(req, res) {
        var data = req.body.data;
        if (!_.isObject(data)) {
            try {
                data = JSON.parse(data);
            } catch (err) {
                console.log(err);
                res.json(400, {
                    error: err,
                    status: 400
                });
                return;
            }
        }

        //get client's IP
        data.ip = req.headers['X-Client-IP'] ||
            req.headers['X-Forwarded-For'] ||
            req.headers['X-Real-IP'] ||
            req.headers['X-Cluster-Client-IP'] ||
            req.headers['X-Forwared'] ||
            req.headers['X-Forwared-For'] ||
            req.headers['X-Forwared'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        data.UID = UUIDService.Create();
        data.requestDate = Services.moment(data.requestDate, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss');
        //save information patient
        UrgentRequest.create({
                UID: data.UID,
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                gender: data.gender,
                email: data.email,
                DOB: (!_.isUndefined(data.DOB) && !_.isNull(data.DOB)) ? data.DOB : null,
                suburb: data.suburb,
                IP: data.ip,
                requestDate: data.requestDate,
                GPReferral: data.GPReferral,
                urgentRequestType: data.urgentRequestType,
                companyName: data.companyName,
                companyPhoneNumber: data.companyPhoneNumber,
                contactPerson: data.contactPerson,
                physiotherapy: data.physiotherapy,
                specialist: data.specialist,
                handTherapy: data.handTherapy,
                GP: data.GP,
                rehab: data.rehab,
                tried: 1,
                status: 'pending',
                interval: 5,
                description: data.description,
                enable: 1
            })
            .then(function(URCreated) {
                //convert service type and gp referral
                var GPReferral = Services.ConvertData.GPReferral(data.GPReferral);
                var serviceType = Services.ConvertData.ServiceType(data);
                var subjectEmail = '[Testing] - [' + data.urgentRequestType + '] - [' + Services.moment(data.requestDate).format('DD/MM/YYYY HH:mm:ss') +
                    '] - [' + data.firstName + ' ' +
                    data.lastName + '] - [' + data.phoneNumber + ']';
                var emailInfo = {
                    from: 'Redimed UrgentCare <HealthScreenings@redimed.com.au>',
                    email: 'HealthScreenings@redimed.com.au',
                    patientEmail: (!_.isUndefined(data.email) && !_.isNull(data.email)) ? data.email : '',
                    subject: subjectEmail,
                    confirmed: APIService.UrgentCareConfirmURL + '/' + data.UID,
                    urgentRequestType: data.urgentRequestType || '',
                    patientName: data.firstName + ' ' + data.lastName,
                    requestDate: Services.moment(data.requestDate).format('DD/MM/YYYY HH:mm:ss'),
                    phoneNumber: data.phoneNumber,
                    suburb: (!_.isUndefined(data.suburb) && !_.isNull(data.suburb)) ? data.suburb : '',
                    DOB: (!_.isUndefined(data.DOB) && !_.isNull(data.DOB)) ? data.DOB : '',
                    GPReferral: GPReferral,
                    serviceType: serviceType,
                    description: (!_.isUndefined(data.description) && !_.isNull(data.description)) ? data.description : '',
                    companyName: (!_.isUndefined(data.companyName) && !_.isNull(data.companyName)) ? data.companyName : '',
                    contactPerson: (!_.isUndefined(data.contactPerson) && !_.isNull(data.contactPerson)) ? data.contactPerson : '',
                    companyPhoneNumber: (!_.isUndefined(data.companyPhoneNumber) && !_.isNull(data.companyPhoneNumber)) ? data.companyPhoneNumber : '',
                    bcc: 'pnguyen@redimed.com.au, meditekcompany@gmail.com'
                };

                /*
                CallBackSendMail: callback from function sendmail
                input: err, responseStatus, html, text
                output: throw status send mail
                */
                var CallBackSendMail = function(err, responseStatus, html, text) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (!_.isUndefined(data.email) &&
                            !_.isNull(data.email) &&
                            data.email.length !== 0) {
                            var CallBackSendMailPatient = function(err, responseStatus, html, text) {
                                if (err) {
                                    console.log(err);
                                }
                            };
                            //send email and sms to customer
                            var emailInfoPatient = {
                                from: 'Redimed UrgentCare <HealthScreenings@redimed.com.au>',
                                email: data.email.toLowerCase(),
                                subject: 'Request Received',
                                urgentRequestType: data.urgentRequestType || '',
                                patientName: data.firstName + ' ' + data.lastName,
                                requestDate: Services.moment(data.requestDate).format('DD/MM/YYYY HH:mm:ss'),
                                phoneNumber: data.phoneNumber,
                                suburb: (!_.isUndefined(data.suburb) && !_.isNull(data.suburb)) ? data.suburb : '',
                                DOB: (!_.isUndefined(data.DOB) && !_.isNull(data.DOB)) ? data.DOB : '',
                                GPReferral: GPReferral,
                                serviceType: serviceType,
                                description: (!_.isUndefined(data.description) && !_.isNull(data.description)) ? data.description : '',
                                companyName: (!_.isUndefined(data.companyName) && !_.isNull(data.companyName)) ? data.companyName : '',
                                contactPerson: (!_.isUndefined(data.contactPerson) && !_.isNull(data.contactPerson)) ? data.contactPerson : '',
                                companyPhoneNumber: (!_.isUndefined(data.companyPhoneNumber) && !_.isNull(data.companyPhoneNumber)) ? data.companyPhoneNumber : '',
                            };
                            if (data.urgentRequestType === 'WorkInjury') {
                                SendMailService.SendMail('WorkInjuryReceive', emailInfoPatient, CallBackSendMailPatient);
                            } else {
                                SendMailService.SendMail('UrgentReceive', emailInfoPatient, CallBackSendMailPatient);
                            }
                        }
                        //send sms
                        var dataSMS = {
                            phone: data.phoneNumber,
                            content: 'Hi ' + data.firstName + ' ' + data.lastName + ', \nPlease note that your request has been received. ' + 'Someone from our REDIMED team will contact you shortly.' + '\nThank you for request.'

                        };
                        var CallBackSendSMS = function(err) {
                            if (err) {
                                console.log('Send SMS:' + err);
                            }
                        }
                        SendSMSService.Send(dataSMS, CallBackSendSMS);
                    }

                };

                //send email
                if (data.urgentRequestType === 'WorkInjury') {
                    SendMailService.SendMail('WorkInjuryRequest', emailInfo, CallBackSendMail);
                } else {
                    SendMailService.SendMail('UrgentRequest', emailInfo, CallBackSendMail);
                }

                //get urgent request id
                var UrgentRequestID = UrgentRequest.findOne()
                    .where({
                        UID: data.UID
                    })
                    .then(function(URID) {
                        return URID;
                    });
                return [UrgentRequestID];
            })
            .spread(function(UrgentRequestID) {
                //save message  queue to database
                var dataMQ = {
                    UID: UUIDService.Create(),
                    urgentRequestID: UrgentRequestID.ID,
                    source: 'Urgent Request',
                    sourceID: 1,
                    job: 'Receive email urgent request',
                    status: 'queueing',
                    startTime: Services.moment().format('YYYY-MM-DD HH:mm:ss')
                };
                //save message queue to database
                MessageQueue.create({
                        UID: dataMQ.UID,
                        urgentRequestID: dataMQ.urgentRequestID,
                        source: dataMQ.source,
                        sourceID: dataMQ.sourceID,
                        job: dataMQ.job,
                        status: dataMQ.status,
                        startTime: dataMQ.startTime,
                        enable: 'Y'
                    })
                    .exec(function(err, MQCreated) {
                        if (err) {
                            console.log(err);
                            res.json(500, {
                                error: err,
                                status: 500
                            });
                        } else {
                            var CallBackMessageQueue = function(err) {
                                res.json(500, {
                                    error: err,
                                    status: 500
                                });
                                return;
                            };
                            //created and start message queue
                            MessageQueueService.CreateMessageQueue(data.UID, dataMQ.UID, CallBackMessageQueue);
                            res.json(200, {
                                data: 'success',
                                status: 200
                            });
                        }
                    });
            })
            .catch(function(err) {
                console.log(err);
                res.json(500, {
                    error: err,
                    status: 500
                });
            });
    },

    /*
    ConfirmRequest: confirmation receive email
    input: UID urgent request
    output: status confirmed
    */
    ConfirmRequest: function(req, res) {
        require('getmac').getMac(function(err, macaddr) {
            UrgentRequest.update({
                    status: 'pending',
                    confirmUserName: null,
                    UID: req.params.id
                }, {
                    status: 'confirmed',
                    confirmUserName: macaddr
                })
                .exec(function(err, URUpdated) {
                    if (err) {
                        res.json(500, {
                            error: err,
                            status: 500
                        });
                    } else {
                        if (!_.isUndefined(URUpdated[0])) {
                            var htmlConfirmed =
                                '<table><tr><td><b>Confirmed Success</b></td></tr>' +
                                '<tr><td>UrgentCare Type: ' + (URUpdated[0].urgentRequestType === null ? '' : URUpdated[0].urgentRequestType) + '</td></tr>' +
                                '<tr><td>Patient Name: ' + URUpdated[0].firstName + ' ' + URUpdated[0].lastName + '</td></tr>' +
                                '<tr><td>Request Date: ' + URUpdated[0].requestDate + '</td></tr>' +
                                '<tr><td>Phone Number: ' + URUpdated[0].phoneNumber + '</td></tr>' +
                                '</td></tr></table>';
                            res.send(htmlConfirmed);
                        } else {
                            res.json(404, {
                                err: URUpdated
                            });
                        }
                    }
                });
        });
    },
    /*
    GetPostCode: get list post code with latitude, longitude and radius 2km
    input: latitude, longtitude
    output: list post code with  received condition
     */
    GetPostCode: function(req, res) {
        var latitude = req.params.lat;
        var longitude = req.params.long;
        var radius = 5;
        PostCode.query('SELECT * FROM PostCode WHERE POWER(Lat - ?, 2) + POWER(Lon - ?,2) <= ?*?', [latitude, longitude, radius, radius], function(err, postcode) {
            if (err) {
                console.log(err);
                res.json(500, {
                    status: 500
                });
            } else {
                res.json(400, {
                    data: postcode
                });
            }
        });
    },

    /*
    GetSuburb: get all list suburb
    input: 
    output: list suburb
    */
    GetSuburb: function(req, res) {
        PostCode.find({
                select: ['Suburb']
            })
            .sort({
                Suburb: 'ASC'
            })
            .exec(function(err, suburbs) {
                if (err) {
                    console.log(err);
                    res.json(500, {
                        status: 500
                    });
                } else {
                    //distinct suburb and parse array object to array string
                    var uniqueSuburb = _.map(_.groupBy(suburbs, function(sub) {
                        return sub.Suburb;
                    }), function(subGrouped) {
                        return subGrouped[0].Suburb;
                    });
                    res.json(200, {
                        data: uniqueSuburb
                    });
                }
            })
    }
};
