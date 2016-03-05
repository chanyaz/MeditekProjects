module.exports = React.createClass({
    propTypes: {
        name: React.PropTypes.string,
        size: React.PropTypes.any,
        groupId: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        code: React.PropTypes.number,
        type: React.PropTypes.string,
        context: React.PropTypes.string,
        refTemp: React.PropTypes.string,
        onRightClickItem: React.PropTypes.func,
        permission: React.PropTypes.string,
        rows: React.PropTypes.any
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
    setValue: function(value){
        $(this.refs.input).val(value)
    },
    getValue: function(){
        return $(this.refs.input).val()
    },
    getName: function(){
        return this.props.name;
    },
    getSize: function(){
        return this.props.size;
    },
    getType: function(){
        return this.props.type;
    },
    getCode: function(){
        return this.props.code;
    },
    getRows: function(){
        return this.props.rows;
    },
    render: function(){
        var type = this.props.type
        var html = null
        switch(type){
            case 'default':
                html = (
                    <textarea className={this.props.className} name={this.props.name} id={this.props.id} ref="input" placeholder={this.props.placeholder}/>
                )
                break;
            case 'eform_input_textarea':
                html = (
                    <div className={"dragField col-xs-"+this.props.size} ref="group">
                        <div className="form-group" id={this.props.groupId}>
                            <div className="col-xs-12">
                                <textarea title={this.props.name} className={this.props.className} 
                                    name={this.props.name} ref="input" placeholder={this.props.placeholder}
                                    rows={this.props.rows}/>
                            </div>
                        </div>
                    </div>
                )
                break;
        }
        return html;
	}
})