import React, { useState } from 'react'
import { Badge, Button, Card, Row, Col } from 'react-bootstrap'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import moment from 'moment'
import OrderModal from '../modal/OrderModal'
import api from '../../services/API'

const OrderCard = ({ order = null, showStatus = false, idTokenQuery }) => {
  const queryClient = useQueryClient()
  const [showOrder, setShowOrder] = useState(false)
  const hideOrder = () => {
    setShowOrder(false)
  }

  const { mutate: showOrderModal } = useMutation(
    () => api.touchOrder(order._id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ordersQuery', 'open'])
        queryClient.invalidateQueries('getUntouchedCount')
        setShowOrder(true)
      },
    }
  )

  return (
    <>
      {showOrder && (
        <OrderModal
          show={showOrder}
          onHide={hideOrder}
          order={order}
          idTokenQuery={idTokenQuery}
        />
      )}

      <Card
        style={{
          width: '70rem',
          backgroundColor: order.option === 'delivery' ? '#fe6b40' : '#6f9c3d',
        }}
        className='p-4 m-4 order-card'
        onClick={() => showOrderModal()}>
        <Card.Body>
          {idTokenQuery.data ? (
            <Row>
              <Col>
                <h2 className='py-2 order-card'>{order && order.pickupName}</h2>
                <h3 className='order-card'>#{order.orderNumber}</h3>
              </Col>
              <Col className='text-right '>
                {!order.touched && <div className='touch-dot'></div>}
                {showStatus ? (
                  <h3 className='order-card'>{order.status}</h3>
                ) : order.option === 'delivery' ? (
                  <h3 className='order-card'>
                    Delivery Time: &nbsp;
                    {order.deliveryTime &&
                      moment(order.deliveryTime).format('hh:mm a')}{' '}
                    {order.delayMins === '60'
                      ? `(+1 hour)`
                      : order.delayMins
                      ? `(+${order.delayMins} mins)`
                      : ''}
                  </h3>
                ) : (
                  <h3 className='order-card'>
                    Pickup Time: {order.pickupTime}{' '}
                    {order.delayMins === '60'
                      ? `(+1 hour)`
                      : order.delayMins
                      ? `(+${order.delayMins} mins)`
                      : ''}
                  </h3>
                )}
              </Col>
            </Row>
          ) : (
            <>Loading ...</>
          )}
        </Card.Body>
      </Card>
    </>
  )
}

export default OrderCard
