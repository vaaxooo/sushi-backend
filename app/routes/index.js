const restana = require('restana')()
const service = restana.newRouter()

const { getCategories, getCategory, getProductBySlug, getProductsByCategories } = require('../services/API')

service.get('/categories', getCategories)
service.get('/categories/:slug', getCategory)
service.get('/products-by-categories', getProductsByCategories)
service.get('/products/:slug', getProductBySlug)

module.exports = service