"use client";

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Info, Plus, DollarSign, Package } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// --- Data Models ---
interface Product {
  id: number;
  name: string;
  inStock: number;
  sellingPrice: number;
}

interface SaleEntry {
  id: string;
  date: string;
  productId: number;
  productName: string;
  sellingPrice: number;
  quantitySold: number;
  revenue: number;
}

interface WasteLog {
  id: string;
  quantity: number;
  costLost: number;
}

export default function SalesTrackerPage() {
  // --- State ---
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleEntry[]>([]);
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Form State ---
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantitySold, setQuantitySold] = useState('');

  // --- Persistence Logic ---
  useEffect(() => {
    // Load data from localStorage on mount matching your other components
    const savedProducts = localStorage.getItem('freshstock_products');
    const savedSales = localStorage.getItem('freshstock_sales');
    const savedWaste = localStorage.getItem('freshstock_waste');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedSales) setSales(JSON.parse(savedSales));
    
    // Fallback dummy data for sales if empty
    if (!savedSales) {
        setSales([
            { id: "s1", date: new Date().toISOString().split("T")[0], productId: 1, productName: "Fresh Tomatoes", sellingPrice: 5.0, quantitySold: 10, revenue: 50.0 }
        ]);
    }

    if (savedWaste) setWasteLogs(JSON.parse(savedWaste));
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('freshstock_sales', JSON.stringify(sales));
    }
  }, [sales, isLoaded]);

  // --- Logic Functions ---
  const handleLogSale = () => {
    const product = products.find(p => p.id.toString() === selectedProductId);
    if (!product || !quantitySold || !date) return alert("Please fill in all fields");

    const qty = parseInt(quantitySold);
    const revenue = product.sellingPrice * qty;

    const newSale: SaleEntry = {
      id: Date.now().toString(),
      date,
      productId: product.id,
      productName: product.name,
      sellingPrice: product.sellingPrice,
      quantitySold: qty,
      revenue,
    };

    setSales([newSale, ...sales]);
    
    // Reset Form
    setDate(new Date().toISOString().split("T")[0]);
    setSelectedProductId('');
    setQuantitySold('');
    setShowAddForm(false);
  };

  // --- Metrics Calculations ---
  const totalRevenue = sales.reduce((sum, s) => sum + s.revenue, 0);
  const totalQuantitySold = sales.reduce((sum, s) => sum + s.quantitySold, 0);

  const productSales = products.map((product) => {
    const productSalesData = sales.filter((s) => s.productId === product.id);
    const totalSold = productSalesData.reduce((sum, s) => sum + s.quantitySold, 0);
    const totalRev = productSalesData.reduce((sum, s) => sum + s.revenue, 0);
    return { product, totalSold, totalRev };
  });

  const bestSelling = [...productSales].sort((a, b) => b.totalSold - a.totalSold);
  const lowPerforming = [...productSales].sort((a, b) => a.totalSold - b.totalSold);

  const revenueByDate = sales.reduce((acc, sale) => {
    const existing = acc.find((item) => item.date === sale.date);
    if (existing) existing.revenue += sale.revenue;
    else acc.push({ date: sale.date, revenue: sale.revenue });
    return acc;
  }, [] as { date: string; revenue: number }[]);

  const totalWaste = wasteLogs.reduce((sum, w) => sum + w.quantity, 0);
  const totalStock = products.reduce((sum, p) => sum + p.inStock, 0);
  const wasteRate = totalStock > 0 ? ((totalWaste / (totalStock + totalWaste)) * 100).toFixed(1) : 0;

  const avgDailySales = totalQuantitySold / (revenueByDate.length || 1);
  const overstockThreshold = avgDailySales * 2;
  const overstockedProducts = products.filter((p) => p.inStock > overstockThreshold);
  const overstockRate = products.length > 0 ? ((overstockedProducts.length / products.length) * 100).toFixed(1) : 0;

  // Food Security Score Logic
  const wasteScore = Math.max(0, 100 - parseFloat(wasteRate as string) * 5);
  const stockScore = products.every((p) => p.inStock > 10) ? 100 : 70;
  const salesScore = totalQuantitySold > 100 ? 100 : (totalQuantitySold / 100) * 100;
  const foodSecurityScore = Math.round((wasteScore + stockScore + salesScore) / 3) || 0;

  if (!isLoaded) return <div className="ml-64 p-8">Loading...</div>;

  return (
    <div className="ml-64 p-10 bg-[#FFFCF6] min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-950 mb-1">Sales Tracker</h1>
          <p className="text-gray-500 text-lg">Monitor revenue and food security performance</p>
        </div>
        {!showAddForm && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition shadow-md"
          >
            <Plus size={20} /> Record Sale
          </button>
        )}
      </div>

      {/* Input Form */}
      {showAddForm && (
        <div className="bg-white p-8 rounded-2xl border border-orange-200 shadow-sm mb-10 animate-in fade-in zoom-in duration-200">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Record New Sale</h2>
          <p className="text-sm text-gray-500 mb-6">Track daily sales for revenue analysis</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
              <input 
                type="date"
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="w-full px-4 py-3 bg-orange-50 rounded-lg border border-orange-100 outline-none focus:ring-2 focus:ring-orange-200" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product</label>
              <select 
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-4 py-3 bg-orange-50 rounded-lg border border-orange-100 outline-none focus:ring-2 focus:ring-orange-200"
              >
                <option value="">Choose a product...</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - RM {p.sellingPrice.toFixed(2)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity Sold</label>
              <input 
                type="number"
                value={quantitySold} 
                onChange={(e) => setQuantitySold(e.target.value)} 
                placeholder="0"
                className="w-full px-4 py-3 bg-orange-50 rounded-lg border border-orange-100 outline-none focus:ring-2 focus:ring-orange-200" 
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleLogSale} 
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition"
            >
              Submit Sale
            </button>
            <button 
              onClick={() => setShowAddForm(false)} 
              className="px-10 py-4 bg-white border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-2xl font-black text-gray-900">RM {totalRevenue.toFixed(2)}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Items Sold</p>
            <p className="text-2xl font-black text-gray-900">{totalQuantitySold}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
            <Package size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Waste Rate</p>
            <p className="text-2xl font-black text-red-600">{wasteRate}%</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
            <TrendingDown size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Overstock Rate</p>
            <p className="text-2xl font-black text-yellow-600">{overstockRate}%</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-500">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueByDate}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Line type="monotone" dataKey="revenue" stroke="#ff6b35" strokeWidth={3} dot={{r: 4, fill: '#ff6b35', strokeWidth: 0}} name="Revenue (RM)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Waste & Overstock Metrics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: "Waste Rate", value: parseFloat(wasteRate as string) },
              { name: "Overstock Rate", value: parseFloat(overstockRate as string) }
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="value" fill="#f7b32b" radius={[6, 6, 0, 0]} name="Percentage (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Performance & Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lists Container */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Best-Selling Products</h2>
            <div className="space-y-4">
              {bestSelling.slice(0, 5).map((item, idx) => (
                <div key={item.product.id} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.totalSold} units sold</p>
                    </div>
                  </div>
                  <p className="font-bold text-green-600">RM {item.totalRev.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Needs Attention</h2>
            <div className="space-y-4">
              {lowPerforming.slice(0, 5).map((item, idx) => (
                <div key={item.product.id} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.product.name}</p>
                      <p className="text-xs text-gray-500">{item.totalSold} units sold</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">RM {item.totalRev.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Food Security Score Widget styled like Waste Tracker's profit box */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold mb-6">Impact Assessment</h2>
          
          <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex flex-col justify-center items-center text-center mb-6 flex-1">
            <p className="text-sm text-green-800 font-bold uppercase tracking-wider mb-1">Food Security Score</p>
            <p className="text-6xl font-black text-green-600 mb-2">{foodSecurityScore}</p>
            <p className="text-xs text-green-700 font-medium bg-green-200/50 px-3 py-1 rounded-full">Out of 100</p>
          </div>

          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="w-full py-3 border-2 border-green-100 text-green-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-50 transition"
          >
            <Info size={18} /> {showInfo ? "Hide" : "Learn Why This Matters"}
          </button>

          {showInfo && (
            <div className="mt-4 space-y-3 bg-gray-50 p-5 rounded-xl border border-gray-100 text-sm">
              <p><strong className="text-gray-900 block mb-0.5">Community Food Stability:</strong> <span className="text-gray-600">Efficient inventory ensures consistent availability.</span></p>
              <p><strong className="text-gray-900 block mb-0.5">Impacts Inflation:</strong> <span className="text-gray-600">Reducing waste controls food prices and artificial scarcity.</span></p>
              <p><strong className="text-gray-900 block mb-0.5">Long-term Supply:</strong> <span className="text-gray-600">Sustainable practices protect local food systems.</span></p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
