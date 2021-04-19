import React, { useState, useEffect } from 'react'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { Form, Modal, Row, Col, Spinner } from 'react-bootstrap'
import OrderItem from '../order/OrderItem'
import formatMoney from '../../services/formatMoney'
import api from '../../services/API'
import DelayOrderModal from './DelayOrderModal'
import PriceAdjustModal from './PriceAdjustModal'
import ConfirmMessageModal from './ConfirmMessageModal'
import moment from 'moment'

const OrderModal = ({ show, onHide, order, idTokenQuery }) => {
  const [showDelay, setShowDelay] = useState(false)
  const [showAdjustPrice, setShowAdjustPrice] = useState(false)
  const [adjustItem, setAdjustItem] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const queryClient = useQueryClient()
  const handleClose = (e) => {
    // e.preventDefault()
    setConfirmCancel(false)
  }
  const handleShow = (e) => {
    e.preventDefault()
    setConfirmCancel(true)
  }

  useEffect(() => {
    if (order.adjustInCents) {
      const item = {
        quantity: 1,
        item: {
          title: order.adjustNote,
        },
        totalPrice: order.adjustInCents,
      }
      setAdjustItem(item)
    }
  }, [order])

  const hideDelay = () => {
    setShowDelay(false)
  }

  const hideAdjustPrice = () => {
    setShowAdjustPrice(false)
  }

  const { mutate: cancelOrder } = useMutation(
    (id) => api.cancelOrder(id, idTokenQuery.data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ordersQuery', 'open'])
        onHide()
      },
    }
  )

  const { mutate: confirmOrder } = useMutation(
    (id) => api.confirmOrder(id, idTokenQuery.data),
    {
      onMutate: () => {
        setLoading(true)
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['ordersQuery', 'open'])
        onHide()
        setLoading(false)
      },
    }
  )

  const { mutate: readyOrder } = useMutation(
    (id) => api.readyOrder(id, idTokenQuery.data),
    {
      onMutate: () => {
        setLoading(true)
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['ordersQuery', 'preparing'])
        onHide()
        setLoading(false)
      },
    }
  )

  const { mutate: pickupOrder } = useMutation(
    (id) => api.pickupOrder(id, idTokenQuery.data),
    {
      onMutate: () => {
        setLoading(true)
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['ordersQuery', 'ready'])
        onHide()
        setLoading(false)
      },
    }
  )

  return (
    <>
      <ConfirmMessageModal
        message={'Are you sure to cancel the order?'}
        show={confirmCancel}
        onHide={handleClose}
        confirm={() => cancelOrder(order._id)}
      />
      {showDelay && (
        <DelayOrderModal
          show={showDelay}
          onHide={hideDelay}
          order={order}
          idTokenQuery={idTokenQuery}
        />
      )}
      {showAdjustPrice && (
        <PriceAdjustModal
          show={showAdjustPrice}
          onHide={hideAdjustPrice}
          order={order}
          idTokenQuery={idTokenQuery}
        />
      )}
      <Modal show={show} onHide={onHide} size='lg' centered>
        <Modal.Header closeButton={true}></Modal.Header>
        <Modal.Body>
          <Form>
            <h1 className='text-capitalize p-4 menu-modal-title'>
              {order.pickupName}
            </h1>
            {order.option === 'pickup' && (
              <h2 className='text-gray mb-0 px-4 menu-modal-subtitle'>
                Pickup Time: {order.pickupTime}{' '}
                {order.delayMins === '60'
                  ? '(+ Delay 1 hour)'
                  : order.delayMins
                  ? `(+ Delay ${order.delayMins} mins)`
                  : ''}
              </h2>
            )}
            {order.option === 'delivery' && (
              <h2 className='text-gray mb-4 px-4 menu-modal-subtitle'>
                Delivery Time: {moment(order.deliveryTime).format('hh:mm a')}{' '}
                {order.delayMins === '60'
                  ? '(+ Delay 1 hour)'
                  : order.delayMins
                  ? `(+ Delay ${order.delayMins} mins)`
                  : ''}
              </h2>
            )}
            {order.option === 'delivery' && (
              <h2 className='text-gray mb-0 px-4 menu-modal-subtitle'>
                Delivery Address: {order.address}
              </h2>
            )}
            <p className='text-gray mb-0 mt-2 px-4 menu-modal-subtitle u-margin-bottom-small'>
              Contact Number: {order.phone}, Email: {order.email}
            </p>
            <p className='text-gray mb-0 px-4 menu-modal-subtitle u-margin-bottom-small'>
              Placed On:{' '}
              {moment(order.createdDate).format('ddd DD-MMM-YYYY HH:mm')}
            </p>
            <div className='order-details p-4'>
              <h2 className='px-4'>Orders</h2>
              <ul>
                {order &&
                  order.items.map((item, idx) => (
                    <OrderItem key={idx} item={item} />
                  ))}
                {order && !!order.discountInCents && (
                  <OrderItem
                    item={{
                      quantity: 1,
                      totalPrice: order.discountInCents,
                      item: { image: '', title: 'Cash Discount 10%' },
                    }}
                  />
                )}
                {order.option === 'delivery' && (
                  <OrderItem
                    item={{
                      quantity: 1,
                      totalPrice: order.deliveryFeeInCents,
                      item: { image: '', title: 'Delivery Fee' },
                    }}
                  />
                )}
                {adjustItem && <OrderItem item={adjustItem} />}
              </ul>
              <footer>
                <h2 className='text-right u-margin-bottom-med'>
                  TOTAL {order && formatMoney(order.totalInCents)}
                </h2>
                {order.status === 'open' && (
                  <>
                    <Row className='u-margin-bottom-small'>
                      <Col>
                        {' '}
                        <button
                          className='invert-theme-btn border full-width-btn mb-0 p-4'
                          disabled={loading || !idTokenQuery.data}
                          onClick={(e) => {
                            e.preventDefault()
                            setShowAdjustPrice(true)
                          }}>
                          Price adjustment
                        </button>
                      </Col>
                      <Col>
                        <button
                          className='invert-theme-btn border full-width-btn mb-0 p-4'
                          disabled={loading || !idTokenQuery.data}
                          onClick={(e) => {
                            e.preventDefault()
                            setShowDelay(true)
                          }}>
                          Delay order
                        </button>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <button
                          className='theme-btn full-width-btn mb-0 p-4'
                          disabled={loading || !idTokenQuery.data}
                          onClick={handleShow}>
                          Cancel
                        </button>
                      </Col>
                      <Col>
                        <button
                          className='theme-btn full-width-btn mb-0 p-4'
                          disabled={loading || !idTokenQuery.data}
                          onClick={() => confirmOrder(order._id)}>
                          {loading && (
                            <>
                              <Spinner
                                as='span'
                                animation='border'
                                aria-hidden='true'
                              />
                              <>&nbsp;&nbsp;</>
                            </>
                          )}
                          Confirm{loading ? 'ing' : ''}
                        </button>
                      </Col>
                    </Row>
                  </>
                )}
                {order.status === 'preparing' && (
                  <Row>
                    <Col></Col>
                    <Col>
                      <button
                        className='theme-btn full-width-btn mb-0 p-4'
                        disabled={loading || !idTokenQuery.data}
                        onClick={() => readyOrder(order._id)}>
                        {loading && (
                          <>
                            <Spinner
                              as='span'
                              animation='border'
                              aria-hidden='true'
                            />
                            <>&nbsp;&nbsp;</>
                          </>
                        )}
                        {`Ready for ${order.option}`}
                      </button>
                    </Col>
                  </Row>
                )}
                {order.status === 'ready' && (
                  <Row>
                    <Col></Col>
                    <Col>
                      <button
                        className='theme-btn full-width-btn mb-0 p-4'
                        disabled={loading || !idTokenQuery.data}
                        onClick={() => pickupOrder(order._id)}>
                        {loading && (
                          <>
                            <Spinner
                              as='span'
                              animation='border'
                              aria-hidden='true'
                            />
                            <>&nbsp;&nbsp;</>
                          </>
                        )}
                        {`${
                          order.option === 'delivery'
                            ? 'delivered'
                            : 'picked up'
                        }`}
                      </button>
                    </Col>
                  </Row>
                )}
              </footer>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default OrderModal
