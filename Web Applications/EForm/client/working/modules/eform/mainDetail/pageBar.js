var history = ReactRouter.hashHistory;

module.exports = React.createClass({
	propTypes: {
		onAddNewSection: React.PropTypes.func,
		onSaveForm: React.PropTypes.func
	},
	_onAddNewSection: function(){
		var self = this;
		swal({
			title: 'Are you sure?',
			text: 'You will create new Section for this E-Form',
			type: 'warning',
			showCancelButton: true,
			closeOnConfirm: false,
			allowOutsideClick: true
		}, function(){
			self.props.onAddNewSection();
		})
	},
	_onSaveForm: function(){
		swal({
			title: 'Are you sure?',
			text: 'You will save this form !!!',
			type: 'warning',
			showCancelButton: true,
			closeOnConfirm: false,
			allowOutsideClick: false,
			showLoaderOnConfirm: true
		}, function(){
			this.props.onSaveForm();
		}.bind(this))
	},
            _goToHome: function(){
                history.push('/eformDev');
            },
	render: function(){
		return (
			<div className="page-bar">
				<ul className="page-breadcrumb">
                    <li>
                        <a onClick={this._goToHome}>Home</a>
                        <i className="fa fa-circle"></i>
                    </li>
                    <li>
                        <span>E-Form Dev</span>
                    </li>
                </ul>
                <div className="page-toolbar">
                    <div className="pull-right">
                    	<button type="button" className="btn green btn-sm" onClick={this._onAddNewSection}>
                    		<i className="fa fa-plus"></i>&nbsp;
                    		Add New Section
						</button>
						&nbsp;
						<button type="button" className="btn green btn-sm" onClick={this._onSaveForm}>
                    		<i className="fa fa-save"></i>&nbsp;
                    		Save Form
						</button>
                    </div>
                </div>
			</div>
		)
	}
})