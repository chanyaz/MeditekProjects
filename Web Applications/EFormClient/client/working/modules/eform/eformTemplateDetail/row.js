var CommonModal = require('common/modal');
var CommonInputText = require('common/inputText');
var CommonInputDate = require('common/inputDate');
var CommonTextArea = require('common/textarea');
var CommonCheckbox = require('common/checkbox');
var CommonRadio = require('common/radio');
var CommonLabel = require('common/label');
var CommonSignature = require('common/signature');
var CommonTable = require('modules/eform/eformTemplateDetail/tableField');
var ComponentFormUpdateSection = require('modules/eform/eformTemplateDetail/formUpdateSection');
var ComponentListField = require('modules/eform/eformTemplateDetail/listField');
var ComponentFieldDetail = require('modules/eform/eformTemplateDetail/fieldDetail');
var Config = require('config');

module.exports = React.createClass({
    propTypes: {
        code: React.PropTypes.number,
        codeSection: React.PropTypes.number,
        type: React.PropTypes.string,        
        refTemp: React.PropTypes.string,
        permission: React.PropTypes.string,
        size: React.PropTypes.number,
        fields: React.PropTypes.object,
        onRemoveRow: React.PropTypes.func,
        onSelectField: React.PropTypes.func,
        onSaveFieldDetail: React.PropTypes.func,
        onRemoveField: React.PropTypes.func,
        onRemoveTableColumn: React.PropTypes.func,
        onCreateTableColumn: React.PropTypes.func,
        onCreateTableRow: React.PropTypes.func,
        onRemoveTableRow: React.PropTypes.func,
        onUpdateTableColumn: React.PropTypes.func
    },
    componentDidMount: function(){
    },
    getCode: function(){
        return this.props.code;
    },
    getRef: function(){
        return this.props.refTemp;
    },
    getType: function(){
        return this.props.type;
    },
    getPermission: function(){
        return this.props.permission;
    },
    getSize: function(){
        return this.props.size;
    },
    setValue: function(fieldRef, value){
        if(typeof this.refs[fieldRef] !== 'undefined')
            this.refs[fieldRef].setValue(value);
    },
    setValueForRadio: function(fieldRef, fieldChecked){
        if(typeof this.refs[fieldRef] !== 'undefined')
            this.refs[fieldRef].setChecked(fieldChecked);
    },
    setValueForTable: function(fieldRef, fieldRefChild, value){
        if(typeof this.refs[fieldRef] !== 'undefined')
            this.refs[fieldRef].setValue(fieldRefChild, value);
    },
    _onRemoveRow: function(){
        var self = this;
        swal({
            title: 'Are you sure?',
            text: 'You will delete this row',
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true
        }, function() {
            self.props.onRemoveRow(self.props.codeSection, self.props.code);
        })
    },
    _onComponentListFieldSelect: function(item){
        this.refs.modalCreateFieldSection.hide();
        this.props.onSelectField(this.props.codeSection, this.props.code, this.props.refTemp, item.get('code'));
    },
    _onRightClickItem: function(code, e, ref) {
        var id = $(e.target).attr('id')
        if (typeof id === 'undefined')
            id = $(e.target).parent().attr('id')
        var type = this.refs[ref].getType();
        var size = this.refs[ref].getSize();
        var dataFieldDetail = null;
        if(Config.getPrefixField(type, 'eform_input') > -1){
            var name = (typeof(this.refs[ref].getName)!=='undefined')?this.refs[ref].getName():'';
            var preCal = (typeof(this.refs[ref].getPreCal)!=='undefined')?this.refs[ref].getPreCal():'';
            dataFieldDetail = {
                size: size,
                code: code,
                type: type,
                ref: ref,
                name: name,
                preCal: preCal
            }
            if(Config.getPrefixField(type, 'textarea') > -1){
                dataFieldDetail.rows = this.refs[ref].getRows();
            }
            if(Config.getPrefixField(type, 'check') > -1){
                dataFieldDetail.label = this.refs[ref].getLabel();
                dataFieldDetail.value = this.refs[ref].getValue();
            }
            if(Config.getPrefixField(type, 'label') > -1){
                delete dataFieldDetail.name;
            }
            if(Config.getPrefixField(type, 'signature') > -1){
                dataFieldDetail.height = this.refs[ref].getHeight();
            }
        }
        switch (id) {
            case 'editField':
                this.refs.modalFieldDetail.show();
                this.refs.fieldDetail.init(dataFieldDetail);
                break;
            case 'deleteField':
                var self = this;
                swal({
                    title: 'Are you sure?',
                    text: 'You will delete this field ?',
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    allowOutsideClick: true
                }, function() {
                    self.props.onRemoveField(self.props.codeSection, self.props.code, code);
                })
                break;
        }
    },
    _onComponentFieldDetailSave: function(data) {
        var self = this;
        swal({
            title: 'Are you sure?',
            text: 'You will edit this field',
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            allowOutsideClick: true
        }, function() {
            self.props.onSaveFieldDetail(self.props.codeSection, self.props.code, data);
            self.refs.modalFieldDetail.hide()
        })
    },
    _onDeleteColumn: function(codeField, codeColumn) {
        this.props.onRemoveTableColumn(this.props.codeSection, this.props.code, codeField, codeColumn);
    },
     _onUpdateColumn: function(codeField, data) {
        this.props.onUpdateTableColumn(this.props.codeSection, this.props.code, codeField, data);
    },
    _onRightClickTableItem: function(code, e, refTemp) {
        var id = $(e.target).attr('id');
        if (typeof id === 'undefined')
            id = $(e.target).parent().attr('id');
        var ref = "field" + code;
        var self = this;
        switch (id) {
            case 'deleteTable':
                swal({
                    title: 'Are you sure?',
                    text: 'You will delete this table.',
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    allowOutsideClick: true
                }, function() {
                    self.props.onRemoveField(self.props.codeSection, self.props.code, code);
                })
                break;
            case 'addRow':
                swal({
                    title: 'Are you sure?',
                    text: 'You will add a row into this table.',
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    allowOutsideClick: true
                }, function() {
                    self.props.onCreateTableRow(self.props.codeSection, self.props.code, code);
                })
                break;
            case 'deleteRow':
                swal({
                    title: 'Are you sure?',
                    text: 'You will delete a row in this table.',
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    allowOutsideClick: true
                }, function() {
                    self.props.onRemoveTableRow(self.props.codeSection, self.props.code, code);
                })
                break;
            case 'addCol':
                swal({
                    title: 'Are you sure?',
                    text: 'You will add a column into this table.',
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    allowOutsideClick: true
                }, function() {
                    self.props.onCreateTableColumn(self.props.codeSection, self.props.code, code);
                })
                break;
            case 'editTable':
                var name = self.refs[refTemp].getName();
                var size = self.refs[refTemp].getSize();
                self.refs.modalFieldDetail.show();
                var dataFieldDetail = { name: name, size: size, code: code, type: 'table', ref: refTemp }
                self.refs.fieldDetail.init(dataFieldDetail);
                break;
        }
    },
    getAllFieldValueWithValidation: function(stringType){
        var fields = this.props.fields.toJS();
        var results = [];
        var self = this;
        for(var i = 0; i < fields.length; i++){
            var field = fields[i];
            var fieldRef = field.ref;
            if(typeof this.refs[fieldRef] !== 'undefined'){
                var type = this.refs[fieldRef].getType();
                if(type !== 'table' && 
                    Config.getPrefixField(type, 'label') === -1 && 
                    Config.getPrefixField(type, 'check') === -1 && 
                    Config.getPrefixField(type, 'date') === -1 &&
                    Config.getPrefixField(field.type, 'signature') === -1){
                    var value = this.refs[fieldRef].getValue();
                    var name = this.refs[fieldRef].getName();
                    results.push({value: value, name: name, ref: fieldRef, type: type, refRow: this.props.refTemp});
                }else if(type === 'table'){
                    var tableFields = this.refs[fieldRef].getAllValue();
                    tableFields.map(function(tableField, index){
                        tableField.refRow = self.props.refTemp;
                        results.push(tableField);
                    })
                }else if(Config.getPrefixField(type, 'checkbox') > -1 || Config.getPrefixField(type, 'radio') > -1){
                    var isChecked = this.refs[fieldRef].isChecked();
                    var value = this.refs[fieldRef].getValue();
                    var name = this.refs[fieldRef].getName();
                    results.push({value: value, name: name, ref: fieldRef, type: type, checked: isChecked, refRow: this.props.refTemp});
                }else if(Config.getPrefixField(type, 'date') > -1){
                    var value = this.refs[fieldRef].getText();
                    var name = this.refs[fieldRef].getName();
                    results.push({value: value, name: name, ref: fieldRef, type: type, refRow: this.props.refTemp});
                }else if(Config.getPrefixField(field.type, 'signature') > -1){
                    if(stringType !== 'print'){
                        var value = this.refs[fieldRef].getValue();
                        var name = this.refs[fieldRef].getName();
                        results.push({value: value, name: name, ref: fieldRef, type: type, refRow: this.props.refTemp});
                    }
                    else{
                        var value = this.refs[fieldRef].getBase64Value();
                        var name = this.refs[fieldRef].getName();
                        results.push({base64Data: value, name: name, ref: fieldRef, type: type, refRow: this.props.refTemp, value: ''});
                    }
                }
            }
        }
        return results;
    },
    render: function(){
        var displayContextMenu = (this.props.permission === 'eformDev')?'contextMenu':'none';
        var displayContextTableMenu = (this.props.permission === 'eformDev')?'contextTableMenu':'none';
        if(this.props.permission === 'eformDev'){
            var html = (
                <div className="row">
                    <div id="contextMenu">
                        <ul className="dropdown-menu" role="menu">
                            <li><a id="editField"><i className="icon-pencil"/> Edit Field</a></li>
                            <li><a id="deleteField"><i className="icon-trash"/> Delete Field</a></li>
                        </ul>
                    </div>
                    <div id="contextTableMenu">
                        <ul className="dropdown-menu" role="menu">
                            <li><a id="editTable"><i className="icon-calendar"/> Edit Table Name</a></li>
                            <li><a id="addCol"><i className="icon-note"/> Add Column</a></li>
                            <li><a id="addRow"><i className="icon-note"/> Add Row</a></li>
                            <li><a id="deleteRow"><i className="icon-trash"/> Delete Row</a></li>
                            <li><a id="deleteTable"><i className="icon-trash"/> Delete Table</a></li>
                        </ul>
                    </div>
                    <CommonModal ref="modalCreateFieldSection">
                        <div className="header">
                            <h4>List Field</h4>
                        </div>
                        <div className="content">
                            <ComponentListField ref="listField" onSelectItem={this._onComponentListFieldSelect}/>
                        </div>
                    </CommonModal>
                    <CommonModal ref="modalFieldDetail">
                        <div className="header">
                            <h4>Modal Field Detail</h4>
                        </div>
                        <div className="content">
                            <ComponentFieldDetail ref="fieldDetail" onSave={this._onComponentFieldDetailSave}
                                onCloseModal={function(){this.refs.modalFieldDetail.hide()}.bind(this)}/>
                        </div>
                    </CommonModal>
                    <div className="col-md-12 dragRow">
                        <div className="portlet light" id={"dragRow_"+this.props.codeSection+'_'+this.props.code}>
                            <div className="portlet-title">
                                    <div className="caption">
                                            <span className="label label-sm label-primary dragRowHandler">
                                                Drag here
                                            </span>
                                        </div>
                                        <div className="tools">
                                            <a className="collapse"></a>
                                        </div>
                                        <div className="actions">
                                            <div className="btn-group">
                                                <a className="btn btn-default btn-sm" data-toggle="dropdown">
                                                    Action&nbsp;
                                                    <i className="fa fa-angle-down"></i>
                                                </a>
                                                <ul className="dropdown-menu pull-right">
                                                    <li>
                                                        <a onClick={function(){this.refs.modalCreateFieldSection.show()}.bind(this)}>
                                                            <i className="fa fa-plus"></i> Add Field
                                                        </a>
                                                    </li>
                                                    <li className="divider"/>
                                                    <li>
                                                        <a onClick={this._onRemoveRow}>
                                                            <i className="fa fa-trash-o"></i> Remove Row
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                           </div>
                           <div className="portlet-body form flip-scroll">
                                <div className="form-horizontal">
                                    <div className="form-body">
                                        <div className="row">
                                            {
                                                this.props.fields.map(function(field,index){
                                                    var type = field.get('type');
                                                    var groupId = 'fieldgroup_'+this.props.codeSection+'_'+this.props.code+'_'+index;
                                                    if(type === 'eform_input_text')
                                                            return <CommonInputText key={index} type={type}
                                                                groupId={groupId}
                                                                name={field.get('name')}
                                                                size={field.get('size')}
                                                                permission={this.props.permission}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                preCal={field.get('preCal')}
                                                                onRightClickItem={this._onRightClickItem}/>
                                                    else if(type === 'eform_input_date'){
                                                            return <CommonInputDate key={index} type={type}
                                                                groupId={groupId}
                                                                name={field.get('name')}
                                                                size={field.get('size')}
                                                                permission={this.props.permission}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                preCal={field.get('preCal')}
                                                                code={index}
                                                                onRightClickItem={this._onRightClickItem}/>
                                                    }else if(type === 'eform_input_textarea')
                                                            return <CommonTextArea key={index} type={type}
                                                                groupId={groupId}
                                                                name={field.get('name')}
                                                                size={field.get('size')}
                                                                permission={this.props.permission}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                onRightClickItem={this._onRightClickItem}
                                                                preCal={field.get('preCal')}
                                                                rows={field.get('rows')}/>
                                                    else if(type === 'eform_input_check_checkbox')
                                                            return <CommonCheckbox key={index} type={type}
                                                                groupId={groupId}
                                                                name={field.get('name')}
                                                                size={field.get('size')}
                                                                permission={this.props.permission}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                value={field.get('value')}
                                                                preCal={field.get('preCal')}
                                                                onRightClickItem={this._onRightClickItem}
                                                                label={field.get('label')}/>
                                                    else if(type === 'eform_input_check_radio')
                                                            return <CommonRadio key={index} type={type}
                                                                groupId={groupId}
                                                                name={field.get('name')}
                                                                size={field.get('size')}
                                                                permission={this.props.permission}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                onRightClickItem={this._onRightClickItem}
                                                                label={field.get('label')}
                                                                preCal={field.get('preCal')}
                                                                value={field.get('value')}/>
                                                    else if(type === 'eform_input_check_label')
                                                            return <CommonLabel key={index} type={type}
                                                                groupId={groupId}
                                                                size={field.get('size')}
                                                                permission={this.props.permission}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                onRightClickItem={this._onRightClickItem}
                                                                label={field.get('label')}/>
                                                    else if(type === 'eform_input_check_label_html')
                                                            return <CommonLabel key={index} type={type}
                                                                groupId={groupId}
                                                                size={field.get('size')}
                                                                permission={this.props.permission}
                                                                context={displayContextMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                onRightClickItem={this._onRightClickItem}
                                                                label={field.get('label')}/>
                                                    else if(type === 'table')
                                                            return <CommonTable key={index} type={type}
                                                                name={field.get('name')}
                                                                permission={this.props.permission}
                                                                content={field.get('content')}
                                                                groupId={groupId}
                                                                context={displayContextTableMenu}
                                                                ref={field.get('ref')}
                                                                refTemp={field.get('ref')}
                                                                code={index}
                                                                size={field.get('size')}
                                                                onDeleteColumn={this._onDeleteColumn}
                                                                onUpdateColumn={this._onUpdateColumn}
                                                                onRightClickItem={this._onRightClickTableItem}/>
                                                    else if(type === 'eform_input_signature'){
                                                        return <CommonSignature key={index} type={type}
                                                            groupId={groupId}
                                                            permission={this.props.permission}
                                                            name={field.get('name')}
                                                            size={field.get('size')}
                                                            context={displayContextMenu}
                                                            ref={field.get('ref')}
                                                            refTemp={field.get('ref')}
                                                            code={index}
                                                            height={field.get('height')}
                                                            onRightClickItem={this._onRightClickItem}/>
                                                    }
                                                }, this)
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else{
            var html = (
                <div className="row">
                    {
                            this.props.fields.map(function(field,index){
                                var type = field.get('type');
                                var groupId = 'fieldgroup_'+this.props.codeSection+'_'+this.props.code+'_'+index;
                                if(type === 'eform_input_text')
                                        return <CommonInputText key={index} type={type}
                                            groupId={groupId}
                                            name={field.get('name')}
                                            size={field.get('size')}
                                            permission={this.props.permission}
                                            context={displayContextMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            onRightClickItem={this._onRightClickItem}
                                            preCal={field.get('preCal')}/>
                                else if(type === 'eform_input_date')
                                        return <CommonInputDate key={index} type={type}
                                            groupId={groupId}
                                            name={field.get('name')}
                                            size={field.get('size')}
                                            permission={this.props.permission}
                                            context={displayContextMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            onRightClickItem={this._onRightClickItem}/>
                                else if(type === 'eform_input_textarea')
                                        return <CommonTextArea key={index} type={type}
                                            groupId={groupId}
                                            name={field.get('name')}
                                            size={field.get('size')}
                                            permission={this.props.permission}
                                            context={displayContextMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            onRightClickItem={this._onRightClickItem}
                                            rows={field.get('rows')}/>
                                else if(type === 'eform_input_check_checkbox')
                                        return <CommonCheckbox key={index} type={type}
                                            groupId={groupId}
                                            name={field.get('name')}
                                            size={field.get('size')}
                                            permission={this.props.permission}
                                            context={displayContextMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            onRightClickItem={this._onRightClickItem}
                                            label={field.get('label')}
                                            value={field.get('value')}/>
                                else if(type === 'eform_input_check_radio')
                                        return <CommonRadio key={index} type={type}
                                            groupId={groupId}
                                            name={field.get('name')}
                                            size={field.get('size')}
                                            permission={this.props.permission}
                                            context={displayContextMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            onRightClickItem={this._onRightClickItem}
                                            label={field.get('label')}
                                            value={field.get('value')}/>
                                else if(type === 'eform_input_check_label')
                                        return <CommonLabel key={index} type={type}
                                            groupId={groupId}
                                            size={field.get('size')}
                                            permission={this.props.permission}
                                            context={displayContextMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            onRightClickItem={this._onRightClickItem}
                                            label={field.get('label')}/>
                                else if(type === 'eform_input_check_label_html')
                                        return <CommonLabel key={index} type={type}
                                            groupId={groupId}
                                            size={field.get('size')}
                                            permission={this.props.permission}
                                            context={displayContextMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            onRightClickItem={this._onRightClickItem}
                                            label={field.get('label')}/>
                                else if(type === 'table')
                                        return <CommonTable key={index} type={type}
                                            name={field.get('name')}
                                            permission={this.props.permission}
                                            content={field.get('content')}
                                            groupId={groupId}
                                            context={displayContextTableMenu}
                                            ref={field.get('ref')}
                                            refTemp={field.get('ref')}
                                            code={index}
                                            size={field.get('size')}
                                            onDeleteColumn={this._onDeleteColumn}
                                            onUpdateColumn={this._onUpdateColumn}
                                            onRightClickItem={this._onRightClickTableItem}/>
                                else if(type === 'eform_input_signature'){
                                    return <CommonSignature key={index} type={type}
                                        groupId={groupId}
                                        permission={this.props.permission}
                                        name={field.get('name')}
                                        size={field.get('size')}
                                        context={displayContextMenu}
                                        ref={field.get('ref')}
                                        refTemp={field.get('ref')}
                                        code={index}
                                        type={type}
                                        height={field.get('height')}
                                        onRightClickItem={this._onRightClickItem}/>
                                }
                            }, this)
                        }
                </div>
            )
        }
        return html;
    }
})