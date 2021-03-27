import { ObjectId } from 'mongodb'

const { connectToDatabaseUsingCache } = require('../../services/db')

let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const { _id, ...itemWithoutId } = req.body.menuItem
  const result = await db.collection('menuitems').updateOne({_id: ObjectId(_id)}, {$set: {...itemWithoutId}})
  res.status(200).json(result)
}