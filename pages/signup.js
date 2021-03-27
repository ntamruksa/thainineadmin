import {
  Container
} from 'react-bootstrap'
import Signup from '../components/Signup'
export default function SignupPage() {
  return (
    <>
      <Container>
        <section className='section section-aboutus'>
          <div className='u-center-text u-margin-bottom-med'>
            <Signup />
          </div>
        </section>
      </Container>
    </>
  )
}
