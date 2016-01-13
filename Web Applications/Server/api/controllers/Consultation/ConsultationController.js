module.exports = {
    RequestConsultation: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.RequestConsultation(data, req.user)
                .then(function(success) {
                    if (HelperService.CheckExistData(success) &&
                        HelperService.CheckExistData(success.transaction)) {
                        success.transaction.commit();
                    }
                    res.ok('success');
                }, function(err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction)) {
                        err.transaction.rollback();
                    }
                    res.serverError(ErrorWrap(err.error || err));
                });
        }
    },
    GetListConsultation: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data == false) {
            res.serverError('data failed');
        } else {
            Services.GetListConsultation(data, req.user)
                .then(function(consultationDetailRes) {
                    res.ok(consultationDetailRes);
                }, function(err) {
                    res.serverError(ErrorWrap(err));
                });
        }
    },
    UpdateRequestConsultation: function(req, res) {
        var data = HelperService.CheckPostRequest(req);
        if (data === false) {
            res.serverError('data failed');
        } else {
            Services.UpdateRequestConsultation(data, req.user)
                .then(function(success) {
                    if (HelperService.CheckExistData(success) &&
                        HelperService.CheckExistData(success.transaction)) {
                        success.transaction.commit();
                    }
                    res.ok('success');
                }, function(err) {
                    if (HelperService.CheckExistData(err) &&
                        HelperService.CheckExistData(err.transaction)) {
                        err.transaction.rollback();
                    }
                    res.serverError(ErrorWrap(err.error || err));
                });
        }
    },
    DestroyConsultation: function(req, res) {
        var UID = req.param('UID');
        Services.DestroyConsultation(UID, req.user)
            .then(function(success) {
                if (HelperService.CheckExistData(success) &&
                    HelperService.CheckExistData(success.transaction)) {
                    success.transaction.commit();
                }
                res.ok('success');
            }, function(err) {
                if (HelperService.CheckExistData(err) &&
                    HelperService.CheckExistData(err.transaction)) {
                    err.transaction.rollback();
                }
                res.serverError(ErrorWrap(err.error || err));
            });
    },
    GetDetailConsultation: function(req, res) {
        var UID = req.param('UID');
        Services.GetDetailConsultation(UID, req.user)
            .then(function(success) {
                res.ok(success);
            }, function(err) {
                res.serverError(ErrorWrap(err.error || err));
            });
    }
};
