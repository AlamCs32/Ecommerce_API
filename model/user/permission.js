const { sequelize, Model, DataTypes } = require('../../config/dbConfig')

class Permission extends Model{}

Permission.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    name :{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    sequelize,
    modelName:"Permission",
    tableName:"Permission"
})

// Permission.sync({force:true}).then(()=> console.log("table is created ")).catch(error => console.log(error))

module.exports = Permission