import React, { useEffect, useState } from 'react'
import { Container, Spinner } from 'react-bootstrap'
import useSound from 'use-sound'
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import { useQuery } from 'react-query'
import OrderCard from '../components/order/OrderCard'
import api from '../services/API'

const OrderIncoming = () => {
  const AuthUser = useAuthUser()

  const idTokenQuery = useQuery(['idToken'], () => AuthUser.getIdToken(), {
    enabled: !!AuthUser.id,
  })
  const { data: orders, isLoading, isError, isIdle, error } = useQuery(
    ['ordersQuery', 'open'],
    () => api.getOrders('open', idTokenQuery.data),
    {
      retry: 1,
      enabled: idTokenQuery.data !== undefined,
    }
  )

  const { data } = api.untouchedOrdersQuery()
  const [playIncoming] = useSound('/sounds/alert.mp3', { volume: 0.25 })
  useEffect(() => {
    console.log('data has change')
    if (data && data.count > 0) {
      playIncoming()
    }
  }, [data])

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
            <div className='mb-4'>New Orders</div>
            {orders.length > 0 ? (
              orders.map((order) => <OrderCard key={order._id} order={order} idTokenQuery={idTokenQuery}/>)
            ) : (
              <h1>No new order.</h1>
            )}
          </>
        )}
      </Container>
    </section>
  )
}
export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: '/login-page/',
})(OrderIncoming)
