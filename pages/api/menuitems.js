const { connectToDatabaseUsingCache } = require('../../services/db')

let db = null
// this api don't need auth
export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const menuitems = await db.collection('menuitems').find().sort({ categoryOrder: 1, itemOrder: 1 }).toArray()
  if (menuitems.length === 0) res.status(404).json({ error: 'No data found.' })
  else res.status(200).json(menuitems)
}
