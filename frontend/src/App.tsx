import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import ProductComparison from './pages/ProductComparison'

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/compare" element={<ProductComparison />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App