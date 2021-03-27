import React, { useState } from 'react'
import { Form, Modal, Row, Col, Spinner } from 'react-bootstrap'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import formatMoney from '../../services/formatMoney'
import api from '../../services/API'
import styled from 'styled-components'
const PriceLineStyles = styled.div`
  padding: 1rem 0;
  /* border-bottom: 1px dashed ${(props) => props.theme.lightgrey}; */
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
  input.adjustNote {
    width: 50rem;
  }
`
const PriceAdjustModal = ({ show, onHide, order, idTokenQuery  }) => {
  const [adjustPrice, setAdjustPrice] = useState(order.adjustInCents / 100)
  const [adjustNote, setAdjustNote] = useState(order.adjustNote)
  const [loading, setLoading] = useState(false)
  const [newTotalCents, setNewTotalCents] = useState(order.totalInCents)
  const queryClient = useQueryClient()

  const { mutate: adjustPriceFunc } = useMutation(
    () =>
      api.adjustPriceOrder(
        order._id,
        adjustPrice * 100,
        order.subTotalInCents,
        adjustNote,
        idTokenQuery.data
      ),
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

  const handleChange = (e) => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    console.log(name, type, val)
    if (name === 'price') {
      if (!isNaN(val)) {
        setAdjustPrice(val)
        setNewTotalCents(order.subTotalInCents + val * 100)
      } else {
        setAdjustPrice(val)
        setNewTotalCents(order.subTotalInCents)
      }
    } else if (name === 'note') {
      setAdjustNote(val)
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size='lg'
      centered
      className='full-height-modal'>
      <Modal.Header closeButton={true}>Price adjustment</Modal.Header>
      <Modal.Body>
        <Form>
          {/* <h1 className='text-gray mb-0 px-4 menu-modal-subtitle u-margin-bottom-small'>
            How much additional time do you need?
          </h1> */}
          <div className='order-details p-4'>
            <PriceLineStyles>
              <h3>Current Total</h3>
              <h3 className='text-right '>
                {formatMoney(order.subTotalInCents)}
              </h3>
            </PriceLineStyles>
            <PriceLineStyles>
              <h3>Adjustment Amount</h3>
              <input
                type='number'
                id='price'
                name='price'
                className='text-right'
                placeholder='0.00'
                step='.01'
                pattern='^\d+(?:\.\d{1,2})?$'
                value={adjustPrice}
                onChange={handleChange}
              />
            </PriceLineStyles>
            <PriceLineStyles>
              <h3>Note</h3>
              <input
                type='text'
                id='note'
                name='note'
                className='adjustNote pl-4'
                placeholder='This will be visible to customer'
                value={adjustNote}
                onChange={handleChange}
              />
            </PriceLineStyles>
            <PriceLineStyles>
              <h3>New Total</h3>
              <h3 className='text-right '>{formatMoney(newTotalCents)}</h3>
            </PriceLineStyles>
            <div className='modal-buffer'></div>
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
                    disabled={!adjustPrice || !adjustNote || loading || !idTokenQuery.data}
                    onClick={() => adjustPriceFunc()}>
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
                    Confirm{loading ? 'ing' : ''}{' '}
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

export default PriceAdjustModal
