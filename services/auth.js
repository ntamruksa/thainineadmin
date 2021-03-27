export const isBrowser = () => typeof window !== 'undefined'

export const getUser = () =>
  isBrowser() && window.localStorage.getItem('nextUser') ? JSON.parse(window.localStorage.getItem('nextUser')) : {isAdminUser : false}

export const setUser = (user) => isBrowser() && window.localStorage.setItem('nextUser', JSON.stringify(user))

export const isLoggedIn = () => {
  const user = getUser()
  if (user.isAdminUser) {
    return user.isAdminUser
  } else {
    return false
  }
}

export const logout = (firebase, callback) => {
  setUser({})
  return new Promise((resolve) => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        setUser({})
        if (callback) callback()
        resolve()
      })
  })
}
