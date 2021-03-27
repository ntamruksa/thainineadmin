import { withRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Form,
  Button,
  Container,
  FormControl,
  ToggleButtonGroup,
  ToggleButton
} from 'react-bootstrap'
import api from '../services/API'

// import styles from '../styles/Home.module.css'

const UpdateMenuitem = withRouter(
  ({
    router: {
      query: { menuItemId }
    }
  }) => {
    const [title, setTitle] = useState('')
    const [image, setImage] = useState('')
    const [largeImage, setLargeImage] = useState('')
    const [menuItem, setMenuItem] = useState({})
    useEffect(() => {
      async function fetchData() {
        const response = await api.getMenuItem(menuItemId)
        setTitle(response.title)
        setImage(response.image)
        // setLargeImage(response.largeImage)
        setMenuItem(response)
      }
      fetchData()
    }, [])

    const handleChange = (e) => {
      const value = e.target.value
      if (e.target.id === 'title') {
        console.log('set title', value)
        setTitle(value)
      }
    }

    const uploadFile = async (e) => {
      console.log(e)
      const files = e.target.files
      const data = new FormData()
      data.append('file', files[0])
      data.append('upload_preset', 'baiyok')

      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dua4rx5cz/image/upload',
        { method: 'POST', body: data }
      ).catch(
        (err) => {
          console.error(err)
        }
      )
      const file = await res.json();
      console.log('file', file)
      setImage(file.secure_url)
      // setLargeImage(file.eager[0].secure_url)
    }
    // const router = useRouter()
    const handleSubmitForm = (e) => {
      e.preventDefault()
      // setIsValid(false)
      // setIsLoading(true)
      const item = {
        _id: menuItem._id,
        title,
        image
      }

      api
        .updateMenuItem(item)
        .then((res) => {
          // setIsValid(true)
          // setIsLoading(false)
        })
        .catch((err) => {
          console.error(err)
          // setErrorMessage(err.message)
          // setIsLoading(false)
          // setIsValid(true)
        })
    }

    return (
      <Container>
        <Form onSubmit={(e) => handleSubmitForm(e)} className='p-4'>
          <Form.Group controlId='title' className='u-margin-bottom-med'>
            <Form.Label>Title</Form.Label>
            <Form.Control
              className='paragraph-secondary'
              type='text'
              defaultValue={menuItem.title}
              onChange={handleChange}
              value={title}
              required
            />
          </Form.Group>
          <Form.Group controlId='image' className='u-margin-bottom-med'>
            <Form.Label>Image</Form.Label>
            <Form.Control
              className='paragraph-secondary'
              type='file'
              defaultValue={menuItem.image}
              onChange={uploadFile}
              required
            />
          </Form.Group>
          {image && <img src={image} alt='Upload Preview'/>}
          <Button
            className='btn-lg'
            variant='outline-secondary'
            onClick={handleSubmitForm}>
            Submit
          </Button>
        </Form>
      </Container>
    )
  }
)

export default UpdateMenuitem
