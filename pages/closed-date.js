import React, { useEffect, useState } from 'react'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import { DateUtils } from 'react-day-picker'
import { Col, Container, Row, Spinner, Form, Button } from 'react-bootstrap'
import dateFnsFormat from 'date-fns/format'
import dateFnsParse from 'date-fns/parse'
import moment from 'moment'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth'
import ClosedDate from '../components/common/ClosedDate'

import api from '../services/API'

function parseDate(str, format, locale) {
  const parsed = dateFnsParse(str, format, new Date(), { locale })
  if (DateUtils.isDate(parsed)) {
    return parsed
  }
  return undefined
}

function formatDate(date, format, locale) {
  return dateFnsFormat(date, format, { locale })
}

const Dates = () => {
  const queryClient = useQueryClient()
  const AuthUser = useAuthUser()
  const idTokenQuery = useQuery(['idToken'], () => AuthUser.getIdToken(), {
    enabled: !!AuthUser.id,
  })

  const { data: dates, isLoading, isError, isIdle, error } = useQuery(
    ['dateConfigs'],
    () => api.getDateConfigs(idTokenQuery.data),
    {
      retry: 1,
      enabled: !!idTokenQuery.data,
    }
  )
  const [date, setDate] = useState(moment().format('DD-MM-yyyy'))
  const [isButtonLoading, setButtonLoading] = useState(false)
  const FORMAT = 'dd-MM-yyyy'
  const { mutate: addDate } = useMutation(() => api.addDate(date), {
    onMutate: () => {
      setButtonLoading(true)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('dateConfigs')
      setButtonLoading(false)
    },
    onError: () => {
      setButtonLoading(false)
    },
  })
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
            <Form.Group
              controlId='formDate'
              className='u-margin-bottom-med text-center'>
              <DayPickerInput
                formatDate={formatDate}
                onDayChange={setDate}
                format={FORMAT}
                parseDate={parseDate}
                placeholder={''}
              />
              <Button
                variant='outline-success'
                className='btn-medium text-uppercase ml-2'
                disabled={isButtonLoading}
                onClick={() => addDate()}>
                {isButtonLoading && (
                  <Spinner
                    as='span'
                    animation='border'
                    size='sm'
                    role='status'
                    aria-hidden='true'
                  />
                )}{' '}
                <span>Add{isButtonLoading ? 'ing' : ''}</span>
              </Button>
            </Form.Group>

            <Row>
              <Col md={12}>
                <div className='bg-white rounded border shadow-sm mb-4'>
                  {dates &&
                    dates.map((date) => (
                      <ClosedDate key={date._id} date={date} idTokenQuery={idTokenQuery}/>
                    ))}
                </div>
              </Col>
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
})(Dates)
