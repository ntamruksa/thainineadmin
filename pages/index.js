import Head from 'next/head'
import Link from 'next/link'
import { Row, Col, Container, Carousel } from 'react-bootstrap'
import ContactCard from '../components/home/ContactCard'
// import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Container>
        <section className='section section-aboutus'>
          <div className='u-center-text u-margin-bottom-med'>
            <h2 className='heading-secondary mx-4'>
              Welcome to Thai Nine Admin Page
            </h2>
          </div>
        </section>
      </Container>
    </>
  )
}
