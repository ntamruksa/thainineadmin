import React from 'react'
import PropTypes from 'prop-types'
import { removeItemFromCart } from '../../services/cart'
import Icon from '../common/FontAwesome'

const CartDropdownItem = ({ item, title, subtitle1, subtitle2, price, cartUpdate, readOnly = false }) => {
  const removeItem = () => {
    removeItemFromCart(item)
    cartUpdate()
  }
  return (
    <>
      <p className="mb-2 mt-4">
        {title}
        {!readOnly && <span className="float-right text-secondary">{price}</span>}
      </p>
      <p className="mb-2">
        {subtitle1 && <span className="text-warning">Note: {subtitle1}</span>}
        {!readOnly && <Icon icon="trash" className="float-right icon--trash" size='lg' onClick={() => removeItem()} />}
      </p>
      <p className="pb-4 border-bottom">{subtitle2}</p>
    </>
  )
}

CartDropdownItem.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle1: PropTypes.string,
  subtitle2: PropTypes.string,
  price: PropTypes.string.isRequired,
  icoIcon: PropTypes.string,
  iconclass: PropTypes.string,
  item: PropTypes.object
}

CartDropdownItem.defaultProps = {
  title: '',
  price: ''
}

export default CartDropdownItem
