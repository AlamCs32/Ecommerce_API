const express = require('express')
const router = express.Router()
const logger = require('./LoggerRouter')
const product = require('./productRouter')
const excel = require('./excelRouter')
const { HomePage } = require('../controller/PublicProduct')

// Logger Apis And PAGES
router.use(logger)
//  Product Apis And PAGES 
router.use('/product', product)
// Excel Downlaod 
router.use('/', excel)
// Home Page for product
router.get('/', HomePage)

module.exports = router