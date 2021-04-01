import React, { useState } from 'react'
import Link from 'next/link'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { Container, Row, Spinner } from 'react-bootstrap'
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth'
import api from '../services/API'

function Setup() {
  const queryClient = useQueryClient()
  const AuthUser = useAuthUser()
  const idTokenQuery = useQuery(['idToken'], () => AuthUser.getIdToken(), {
    enabled: !!AuthUser.id,
  })

  const { data: businessHours, isLoading, isError, isIdle, error } = useQuery(
    ['businessHours'],
    () => api.getBusinessHours(idTokenQuery.data),
    {
      retry: 1,
      enabled: idTokenQuery.data !== undefined,
    }
  )

  const [isUpdating, setIsUpdating] = useState(false)
  const { mutate: closedShop } = useMutation(
    (isClosedShop) => api.setClosedShop(isClosedShop, idTokenQuery.data),
    {
      onMutate: () => {
        setIsUpdating(true)
      },
      onSuccess: () => {
        queryClient.invalidateQueries('businessHours')
        setIsUpdating(false)
      },
      onError: () => {
        setIsUpdating(false)
      },
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
              Shop is now {businessHours?.isTodayClosed ? 'Closed' : 'Open'}
            </h1>
            <Row>
              <div
                className='setup-card m-4'
                onClick={() =>
                  closedShop(businessHours?.isTodayClosed ? false : true)
                }>
                {isUpdating ? (
                  <Spinner
                    animation='border'
                    variant='primary'
                    className='mr-2'
                  />
                ) : businessHours?.isTodayClosed ? (
                  'Open Shop'
                ) : (
                  'Closed Shop'
                )}
              </div>
              <Link href='/closed-date'>
                <div className='setup-card m-4'>Setup Closed Date</div>
              </Link>
              <Link href='/menu'>
                <div className='setup-card m-4'>Setup Menu</div>
              </Link>
            </Row>
          </>
        )}
      </Container>
    </section>
  )
}

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: '/login-page/',
})(Setup)
