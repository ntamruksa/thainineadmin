import React, { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { Button, Media, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import api from '../../services/API'

const ClosedDate = ({ date = null, idTokenQuery }) => {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()
  const { mutate: deleteDate } = useMutation(
    () => api.deleteDate(date._id, idTokenQuery.data),
    {
      onMutate: () => {
        setLoading(true)
      },
      onSuccess: () => {
        queryClient.invalidateQueries('dateConfigs')
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
          ) : (
            <Button
              variant='outline-danger'
              className='btn-medium text-uppercase ml-2'
              disabled={!idTokenQuery.data}
              onClick={() => deleteDate()}>
              Delete
            </Button>
          )}
        </span>
        <Media>
          <Media.Body>
            <h4 className='mb-2 text-capitalize'>
              <strong>{date.date}</strong>
            </h4>
          </Media.Body>
        </Media>
      </div>
    </>
  )
}

ClosedDate.propTypes = {
  date: PropTypes.string,
}

export default ClosedDate