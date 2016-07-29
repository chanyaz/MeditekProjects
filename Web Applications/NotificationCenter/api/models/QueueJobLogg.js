module.exports={
	attributes:{
		ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            primaryKey: true
        },

        QueueJobgID:{
        	type:Sequelize.BIGINT(20)
        },

        Log:{
    		type:Sequelize.TEXT,
        },

        CreatedDate:{
        	type:Sequelize.DATE,
        }

	},

	associations: function() {},
	options: {
        tableName: 'QueueJobLogg',
        timestamps: false,
    }
}