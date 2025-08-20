import React, { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface PricePlan {
  name: string;
  price: number;
  currency: string;
  period: string;
}

interface MarketplaceListing {
  name: string;
  listing_url: string;
  upvotes: number;
  reviews_count: number;
  rating: number;
  price_plans: PricePlan[];
}

interface TrafficInfo {
  visits_month: number;
  visits_growth: number;
}

interface MrrEstimate {
  mrr_low: number;
  mrr_likely: number;
  mrr_high: number;
  confidence: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  categories: string[];
  tags: string[];
  marketplaces: MarketplaceListing[];
  estimates: MrrEstimate;
  traffic: TrafficInfo;
}

const ProductComparison: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/products?limit=100');
      setAllProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchSelectedProducts = async (ids: number[]) => {
    try {
      const productPromises = ids.map(id => 
        axios.get(`http://localhost:8000/api/v1/products/${id}`)
      );
      const responses = await Promise.all(productPromises);
      const productsData = responses.map(res => res.data.product);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching selected products:', error);
    }
  };

  const handleProductSelect = (productId: number) => {
    if (selectedProductIds.includes(productId)) {
      const newIds = selectedProductIds.filter(id => id !== productId);
      setSelectedProductIds(newIds);
      if (newIds.length > 0) {
        fetchSelectedProducts(newIds);
      } else {
        setProducts([]);
      }
    } else if (selectedProductIds.length < 3) {
      const newIds = [...selectedProductIds, productId];
      setSelectedProductIds(newIds);
      fetchSelectedProducts(newIds);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to products
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Compare Products</h2>
        <p className="text-gray-600 mb-6">
          Select up to 3 products to compare their features, pricing, and metrics.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Products to Compare
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allProducts.map(product => (
              <div
                key={product.id}
                onClick={() => handleProductSelect(product.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedProductIds.includes(product.id)
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedProductIds.includes(product.id)}
                    onChange={() => {}}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{product.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {products.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Product Comparison</h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Feature
                    </th>
                    {products.map(product => (
                      <th key={product.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {product.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Description
                    </td>
                    {products.map(product => (
                      <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.description}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Categories
                    </td>
                    {products.map(product => (
                      <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {product.categories.map(category => (
                            <span key={category} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {category}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Traffic (Monthly Visits)
                    </td>
                    {products.map(product => (
                      <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.traffic?.visits_month ? product.traffic.visits_month.toLocaleString() : 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Traffic Growth
                    </td>
                    {products.map(product => (
                      <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={product.traffic?.visits_growth && product.traffic.visits_growth > 0 ? 'text-green-600' : 'text-red-600'}>
                          {product.traffic?.visits_growth ? `${product.traffic.visits_growth}%` : 'N/A'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      MRR Estimate (Likely)
                    </td>
                    {products.map(product => (
                      <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <BarChart3 className="h-4 w-4 text-blue-500 mr-1" />
                          <span className="font-medium">
                            {product.estimates?.mrr_likely ? formatCurrency(product.estimates.mrr_likely) : 'N/A'}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      MRR Range
                    </td>
                    {products.map(product => (
                      <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.estimates?.mrr_low && product.estimates?.mrr_high ? (
                          <div>
                            <div className="text-gray-500">
                              {formatCurrency(product.estimates.mrr_low)} - {formatCurrency(product.estimates.mrr_high)}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ 
                                  width: `${Math.min(100, Math.max(10, (product.estimates.mrr_likely - product.estimates.mrr_low) / (product.estimates.mrr_high - product.estimates.mrr_low) * 100))}%` 
                                }}
                              ></div>
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
                      Highest Price Plan
                    </td>
                    {products.map(product => {
                      const highestPricePlan = product.marketplaces?.[0]?.price_plans
                        ?.reduce((prev, current) => (prev.price > current.price) ? prev : current, { price: 0, name: 'N/A', period: 'N/A' });
                      
                      return (
                        <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {highestPricePlan?.price ? (
                            <div>
                              <div className="font-medium">{formatCurrency(highestPricePlan.price)}</div>
                              <div className="text-xs text-gray-500">{highestPricePlan.name} ({highestPricePlan.period})</div>
                            </div>
                          ) : 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Upvotes
                    </td>
                    {products.map(product => (
                      <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.marketplaces?.[0]?.upvotes?.toLocaleString() || 'N/A'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedProductIds.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Select products above to compare them.</p>
        </div>
      )}
    </div>
  );
};

export default ProductComparison;