import { ObjectId } from 'mongodb'

const { connectToDatabaseUsingCache } = require('../../services/db')

let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  let itemsToReset = await db.collection('reset_menuitems').find({}).toArray()
  itemsToReset = itemsToReset.map( item => ObjectId(item.itemId))
  console.log('itemsToReset', itemsToReset)
  await db.collection('menuitems').updateMany({ "_id": { "$in": itemsToReset }}, {$set: {available: true}})
  await db.collection('reset_menuitems').deleteMany()
  res.status(200).json({status: 'success'})
}