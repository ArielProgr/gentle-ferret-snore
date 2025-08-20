import React from 'react'
import { Link } from 'react-router-dom'
import { Search, BarChart3, Package } from 'lucide-react'

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <Link to="/" className="text-xl font-bold text-gray-900">
              Marketplace Intelligence
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/products" 
              className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
            >
              <Search className="h-4 w-4" />
              <span>Products</span>
            </Link>
            
            <Link 
              to="/compare" 
              className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
            >
              <Package className="h-4 w-4" />
              <span>Compare</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar