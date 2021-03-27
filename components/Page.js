import React, { Component } from 'react'
import Footer from './Footer'
import Header from './Header'
import Sidebar from './sidebar/Sidebar'
import Meta from './Meta'
// import styled from 'styled-component'

class Page extends Component {
  render() {
    return (
      <div>
        <Meta />
        {/* <Header /> */}
        <Sidebar />
        <div style={{ marginTop: '60px' }}>{this.props.children}</div>
      </div>
    )
  }
}

export default Page
