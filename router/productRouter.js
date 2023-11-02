const express = require('express')
const { ViweProduct, AddProduct, UpdateProduct, DeleeteProduct, CartApi, getCart, deleteCart, addWishlist, getWishlist, deleteWishlist, Slug, Recent_product, popular_product, trending_product, CategorySearch } = require('../controller/productApi')
const { AddProductPage, ViewProductPage, UpdateProductPage, CartPage, OrderPage, product_Page } = require('../controller/PublicProduct')
// const { ViewOrder, AddOrder, CancleOrder } = require('../controller/orderApi') //Depricated Module
const { ViewOrderPage } = require('../controller/publicOrder')
const { PlaceOrder, ViewPlaceOrder, CanclePlaceOrder, getPayment, paymentPay, CancleOrderAdmin, GetDeliveryStatus, UpdateDeliveryStatus, ConfirmOrder, UpdateDeliveryLocation, AdminOrderList, AdminOrderListDetails, UserOrderList, UserOrderListDetails, AdminAllUserOrder } = require('../controller/OrderSirApi')
const auth = require('../middleware/auth')
const isAuthorize = require('../middleware/roleAuth')
const { WhishliastEmail, CardEmail } = require('../controller/whishistCartEmail')
const router = express.Router()

// ################ Api's #########################

//  View search wise pages
router.get('/view', ViweProduct)  // search Only Product
router.get('/csearch', CategorySearch)
router.get('/recent', Recent_product)
router.get('/popular', popular_product)
router.get('/trending', trending_product)

// Order Api   Depcricated Function is this 
// router.get('/order', auth, isAuthorize('admin'), ViewOrder) //Depricated Function
// router.post('/add/order/:id', auth, AddOrder) //Depricated Function
// router.post('/cancle/order/:pid/:rid', auth, CancleOrder) //Depricated Function

// Product Api 
router.post('/add', auth, isAuthorize('admin'), AddProduct)
router.put('/update/:id', auth, isAuthorize('admin'), UpdateProduct)
router.delete('/delete/:id', auth, isAuthorize('admin'), DeleeteProduct)

// Cart Api 
router.post('/cart', auth, CartApi)
router.get('/cart', auth, getCart)
router.delete('/cart', auth, deleteCart)

// WishList Api
router.get('/wishlist', auth, getWishlist)
router.post('/wishlist', auth, addWishlist)
router.delete('/wishlist', auth, deleteWishlist)

// Slug fro Search Engine Optimazation(SEO)
router.get('/slug', Slug)

// #################### Place Order APIs USER ####################
router.post('/placeorder', auth, PlaceOrder)
router.get('/placeorder', auth, ViewPlaceOrder)
router.delete('/placeorder', auth, CanclePlaceOrder)

// #################### PlaceOrder admin Confirm/Cancle APIs ####################
router.post('/confirmorder', auth, isAuthorize("admin"), ConfirmOrder)
router.delete('/admin/order', auth, isAuthorize('admin'), CancleOrderAdmin)

// #################### Payment Order APIs####################
router.get('/payment', getPayment)
router.post('/payment', paymentPay)

// #################### Order Status APIs####################
router.get('/delivery', auth, GetDeliveryStatus)
router.put('/updatelocation', auth, isAuthorize("admin"), UpdateDeliveryLocation)
router.put('/delivery', auth, isAuthorize("admin"), UpdateDeliveryStatus)

// #################### Admin Order List And Details APIs ####################
router.get('/admin/order', auth, isAuthorize("admin"), AdminOrderList)
router.get('/admin/order/user', auth, isAuthorize("admin"), AdminAllUserOrder)
router.get('/admin/order/:id', auth, isAuthorize("admin"), AdminOrderListDetails)

// #################### User Order List And Details APIs ####################
router.get('/user/order', auth, UserOrderList)
router.get('/user/order/:id', auth, UserOrderListDetails)

// ################# Whishlist Card Emails Send #####################

router.get('/card/email', CardEmail)
router.get('/whish/email', WhishliastEmail)



// ################ API's End ################
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// ################ Pages #########################

// Product Pages for admin and seller

// Admin Pages 
router.get('/admin/add', auth, AddProductPage)
router.get('/admin/view', auth, ViewProductPage)
router.get('/admin/update/:id', auth, UpdateProductPage)

// View Separate product Page 
router.get('/:id', product_Page)
// Order Pages User
router.get('/order/:rid', auth, ViewOrderPage)

// Cart Page 
router.get('/cart', auth, CartPage)
router.get('/order', auth, OrderPage)


module.exports = router