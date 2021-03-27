import React from 'react'
import {Modal, Button} from 'react-bootstrap'

const ConfirmMessageModal = ({ message, show, onHide, confirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>info</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h2>{message}</h2>
      </Modal.Body>

      <Modal.Footer>
        <Button className='theme-btn' onClick={(e) => confirm(e)}>OK</Button>
        <Button className='invert-theme-btn border' onClick={(e) => onHide(e)}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmMessageModal
