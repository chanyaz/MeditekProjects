module.exports = React.createClass({
    value: 'no',
    propTypes: {
        label: React.PropTypes.string,
        name: React.PropTypes.string,
        size: React.PropTypes.any,
        groupId: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        code: React.PropTypes.number,
        type: React.PropTypes.string,
        context: React.PropTypes.string,
        onRightClickItem: React.PropTypes.func,
        preCal: React.PropTypes.string,
        onChange: React.PropTypes.func
    },
    getDefaultProps: function(){
        return {
            placeholder: '',
            type: 'default',
            name: '',
            className: 'form-control',
            size: '12'
        }
    },
    componentDidMount: function(){
        var self = this;
        $(this.refs.input).iCheck({
            labelHover: false,
            cursor: true,
            checkboxClass: 'icheckbox_square-green'
        })
        $(this.refs.input).on('ifChecked', function(event){
            self.value = 'yes';
            if(typeof self.props.onChange !== 'undefined')
                self.props.onChange(self.value);
        })
        $(this.refs.input).on('ifUnchecked', function(event){
            self.value = 'no';
            if(typeof self.props.onChange !== 'undefined')
                self.props.onChange(self.value);
        })
        if(typeof this.refs.group !== 'undefined' && this.props.context !== 'none'){
            $(this.refs.group).contextmenu({
                target: '#'+this.props.context,
                before: function(e, element, target) {                    
                    e.preventDefault();
                    return true;
                },
                onItem: function(element, e) {
                    this.props.onRightClickItem(this.props.code, e, this.props.refTemp)
                }.bind(this)
            })
        }
        if(this.props.permission === 'eformDev'){
            $(this.refs.input).prop('disabled', true);
        }
    },
    isChecked: function(){
        return $(this.refs.input).prop('checked');
    },
    setChecked: function(checked){
        if(checked){
            if(checked === 'true' || checked === true)
                $(this.refs.input).iCheck('check');
            else if(checked === 'false')
                $(this.refs.input).iCheck('uncheck');    
        }
        else{
             $(this.refs.input).iCheck('uncheck');
        }
    },
    setValue: function(checked){
        if(checked === 'yes' || checked === 'Y')
            $(this.refs.input).iCheck('check');
        else if(checked === 'no' || checked === 'N')
           $(this.refs.input).iCheck('uncheck'); 
    },
    setDisplay: function(type){
        if(type === 'disable'){
            $(this.refs.input).prop('disabled', true);
        }else{
            $(this.refs.input).css('display', 'none');
        }
    },
    getValue: function(){
        return this.props.value;
    },
    getValueTable: function(){
        return this.value;
    },
    getName: function(){
        return this.props.name;
    },
    getLabel: function(){
        return this.props.label;
    },
    getSize: function(){
        return this.props.size;
    },
    getType: function(){
        return this.props.type;
    },
    getPreCal: function(){
        return this.props.preCal;
    },
    getCal: function(){
        return this.props.cal;
    },
    getRoles: function(){
        return this.props.roles;
    },
    isSelected: false,
    getIsSelected: function() {
        return this.isSelected;
    },
    selection: function () {
        if(!this.isSelected)
        {
            this.isSelected = true;
            $(this.refs.label_checkbox).addClass('eform-selection-field');
        } else {
            this.isSelected = false;
            $(this.refs.label_checkbox).removeClass('eform-selection-field');
        }

    },
    render: function(){
        var type = this.props.type
        var html = null;
        var display_name = null;
        if(this.props.permission === 'eformDev'){
            display_name = (
                <div style={{position: 'absolute', top: -30, left: 0, backgroundColor: 'green', color: 'white', padding: 5}}>
                    {this.props.name}
                </div>
            )
        }
        switch(type){
            case 'default':
                html = (
                    <input type="checkbox" className="icheck" name={this.props.name} id={this.props.id} ref="input"/>
                )
                break;
            case 'eform_input_check_checkbox':
                html = (
                    <div className={"dragField col-xs-"+this.props.size} ref="group">
                        {display_name}
                        <div className="form-group" id={this.props.groupId}>
                            <div className="col-xs-12">
                                <div className="icheck-inline">
                                    <label ref="label_checkbox" onDoubleClick = {this.selection}>
                                        <input type="checkbox" className="icheck" 
                                            id={this.props.refTemp} name={this.props.name} ref="input" title={this.props.name} />
                                        &nbsp;
                                        {this.props.label}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break;
            case 'c':
                html = (
                    <input type="checkbox" className="icheck" ref="input"/>
                )
                break;
        }
        return html
    }
})