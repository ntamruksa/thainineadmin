const { connectToDatabaseUsingCache } = require('../../services/db')

let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const reservation = req.body.reservation
  reservation.createdDate = new Date()
  const result = await db.collection('reservation').insertOne(reservation)
  res.status(200).json(result)
}
