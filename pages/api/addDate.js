const { connectToDatabaseUsingCache } = require('../../services/db')
const moment = require('moment')
let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const date = req.body
  const formatDate = moment(date.date).format('DD-MM-yyyy')
  date.date = formatDate
  date.createdDate = new Date()
  const result = await db.collection('closed_date_config').insertOne(date)
  res.status(200).json(result)
}
