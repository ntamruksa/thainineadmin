const { connectToDatabaseUsingCache } = require('../../services/db')

let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const {
    query: { date = '' }
  } = req
  const bookingSetup = await db.collection('reservation_setup').findOne({date})
  res.status(200).json(bookingSetup)
}
