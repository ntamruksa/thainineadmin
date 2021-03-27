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
      query: { orderId = '', adjustInCents, subTotalInCents, adjustNote },
    } = req
    // 1. update adjustInCents, adjustNote, and totalInCents field in order
    console.log(adjustInCents, subTotalInCents, adjustNote)
    const totalInCents = parseInt(adjustInCents) + parseInt(subTotalInCents)
    console.log(adjustInCents, subTotalInCents, totalInCents)

    const result = await db.collection('orders').updateOne(
      { _id: ObjectId(orderId) },
      {
        $set: addUpdateMeta({
          adjustInCents: parseInt(adjustInCents),
          adjustNote,
          totalInCents: parseInt(totalInCents),
        }),
      }
    )
    res.status(200).json(result)
  } else {
    res.status(401).json({ status: 'unauthorized' })
  }
}
