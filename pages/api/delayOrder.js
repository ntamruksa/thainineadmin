import { ObjectId } from 'mongodb'
import { isUserAdmin } from './utils/authHelper'

// const sgMail = require('@sendgrid/mail')

// sgMail.setApiKey(process.env.NEXT_SENDGRID_API_KEY)
// const SENDGRID_SENDER = process.env.NEXT_SENDGRID_SENDER

const {
  connectToDatabaseUsingCache,
  addUpdateMeta,
  findNotDeleted,
} = require('../../services/db')

let db = null

export default async (req, res) => {
  db = await connectToDatabaseUsingCache(process.env.NEXT_MONGODB_URI, db)
  const { authorization } = req.headers
  const isAdmin = await isUserAdmin(authorization, db)
  if (isAdmin) {
    const {
      query: { orderId = '', delayMins },
    } = req
    // 1. update delayMins field in order
    const result = await db
      .collection('orders')
      .updateOne(
        { _id: ObjectId(orderId) },
        { $set: addUpdateMeta({ delayMins }) }
      )
    // 2. send email to customer about delay
    // const order = await db
    //   .collection('orders')
    //   .findOne({ _id: ObjectId(orderId) })
    // let { emailDelayTemplate, emailDelaySubject } = await db
    //   .collection('tech_configs')
    //   .findOne(findNotDeleted({}))
    //   emailDelayTemplate = emailDelayTemplate
    //   .replace('{pickupName}', order.pickupName)
    //   .replace('{orderNumber}', `#${order.orderNumber}`)
    //   .replace('{delayMins}', order.delayMins)
    //   .replace('{link}', `<a href=${order.successUrl}>here</a>`)
    // const msg = {
    //   to: order.email,
    //   from: SENDGRID_SENDER,
    //   subject: emailDelaySubject || '',
    //   text: emailDelayTemplate || '',
    //   html: emailDelayTemplate || ''
    // }
    // try {
    //   await sgMail.send(msg)
    //   console.log(`Delay email send to ${order.email}`)
    // } catch (error) {
    //   console.error(error)
    //   if (error.response) {
    //     console.error(error.response.body)
    //   }
    // }
    res.status(200).json(result)
  } else {
    res.status(401).json({ status: 'unauthorized' })
  }
}
