import { ObjectId } from 'mongodb'

const { connectToDatabaseUsingCache, setDeleted } = require('../../services/db')

let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const {
    query: { dateId },
  } = req
  const result = await db.collection('closed_date_config').updateOne({_id: ObjectId(dateId)}, setDeleted)
  res.status(200).json(result)
}