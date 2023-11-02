const express = require('express')
const { DownloadDataProduct, DownloadDataUser, SellerProduct } = require('../controller/excelController')
const router = express.Router()
const auth = require('../middleware/auth')
// ################ Api #########################

router.get('/product/excel', DownloadDataProduct)
router.get('/user/excel', DownloadDataUser)
router.get('/seller/download', auth, SellerProduct)

module.exports = router