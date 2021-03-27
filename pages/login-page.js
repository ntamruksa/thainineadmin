import { withAuthUser, AuthAction } from 'next-firebase-auth'
import { Container } from 'react-bootstrap'
import Signup from '../components/Signup'

const MyLoader = () => {
  return (
    <>
      <Container>
        <div>Loading...</div>
      </Container>
    </>
  )
}

const LoginPage = () => {
  return (
    <>
      <Container>
        <div>Login page</div>
        <Signup />
      </Container>
    </>
  )
}

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.RENDER,
  LoaderComponent: MyLoader,
})(LoginPage)
