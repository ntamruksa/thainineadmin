import { ObjectId } from 'mongodb'

const { connectToDatabaseUsingCache } = require('../../services/db')

let db = null
// this api don't need auth
export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const {
    query: { menuItemId = '' }
  } = req
  const menuitem = await db.collection('menuitems').findOne({_id: ObjectId(menuItemId)})
  res.status(200).json(menuitem)
}
