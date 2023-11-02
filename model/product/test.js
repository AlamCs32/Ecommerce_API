const { sequelize, Model, DataTypes, QueryTypes } = require('../../config/dbConfig')

class Test extends Model { }

Test.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
    },
    color: {
        type: DataTypes.STRING,
    },
    json: {
        type: DataTypes.TEXT,
        // get: function () {
        //     this.toJSON("json")
        //     // return JSON.parse(this.getDataValue("json"))
        // },
        // set: function (value) {
        //     return this.setDataValue("json", JSON.stringify(value))
        // }
    }

}, {
    sequelize,
    modelName: "Test",
    tableName: "Test"
})

// Test.create({title:"NAME",fee:"aqqdq",color:"GREEN",json:[{id:4,present:"yes",data:"no Data"}]}).then(res => console.log(res)).catch(error => console.log(error))


// For Json Array
// sequelize.query("SELECT * FROM `test` where JSON_CONTAINS(productId,'[1]') ", { nest: true, type: QueryTypes.SELECT }).then((res) => console.log(res)).catch(error => console.log(error))
// let id = 1
// For Json Object
// sequelize.query("SELECT * FROM `test` WHERE JSON_UNQUOTE(JSON_EXTRACT(json,'$.id')) = 4", { type: QueryTypes.SELECT }).then((res) => console.log(res)).catch(error => console.log(error))

// Test.findAll({ raw: true }).then(res => { console.log(res) })

// Test.sync({ force: true }).then(() => console.log('database is connect')).catch(err => console.log(err))

// For Product and Specification
// SELECT * FROM `test`,product WHERE JSON_UNQUOTE(JSON_EXTRACT(json,'$.id')) = 1 and product.id = JSON_UNQUOTE(JSON_EXTRACT(json,'$.id'));
// sequelize.query("SELECT * FROM `product` order by createdAt desc ", { type: QueryTypes.SELECT }).then((res) => console.log(res)).catch(error => console.log(error))

let arr = [1, 1, 2, 1, 3, 4, 4, 5]

function removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
}
// let data = removeDuplicates(arr)

let data = [...new Set(arr)]

console.log(data)