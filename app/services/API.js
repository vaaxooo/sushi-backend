const Categories = require('../models/Categories')
const Products = require('../models/Products')

module.exports = {

    /* The `getProductsByCategories` function is an asynchronous function that retrieves products grouped
    by categories from a database and sends them as a response to an HTTP request. */
    async getProductsByCategories(req, res) {
        try {
            const categories = await Categories.findAll()
            for (let category of categories) {
                const products = await Products.findAll({
                    where: {
                        category_id: category.id
                    },
                    limit: 4
                })
                category.dataValues.products = products
            }
            return res.send({
                success: true,
                data: categories
            })
        } catch (error) {
            console.error(error)
            return res.send({ message: 'Internal server error' })
        }
    },

    /* This is a function that retrieves a list of reviews from a database and returns them as a response
    to an HTTP request. It uses the `findAndCountAll` method from the `Reviews` model to retrieve the
    reviews, and applies pagination to limit the number of results returned. The function then
    constructs a response object with the retrieved reviews and pagination information, and sends it
    back to the client. If an error occurs during the retrieval process, the function catches the error
    and returns a 500 status code with an error message. */
    async getCategories(req, res) {
        try {
            const categories = await Categories.findAll()
            return res.send({
                success: true,
                data: categories
            })
        } catch (error) {
            console.error(error)
            return res.send({ message: 'Internal server error' })
        }
    },

    /**
     * The function `getCategory` is an asynchronous function that retrieves a category based on its slug
     * and sends a response with the category data if found, or an error message if not found or if there
     * is an internal server error.
     * @param req - The `req` parameter is the request object that contains information about the HTTP
     * request made by the client. It includes properties such as the request method, request headers,
     * request parameters, and request body.
     * @param res - The `res` parameter is the response object that is used to send the response back to
     * the client. It contains methods and properties that allow you to control the response, such as
     * `send`, `json`, `status`, etc. In this code snippet, the `send` method is used to
     * @returns a response object with either a success or failure message and the category data.
     */
    async getCategory(req, res) {
        try {
            const category = await Categories.findOne({
                where: {
                    slug: req.params.slug
                }
            })
            if(!category) {
                return res.send({
                    success: false,
                    message: 'Category not found'
                })
            }

            const products = await Products.findAll({
                where: {
                    category_id: category.id
                }
            })

            return res.send({
                success: true,
                data: {
                    category: category,
                    products: products
                }
            })
        } catch (error) {
            console.error(error)
            return res.send({ message: 'Internal server error' })
        }
    },


    /**
     * The function `getProductBySlug` is an asynchronous function that retrieves a product from the
     * database based on its slug and returns a response with the product data if found, or an error
     * message if not found or if an internal server error occurs.
     * @param req - The `req` parameter is the request object that contains information about the incoming
     * HTTP request, such as the request headers, request parameters, and request body.
     * @param res - The `res` parameter is the response object that is used to send the response back to
     * the client. It contains methods and properties that allow you to control the response, such as
     * `send`, `json`, `status`, etc. In this code snippet, the `res` object is used to
     * @returns a response object with either a success or failure message and the data of the product if
     * it is found.
     */
    async getProductBySlug(req, res) {
        try {
            const product = await Products.findOne({
                where: {
                    slug: req.params.slug
                }
            })
            if(!product) {
                return res.send({
                    success: false,
                    message: 'Product not found'
                })
            }
            return res.send({
                success: true,
                data: product
            })
        } catch (error) {
            console.error(error)
            return res.send({ message: 'Internal server error' })
        }
    }

}