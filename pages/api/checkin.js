const { connectToDatabaseUsingCache } = require('../../services/db')

let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const checkin = req.body.checkin
  checkin.createdDate = new Date()
  await db.collection('covid_checkin').insertOne(checkin)
  res.status(200).json(checkin)
}
