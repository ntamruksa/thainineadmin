import { Image, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer className='footer'>
      <Col className='align-items-center d-flex flex-column text-100'>
        <div>
        Bai Yok Modern Thai Cuisine - 2020
        </div>
        <div>
          <a target='_blank' rel='noreferrer' href='/privacy'>
            Privacy Policy
          </a>{' '}
          |{' '}
          <a target='_blank' rel='noreferrer' href='/terms'>
            Terms &amp; Conditions
          </a>
        </div>
      </Col>
    </footer>
  )
}

export default Footer
