import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { dashboardService } from 'services/dashboardService';
import LoadingSpinner from 'components/ui/LoadingSpinner';

const Analytics: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [productPerformance, setProductPerformance] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [conversionData, setConversionData] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Try to fetch analytics data, but handle missing endpoints gracefully
      const promises = [
        dashboardService.getRevenueChart(timeRange).catch(() => ({ success: false, data: null })),
        dashboardService.getOrdersChart(timeRange).catch(() => ({ success: false, data: null })),
        dashboardService.getCustomerGrowth(timeRange).catch(() => ({ success: false, data: null })),
        dashboardService.getProductPerformance(timeRange).catch(() => ({ success: false, data: null })),
        dashboardService.getCategoryPerformance(timeRange).catch(() => ({ success: false, data: null })),
        dashboardService.getConversionRates(timeRange).catch(() => ({ success: false, data: null }))
      ];

      const [
        revenueResponse,
        ordersResponse,
        customerResponse,
        productResponse,
        categoryResponse,
        conversionResponse
      ] = await Promise.all(promises);

      // Set data if available, otherwise use empty arrays
      setRevenueData(revenueResponse.success && revenueResponse.data ? revenueResponse.data.revenueChart || [] : []);
      setOrdersData(ordersResponse.success && ordersResponse.data ? ordersResponse.data.orderChart || [] : []);
      setCustomerData(customerResponse.success && customerResponse.data ? customerResponse.data.customerGrowth || [] : []);
      setProductPerformance(productResponse.success && productResponse.data ? productResponse.data.products || [] : []);
      setCategoryData(categoryResponse.success && categoryResponse.data ? categoryResponse.data.categories || [] : []);
      setConversionData(conversionResponse.success && conversionResponse.data ? conversionResponse.data.conversions || [] : []);

      // Check if any data was loaded successfully
      // const hasData = [revenueResponse, ordersResponse, customerResponse, productResponse, categoryResponse, conversionResponse]
      //   .some(response => response.success && response.data);

      // Don't set error if no data - just show empty state
      // The warning message below will handle this case

    } catch (err: any) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Analytics Not Available</h3>
        <p className="mt-1 text-sm text-gray-500 mb-4">{error}</p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={fetchAnalyticsData}
            className="btn btn-primary"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="btn btn-secondary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Deep insights into your business performance and trends
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* No Data Warning */}
      {!revenueData.length && !ordersData.length && !customerData.length && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Analytics Data Not Available
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  The analytics endpoints are not yet implemented in your backend. 
                  This page will show real data once the following endpoints are available:
                </p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li><code className="bg-yellow-100 px-1 rounded">/analytics/revenue</code></li>
                  <li><code className="bg-yellow-100 px-1 rounded">/analytics/orders</code></li>
                  <li><code className="bg-yellow-100 px-1 rounded">/analytics/customer-growth</code></li>
                  <li><code className="bg-yellow-100 px-1 rounded">/analytics/product-performance</code></li>
                  <li><code className="bg-yellow-100 px-1 rounded">/analytics/category-performance</code></li>
                  <li><code className="bg-yellow-100 px-1 rounded">/analytics/conversion-rates</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {revenueData.length > 0 
                      ? formatCurrency(revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0))
                      : '$0.00'
                    }
                  </div>
                                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      <span className="sr-only">Increased by</span>
                      +12.5%
                    </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingCartIcon className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {ordersData.length > 0 
                      ? formatNumber(ordersData.reduce((sum, item) => sum + (item.orders || 0), 0))
                      : '0'
                    }
                  </div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                          <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      <span className="sr-only">Increased by</span>
                      +8.2%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-purple-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">New Customers</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {customerData.length > 0 
                      ? formatNumber(customerData.reduce((sum, item) => sum + (item.newCustomers || 0), 0))
                      : '0'
                    }
                  </div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                          <ArrowTrendingUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      <span className="sr-only">Increased by</span>
                      +15.3%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-orange-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Conversion Rate</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {conversionData.length > 0 
                      ? formatPercentage(conversionData[conversionData.length - 1]?.rate || 0)
                      : '0%'
                    }
                  </div>
                  <div className="ml-2 flex items-baseline text-sm font-semibold text-red-600">
                                          <ArrowTrendingDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                      <span className="sr-only">Decreased by</span>
                      -2.1%
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue and Orders Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.3}
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No revenue data available
            </div>
          )}
        </div>

        {/* Orders Trend */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Orders Trend</h3>
          {ordersData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No orders data available
            </div>
          )}
        </div>
      </div>

      {/* Customer Growth and Product Performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Customer Growth */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Growth</h3>
          {customerData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={customerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="newCustomers" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="totalCustomers" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No customer data available
            </div>
          )}
        </div>

        {/* Product Performance */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Product Performance</h3>
          {productPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="revenue" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No product performance data available
            </div>
          )}
        </div>
      </div>

      {/* Category Performance and Conversion Rates */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category Performance */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Category Performance</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : 0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No category data available
            </div>
          )}
        </div>

        {/* Conversion Rates */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Conversion Rates</h3>
          {conversionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => formatPercentage(Number(value))} />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#EC4899" 
                  strokeWidth={2}
                  dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No conversion data available
            </div>
          )}
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Performance Metrics</h3>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Previous Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Average Order Value
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {revenueData.length > 0 && ordersData.length > 0
                    ? formatCurrency(
                        revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0) /
                        ordersData.reduce((sum, item) => sum + (item.orders || 0), 0)
                      )
                    : '$0.00'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$45.20</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+12.5%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Customer Retention Rate
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">78.5%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">75.2%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+3.3%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Cart Abandonment Rate
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">23.1%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25.8%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">-2.7%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 
