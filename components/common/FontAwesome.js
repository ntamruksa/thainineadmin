import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlus,
  faMinus,
  faChevronCircleRight,
  faShoppingBasket,
  faUser,
  faMapMarker,
  faInfoCircle,
  faCreditCard,
  faMoneyBill,
  faTrash,
  faCartPlus,
  faArrowAltCircleDown,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons'
import { faFacebookSquare, faInstagramSquare } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'

// add icon so it can be call anywhere
library.add(
  faPlus,
  faMinus,
  faChevronCircleRight,
  faCartPlus,
  faUser,
  faMapMarker,
  faInfoCircle,
  faCreditCard,
  faMoneyBill,
  faFacebookSquare,
  faInstagramSquare,
  faTrash,
  faShoppingBasket,
  faArrowAltCircleDown,
  faArrowDown
)

export default Icon
