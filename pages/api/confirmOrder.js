import { ObjectId } from 'mongodb'
import { isUserAdmin } from './utils/authHelper'
import sgMail from '@sendgrid/mail'
import stripe from '../../services/stripe'

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

    // 1. complete the payment using paymentMethodId and totalInCents to create a payment intent with confirm=true
    try {
      let intent
      // if paymentMethodId is 'cash' customer will pay at restaurant
      if (order.paymentMethodId && order.paymentMethodId !== 'cash') {
        // Create the PaymentIntent
        console.log('paymentMethodId', order.paymentMethodId)
        intent = await stripe.paymentIntents.create({
          payment_method: order.paymentMethodId,
          amount: order.totalInCents,
          currency: 'aud',
          // confirmation_method: 'manual',
          confirm: true,
        })
      } else if (order.paymentIntentId) {
        intent = await stripe.paymentIntents.confirm(order.paymentIntentId)
      }
      // 2. update order status to preparing
      await db
        .collection('orders')
        .updateOne(
          { _id: ObjectId(orderId) },
          {
            $set: addUpdateMeta({
              status: 'preparing',
              paymentId: intent ? intent.id : 'cash',
              paymentStatus: intent ? intent.status : 'cash',
              paymentAmountInCents: intent ? intent.amount : order.totalInCents,
            }),
          }
        )
      // 3. send email to customer to confirm the order
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
      // Send the response to the client
      res.send(generateResponse(intent))
    } catch (e) {
      // Display error on client
      console.error(e.message)
      return res.send({ error: e.message })
    }
  } else {
    res.status(401).json({ status: 'unauthorized' })
  }
}

const generateResponse = (intent) => {
  // Note that if your API version is before 2019-02-11, 'requires_action'
  // appears as 'requires_source_action'.
  if (
    intent.status === 'requires_action' &&
    intent.next_action.type === 'use_stripe_sdk'
  ) {
    // Tell the client to handle the action
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret,
    }
  } else if (intent.status === 'succeeded') {
    // The payment didn’t need any additional actions and completed!
    // Handle post-payment fulfillment
    return {
      success: true,
    }
  } else {
    // Invalid status
    return {
      error: 'Invalid PaymentIntent status',
    }
  }
}
