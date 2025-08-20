import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, TrendingUp, Users, DollarSign } from 'lucide-react'
import { productService } from '@/services/api'
import { Product } from '@/types/product'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id))
    }
  }, [id])

  const fetchProduct = async (productId: number) => {
    try {
      setLoading(true)
      const productData = await productService.getProduct(productId)
      setProduct(productData)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
        <p className="mt-2 text-gray-600">The product you're looking for doesn't exist.</p>
        <Link 
          to="/products" 
          className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to products
        </Link>
      </div>
    )
  }

  // Prepare data for charts
  const mrrData = product.estimates ? [
    { name: 'Low', value: product.estimates.mrr_low },
    { name: 'Likely', value: product.estimates.mrr_likely },
    { name: 'High', value: product.estimates.mrr_high },
  ] : []

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
        <a 
          href={product.canonical_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          View on Marketplace
          <ExternalLink className="ml-2 h-4 w-4" />
        </a>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            {product.logo_url ? (
              <img 
                src={product.logo_url} 
                alt={product.name} 
                className="h-16 w-16 rounded-md mr-4"
              />
            ) : (
              <div className="h-16 w-16 rounded-md bg-gray-200 mr-4 flex items-center justify-center">
                <span className="text-gray-500 font-medium text-xl">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <p className="mt-1 text-sm text-gray-500">{product.description}</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Categories</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {product.categories.map((category, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Tags</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </dd>
            </div>
            {product.traffic && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Traffic</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {product.traffic.visits_month?.toLocaleString() || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">Monthly Visits</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {product.traffic.visits_growth !== undefined 
                            ? `${product.traffic.visits_growth > 0 ? '+' : ''}${product.traffic.visits_growth}%` 
                            : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">Growth Rate</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {product.traffic.bounce_rate !== undefined 
                            ? `${product.traffic.bounce_rate}%` 
                            : 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">Bounce Rate</p>
                      </div>
                    </div>
                  </div>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {product.estimates && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">MRR Estimation</h2>
            <p className="mt-1 text-sm text-gray-500">
              Estimated Monthly Recurring Revenue based on traffic and pricing data
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-red-800">Low Estimate</p>
                <p className="mt-1 text-2xl font-bold text-red-900">
                  {formatCurrency(product.estimates.mrr_low)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Likely Estimate</p>
                <p className="mt-1 text-2xl font-bold text-blue-900">
                  {formatCurrency(product.estimates.mrr_likely)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-800">High Estimate</p>
                <p className="mt-1 text-2xl font-bold text-green-900">
                  {formatCurrency(product.estimates.mrr_high)}
                </p>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mrrData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'MRR']} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900">Assumptions</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {product.estimates.assumptions.map((assumption, index) => (
                  <li key={index} className="text-sm text-gray-500">
                    {assumption}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Marketplace Listings</h2>
          <p className="mt-1 text-sm text-gray-500">
            Product listings across different marketplaces
          </p>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marketplace
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upvotes
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price Plans
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {product.marketplaces.map((marketplace, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{marketplace.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {marketplace.upvotes !== undefined ? marketplace.upvotes.toLocaleString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {marketplace.price_plans.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {marketplace.price_plans.map((plan, planIndex) => (
                            <span 
                              key={planIndex} 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                plan.is_popular 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {plan.name}: {formatCurrency(plan.price)}/{plan.period}
                            </span>
                          ))}
                        </div>
                      ) : (
                        'No pricing information'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a 
                      href={marketplace.listing_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail