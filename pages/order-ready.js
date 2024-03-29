import React from 'react'
import { Container, Spinner } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth'
import OrderCard from '../components/order/OrderCard'
import api from '../services/API'

const OrderReady = ({}) => {
  const AuthUser = useAuthUser()

  const idTokenQuery = useQuery(['idToken'], () => AuthUser.getIdToken(), {
    enabled: !!AuthUser.id,
    cacheTime: 5 * 60 * 1000,
  })
  const { data: orders, isLoading, isError, isIdle, error } = useQuery(
    ['ordersQuery', 'ready'],
    () => api.getOrders('ready', idTokenQuery.data),
    {
      retry: 10,
      enabled: idTokenQuery.data !== undefined,
    }
  )

  return (
    <section className='section section-main'>
      <Container>
        {isIdle || isLoading ? (
          <>
            <Spinner animation='border' variant='primary' className='mr-2' />{' '}
            Loading ...
          </>
        ) : isError ? (
          <div>{error.message}</div>
        ) : (
          <>
            <h1 className='notification'>
              ** CUSTOMER GET A FREE RICE FOR EVERY $35 SPENT **
            </h1>

            <div className='mb-4'>Ready for Pick Up / Delivery</div>
            {orders.length > 0 ? (
              orders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  idTokenQuery={idTokenQuery}
                />
              ))
            ) : (
              <h1>No order ready for Pickup / Delivery.</h1>
            )}
          </>
        )}
      </Container>
    </section>
  )
}

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: '/login-page/',
})(OrderReady)
