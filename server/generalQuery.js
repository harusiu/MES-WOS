const Pool = require('pg').Pool

const pool = new Pool({
  user: '46d1a69b-6cd1-4b94-b009-537e2d575bba',
  host: '42.159.86.191',
  database: 'ecd73592-abcd-4a8e-a7c9-26e1d5bab72c',
  password: '',
  port: 5432,
})

const generalQuery = (request, response) => {
  const sql = request.body.data.sql;
  pool.query(sql, (error, results) => {
    if (error) {
      //throw error
      console.log(error)
      response.status(400).json([])
    }
    else
      response.status(200).json(results.rows)
  })
}

module.exports = {
  generalQuery,
}
