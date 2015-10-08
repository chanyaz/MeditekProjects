module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        PatientID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'Patient',
                key: 'ID'
            }
        },
        AppointmentID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'Appointment',
                key: 'ID'
            }
        }
    },
    associations: function() {},
    options: {
        tableName: 'RelPatientAppointment',
        timestamps: false
    }
};