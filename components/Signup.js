import React, { useEffect, useState } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase'
import { Row, Col, Container } from 'react-bootstrap'
import { setUser, isLoggedIn, logout } from '../services/auth'
import api from '../services/API'
import { useRouter } from 'next/router'

const firebaseConfig = {
  apiKey: 'AIzaSyBYrAjHiK3n3NNWfdBE7NLLhcMqQMuoyNg',
  authDomain: 'baiyok-4c688.firebaseapp.com',
  projectId: 'baiyok-4c688',
  storageBucket: 'baiyok-4c688.appspot.com',
  messagingSenderId: '308509120517',
  appId: '1:308509120517:web:c9e42121e779c7c5aba46c',
  measurementId: 'G-MH9SX9MDWZ',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const Signup = () => {
  // const [firebaseInit, setFirebaseInit] = useState(false)
  const router = useRouter()
  function getUiConfig() {
    return {
      signInFlow: 'popup',
      signInOptions: [
        {
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          recaptchaParameters: {
            type: 'image', // 'audio'
            size: 'invisible', // 'invisible' or 'compact'
            badge: 'bottomright' //' bottomright' or 'inline' applies to invisible.
          },
          defaultCountry: 'AU',
          whitelistedCountries: ['AU', '+61'],
        },
      ],

      signInSuccessUrl: '/order-incoming',
      callbacks: {
        signInSuccessWithAuthResult: () => {
          router.push('/order-incoming')
        },
      },
    }
  }

  // useEffect(() => {
  //   async function addUser(dbUser) {
  //     const res = await api.addUser(dbUser)
  //     if (res.isAdminUser) {
  //       setUser(res)
  //     }
  //   }
  //   const unregisterAuthObserver = firebase
  //     .auth()
  //     .onAuthStateChanged((user) => {
  //       if (user) {
  //         const dbUser = {
  //           uid: user.uid,
  //           phoneNumber: user.phoneNumber,
  //         }
  //         addUser(dbUser)
  //       }
  //     })
  //   return () => unregisterAuthObserver() // Make sure we un-register Firebase observers when the component unmounts.
  // }, [])

  return (
    <section className='section pt-5 pb-5'>
      <Container>
        <Row>
          <Col md={12} className='text-center pt-5 pb-5'>
            <h1 className='mt-2 mb-2'>Please Sign-In</h1>
            {/* {firebaseInit && ( */}
            <StyledFirebaseAuth
              uiConfig={getUiConfig()}
              firebaseAuth={firebase.auth()}
            />
            {/* )} */}
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Signup
