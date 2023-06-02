const Sequelize = require('sequelize')
const Carriers = require('../models/Carriers')
const Flights = require('../models/Flights')
const Reviews = require('../models/Reviews')

module.exports = {

    /* This is a function that retrieves a list of reviews from a database and returns them as a response
    to an HTTP request. It uses the `findAndCountAll` method from the `Reviews` model to retrieve the
    reviews, and applies pagination to limit the number of results returned. The function then
    constructs a response object with the retrieved reviews and pagination information, and sends it
    back to the client. If an error occurs during the retrieval process, the function catches the error
    and returns a 500 status code with an error message. */
    async getReviews(req, res) {
        try {
            const page = req.query.page || 1
            const limit = req.query.limit || 15
            const offset = (page - 1) * limit
            const reviews = await Reviews.findAndCountAll({
                limit,
                offset,
                order: [
                    ['id', 'DESC']
                ]
            })
            return res.send({
                success: true,
                data: {
                    reviews: reviews.rows,
                    pagination: {
                        total: reviews.count,
                        page: page,
                        pages: Math.ceil(reviews.count / limit)
                    }
                }
            })
        } catch (error) {
            console.error(error)
            return res.send({ message: 'Internal server error' })
        }
    },


    /* This is a function that retrieves a list of carriers from a database and returns them as a response
    to an HTTP request. It uses the `findAndCountAll` method from the `Carriers` model to retrieve the
    carriers, and applies pagination to limit the number of results returned. The function then
    constructs a response object with the retrieved carriers and pagination information, and sends it
    back to the client. If an error occurs during the retrieval process, the function catches the error
    and returns a 500 status code with an error message. */
    async getCarriers(req, res) {
        try {
            const page = req.query.page || 1
            const limit = req.query.limit || 20
            const offset = (page - 1) * limit
            const carriers = await Carriers.findAndCountAll({
                limit,
                offset,
                order: [
                    ['id', 'ASC']
                ]
            })

            return res.send({
                success: true,
                data: {
                    carriers: carriers.rows,
                    pagination: {
                        total: carriers.count,
                        page: page,
                        pages: Math.ceil(carriers.count / limit)
                    }
                }
            })
        } catch (error) {
            console.log(error)
            return res.send({ message: 'Internal server error' })
        }
    },

    /* This is a function that retrieves a list of distinct cities from a database and returns them as a
    response to an HTTP request. It uses the `findAll` method from the `Flights` model to retrieve the
    distinct cities, and constructs a response object with the retrieved cities and sends it back to the
    client. If an error occurs during the retrieval process, the function catches the error and returns
    a 500 status code with an error message. */
    async getCities(req, res) {
        try {
            const cities = await Flights.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('from')), 'from']],
            });
            const citiesArray = cities.map(city => city.from)
            return res.send({
                success: true,
                data: {
                    cities: citiesArray
                }
            })
        } catch (error) {
            console.log(error)
            return res.send({ message: 'Internal server error' })
        }
    },


    /**
     * This function retrieves flights based on the provided parameters and returns them with pagination
     * information.
     * @param req - The request object contains information about the incoming HTTP request, such as the
     * request headers, request parameters, and request body.
     * @param res - The "res" parameter is the response object that is sent back to the client after the
     * server has processed the request. It contains information such as the HTTP status code, headers, and
     * response body.
     * @returns a response object with a success property set to true and a data property containing an
     * object with two properties: flights and pagination. The flights property contains an array of flight
     * objects, and the pagination property contains information about the total number of flights, the
     * current page, and the total number of pages. If there is an error, the function returns a response
     * object with a message property set
     */
    async getFlights(req, res) {
        try {
            const from = req.query.from
            const to = req.query.to
            const page = req.query.page || 1
            const limit = req.query.limit || 20
            const offset = (page - 1) * limit
            const flights = await Flights.findAndCountAll({
                where: {
                    from: {
                        [Sequelize.Op.like]: `%${from}%`
                    },
                    to: {
                        [Sequelize.Op.like]: `%${to}%`
                    }
                },
                limit,
                offset,
                order: [
                    ['id', 'ASC']
                ]
            })

            return res.send({
                success: true,
                data: {
                    flights: flights.rows,
                    pagination: {
                        total: flights.count,
                        page: page,
                        pages: Math.ceil(flights.count / limit)
                    }
                }
            })
        } catch (error) {
            console.log(error)
            return res.send({ message: 'Internal server error' })
        }
    },

    /**
     * This is an asynchronous function that retrieves flight information based on a given ID and returns
     * it in a response object.
     * @param req - The request object contains information about the HTTP request that was made, such as
     * the request parameters, headers, and body.
     * @param res - `res` is the response object that is sent back to the client making the request. It
     * contains the data that is sent back to the client, such as the HTTP status code, headers, and the
     * response body. In this case, the response body contains either an error message or the flight data
     * @returns a JSON response with either a success message and the flight data if the flight is found,
     * or an error message if there is an internal server error or if the flight id is not provided.
     */
    async getFlight(req, res) {
        try {
            if(!req.params.id) return res.send({ message: 'Flight id is required' })
            const flight = await Flights.findOne({
                where: {
                    id: req.params.id
                },
                include: [ { model: Carriers, as: 'carrier' } ]
            })
            return res.send({
                success: true,
                data: flight
            })
        } catch (error) {
            console.log(error)
            return res.send({ message: 'Internal server error' })
        }
    }

}