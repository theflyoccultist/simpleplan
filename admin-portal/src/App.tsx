import './App.css'
import { Button } from 'react-bootstrap';

function App() {
  return (
<div>
  <h2>SimplePlan - Admin Portal</h2>
  <Button variant="primary" href="/login">Login</Button>
  <br/>
  <Button variant='primary' href="/register">Register</Button>
</div>
  )
}

export default App
