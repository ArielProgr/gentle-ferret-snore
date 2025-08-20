import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowLeft } from 'lucide-react'
import { productService } from '@/services/api'
import { Product } from '@/types/product'

const ProductComparison: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchInitialProducts()
  }, [])

  const fetchInitialProducts = async () => {
    try {
      setLoading(true)
      const response = await productService.getProducts(1, 20)
      setProducts(response.products)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    
    try {
      const response = await productService.searchProducts(searchQuery, 1, 10)
      setSearchResults(response.products)
    } catch (error) {
      console.error('Error searching products:', error)
    }
  }

  const addProductToComparison = (productId: number) => {
    if (selectedProducts.length < 3 && !selectedProducts.includes(productId)) {
      setSelectedProducts([...selectedProducts, productId])
      setSearchQuery('')
      setSearchResults([])
    }
  }

  const removeProductFromComparison = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(id => id !== productId))
  }

  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'Free'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getSelectedProductDetails = () => {
    return selectedProducts.map(id => {
      const product = [...products, ...searchResults].find(p => p.id === id)
      return product || null
    }).filter(Boolean) as Product[]
  }

  const selectedProductDetails = getSelectedProductDetails()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link 
          to="/products" 
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to products
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Product Comparison</h1>
        <div></div> {/* Spacer for alignment */}
      </div>

      {/* Product Search */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add Products to Compare</h2>
        <form onSubmit={handleSearch} className="flex">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products to compare..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-4 border border-gray-200 rounded-md">
            <ul className="divide-y divide-gray-200">
              {searchResults.map((product) => (
                <li key={product.id}>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      {product.logo_url ? (
                        <img 
                          src={product.logo_url} 
                          alt={product.name} 
                          className="h-10 w-10 rounded-md mr-3"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-200 mr-3 flex items-center justify-center">
                          <span className="text-gray-500 font-medium">
                            {product.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-md">
                          {product.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => addProductToComparison(product.id)}
                      disabled={selectedProducts.includes(product.id) || selectedProducts.length >= 3}
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md ${
                        selectedProducts.includes(product.id) || selectedProducts.length >= 3
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {selectedProducts.includes(product.id) ? 'Added' : 'Add to Compare'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Comparing {selectedProducts.length} Product{selectedProducts.length !== 1 ? 's' : ''}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  {selectedProductDetails.map((product) => (
                    <th key={product.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex flex-col items-start">
                        <div className="flex items-center">
                          {product.logo_url ? (
                            <img 
                              src={product.logo_url} 
                              alt={product.name} 
                              className="h-8 w-8 rounded-md mr-2"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-md bg-gray-200 mr-2 flex items-center justify-center">
                              <span className="text-gray-500 font-medium text-xs">
                                {product.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <span className="font-medium">{product.name}</span>
                        </div>
                        <button
                          onClick={() => removeProductFromComparison(product.id)}
                          className="mt-1 text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Description
                  </td>
                  {selectedProductDetails.map((product) => (
                    <td key={product.id} className="px-6 py-4 text-sm text-gray-500">
                      {product.description}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Categories
                  </td>
                  {selectedProductDetails.map((product) => (
                    <td key={product.id} className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {product.categories.map((category, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    MRR Estimate
                  </td>
                  {selectedProductDetails.map((product) => (
                    <td key={product.id} className="px-6 py-4 text-sm text-gray-500">
                      {product.estimates ? (
                        <div>
                          <div className="font-medium">
                            {formatCurrency(product.estimates.mrr_likely)}
                          </div>
                          <div className="text-xs text-gray-500">
                            ({formatCurrency(product.estimates.mrr_low)} - {formatCurrency(product.estimates.mrr_high)})
                          </div>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Monthly Visits
                  </td>
                  {selectedProductDetails.map((product) => (
                    <td key={product.id} className="px-6 py-4 text-sm text-gray-500">
                      {product.traffic?.visits_month ? (
                        <div>
                          <div className="font-medium">
                            {product.traffic.visits_month.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.traffic.visits_growth !== undefined 
                              ? `${product.traffic.visits_growth > 0 ? '+' : ''}${product.traffic.visits_growth}% growth` 
                              : ''}
                          </div>
                        </div>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Price Plans
                  </td>
                  {selectedProductDetails.map((product) => (
                    <td key={product.id} className="px-6 py-4 text-sm text-gray-500">
                      {product.marketplaces[0]?.price_plans.length > 0 ? (
                        <div className="space-y-2">
                          {product.marketplaces[0].price_plans.map((plan, index) => (
                            <div key={index} className="flex items-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-2 ${
                                plan.is_popular 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {plan.name}
                              </span>
                              <span className="font-medium">
                                {formatCurrency(plan.price)}/{plan.period}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        'No pricing information'
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Marketplaces
                  </td>
                  {selectedProductDetails.map((product) => (
                    <td key={product.id} className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap gap-1">
                        {product.marketplaces.map((marketplace, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {marketplace.name}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedProducts.length === 0 && (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No products selected</h3>
          <p className="mt-1 text-sm text-gray-500">
            Search for products above to add them to the comparison.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductComparison