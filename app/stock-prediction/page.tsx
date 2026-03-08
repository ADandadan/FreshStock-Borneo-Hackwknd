"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { Days_One } from 'next/font/google';

//Types
interface Product {
  id: number;
  name: string;
  inStock: number;
}

interface PredictionResult {
  id: string; // Unique ID for each prediction card
  productName: string;
  avgDailySales: number;
  currentStock: number;
  nextWeekNeeded: number;
  isShortage: boolean;
}

export default function StockPredictionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [totalSold, setTotalSold] = useState('');
  const [numDays, setNumDays] = useState('7');
  
  // Array to hold multiple results
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('freshstock_products');
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  const handleCalculate = () => {
    const product = products.find(p => p.id.toString() === selectedProductId);
    if (!product || !totalSold || !numDays) return alert("Please fill in all fields");

    const sold = parseFloat(totalSold);
    const days = parseInt(numDays);
    const avgSales = sold / days;
    const weeklyNeeded = Math.ceil(avgSales * days);
    const shortage = weeklyNeeded > product.inStock;

    const newResult: PredictionResult = {
      id: Date.now().toString(),
      productName: product.name,
      avgDailySales: avgSales,
      currentStock: product.inStock,
      nextWeekNeeded: weeklyNeeded,
      isShortage: shortage
    };

    // Add the new result to the existing list (newest on top)
    setPredictions([newResult, ...predictions]);
    
    // Optional: Clear input fields after calculating
    setTotalSold('');
  };

  const removePrediction = (id: string) => {
    setPredictions(predictions.filter(p => p.id !== id));
  };

  return (
    <div className="ml-64 p-10 bg-[#FFFCF6] min-h-screen font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-950 mb-1">Stock Prediction</h1>
        <p className="text-gray-500 text-lg">Forecast inventory needs based on sales data</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Input Form */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-1">Manual Prediction</h2>
          <p className="text-sm text-gray-500 mb-6">Calculate stock needs for a specific product</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Select Product</label>
              <select 
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full p-3 bg-orange-50 rounded-lg border border-orange-100 outline-none"
              >
                <option value="">Choose a product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Total Sold</label>
              <input 
                type="number"
                value={totalSold}
                onChange={(e) => setTotalSold(e.target.value)}
                placeholder="Enter total quantity sold"
                className="w-full p-3 bg-orange-50 rounded-lg border border-orange-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Number of Days</label>
              <input 
                type="number"
                value={numDays}
                onChange={(e) => setNumDays(e.target.value)}
                className="w-full p-3 bg-orange-50 rounded-lg border border-orange-100"
              />
            </div>
            <button 
              onClick={handleCalculate}
              className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition"
            >
              Calculate Prediction
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-1">Auto Prediction</h2>
          <p className="text-sm text-gray-500 mb-6">Calculate for all products based on history</p>
          <div className="bg-green-50 p-6 rounded-xl border border-green-100 mb-6 text-sm">
            <p className="font-bold text-gray-800 mb-2">How it works:</p>
            <ul className="list-disc ml-5 space-y-1 text-gray-600">
              <li>Analyzes sales history from the past 7 days</li>
              <li>Calculates average daily sales for each product</li>
              <li>Predicts next week's stock requirements</li>
              <li>Alerts you if restocking is needed</li>
            </ul>
          </div>
          <button className="w-full py-3 bg-yellow-500 text-white rounded-xl font-bold flex items-center justify-center gap-2">
            <TrendingUp size={18} /> Calculate All Predictions
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Predictions</h2>
        {predictions.length > 0 && (
          <button onClick={() => setPredictions([])} className="text-red-500 text-sm font-bold flex items-center gap-1">
            <Trash2 size={16} /> Clear All
          </button>
        )}
      </div>

      {/*Mapping over the array to show multiple cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {predictions.length > 0 ? (
          predictions.map((res) => (
            <div key={res.id} className={`p-6 rounded-2xl border transition-all ${res.isShortage ? 'border-red-400 bg-white' : 'border-green-200 bg-white'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{res.productName}</h3>
                  <p className="text-xs text-gray-500">Stock forecast analysis</p>
                </div>
                <button onClick={() => removePrediction(res.id)} className="text-gray-300 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Avg Daily Sales</p>
                  <p className="text-lg font-bold">{res.avgDailySales.toFixed(2)} units</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Current Stock</p>
                  <p className="text-lg font-bold">{res.currentStock} units</p>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl mb-4 border border-orange-100">
                <p className="text-xs text-orange-700 font-bold uppercase mb-1">Next Week Prediction</p>
                <p className="text-2xl font-black text-orange-600">{res.nextWeekNeeded} units needed</p>
              </div>

              {res.isShortage ? (
                <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex gap-2 items-center text-red-700 text-xs">
                  <AlertTriangle size={16} />
                  <p><strong>Restock Required!</strong> Prepare {res.nextWeekNeeded - res.currentStock} more units.</p>
                </div>
              ) : (
                <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex gap-2 items-center text-green-700 text-xs">
                  <CheckCircle size={16} />
                  <p><strong>Stock Level Healthy!</strong> Current stock is sufficient.</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <TrendingUp size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400">No predictions yet. Use manual calculation above.</p>
          </div>
        )}
      </div>
    </div>
  );
}