const restana = require('restana')()
const service = restana.newRouter()


const { 
    getReviews,
    getCarriers,
    getCities,
    getFlights,
    getFlight
 } = require('../services/API')

service.get('/reviews', getReviews)
service.get('/carriers', getCarriers)
service.get('/cities', getCities)
service.get('/flights', getFlights)
service.get('/flights/:id', getFlight)

module.exports = service