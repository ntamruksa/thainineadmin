const { connectToDatabaseUsingCache } = require('../../services/db')

let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const onlineShop = await db.collection('tech_configs').findOne({key: 'onlineShop'})
  res.status(200).json(onlineShop)
}
