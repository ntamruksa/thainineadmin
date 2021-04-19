import axios from 'axios'
import { useQuery } from 'react-query'

export const client = axios.create({
  baseURL: '',
  timeout: 30000,
})

// need auth detail

const getHeader = (idToken) => {
  const headers = {
    Authorization: idToken,
  }
  return headers
}
//  ****** no auths needed  *******//
const getMenuItems = () => {
  return client.get(`/api/menuitems`).then((res) => res.data)
}

function menuItemQuery() {
  return useQuery('menuitems', () => getMenuItems())
}

const getMenuItem = (menuItemId) => {
  return client
    .get(`/api/menuitem?menuItemId=${menuItemId}`)
    .then((res) => res.data)
}

const addBooking = (reservation, idToken) => {
  const headers = getHeader(idToken)
  return client
    .post('/api/addBooking', { reservation }, { headers })
    .then((res) => res.data)
}

const getBooking = (bookingId, idToken) => {
  const headers = getHeader(idToken)
  return client
    .get(`/api/getBooking?bookingId=${bookingId}`, { headers })
    .then((res) => res.data)
}

const checkin = (checkin, idToken) => {
  const headers = getHeader(idToken)
  return client
    .post('/api/checkin', { checkin }, { headers })
    .then((res) => res.data)
}

const getBookingSetup = (date, idToken) => {
  const headers = getHeader(idToken)
  return client
    .get(`/api/getBookingSetup?date=${date}`, { headers })
    .then((res) => res.data)
}

const updateMenuItem = (menuItem, idToken) => {
  const headers = getHeader(idToken)
  return client
    .post('/api/updateMenuItem', { menuItem }, { headers })
    .then((res) => res.data)
}

const getOrders = (status, idToken) => {
  const headers = getHeader(idToken)
  return client
    .get(`/api/orders?status=${status}`, { headers })
    .then((res) => res.data)
}

function cancelOrder(orderId, idToken) {
  const headers = getHeader(idToken)
  return client
    .get(`/api/cancelOrder?orderId=${orderId}`, { headers })
    .then((res) => res.data)
}

const confirmOrder = (orderId, idToken) => {
  const headers = getHeader(idToken)
  return client.get(`/api/confirmOrder?orderId=${orderId}`, { headers })
}

const readyOrder = (orderId, idToken) => {
  const headers = getHeader(idToken)
  return client.get(`/api/readyOrder?orderId=${orderId}`, { headers })
}

const pickupOrder = (orderId, idToken) => {
  const headers = getHeader(idToken)
  return client.get(`/api/pickupOrder?orderId=${orderId}`, { headers })
}

const touchOrder = (orderId) => {
  return client.get(`/api/touchOrder?orderId=${orderId}`)
}

const untouchedOrders = () => {
  return client.get(`/api/untouchedOrders`).then((res) => res.data)
}

const delayOrder = (orderId, delayMins, idToken) => {
  const headers = getHeader(idToken)
  return client.get(
    `/api/delayOrder?orderId=${orderId}&delayMins=${delayMins}`,
    { headers }
  )
}

const switchItem = (itemId, available, reset, idToken) => {
  const headers = getHeader(idToken)
  return client.get(
    `/api/availableItem?itemId=${itemId}&available=${available}&reset=${reset}`,
    { headers }
  )
}

function untouchedOrdersQuery() {
  const untouchQuery = useQuery('getUntouchedCount', () => untouchedOrders(), {
    refetchInterval: 10000,
  })
  // useQuery(['ordersQuery', 'open'], () => getOrders('open'), {
  //   enabled: untouchQuery.data?.count > 0,
  // })
  return untouchQuery
}

const getBusinessHours = (idToken) => {
  const headers = getHeader(idToken)
  return client.get(`/api/businessHours`, { headers }).then((res) => res.data)
}


const adjustPriceOrder = (
  orderId,
  adjustInCents,
  subTotalInCents,
  adjustNote,
  idToken
) => {
  const headers = getHeader(idToken)
  return client.get(
    `/api/adjustPriceOrder?orderId=${orderId}&adjustInCents=${adjustInCents}&adjustNote=${adjustNote}&subTotalInCents=${subTotalInCents}`,
    { headers }
  )
}

const addUser = (user, idToken) => {
  const headers = getHeader(idToken)
  return client
    .post('/api/addUser', { user }, { headers })
    .then((res) => res.data)
}

const getDateConfigs = (idToken) => {
  const headers = getHeader(idToken)
  return client.get(`/api/getDateConfigs`, { headers }).then((res) => res.data)
}

const deleteDate = (dateId, idToken) => {
  const headers = getHeader(idToken)
  return client.get(`/api/deleteDate?dateId=${dateId}`, { headers })
}

const addDate = (date, idToken) => {
  const headers = getHeader(idToken)
  return client
    .post(`/api/addDate`, { date }, { headers })
    .then((res) => res.data)
}

const setClosedShop = (isClosedShop, idToken) => {
  const headers = getHeader(idToken)
  return client.get(`/api/setClosedShop?isClosedShop=${isClosedShop}`, {
    headers,
  })
}

export default {
  getMenuItems,
  addBooking,
  checkin,
  getBooking,
  getBookingSetup,
  getMenuItem,
  updateMenuItem,
  getOrders,
  cancelOrder,
  confirmOrder,
  readyOrder,
  pickupOrder,
  touchOrder,
  untouchedOrders,
  delayOrder,
  adjustPriceOrder,
  addUser,
  untouchedOrdersQuery,
  getBusinessHours,
  switchItem,
  menuItemQuery,
  getDateConfigs,
  deleteDate,
  addDate,
  setClosedShop,
}
