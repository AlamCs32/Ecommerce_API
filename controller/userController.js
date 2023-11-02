const { Address, User, addressValidate, addressCreateValidate } = require("../model")
const { sequelize, QueryTypes } = require('../config/dbConfig')

class AddressApi {
    // retrive Your address informaton 
    static async GetAddress(req, res) {
        let address = await Address.findAll({
            where: { userId: req.user.id },
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [{
                model: User,
                target: "id",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "password", "googleId"]
                }
            }]
        }).catch(error => {
            return res.status(404).send(error)
        })
        return res.status(200).send(address)
    }
    // ########################## TESTING ################################
    // static async GetAddress(req, res) {
    //     let address = await sequelize.query(`select * from address where userId=${req.user.id} left join user on address.userId = user.id`, { type: QueryTypes.SELECT }).catch(error => {
    //         // return res.status(200).send(error)
    //         console.log(error)
    //     })
    //     console.log(address)
    //     return res.status(200).send('done')
    // }

    // Creating and updating User Address
    static async CreateAddress(req, res) {
        let user = await Address.findOne({ where: { userId: req.user.id } }).catch(error => {
            return res.status(404).send(error)
        })

        req.body.userId = req.user.id

        if (user) {
            let valid = addressValidate(req.body)
            if (valid) { return res.status(404).send(valid) }
            // Updaing User Address Information
            let result = await Address.update(req.body, { where: { userId: req.user.id } }).catch(error => {
                return res.status(404).send(error)
            })//sending response
            return res.status(200).send(result)
        }
        // If User Not present then this will Execute
        // This function check all field is present or not 
        let AddValid = addressCreateValidate(req.body)
        if (AddValid) { return res.status(404).send(AddValid) }
        // Creating User Address Information
        let result = await Address.create(req.body).catch(error => {
            return res.status(404).send(error)
        })
        //sending response
        return res.status(200).send(result)
    }

}

module.exports = AddressApi