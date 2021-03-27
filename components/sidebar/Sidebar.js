import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ReceiptIcon from '@material-ui/icons/Receipt'
import SettingsIcon from '@material-ui/icons/Settings'
import OutdoorGrillIcon from '@material-ui/icons/OutdoorGrill'
import LocalMallIcon from '@material-ui/icons/LocalMall'
import HistoryIcon from '@material-ui/icons/History'
import LoginIcon from '@material-ui/icons/Lock'
import LogoutIcon from '@material-ui/icons/ExitToApp'
import { isLoggedIn, logout } from '../../services/auth'
import classNames from 'classnames'
import { ControlPointDuplicateTwoTone } from '@material-ui/icons'
import api from '../../services/API'
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
const drawerWidth = 70
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('xs')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('xs')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.up('xs')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
}))

function Sidebar(props) {
  const AuthUser = useAuthUser()
  const router = useRouter()
  const classes = useStyles()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data } = api.untouchedOrdersQuery()
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  useEffect(() => {
    setUserLoggedIn(isLoggedIn)
    console.log('pathname', router.pathname)
  }, [])

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
      <ListItem button key='Setup' divider className='sidenav-item'>
          <ListItemIcon>
            <Link href='/setup' passHref>
              <SettingsIcon
                style={{ fontSize: 30 }}
                className={`sidenav-item__icon ${
                  router.pathname === '/setup'
                    ? 'sidenav-item__selected'
                    : ''
                }`}
              />
            </Link>
          </ListItemIcon>
          {/* <ListItemText primary='Incoming Order' /> */}
        </ListItem>
        <ListItem button key='Incoming Order' divider className='sidenav-item'>
          <ListItemIcon>
            <Link href='/order-incoming' passHref>
              <ReceiptIcon
                style={{ fontSize: 30 }}
                className={`sidenav-item__icon ${
                  router.pathname === '/order-incoming'
                    ? 'sidenav-item__selected'
                    : ''
                }`}
              />
            </Link>
            {data && data.count > 0 ? (
              <div className='touch-dot__nav'></div>
            ) : (
              <></>
            )}
          </ListItemIcon>
          {/* <ListItemText primary='Incoming Order' /> */}
        </ListItem>
        <ListItem button key='Inprogress' divider className='sidenav-item'>
          <ListItemIcon>
            <Link href='/order-preparing' passHref>
              <OutdoorGrillIcon
                style={{ fontSize: 30 }}
                className={`sidenav-item__icon ${
                  router.pathname === '/order-preparing'
                    ? 'sidenav-item__selected'
                    : ''
                }`}
              />
            </Link>
          </ListItemIcon>
          {/* <ListItemText primary='Inprogress' /> */}
        </ListItem>
        <ListItem
          button
          key='Ready for Pickup'
          divider
          className='sidenav-item'>
          <ListItemIcon>
            <Link href='/order-ready' passHref>
              <LocalMallIcon
                style={{ fontSize: 30 }}
                className={`sidenav-item__icon ${
                  router.pathname === '/order-ready'
                    ? 'sidenav-item__selected'
                    : ''
                }`}
              />
            </Link>
          </ListItemIcon>
          {/* <ListItemText primary='Ready for Pickup' /> */}
        </ListItem>
        <ListItem button key='History' divider className='sidenav-item'>
          <ListItemIcon>
            <Link href='/order-history' passHref>
              <HistoryIcon
                style={{ fontSize: 30 }}
                className={`sidenav-item__icon ${
                  router.pathname === '/order-history'
                    ? 'sidenav-item__selected'
                    : ''
                }`}
              />
            </Link>
          </ListItemIcon>
        </ListItem>
        {!AuthUser?.id && (
          <ListItem button key='Login' divider className='sidenav-item'>
            <ListItemIcon>
              <Link href='/login-page' passHref>
                <LoginIcon
                  style={{ fontSize: 30 }}
                  className={`sidenav-item__icon ${
                    router.pathname === '/login-page'
                      ? 'sidenav-item__selected'
                      : ''
                  }`}
                />
              </Link>
            </ListItemIcon>
          </ListItem>
        )}
        {AuthUser?.id && (
          <ListItem button key='Logout' divider className='sidenav-item'>
            <ListItemIcon>
              {/* <Link href='/signup' passHref> */}
                <div onClick={()=> AuthUser.signOut()}>
                <LogoutIcon
                  style={{ fontSize: 30 }}
                  className={`sidenav-item__icon ${
                    router.pathname === '/login-page'
                      ? 'sidenav-item__selected'
                      : ''
                  }`}
                />
                </div>
              {/* </Link> */}
            </ListItemIcon>
          </ListItem>
        )}
      </List>
    </div>
  )

  return (
    <Hidden xsDown implementation='css'>
      <Drawer
        variant='permanent'
        anchor={'left'}
        open
        classes={{
          paper: classNames(classes.drawerPaper),
        }}>
        {drawer}
      </Drawer>
    </Hidden>
  )
}

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  authPageURL: '/login-page/',
})(Sidebar)
