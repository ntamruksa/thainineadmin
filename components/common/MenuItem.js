import React, { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { Badge, Button, Media, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
// import { useRouter } from 'next/router'
import api from '../../services/API'

const MenuItem = ({ item = null, idTokenQuery }) => {

  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const { mutate: switchItem } = useMutation(
    (available) => api.switchItem(item._id, available, idTokenQuery.data),
    {
      onMutate: () => {
        setLoading(true)
      },
      onSuccess: () => {
        queryClient.invalidateQueries('menuitems')
        setLoading(false)
      },
      onError: () => {
        setLoading(false)
      }
    }
  )

  return (
    <>
      <div className='p-3 border-bottom gold-members'>
        {/* todo don't use float-right... use flex insteead */}
        <span className='float-right'>
          {loading ? (
            <Spinner animation='border' variant='primary' className='mr-2' />
          ) : item.available ? (
            <Button
              className='btn-medium ml-2'
              variant='outline-success'
              disabled={!idTokenQuery.data}
              onClick={() => switchItem(false)}>
              ${(item.priceInCents / 100).toFixed(2)}
            </Button>
          ) : (
            <Button
              variant='outline-danger'
              className='btn-medium text-uppercase ml-2'
              disabled={!idTokenQuery.data}
              onClick={() => switchItem(true)}>
              Sold Out
            </Button>
          )}
        </span>
        <Media>
          <Media.Body>
            <h4 className='mb-2 text-capitalize'>
              <strong>{item.title}</strong>
              {item.badge && (
                <Badge variant='danger' className='ml-2 text-capitalize'>
                  {item.badge}
                </Badge>
              )}
            </h4>
            <p className='text-gray mb-0'>
              {item.subtitle &&
                (item.subtitle.charAt(item.subtitle.length - 1) === '.'
                  ? item.subtitle.substring(0, item.subtitle.length - 1)
                  : item.subtitle)}
            </p>
          </Media.Body>
        </Media>
      </div>
    </>
  )
}

MenuItem.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  imageAlt: PropTypes.string,
  image: PropTypes.string,
  imageClass: PropTypes.string,
  qty: PropTypes.number,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  getValue: PropTypes.func,
  available: PropTypes.bool,
}
MenuItem.defaultProps = {
  imageAlt: '',
  imageClass: '',
  showBadge: false,
  price: '',
  priceUnit: '$',
  showPromoted: false,
  badgeVariant: 'danger',
  available: true,
}

export default MenuItem