import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './Navbar';
import Form from './Form';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        {/* <main className="container mx-auto px-4 py-8"> */}
          <Form />
        {/* </main> */}
      </div>
    </Router>
  );
}

export default App;
