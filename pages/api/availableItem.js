import { ObjectId } from 'mongodb'

const { connectToDatabaseUsingCache } = require('../../services/db')

let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const {
    query: { itemId , available, reset },
  } = req
  // if request come with reset flag === true, add itemId to list of menu to get reset over the night
  console.log('request', itemId , available, reset)
  if (reset === 'true') {
    await db.collection('reset_menuitems').insertOne({ itemId })
  }
  const result = await db.collection('menuitems').updateOne({_id: ObjectId(itemId)}, {$set: {available: available === 'true'}})
  res.status(200).json(result)
}