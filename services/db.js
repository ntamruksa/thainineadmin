const MongoClient = require('mongodb').MongoClient
// Create cached connection variable
let cachedDb = null

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
async function connectToDatabase(uri) {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  // Select the database through the connection,
  // using the database path of the connection string
  const db = await client.db(new URL(uri).pathname.substr(1))

  // Cache the database connection and return the connection
  cachedDb = db
  return db
}

async function connectToDatabaseUsingCache(uri, cachedDB) {
  if (cachedDB) {
    return cachedDB
  }
  return connectToDatabase(uri)
}

const findNotDeleted = (data = {}) => {
  Object.assign(data, {
    $or: [{ _deleted: { $exists: false } }, { _deleted: false }]
  })
  return data
}

const findNotDeletedAndNotDisabled = (data = {}) => {
  Object.assign(data, {
    $and: [
      {
        $or: [{ _disabled: { $exists: false } }, { _disabled: false }]
      },
      {
        $or: [{ _deleted: { $exists: false } }, { _deleted: false }]
      }
    ]
  })
  return data
}

const addUpdateMeta = (data = {}) => {
  Object.assign(data, {
    _updatedDate: new Date(),
    _deleted: false
  })
  return data
}

const addInsertMeta = (data = {}) => {
  Object.assign(data, {
    _createdDate: new Date(),
    _flags: { active: true }
  })
  return data
}

const setDeleted = {
  $set: {
    _updatedDate: new Date(),
    _deleted: true
  }
}

const findActive = (data = {}) => {
  Object.assign(data, {
    $and: [
      {
        $or: [{ _flags: { $exists: false } }, { '_flags.active': true }]
      },
      {
        $or: [{ _deleted: { $exists: false } }, { _deleted: false }]
      }
    ]
  })
  return data
}

module.exports = {
  connectToDatabase,
  connectToDatabaseUsingCache,
  findNotDeleted,
  findNotDeletedAndNotDisabled,
  addUpdateMeta,
  addInsertMeta,
  setDeleted,
  findActive
}
