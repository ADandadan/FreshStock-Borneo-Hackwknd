"use client";

import { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Trash2, Sparkles } from 'lucide-react';
import { Product, PredictionResult, SaleEntry } from '@/constants';

export default function StockPredictionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleEntry[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [totalSold, setTotalSold] = useState('');
  const [numDays, setNumDays] = useState('7');
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);

  // Load both Products AND Sales from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('freshstock_products');
    const savedSales = localStorage.getItem('freshstock_sales');
    
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedSales) setSales(JSON.parse(savedSales));
  }, []);

  // --- Logic: Manual Prediction ---
  const handleCalculate = () => {
    const product = products.find(p => p.id.toString() === selectedProductId);
    if (!product || !totalSold || !numDays) return alert("Please fill in all fields");

    const sold = parseFloat(totalSold);
    const days = parseInt(numDays);
    addPredictionToState(product, sold, days);
    
    setTotalSold(''); // Reset input
  };

  // --- Logic: Auto Prediction ---
  const handleAutoCalculate = () => {
    if (sales.length === 0) return alert("No sales data found to calculate predictions.");

    const newAutoPredictions: PredictionResult[] = [];

    products.forEach(product => {
      // 1. Get all sales for THIS product
      const productSales = sales.filter(s => s.productId === product.id);
      
      if (productSales.length > 0) {
        // 2. Sum the total quantity sold
        const totalQtySold = productSales.reduce((sum, s) => sum + s.quantitySold, 0);
        
        // 3. Find the date range (how many days of sales we have recorded)
        const uniqueDates = new Set(productSales.map(s => s.date));
        const days = uniqueDates.size || 1; // Avoid division by zero

        // 4. Calculate
        const avgSales = totalQtySold / days;
        const weeklyNeeded = Math.ceil(avgSales * 7);
        const shortage = weeklyNeeded > product.inStock;

        newAutoPredictions.push({
          id: `auto-${product.id}-${Date.now()}`,
          productName: product.name,
          avgDailySales: avgSales,
          currentStock: product.inStock,
          nextWeekNeeded: weeklyNeeded,
          isShortage: shortage
        });
      }
    });

    if (newAutoPredictions.length === 0) {
        alert("Products are registered, but no sales have been logged for them yet.");
    } else {
        setPredictions([...newAutoPredictions, ...predictions]);
    }
  };

  // Helper to add a prediction to the list
  const addPredictionToState = (product: Product, sold: number, days: number) => {
    const avgSales = sold / days;
    const weeklyNeeded = Math.ceil(avgSales * 7);
    const shortage = weeklyNeeded > product.inStock;

    const newResult: PredictionResult = {
      id: Date.now().toString(),
      productName: product.name,
      avgDailySales: avgSales,
      currentStock: product.inStock,
      nextWeekNeeded: weeklyNeeded,
      isShortage: shortage
    };

    setPredictions([newResult, ...predictions]);
  };

  const removePrediction = (id: string) => {
    setPredictions(predictions.filter(p => p.id !== id));
  };

  return (
    <div className="p-10 bg-[#FFFCF6] min-h-screen font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-950 mb-1">Stock Prediction</h1>
        <p className="text-gray-500 text-lg">Forecast inventory needs based on sales data</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Manual Prediction Form */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-1 text-gray-900">Manual Prediction</h2>
          <p className="text-sm text-gray-500 mb-6">Calculate stock needs for a specific product</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-gray-700">Select Product</label>
              <select 
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full p-3 bg-orange-50 rounded-lg border border-orange-100 outline-none focus:ring-2 focus:ring-orange-200"
              >
                <option value="">Choose a product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700">Total Sold</label>
                    <input 
                        type="number"
                        value={totalSold}
                        onChange={(e) => setTotalSold(e.target.value)}
                        placeholder="Qty"
                        className="w-full p-3 bg-orange-50 rounded-lg border border-orange-100 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-1.5 text-gray-700">Days</label>
                    <input 
                        type="number"
                        value={numDays}
                        onChange={(e) => setNumDays(e.target.value)}
                        className="w-full p-3 bg-orange-50 rounded-lg border border-orange-100 outline-none"
                    />
                </div>
            </div>
            <button 
              onClick={handleCalculate}
              className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-md"
            >
              Calculate Prediction
            </button>
          </div>
        </div>

        {/* Auto Prediction Info Box */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold mb-1 text-gray-900">Auto Prediction</h2>
          <p className="text-sm text-gray-500 mb-6">Calculate for all products based on history</p>
          <div className="bg-green-50 p-6 rounded-xl border border-green-100 mb-6 text-sm flex-1">
            <p className="font-bold text-green-800 mb-2">How it works:</p>
            <ul className="list-disc ml-5 space-y-2 text-green-700">
              <li>Reads data from your <strong>Sales Tracker</strong> automatically</li>
              <li>Calculates average daily sales for every active product</li>
              <li>Predicts 7-day requirements vs your current stock</li>
            </ul>
          </div>
          <button 
            onClick={handleAutoCalculate}
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md"
          >
            <Sparkles size={20} /> Calculate All Predictions
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-950">Active Forecasts</h2>
        {predictions.length > 0 && (
          <button onClick={() => setPredictions([])} className="text-red-500 text-sm font-bold flex items-center gap-1 hover:underline">
            <Trash2 size={16} /> Clear All
          </button>
        )}
      </div>

      {/* Grid for Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {predictions.length > 0 ? (
          predictions.map((res) => (
            <div key={res.id} className={`p-6 rounded-2xl border-2 transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 ${res.isShortage ? 'border-red-100 bg-white' : 'border-green-100 bg-white'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{res.productName}</h3>
                  <p className="text-xs text-gray-400 font-medium">Weekly Forecast</p>
                </div>
                <button onClick={() => removePrediction(res.id)} className="text-gray-300 hover:text-red-500 transition">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-[10px] text-gray-400 uppercase font-black">Daily Avg</p>
                  <p className="text-lg font-bold text-gray-800">{res.avgDailySales.toFixed(1)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-[10px] text-gray-400 uppercase font-black">Current Stock</p>
                  <p className="text-lg font-bold text-gray-800">{res.currentStock}</p>
                </div>
              </div>

              <div className={`p-4 rounded-xl mb-4 border ${res.isShortage ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'}`}>
                <p className={`text-[10px] font-black uppercase mb-1 ${res.isShortage ? 'text-orange-700' : 'text-green-700'}`}>Next 7 Days Needed</p>
                <p className={`text-3xl font-black ${res.isShortage ? 'text-orange-600' : 'text-green-600'}`}>{res.nextWeekNeeded} <span className="text-sm font-normal">units</span></p>
              </div>

              {res.isShortage ? (
                <div className="flex gap-2 items-center text-red-600 text-xs font-bold bg-red-50 p-2 rounded-lg">
                  <AlertTriangle size={14} />
                  <p>Restock {res.nextWeekNeeded - res.currentStock} units ASAP!</p>
                </div>
              ) : (
                <div className="flex gap-2 items-center text-green-600 text-xs font-bold bg-green-50 p-2 rounded-lg">
                  <CheckCircle size={14} />
                  <p>Inventory level is healthy.</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <TrendingUp size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-medium">No active forecasts. Calculate above to start.</p>
          </div>
        )}
      </div>
    </div>
  );
}