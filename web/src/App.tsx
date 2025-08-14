import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerForm from './pages/CustomerForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerForm />} />
        <Route path="/customer-form" element={<CustomerForm />} />
      </Routes>
    </Router>
  )
}

export default App
