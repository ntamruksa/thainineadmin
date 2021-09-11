import { ObjectId } from 'mongodb'
import { isUserAdmin } from './utils/authHelper'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.NEXT_SENDGRID_API_KEY)
const SENDGRID_SENDER = process.env.NEXT_SENDGRID_SENDER
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
      query: { orderId = '' },
    } = req
    const order = await db
      .collection('orders')
      .findOne({ _id: ObjectId(orderId) })

    try {
      // 1. update order status to preparing
      await db
        .collection('orders')
        .updateOne(
          { _id: ObjectId(orderId) },
          {
            $set: addUpdateMeta({
              status: 'preparing',
              paymentId: order.paymentMethodId,
              paymentStatus: 'cash',
              paymentMethodId: 'cash',
              paymentAmountInCents: order.totalInCents,
            }),
          }
        )
      // 2. send email to customer to confirm the order
      let { emailTemplate, emailSubject } = await db
        .collection('tech_configs')
        .findOne(findNotDeleted({}))
      emailTemplate = emailTemplate
        .replace('{pickupName}', order.pickupName)
        .replace('{orderNumber}', `#${order.orderNumber}`)
        .replace('{link}', `<a href=${order.successUrl}>here</a>`)
      const msg = {
        to: order.email,
        from: SENDGRID_SENDER,
        subject: emailSubject || '',
        text: emailTemplate || '',
        html: emailTemplate || '',
      }
      await sgMail.send(msg)
      console.log(`Confirm email send to ${order.email}`)
    } catch (e) {
      // Display error on client
      console.error(e.message)
      res.status(400).json({ staus: 'confirm order error', error: e.message })
    }
  } else {
    res.status(401).json({ status: 'unauthorized' })
  }
}
