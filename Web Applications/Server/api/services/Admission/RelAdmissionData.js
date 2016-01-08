var $q = require('q');
module.exports = function(objRel) {
    var defer = $q.defer();
    if (HelperService.CheckExistData(objRel) &&
        HelperService.CheckExistData(objRel.data)) {
        if (HelperService.CheckExistData(objRel.admissionObject)) {
            return objRel.admissionObject.addAdmissionData(objRel.data, {
                transaction: objRel.transaction
            });
        } else {
            return RelConsultationData.create(objRel.data, {
                transaction: objRel.transaction
            });
        }
    } else {
        defer.reject('objRel.RelConsultationData.failed');
    }
    return defer.promise;
};