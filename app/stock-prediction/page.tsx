"use client";

import { useState, useEffect, useRef } from 'react';
import { Trash2, Sparkles, Clock } from 'lucide-react';
import type { Product, PredictionResult, SaleEntry } from '@/constants';

export default function StockPredictionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  //const [sales, setSales] = useState<SaleEntry[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  
  // This Ref acts as a "Lock". We only save to storage if this is TRUE.
  const hasLoadedFromStorage = useRef(false);

  // --- 1. SINGLE EFFECT FOR LOADING ---
  useEffect(() => {
    const savedProducts = localStorage.getItem('freshstock_products');
    //const savedSales = localStorage.getItem('freshstock_sales');
    const savedPredictions = localStorage.getItem('freshstock_predictions');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    //if (savedSales) setSales(JSON.parse(savedSales));
    
    if (savedPredictions) {
      const parsed = JSON.parse(savedPredictions);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setPredictions(parsed);
      }
    }

    // After loading is finished, we unlock the ability to SAVE
    hasLoadedFromStorage.current = true;
  }, []);

  // --- 2. SINGLE EFFECT FOR SAVING ---
  useEffect(() => {
    // Only save if the "Lock" is open. 
    // This prevents saving [] over your data during page transitions.
    const predictionsJSON = JSON.stringify(predictions);
    if (hasLoadedFromStorage.current && predictionsJSON !== "[]") {
      localStorage.setItem('freshstock_predictions', JSON.stringify(predictions));
    }
  }, [predictions]);

  // --- Manual Calculation ---
  const handleManualCalculate = () => {
    const product = products.find(p => p.id.toString() === selectedProductId);
    if (!product || !totalSold || !numDays) return alert("Please fill in all fields");

    const sold = parseFloat(totalSold);
    const days = parseInt(numDays);
    const avgSales = sold / days;
    const weeklyNeeded = Math.ceil(avgSales * 7);

    const newResult: PredictionResult = {
      id: `manual-${Date.now()}`,
      productName: product.name,
      avgDailySales: avgSales,
      currentStock: product.inStock,
      nextWeekNeeded: weeklyNeeded,
      isShortage: weeklyNeeded > product.inStock
    };

    setPredictions(prev => [newResult, ...prev]);
    setTotalSold('');
  };

  // --- Auto Prediction ---
  const handleAutoCalculate = () => {
    const freshSalesRaw = localStorage.getItem('freshstock_sales');
    const freshSales: SaleEntry[] = freshSalesRaw ? JSON.parse(freshSalesRaw) : [];

    if (freshSales.length === 0) return alert("No sales history found!");

    const newAutoResults: PredictionResult[] = [];

    products.forEach(product => {
      const productSales = freshSales.filter(s => s.productId === product.id);
      if (productSales.length > 0) {
        const totalQtySold = productSales.reduce((sum, s) => sum + s.quantitySold, 0);
        const uniqueDates = new Set(productSales.map(s => s.date));
        const days = uniqueDates.size || 1;

        const avgSales = totalQtySold / days;
        const weeklyNeeded = Math.ceil(avgSales * 7);

        newAutoResults.push({
          id: `auto-${product.id}-${Date.now()}`,
          productName: product.name,
          avgDailySales: avgSales,
          currentStock: product.inStock,
          nextWeekNeeded: weeklyNeeded,
          isShortage: weeklyNeeded > product.inStock
        });
      }
    });

    if (newAutoResults.length > 0) {
      setPredictions(prev => [...newAutoResults, ...prev]);
    } else {
      alert("No sales found for current products.");
    }
  };

  const removePrediction = (id: string) => {
    setPredictions(prev => prev.filter(p => p.id !== id));
  };

  const clearAll = () => {
    if (confirm("Clear all?")) {
      setPredictions([]);
      localStorage.removeItem('freshstock_predictions');
    }
  };

  // State for form
  const [selectedProductId, setSelectedProductId] = useState('');
  const [totalSold, setTotalSold] = useState('');
  const [numDays, setNumDays] = useState('7');

  return (
    <div className="p-10 bg-[#FFFCF6] min-h-screen font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-950 mb-1">Stock Prediction</h1>
        <p className="text-gray-500 text-lg">Forecast stays even after switching sections</p>
      </header>

      {/* Control Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Manual Entry</h2>
          <div className="space-y-4">
            <select 
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full p-3.5 bg-gray-50 rounded-xl outline-none focus:outline-solid" aria-label='Select product combo box'
            >
              <option value="">Select Product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Sold" value={totalSold} onChange={(e) => setTotalSold(e.target.value)} className="p-3.5 bg-gray-50 rounded-xl outline-none focus:outline-solid" />
              <input type="number" placeholder="Days" value={numDays} onChange={(e) => setNumDays(e.target.value)} className="p-3.5 bg-gray-50 rounded-xl outline-none focus:outline-solid" />
            </div>
            <button type='button'onClick={handleManualCalculate} className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold transition hover:bg-orange-600">
              Calculate
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <button type='button'
            onClick={handleAutoCalculate}
            className="w-full py-6 bg-yellow-500 hover:bg-yellow-600 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition shadow-lg"
          >
            <Sparkles size={28} /> RUN AUTO-PREDICTION
          </button>
          <p className="text-center text-xs text-gray-500 mt-4 uppercase font-bold tracking-widest">Uses Sales Tracker History</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-gray-900 uppercase">Forecast History</h2>
        {predictions.length > 0 && (
          <button type='button'onClick={clearAll} className="text-red-500 font-bold text-sm">Clear All</button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {predictions.length > 0 ? (
          predictions.map((res) => (
            <div key={res.id} className={`p-6 bg-white rounded-2xl border-2 ${res.isShortage ? 'border-red-100' : 'border-green-100'}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900 uppercase">{res.productName}</h3>
                <button type='button'onClick={() => removePrediction(res.id)} className="text-gray-300 hover:text-red-500" aria-label='Delete prediction'><Trash2 size={18}/></button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-50 p-2 rounded-lg text-center">
                  <p className="text-[10px] text-gray-500 font-bold">STOCK</p>
                  <p className="font-bold">{res.currentStock}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg text-center">
                  <p className="text-[10px] text-gray-500 font-bold">AVG SOLD</p>
                  <p className="font-bold">{res.avgDailySales.toFixed(1)}</p>
                </div>
              </div>
              <div className={`p-4 rounded-xl text-center mb-4 ${res.isShortage ? 'bg-orange-50' : 'bg-green-50'}`}>
                <p className="text-[10px] font-black uppercase text-gray-500">7-Day Demand</p>
                <p className="text-4xl font-black">{res.nextWeekNeeded}</p>
              </div>
              {res.isShortage ? (
                <div className="bg-red-600 text-white p-2 rounded-lg text-center text-[10px] font-bold uppercase">Restock Required</div>
              ) : (
                <div className="bg-green-600 text-white p-2 rounded-lg text-center text-[10px] font-bold uppercase">Stock Healthy</div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-3xl">
            <Clock size={40} className="mx-auto text-gray-200 mb-2" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No saved forecasts</p>
          </div>
        )}
      </div>
    </div>
  );
}