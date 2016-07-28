/**
 * @namespace Service
 */
module.exports = {
    UserAccount: require('./UserAccount/UserAccount'),
    Patient: require('./Patient/Patient'),
    UserActivation: require('./UserAccount/UserActivation'),
    UserToken: require('./UserAccount/UserToken'),
    RefreshToken: require('./UserAccount/RefreshToken'),
    Paperless: require('./Paperless/Paperless'),
    //begin Appointment
    CreateTelehealthAppointment: require('./Appointment/CreateTelehealthAppointment'),
    GetDataAppointment: require('./Appointment/GetDataAppointment'),
    GetListAppointment: require('./Appointment/GetListAppointment'),
    GetDetailTelehealthAppointment: require('./Appointment/GetDetailTelehealthAppointment'),
    UpdateTelehealthAppointment: require('./Appointment/UpdateTelehealthAppointment'),
    UrgentCare: require('./UrgentCare/UrgentCare'),
    DisableAppointment: require('./Appointment/DisableAppointment'),
    RelDoctorTelehealthAppointment: require('./Appointment/RelDoctorTelehealthAppointment'),
    BulkCreateClinicalDetail: require('./Appointment/BulkCreateClinicalDetail'),
    CreateAppointment: require('./Appointment/CreateAppointment'),
    CreateExaminationRequired: require('./Appointment/CreateExaminationRequired'),
    BulkCreatePreferredPractitioner: require('./Appointment/BulkCreatePreferredPractitioner'),
    CreateTelehealthAppointment: require('./Appointment/CreateTelehealthAppointment'),
    CreatePatientAppointment: require('./Appointment/CreatePatientAppointment'),
    GetPreferringPractictioner: require('./Appointment/GetPreferringPractictioner'),
    RelAppointmentFileUpload: require('./Appointment/RelAppointmentFileUpload'),
    RelDoctorAppointment: require('./Appointment/RelDoctorAppointment'),
    RelPatientAppointment: require('./Appointment/RelPatientAppointment'),
    RequestTelehealthAppointment: require('./Appointment/RequestTelehealthAppointment'),
    GetTelehealthAppointmentObject: require('./Appointment/GetTelehealthAppointmentObject'),
    UpdateRequestTelehealthAppointment: require('./Appointment/UpdateRequestTelehealthAppointment'),
    UpdateRequestWAAppointment: require('./Appointment/UpdateRequestWAAppointment'),
    UpdateAppointment: require('./Appointment/UpdateAppointment'),
    UpdateClinicalDetail: require('./Appointment/UpdateClinicalDetail'),
    UpdateExaminationRequired: require('./Appointment/UpdateExaminationRequired'),
    UpdatePreferredPractitioner: require('./Appointment/UpdatePreferredPractitioner'),
    UpdatePatientAppointment: require('./Appointment/UpdatePatientAppointment'),
    RequestWAAppointment: require('./Appointment/RequestWAAppointment'),
    GetDetailWAAppointment: require('./Appointment/GetDetailWAAppointment'),
    CreateClinicalDetailWAAppointment: require('./Appointment/CreateClinicalDetailWAAppointment'),
    CreateWAAppointment: require('./Appointment/CreateWAAppointment'),
    RelClinicalDetailFileUpload: require('./Appointment/RelClinicalDetailFileUpload'),
    UpdateWAAppointment: require('./Appointment/UpdateWAAppointment'),
    UpdateClinicalDetailWAAppointment: require('./Appointment/UpdateClinicalDetailWAAppointment'),
    AttributesAppt: require('./Appointment/AttributesAppt'),
    GetWAAppointmentObject: require('./Appointment/GetWAAppointmentObject'),
    RequestWAAppointmentPatient: require('./Appointment/RequestWAAppointmentPatient'),
    CreateOnsiteAppointment: require('./Appointment/CreateOnsiteAppointment'),
    GetDetailWAAppointmentforEform: require('./Appointment/GetDetailWAAppointmentforEform'),
    CreateAppointmentData: require('./Appointment/CreateAppointmentData'),
    RelAppointmentDoctorGroup: require('./Appointment/RelAppointmentDoctorGroup'),
    RequestWAAppointmentPatientOnlineBooking: require('./Appointment/RequestWAAppointmentPatientOnlineBooking'),
    RequestAppointmentCompany: require('./Appointment/RequestAppointmentCompany'),
    RelAppointmentDoctor: require('./Appointment/RelAppointmentDoctor'),
    RelAppointmentPatient: require('./Appointment/RelAppointmentPatient'),
    RequestWAAppointmentPatientNew: require('./Appointment/RequestWAAppointmentPatientNew'),
    UpdateRequestWAAppointmentCompany: require('./Appointment/UpdateRequestWAAppointmentCompany'),
    UpdateAppointmentData: require('./Appointment/UpdateAppointmentData'),
    LinkAppointmentPatient: require('./Appointment/LinkAppointmentPatient'),
    GetListAppointmentAdmin: require('./Appointment/GetListAppointmentAdmin'),
    GetListAppointmentDoctor: require('./Appointment/GetListAppointmentDoctor'),
    GetListAppointmentOrganization: require('./Appointment/GetListAppointmentOrganization'),
    GetListAppointmentPatient: require('./Appointment/GetListAppointmentPatient'),
    UpdateSignaturePatient: require('./Appointment/UpdateSignaturePatient'),
    //end Appointment
    Module: require('./Authorization/v0_1/Module'),
    Role: require('./Authorization/v0_1/Role'),
    UserRole: require('./Authorization/v0_1/UserRole'),
    Doctor: require('./Doctor/Doctor'),
    FileUpload: require('./FileUpload/FileUpload'),
    Register: require('./Register/Register'),
    //begin Consultation
    RequestConsultation: require('./Consultation/RequestConsultation'),
    BulkCreateConsultation: require('./Consultation/BulkCreateConsultation'),
    RelAppointmentConsultation: require('./Consultation/RelAppointmentConsultation'),
    BulkCreateConsultationData: require('./Consultation/BulkCreateConsultationData'),
    GetDataConsultation: require('./Consultation/GetDataConsultation'),
    RelConsultationDataFileUpload: require('./Consultation/RelConsultationDataFileUpload'),
    RelConsultationData: require('./Consultation/RelConsultationData'),
    GetListConsultation: require('./Consultation/GetListConsultation'),
    AttributesConsult: require('./Consultation/AttributesConsult'),
    UpdateRequestConsultation: require('./Consultation/UpdateRequestConsultation'),
    BulkUpdateConsultation: require('./Consultation/BulkUpdateConsultation'),
    DestroyConsultation: require('./Consultation/DestroyConsultation'),
    Drawing: require('./Consultation/Drawing'),
    GetDetailConsultation: require('./Consultation/GetDetailConsultation'),
    RelConsultationFileUpload: require('./Consultation/RelConsultationFileUpload'),
    //end Consultation
    //begin Admission
    RequestAdmission: require('./Admission/RequestAdmission'),
    BulkCreateAdmission: require('./Admission/BulkCreateAdmission'),
    RelAppointmentAdmission: require('./Admission/RelAppointmentAdmission'),
    BulkCreateAdmissionData: require('./Admission/BulkCreateAdmissionData'),
    GetDataAdmission: require('./Admission/GetDataAdmission'),
    RelAdmissionDataFileUpload: require('./Admission/RelAdmissionDataFileUpload'),
    RelAdmissionData: require('./Admission/RelAdmissionData'),
    GetListAdmission: require('./Admission/GetListAdmission'),
    AttributesAdmission: require('./Admission/AttributesAdmission'),
    UpdateRequestAdmission: require('./Admission/UpdateRequestAdmission'),
    BulkUpdateAdmission: require('./Admission/BulkUpdateAdmission'),
    DestroyAdmission: require('./Admission/DestroyAdmission'),
    GetDetailAdmission: require('./Admission/GetDetailAdmission'),
    RelAdmissionFileUpload: require('./Admission/RelAdmissionFileUpload'),
    //end Admission
    RequestRoster: require('./Roster/RequestRoster'),
    UpdateRequestRoster: require('./Roster/UpdateRequestRoster'),
    GetDetailRoster: require('./Roster/GetDetailRoster'),
    DestroyRoster: require('./Roster/DestroyRoster'),
    CheckOverlap: require('./Roster/CheckOverlap'),
    BulkCreateRoster: require('./Roster/BulkCreateRoster'),
    CreateRoster: require('./Roster/CreateRoster'),
    GetDataRoster: require('./Roster/GetDataRoster'),
    AttributesRoster: require('./Roster/AttributesRoster'),
    CheckRosterExistAppointment: require('./Roster/CheckRosterExistAppointment'),
    GetListRoster: require('./Roster/GetListRoster'),
    GetListService: require('./Roster/GetListService'),
    BulkUpdateRoster: require('./Roster/BulkUpdateRoster'),
    UpdateRoster: require('./Roster/UpdateRoster'),
    UpdateRelRosterService: require('./Roster/UpdateRelRosterService'),
    GetListSite: require('./Roster/GetListSite'),
    UpdateRelRosterSite: require('./Roster/UpdateRelRosterSite'),
    GetListBooking: require('./Booking/GetListBooking'),
    RequestBooking: require('./Booking/RequestBooking'),
    UpdateRequestBooking: require('./Booking/UpdateRequestBooking'),
    GetDetailBooking: require('./Booking/GetDetailBooking'),
    DestroyBooking: require('./Booking/DestroyBooking'),
    UpdateStatusBooking: require('./Booking/UpdateStatusBooking'),
    CheckTimeRoster: require('./Booking/CheckTimeRoster'),
    GetListRosterAdmin: require('./Roster/GetListRosterAdmin'),
    GetListRosterStaff: require('./Roster/GetListRosterStaff'),
    //begin Roster
    //Begin Company
    Company: require('./Company/Company'),
    transferData: require('./Company/transferData'),
    transferUser: require('./Company/transferUser'),
    //End Company
    //begin EForm
    GetListEFormTemplate: require('./EForm/GetListEFormTemplate'),
    AttributesEForm: require('./EForm/AttributesEForm'),
    getHistoryDetail: require('./EForm/getHistoryDetail'),
    createFormByUpload: require('./EForm/createFormByUpload'),
    //end EForm
    //begin SystemSetting
    GetValueSetting: require('./SystemSetting/GetValueSetting'),
    AttributesSystem: require('./SystemSetting/AttributesSystem'),
    //end SystemSetting
    //begin Language
    GetListLanguage: require('./Language/GetListLanguage'),
    //end Language
    //begin Staff
    GetListStaff: require('./Staff/GetListStaff'),
    //end Staff
    updateUserData: require('./UserAccount/updateUserData'),
    updatePassword: require('./UserAccount/updatePassword'),
    sendEmail: require('./UserAccount/sendEmail'),
    loadChildNode: require('./Patient/loadChildNode'),
};
