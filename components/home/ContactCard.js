import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { Figure } from 'react-bootstrap'

const ContactCard = (props) => {
  return (
    <div className={props.boxClass}>
      <div className='heading-tertiary pt-4'>{props.title}</div>
    </div>
  )
}

ContactCard.propTypes = {
  linkUrl: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  imageClass: PropTypes.string,
  imageAlt: PropTypes.string,
  boxClass: PropTypes.string,
  title: PropTypes.string,
  counting: PropTypes.string
}
ContactCard.defaultProps = {
  imageAlt: '',
  image: '',
  imageClass: '',
  linkUrl: '',
  boxClass: 'contact-card',
  title: '',
  counting: ''
}

export default ContactCard
