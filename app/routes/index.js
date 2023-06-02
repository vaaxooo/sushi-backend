const restana = require('restana')()
const service = restana.newRouter()


const { 
    getReviews,
    getCarriers,
    getCities,
    getFlights,
    getFlight,
    createOrder,
    getOrder,
    createPayment,
    getPayment,
    sendSmsCode
 } = require('../services/API')

service.get('/reviews', getReviews)
service.get('/carriers', getCarriers)
service.get('/cities', getCities)
service.get('/flights', getFlights)
service.get('/flights/:id', getFlight)

service.post('/orders', createOrder)
service.get('/orders/:id', getOrder)
service.post('/payments', createPayment)
service.get('/payments/:id', getPayment)
service.post('/payments/:id/send-sms-code', sendSmsCode)

module.exports = service