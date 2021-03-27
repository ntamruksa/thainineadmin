import React, { useState } from 'react'
import { Form, Modal, Row, Col, Spinner } from 'react-bootstrap'
import {
  useQuery,
  useQueryClient,
  useMutation
} from 'react-query'
import api from '../../services/API'

const DelayOrderModal = ({ show, onHide, order, idTokenQuery }) => {
  const [delayMins, setDelayMins] = useState(null)
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const {mutate: delayOrder} =  useMutation(() => api.delayOrder(order._id, delayMins, idTokenQuery.data), {
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ordersQuery', 'open'])
      onHide()
      setLoading(false)
    }
  })

  return (
    <Modal
      show={show}
      onHide={onHide}
      size='lg'
      centered
      className='full-height-modal'>
      <Modal.Header closeButton={true}>Delay Order</Modal.Header>
      <Modal.Body>
        <Form>
          <h1 className='text-gray mb-0 px-4 menu-modal-subtitle u-margin-bottom-small'>
            How much additional time do you need?
          </h1>
          <div className='order-details p-4'>
            <Row className='u-margin-bottom-small'>
              <Col>
                <button
                  className={`${
                    delayMins === 5 ? 'theme-btn' : 'invert-theme-btn'
                  } border full-width-btn mb-0 p-4`}
                  disabled={delayMins === 5}
                  onClick={() => setDelayMins(5)}>
                  5 min(s)
                </button>
              </Col>
              <Col>
                <button
                  className={`${
                    delayMins === 10 ? 'theme-btn' : 'invert-theme-btn'
                  } border full-width-btn mb-0 p-4`}
                  disabled={delayMins === 10}
                  onClick={() => setDelayMins(10)}>
                  10 min(s)
                </button>
              </Col>
            </Row>
            <Row className='u-margin-bottom-small'>
              <Col>
                <button
                  className={`${
                    delayMins === 15 ? 'theme-btn' : 'invert-theme-btn'
                  } border full-width-btn mb-0 p-4`}
                  disabled={delayMins === 15}
                  onClick={() => setDelayMins(15)}>
                  15 min(s)
                </button>
              </Col>
              <Col>
                <button
                  className={`${
                    delayMins === 20 ? 'theme-btn' : 'invert-theme-btn'
                  } border full-width-btn mb-0 p-4`}
                  disabled={delayMins === 20}
                  onClick={() => setDelayMins(20)}>
                  20 min(s)
                </button>
              </Col>
            </Row>
            <Row className='u-margin-bottom-small'>
              <Col>
                <button
                  className={`${
                    delayMins === 30 ? 'theme-btn' : 'invert-theme-btn'
                  } border full-width-btn mb-0 p-4`}
                  disabled={delayMins === 30}
                  onClick={() => setDelayMins(30)}>
                  30 min(s)
                </button>
              </Col>
              <Col>
                <button
                  className={`${
                    delayMins === 40 ? 'theme-btn' : 'invert-theme-btn'
                  } border full-width-btn mb-0 p-4`}
                  disabled={delayMins === 40}
                  onClick={() => setDelayMins(40)}>
                  40 min(s)
                </button>
              </Col>
            </Row>
            <Row className='u-margin-bottom-small'>
              <Col>
                <button
                  className={`${
                    delayMins === 45 ? 'theme-btn' : 'invert-theme-btn'
                  } border full-width-btn mb-0 p-4`}
                  disabled={delayMins === 45}
                  onClick={() => setDelayMins(45)}>
                  45 min(s)
                </button>
              </Col>
              <Col>
                <button
                  className={`${
                    delayMins === 60 ? 'theme-btn' : 'invert-theme-btn'
                  } border full-width-btn mb-0 p-4`}
                  disabled={delayMins === 60}
                  onClick={() => setDelayMins(60)}>
                  1 Hour
                </button>
              </Col>
            </Row>
            {/* <div className='modal-buffer'></div> */}
            <footer>
              <Row>
                <Col>
                  <button
                    className='theme-btn full-width-btn mb-0 p-4'
                    onClick={(e) => onHide()}>
                    Cancel
                  </button>
                </Col>
                <Col>
                  <button
                    className='theme-btn full-width-btn mb-0 p-4'
                    disabled={!delayMins || loading || !idTokenQuery.data}
                    onClick={() => delayOrder()}>
                    {loading && (
                      <><Spinner
                        as='span'
                        animation='border'
                        aria-hidden='true'
                      /><>&nbsp;&nbsp;</></>
                    )}
                    Confirm{loading ? 'ing' : ''}
                  </button>
                </Col>
              </Row>
            </footer>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default DelayOrderModal
