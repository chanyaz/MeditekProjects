var ComponentSection = require('modules/eform/eformTemplateDetail/section');
var EFormService = require('modules/eform/services');
var Config = require('config');
var ComponentPageBar = require('modules/eform/eformDetail/pageBar');

module.exports = React.createClass({
    appointmentUID: null,
    patientUID: null,
    userUID: null,
    templateUID: null,
    formUID: null,
    signatureDoctor: null,
    getInitialState: function(){
        return {
            name: '',
            sections: Immutable.List()
        }
    },
    componentDidMount: function() {
        var locationParams = Config.parseQueryString(window.location.href);
        this.appointmentUID = locationParams.appointmentUID;
        this.patientUID = locationParams.patientUID;
        this.userUID = locationParams.userUID;
        this.templateUID = locationParams.templateUID;

        this._serverTemplateDetail();
        this._serverPermissionUser();
    },
    _serverPermissionUser: function(){
        EFormService.getUserRoles({UID: this.userUID})
        .then(function(response){
            
        })
    },
    _serverPreFormDetail: function(content){
        var self = this;
        EFormService.preFormDetail({UID: this.appointmentUID})
        .then(function(response){            
            self.signatureDoctor = response.data.Doctor.FileUpload;
            for(var section_index = 0; section_index < content.length; section_index++){
                var section = content[section_index];
                for(var row_index = 0; row_index < section.rows.length; row_index++){
                    var row = section.rows[row_index];
                    for(var field_index = 0; field_index < row.fields.length; field_index++){
                        var field = row.fields[field_index];
                        if(field.type === 'eform_input_image_doctor'){
                            self.refs[section.ref].setValue(row.ref, field.ref, self.signatureDoctor);
                        }
                        var preCalArray = [];
                        if(typeof field.preCal !== 'undefined'){
                            preCalArray = field.preCal.split('|');
                        }
                        preCalArray.map(function(preCal){
                            /* CONCAT PREFIX */
                            if(Config.getPrefixField(preCal,'CONCAT') > -1){
                                if(preCal !== ''){
                                    var preCalRes = Config.getArrayConcat(preCal);
                                    var value = '';
                                    preCalRes.map(function(preCalResItem){
                                        var preCalResItemArr = preCalResItem.split('.');
                                        var responseTemp = null;
                                        var preCalResItemTemp = '';
                                        if(preCalResItemArr.length > 1){
                                            responseTemp = response.data[preCalResItemArr[0]];
                                            preCalResItemTemp = preCalResItemArr[1];
                                        }else{
                                            responseTemp = response.data;
                                            preCalResItemTemp = preCalResItem;
                                        }
                                        for(var key in responseTemp){
                                            if(key === preCalResItemTemp){
                                                if(Config.getPrefixField(field.type,'checkbox') > -1){
                                                    if(field.value === responseTemp[key]){
                                                        value = 'yes';
                                                    }
                                                }
                                                else if(Config.getPrefixField(field.type,'radio') > -1){
                                                    if(field.value === responseTemp[key]){
                                                        value = 'yes';
                                                    }
                                                }else{
                                                    if(responseTemp[key] !== null)
                                                        value += responseTemp[key]+' ';
                                                }
                                                break;
                                            }
                                        }
                                    })
                                    self.refs[section.ref].setValue(row.ref, field.ref, value);
                                }
                            }
                            /* END CONCAT PREFIX */
                            /* DEFAULT PREFIX */
                            if(Config.getPrefixField(preCal,'DEFAULT') > -1){
                                if(preCal !== ''){
                                    var preCalRes = Config.getArrayDefault(preCal);
                                    var value = preCalRes[0];

                                    if(value === 'TODAY'){
                                        self.refs[section.ref].setValue(row.ref, field.ref, moment().format('YYYY-MM-DD HH:mm:ss'));
                                    }
                                }
                            }
                            /* END DEFAULT PREFIX */
                        })
                    }
                }
            }
        })
    },
    _checkServerEFormDetail: function(){
        var self = this;
        EFormService.eformCheckDetail({templateUID: this.templateUID, appointmentUID: this.appointmentUID})
        .then(function(response){
            if(response.data){
                self.formUID = response.data.UID;
                var EFormDataContent = JSON.parse(response.data.EFormData.FormData);
                EFormDataContent.map(function(field, indexField){
                    var fieldRef = field.ref;
                    var fieldData = field.value;
                    var rowRef = field.refRow;
                    var sections = self.state.sections.toJS();
                    for(var i = 0; i < sections.length; i++){
                        var section = sections[i];
                        if(typeof field.refChild === 'undefined'){
                            if(Config.getPrefixField(field.type, 'radio') > -1 || Config.getPrefixField(field.type, 'checkbox') > -1){
                                self.refs[section.ref].setValueForRadio(rowRef, fieldRef, field.checked);
                            }else{
                                self.refs[section.ref].setValue(rowRef, fieldRef, fieldData);
                            }
                        }else{
                            var fieldRefChild = field.refChild;
                            self.refs[section.ref].setValueForTable(rowRef, fieldRef, fieldRefChild, fieldData);
                        }
                    }
                })
            }
        })
    },
    _serverTemplateDetail: function(){
        var self = this;
        EFormService.eformTemplateDetail({uid: this.templateUID})
        .then(function(response){
             EFormService.eformHistoryDetail({EFormTemplateUID: self.templateUID, PatientUID: self.patientUID})
            .then(function(result){
            })
            var EFormTemplate = response.data;
            var content = JSON.parse(response.data.EFormTemplateData.TemplateData);
            self._serverPreFormDetail(content);
            self.setState(function(prevState){
                return {
                    name: EFormTemplate.Name,
                    sections: Immutable.fromJS(content)
                }
            })
            self._checkServerEFormDetail();
        })
    },
    _onComponentPageBarSaveForm: function(){
        var templateUID = this.templateUID;
        var sections = this.state.sections.toJS();
        var self = this;
        var fields = [];
        for(var i = 0; i < sections.length; i++){
            var section = sections[i];
            var sectionRef = section.ref;
            var tempFields = this.refs[sectionRef].getAllFieldValueWithValidation('form');
            tempFields.map(function(field, index){
                fields.push(field);
            })
        }

        var content = JSON.stringify(fields);
        var appointmentUID = this.appointmentUID;

        if(this.formUID === null){
            EFormService.formSave({templateUID: this.templateUID, appointmentUID: appointmentUID, content: content, name: this.state.name, patientUID: this.patientUID, userUID: this.userUID})
            .then(function(){
                swal("Success!", "Your form has been saved.", "success");
            })
        }else{
            EFormService.formUpdate({UID: this.formUID, content: content})
            .then(function(){
                swal("Success!", "Your form has been saved.", "success");
            })
        }
    },
    _onComponentPageBarPrintForm: function(printType){
        var sections = this.state.sections.toJS();
        var self = this;
        var fields = [];
        for(var i = 0; i < sections.length; i++){
            var section = sections[i];
            var sectionRef = section.ref;
            var tempFields = this.refs[sectionRef].getAllFieldValueWithValidation('print');
            tempFields.map(function(field, index){
                fields.push(field);
            })
        }
        var data = {
            printMethod: printType,
            data: fields,
            templateUID: this.templateUID
        }

        EFormService.createPDFForm(data)
        .then(function(response){
            var fileName = 'report_'+moment().format('X');
            var blob = new Blob([response], {
                type: 'application/pdf'
            });
            saveAs(blob, fileName);
            //swal("Success!", "Your form has been printed to PDF.", "success");
        }, function(error){

        })
    },
    render: function(){
        return (
            <div className="page-content">
                <ComponentPageBar ref="pageBar"
                        onSaveForm={this._onComponentPageBarSaveForm}
                        onPrintForm={this._onComponentPageBarPrintForm}/>
                <h3 className="page-title">{this.state.name}</h3>
                <div className="row">
                    <div className="col-md-9">
                        {
                            this.state.sections.map(function(section, index){
                                return <ComponentSection key={index}
                                    ref={section.get('ref')}
                                    refTemp={section.get('ref')}
                                    key={index}
                                    code={index}
                                    type="section"
                                    permission="normal"
                                    rows={section.get('rows')}
                                    name={section.get('name')}/>
                            }, this)
                        }
                    </div>
                    <div className="col-lg-3 col-md-12">
                        <div className="portlet portlet-fit box blue">
                            <div className="portlet-title">
                                <div className="caption">
                                    <span className="caption-subject bold uppercase">
                                        <i className="icon-speedometer"></i> History
                                    </span>
                                </div>
                                <div className="tools">
                                    <a href="javascript:;" className="collapse"> </a>
                                </div>
                            </div>
                            <div className="portlet-body">
                                <table className="table table-hover table-striped">
                                    <thead>
                                        <tr>
                                            <th width="1">#</th>
                                            <th>Created date</th>
                                            <th>Created by</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>1</td><td>20/11/2015</td><td>Master Angular</td></tr>
                                        <tr><td>2</td><td>08/03/2015</td><td>Cylops Commit</td></tr>
                                        <tr><td>3</td><td>30/04/2015</td><td>Peter Parker</td></tr>
                                        <tr><td>4</td><td>01/06/2015</td><td>Captain Americant</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <ComponentPageBar ref="pageBarBottom"
                        onSaveForm={this._onComponentPageBarSaveForm}
                        onPrintForm={this._onComponentPageBarPrintForm}/>
            </div>
        )
    }
})