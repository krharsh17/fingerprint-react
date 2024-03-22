// App.jsx
import { Link } from "react-router-dom";

function App() {
  return (
    <main>
      <h1>Authentication</h1>
      <Link to={'/signup'}>Sign Up</Link>
      <Link to={'/login'}>Log In</Link>      
    </main>
  )
}

export default App