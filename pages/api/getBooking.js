import { ObjectId } from 'mongodb'

const { connectToDatabaseUsingCache } = require('../../services/db')

let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const {
    query: { bookingId = '' }
  } = req
  const booking = await db.collection('reservation').findOne({_id: ObjectId(bookingId)})
  res.status(200).json(booking)
}
