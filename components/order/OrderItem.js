import React from 'react'
import formatMoney from '../../services/formatMoney'
import styled from 'styled-components'
const ItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px dashed ${(props) => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;
  img {
    margin-right: 10px;
  }
  h3,
  p {
    margin: 0;
  }
`

const CartItem = ({ item }) => (
  <ItemStyles>
    {/* <div className="item-details p-4"> */}
    <h3 className='text-left p-4'>{`${item.quantity}x`}</h3>
    <div>
      <h3 className='text-left '>{`${item.item.title}`}</h3>
      {item.option && <p className='text-left'>{item.option.title} {item.option.priceInCents > 0 ? `(${formatMoney(item.option.priceInCents)})` : ''}</p>}
      {item.glutenFree && <p className='text-left'>
        Gluten Free ($1.00)
      </p>}
      {item.note && <p className='text-left'>
        Note: {item.note}
      </p>}
    </div>
    <h3 className='text-right '>
      {formatMoney(item.totalPrice * item.quantity)}
    </h3>
    {/* {item.option && <p className='text-left'>{item.option.title} {item.option.priceInCents > 0 ? `(${formatMoney(item.option.priceInCents)})` : ''}</p>}
      {item.glutenFree && <p className='text-left'>
        Gluten Free ($1.00)
      </p>}
      <p className='text-left'>
        {formatMoney(item.totalPrice * item.quantity)}
        {" - "}
        <em>
          {item.quantity} &times; {formatMoney(item.totalPrice)}
        </em>

      </p>
      {item.note && <p className='text-left'>
        Note: {item.note}
      </p>} */}
    {/* </div> */}
  </ItemStyles>
)

export default CartItem
