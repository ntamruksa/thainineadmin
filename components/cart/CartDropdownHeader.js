import React from 'react'
import Link from 'next/link'
import PropTypes from 'prop-types'

const CartDropdownHeader = (props) => (
  <div className={props.className}>
    {props.image ? <img alt="" src={props.image} className={props.imageClass} /> : ''}
    <h6 className="mb-0">{props.title}</h6>
    {props.subTitle ? <p className="text-secondary mb-0">{props.subTitle}</p> : ''}
    {props.linkUrl ? (
      <small>
        <Link className="text-primary font-weight-bold" to={props.linkUrl}>
          {props.linkText}
        </Link>
      </small>
    ) : (
      ''
    )}
  </div>
)

CartDropdownHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  className: PropTypes.string,
  image: PropTypes.string,
  imageClass: PropTypes.string,
  imageAlt: PropTypes.string,
  badgeClass: PropTypes.string,
  badgeValue: PropTypes.number,
  linkUrl: PropTypes.string,
  linkText: PropTypes.string
}

CartDropdownHeader.defaultProps = {
  subTitle: '',
  className: '',
  imageAlt: '',
  image: '',
  imageClass: '',
  badgeClass: '',
  badgeValue: 0,
  linkUrl: '',
  linkText: ''
}

export default CartDropdownHeader
