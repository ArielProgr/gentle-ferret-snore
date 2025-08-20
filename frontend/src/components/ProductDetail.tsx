import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, BarChart3 } from 'lucide-react';
import axios from 'axios';

interface PricePlan {
  name: string;
  price: number;
  currency: string;
  period: string;
  features: string[];
  is_popular: boolean;
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
  bounce_rate: number;
  avg_time_on_site: number;
}

interface MrrEstimate {
  mrr_low: number;
  mrr_likely: number;
  mrr_high: number;
  confidence: number;
  assumptions: string[];
  methodology: string;
}

interface Product {
  id: number;
  name: string;
  canonical_url: string;
  description: string;
  logo_url: string;
  categories: string[];
  tags: string[];
  marketplaces: MarketplaceListing[];
  estimates: MrrEstimate;
  traffic: TrafficInfo;
  created_at: string;
  updated_at: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/products/${id}`);
      setProduct(response.data.product);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found.</p>
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

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">{product.name}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{product.description}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <a
                href={product.canonical_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Product
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Categories</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {product.categories.map(category => (
                    <span key={category} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {category}
                    </span>
                  ))}
                </div>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Tags</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Traffic Data</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {product.traffic ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Monthly Visits</p>
                      <p className="font-medium">{product.traffic.visits_month?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Growth Rate</p>
                      <p className={`font-medium ${product.traffic.visits_growth && product.traffic.visits_growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.traffic.visits_growth ? `${product.traffic.visits_growth}%` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bounce Rate</p>
                      <p className="font-medium">{product.traffic.bounce_rate ? `${product.traffic.bounce_rate}%` : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Avg. Time on Site</p>
                      <p className="font-medium">{product.traffic.avg_time_on_site ? `${product.traffic.avg_time_on_site}s` : 'N/A'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No traffic data available</p>
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">MRR Estimates</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {product.estimates ? (
                  <div>
                    <div className="flex items-center mb-4">
                      <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="font-medium">Revenue Projections</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border border-gray-200 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-500">Low</p>
                        <p className="text-lg font-bold text-red-600">${product.estimates.mrr_low?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                      <div className="border border-blue-300 rounded-lg p-3 text-center bg-blue-50">
                        <p className="text-sm text-gray-500">Likely</p>
                        <p className="text-lg font-bold text-blue-600">${product.estimates.mrr_likely?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-500">High</p>
                        <p className="text-lg font-bold text-green-600">${product.estimates.mrr_high?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">per month</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Confidence: {product.estimates.confidence ? `${(product.estimates.confidence * 100).toFixed(0)}%` : 'N/A'}</p>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Assumptions</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {product.estimates.assumptions?.slice(0, 3).map((assumption, index) => (
                          <li key={index} className="text-sm text-gray-500">{assumption}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No MRR estimates available</p>
                )}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Marketplace Listings</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="space-y-4">
                  {product.marketplaces?.map((marketplace, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{marketplace.name}</h4>
                        <a
                          href={marketplace.listing_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Listing
                        </a>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Upvotes</p>
                          <p className="font-medium">{marketplace.upvotes?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Reviews</p>
                          <p className="font-medium">{marketplace.reviews_count?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Rating</p>
                          <p className="font-medium">{marketplace.rating ? `${marketplace.rating}/5` : 'N/A'}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Pricing Plans</p>
                        <div className="flex flex-wrap gap-2">
                          {marketplace.price_plans?.map((plan, planIndex) => (
                            <span 
                              key={planIndex} 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                plan.is_popular 
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {plan.name}: ${plan.price}/{plan.period}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;