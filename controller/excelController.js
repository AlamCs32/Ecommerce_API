const { Product, User } = require('../model')
const generateExcelFile = require('../service/excel')

class Excel {
    // Product Data download  Admin
    static async DownloadDataProduct(req, res) {
        // Raw is used to get Original values Without Extra data 
        let product = await Product.findAll({ raw: true }).catch(err => {
            return res.status(404).send("Something went wronge")
        })
        // This method take Two input Data in object and Name it is optional 
        generateExcelFile(product, 'Product', 'product.xls')
        // Rending Download response 
        return res.status(200).download('/razy/public/files/product.xls')
    }

    // User Data Downlaod
    static async DownloadDataUser(req, res) {
        // Raw is used to get Original values Without Extra data 
        let user = await User.findAll({ raw: true }).catch(err => {
            return res.status(404).send("Something went wronge")
        })
        // This method take Two input Data in object and Name it is optional 
        generateExcelFile(user, 'user', 'user.xls')
        // Rending Download response 
        return res.status(200).download('/razy/public/files/user.xls')
    }

    // Seller Product excel file 
    static async SellerProduct(req, res) {
        let product = await Product.findAll({ where: { userId: req.user.id }, raw: true }).catch(err => {
            return res.status(404).send("Something went wronge")
        })
        // This method take Two input Data in object and Name it is optional 
        generateExcelFile(product, 'seller', 'seller.xls')
        // Rending Download response 
        return res.status(200).download('/razy/public/files/seller.xls')
    }
}



module.exports = Excel