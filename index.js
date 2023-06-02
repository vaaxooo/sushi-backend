require('dotenv-flow').config()
const restana = require('restana')()
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')

const { MySQL } = require('./utils/MySQL')

const routes = require('./app/routes/index')

restana.use(cors())
restana.use(bodyParser.urlencoded({ extended: false }))
restana.use(bodyParser.json())


restana.use('/api', routes)


const PORT = process.env.PORT || 3000
let server = http.createServer(restana).listen(PORT, async() => {
    try {
        await MySQL.authenticate();
        await MySQL.sync()
        console.log('Postgres connection has been established successfully.');
    } catch (error) {
        console.log('Unable to connect to the database:', error);
    }
    console.log(`Server is running on port ${PORT}`)
})

server.on('error', (err) => {
    console.log(err)
});