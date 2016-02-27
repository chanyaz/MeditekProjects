module.exports = {
    GetRosterRepeat: function(data, userInfo) {
        var moment = require('moment');
        require('moment-range');
        var dataRes = [];
        if (!_.isEmpty(data) &&
            data.IsRecurrence == 'Y' &&
            HelperService.CheckExistData(data.RecurrenceType) &&
            HelperService.CheckExistData(data.EndRecurrence) &&
            HelperService.CheckExistData(data.FromTime) &&
            HelperService.CheckExistData(data.ToTime) &&
            (moment(data.FromTime, 'YYYY-MM-DD Z', true).isValid() ||
                moment(data.FromTime, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) &&
            (moment(data.ToTime, 'YYYY-MM-DD Z', true).isValid() ||
                moment(data.ToTime, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) &&
            (moment(data.EndRecurrence, 'YYYY-MM-DD Z', true).isValid() ||
                moment(data.EndRecurrence, 'YYYY-MM-DD HH:mm:ss Z', true).isValid())) {
            switch (data.RecurrenceType) {
                case 'weekly':
                    var fromTime = moment(data.FromTime, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss Z');
                    var toTime = moment(data.ToTime, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss Z');
                    var endRecurrence = moment(data.EndRecurrence, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss Z');
                    var arrayDateRepeat = [];
                    var timeTo = toTime.split(' ')[1];
                    var timeFrom = fromTime.split(' ')[1];
                    var zoneFrom = fromTime.split(' ')[2];
                    var zoneTo = toTime.split(' ')[2];
                    var zoneEndRecurrence = endRecurrence.split(' ')[2];
                    var startDate = moment(fromTime, 'YYYY-MM-DD HH:mm:ss Z');
                    var endDate = moment(endRecurrence.split(' ')[0] + ' ' + timeFrom + ' ' + zoneEndRecurrence, 'YYYY-MM-DD HH:mm:ss Z');
                    var rangeDateFrom = moment.range(startDate, endDate);
                    if (!_.isEmpty(rangeDateFrom)) {
                        rangeDateFrom.by('days', function(day) {
                            var objectDate = {
                                fromTime: moment(day).format('YYYY-MM-DD') + ' ' + timeFrom + ' ' + zoneFrom,
                                toTime: moment(day).format('YYYY-MM-DD') + ' ' + timeTo + ' ' + zoneTo
                            };
                            arrayDateRepeat.push(objectDate);
                        });
                    }
                    if (!_.isEmpty(arrayDateRepeat) &&
                        _.isArray(arrayDateRepeat)) {
                        _.forEach(arrayDateRepeat, function(valueDate, indexDate) {
                            if (!_.isEmpty(valueDate) &&
                                HelperService.CheckExistData(valueDate.fromTime) &&
                                HelperService.CheckExistData(valueDate.toTime) &&
                                moment(valueDate.fromTime).format('e') ===
                                moment(fromTime).format('e')) {
                                var objectRoster = {
                                    UID: UUIDService.Create(),
                                    FromTime: valueDate.fromTime,
                                    ToTime: valueDate.toTime,
                                    IsRecurrence: data.IsRecurrence,
                                    RecurrenceType: data.RecurrenceType,
                                    EndRecurrence: data.EndRecurrence,
                                    Enable: 'Y',
                                    CreatedBy: userInfo.ID
                                };
                                dataRes.push(objectRoster);
                            }
                        });
                    }
                    break;
                case 'daily':
                    var fromTime = moment(data.FromTime, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss Z');
                    var toTime = moment(data.ToTime, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss Z');
                    var endRecurrence = moment(data.EndRecurrence, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss Z');
                    var arrayDateRepeat = [];
                    var timeTo = toTime.split(' ')[1];
                    var timeFrom = fromTime.split(' ')[1];
                    var zoneFrom = fromTime.split(' ')[2];
                    var zoneTo = toTime.split(' ')[2];
                    var zoneEndRecurrence = endRecurrence.split(' ')[2];
                    var startDate = moment(fromTime, 'YYYY-MM-DD HH:mm:ss Z');
                    var endDate = moment(endRecurrence.split(' ')[0] + ' ' + timeFrom + ' ' + zoneEndRecurrence, 'YYYY-MM-DD HH:mm:ss Z');
                    console.log('startDate', startDate);
                    console.log('endDate', endDate);
                    var rangeDateFrom = moment.range(startDate, endDate);
                    if (!_.isEmpty(rangeDateFrom)) {
                        rangeDateFrom.by('days', function(day) {
                            console.log('day', moment(day).format('YYYY-MM-DD'));
                            var objectDate = {
                                fromTime: moment(day).format('YYYY-MM-DD') + ' ' + timeFrom + ' ' + zoneFrom,
                                toTime: moment(day).format('YYYY-MM-DD') + ' ' + timeTo + ' ' + zoneTo
                            };
                            arrayDateRepeat.push(objectDate);
                        });
                    }
                    if (!_.isEmpty(arrayDateRepeat) &&
                        _.isArray(arrayDateRepeat)) {
                        _.forEach(arrayDateRepeat, function(valueDate, indexDate) {
                            if (!_.isEmpty(valueDate) &&
                                HelperService.CheckExistData(valueDate.fromTime) &&
                                HelperService.CheckExistData(valueDate.toTime)) {
                                var objectRoster = {
                                    UID: UUIDService.Create(),
                                    FromTime: valueDate.fromTime,
                                    ToTime: valueDate.toTime,
                                    IsRecurrence: data.IsRecurrence,
                                    RecurrenceType: data.RecurrenceType,
                                    EndRecurrence: data.EndRecurrence,
                                    Enable: 'Y',
                                    CreatedBy: userInfo.ID
                                };
                                dataRes.push(objectRoster);
                            }
                        });
                    }
                    break;
                case 'weekday':
                    var fromTime = moment(data.FromTime, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss Z');
                    var toTime = moment(data.ToTime, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss Z');
                    var endRecurrence = moment(data.EndRecurrence, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss Z');
                    var arrayDateRepeat = [];
                    var timeTo = toTime.split(' ')[1];
                    var timeFrom = fromTime.split(' ')[1];
                    var zoneFrom = fromTime.split(' ')[2];
                    var zoneTo = toTime.split(' ')[2];
                    var zoneEndRecurrence = endRecurrence.split(' ')[2];
                    var startDate = moment(fromTime, 'YYYY-MM-DD HH:mm:ss Z');
                    var endDate = moment(endRecurrence.split(' ')[0] + ' ' + timeFrom + ' ' + zoneEndRecurrence, 'YYYY-MM-DD HH:mm:ss Z');
                    var rangeDateFrom = moment.range(startDate, endDate);
                    if (!_.isEmpty(rangeDateFrom)) {
                        rangeDateFrom.by('days', function(day) {
                            var objectDate = {
                                fromTime: moment(day).format('YYYY-MM-DD') + ' ' + timeFrom + ' ' + zoneFrom,
                                toTime: moment(day).format('YYYY-MM-DD') + ' ' + timeTo + ' ' + zoneTo
                            };
                            arrayDateRepeat.push(objectDate);
                        });
                    }
                    if (!_.isEmpty(arrayDateRepeat) &&
                        _.isArray(arrayDateRepeat)) {
                        _.forEach(arrayDateRepeat, function(valueDate, indexDate) {
                            if (!_.isEmpty(valueDate) &&
                                HelperService.CheckExistData(valueDate.fromTime) &&
                                HelperService.CheckExistData(valueDate.toTime) &&
                                moment(valueDate.fromTime).format('e') ===
                                moment(fromTime).format('e') &&
                                moment(valueDate.fromTime).format('e') <= 5) {
                                var objectRoster = {
                                    UID: UUIDService.Create(),
                                    FromTime: valueDate.fromTime,
                                    ToTime: valueDate.toTime,
                                    IsRecurrence: data.IsRecurrence,
                                    RecurrenceType: data.RecurrenceType,
                                    EndRecurrence: data.EndRecurrence,
                                    Enable: 'Y',
                                    CreatedBy: userInfo.ID
                                };
                                dataRes.push(objectRoster);
                            }
                        });
                    }
                    break;
                default:
                    break;
            }
        } else if (!_.isEmpty(data) &&
            data.IsRecurrence == 'N' &&
            HelperService.CheckExistData(data.FromTime) &&
            HelperService.CheckExistData(data.ToTime) &&
            (moment(data.FromTime, 'YYYY-MM-DD Z', true).isValid() ||
                moment(data.FromTime, 'YYYY-MM-DD HH:mm:ss Z', true).isValid()) &&
            (moment(data.ToTime, 'YYYY-MM-DD Z', true).isValid() ||
                moment(data.ToTime, 'YYYY-MM-DD HH:mm:ss Z', true).isValid())) {
            var objectRoster = {
                UID: UUIDService.Create(),
                FromTime: data.FromTime,
                ToTime: data.ToTime,
                IsRecurrence: data.IsRecurrence,
                RecurrenceType: data.RecurrenceType,
                EndRecurrence: data.EndRecurrence,
                Enable: 'Y',
                CreatedBy: userInfo.ID
            };
            dataRes.push(objectRoster);
        }
        console.log('dataRes', dataRes);
        return dataRes;
    },
};
