import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import {
  Col,
  Container,
  Row,
  Spinner,
  Accordion,
  Button,
} from 'react-bootstrap'
import { useAuthUser, withAuthUser, AuthAction } from 'next-firebase-auth'
import MenuItem from '../components/common/MenuItem'
import { CATEGORIES } from '../components/StaticData'

import api from '../services/API'

const Menu = ({}) => {
  const AuthUser = useAuthUser()
  const idTokenQuery = useQuery(['idToken'], () => AuthUser.getIdToken(), {
    enabled: !!AuthUser.id,
  })
  const [showModal, setShowModal] = useState(false)
  const { data: menuitems, isLoading, isError } = api.menuItemQuery()

  // const [menuitems, setMenuitems] = useState([])
  const closeModal = () => {
    setShowModal(false)
  }

  const cancel = () => {
    closeModal()
    navigate('/')
  }

  return (
    <section className='section section-main'>
      <Container>
        {isLoading ? (
          <>
            <Spinner animation='border' variant='primary' className='mr-2' />{' '}
            Loading menu...
          </>
        ) : (
          <>
            {CATEGORIES.map(({ title, category }) => (
              <Accordion defaultActiveKey={title}>
                {/* <Card> */}
                <Row key={title}>
                  <Col md={12}>
                    <Accordion.Toggle
                      as={Button}
                      size='block'
                      variant='link'
                      className='text-left d-flex align-items-center p-0'
                      eventKey={title}>
                      <h3 className='my-3 text-capitalize'>
                        <strong>{title}</strong>
                      </h3>
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey={title} show>
                      <div className='bg-white rounded border shadow-sm mb-4'>
                        {menuitems &&
                          menuitems
                            .filter((item) => item.category === category)
                            .map((item) => (
                              <MenuItem
                                key={item._id}
                                item={item}
                                idTokenQuery={idTokenQuery}
                              />
                            ))}
                      </div>
                    </Accordion.Collapse>
                  </Col>
                </Row>
                {/* </Card> */}
              </Accordion>
            ))}
          </>
        )}
      </Container>
    </section>
  )
}

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: '/login-page/',
})(Menu)
