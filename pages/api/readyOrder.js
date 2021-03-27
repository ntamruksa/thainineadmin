import { ObjectId } from 'mongodb'
import { isUserAdmin } from './utils/authHelper'
import { connectToDatabaseUsingCache, addUpdateMeta } from '../../services/db'

let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const { authorization } = req.headers
  const isAdmin = await isUserAdmin(authorization, db)
  if (isAdmin) {
    const {
      query: { orderId = '' },
    } = req
    console.log('orderId', orderId)
    const result = await db
      .collection('orders')
      .updateOne(
        { _id: ObjectId(orderId) },
        { $set: addUpdateMeta({ status: 'ready' }) }
      )
    res.status(200).json(result)
  } else {
    res.status(401).json({ status: 'unauthorized' })
  }
}
