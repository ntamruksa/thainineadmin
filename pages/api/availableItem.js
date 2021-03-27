import { ObjectId } from 'mongodb'

const { connectToDatabaseUsingCache } = require('../../services/db')

let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const {
    query: { itemId , available },
  } = req
  const result = await db.collection('menuitems').updateOne({_id: ObjectId(itemId)}, {$set: {available: available === 'true'}})
  res.status(200).json(result)
}