const { connectToDatabaseUsingCache, findNotDeleted } = require('../../services/db')

let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const closedDateConfig = await db.collection('closed_date_config').find(findNotDeleted()).toArray()
  res.status(200).json(closedDateConfig)
}
