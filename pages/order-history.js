import React from 'react'
import { Container, Spinner } from 'react-bootstrap'
import { useQuery } from 'react-query'
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth'
import OrderCard from '../components/order/OrderCard'
import api from '../services/API'

const OrderHistory = ({}) => {
  const AuthUser = useAuthUser()
  const idTokenQuery = useQuery(['idToken'], () => AuthUser.getIdToken(), {
    enabled: !!AuthUser.id,
  })
  const { data: orders, isLoading, isError, isIdle, error } = useQuery(
    ['ordersQuery', ''],
    () => api.getOrders('', idTokenQuery.data),
    {
      retry: 1,
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
            <div className='mb-4'>Orders History</div>
            {orders.length > 0 ? (
              orders.map((order) => <OrderCard key={order._id} order={order} idTokenQuery={idTokenQuery}/>)
            ) : (
              <h1>No order today.</h1>
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
})(OrderHistory)
