const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./generalQuery')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const cors = require('cors')
const corsOptions = {
  origin: '*',
  //optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
cors(corsOptions)
app.use(cors())

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.post('/generalQuery', db.generalQuery)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
