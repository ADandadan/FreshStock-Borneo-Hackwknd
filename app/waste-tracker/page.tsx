"use client";

import { useState, useEffect } from 'react';
import { Trash2, DollarSign, Sparkles, Sprout } from 'lucide-react';
import type { WasteLog, Product } from '@/constants';

const WASTE_LOGS_KEY = 'freshstock_waste';

export default function WasteTrackerPage() {
  async function handleSubmit(context: string) {
    const res = await fetch("/api/gemini", {
      method: "POST",
      body: JSON.stringify({ prompt: `Please provide one immediate suggestion on how to handle this wasted food and one long-term suggestion on how to prevent more wastage. The suggestion must be relevant to businesses and relatively simple to enact. Assume this is after the business is closed for customers. Additional context: ${context}` }),
    });
    const { result } = await res.json();
    return result
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalBatchStock, setTotalBatchStock] = useState(''); 
  const [reason, setReason] = useState('');
  
  const selectedProduct = products.find(p => p.id === Number(selectedProductId)) || null;
  const calculatedCost = selectedProduct && quantity
    ? (Number(quantity) * selectedProduct.sellingPrice).toFixed(2)
    : '';

  useEffect(() => {
    if (selectedProduct) {
      setTotalBatchStock(selectedProduct.inStock.toString());
      setQuantity('');
    } else {
      setTotalBatchStock('');
    }
  }, [selectedProduct]);
  
  // Load from localStorage on mount, fall back to DEFAULT_LOGS
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>(() => {
    try {
      const saved = localStorage.getItem(WASTE_LOGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever wasteLogs changes
  useEffect(() => {
    const wasteJSON = JSON.stringify(wasteLogs);
    if (wasteJSON !== "[]") {
      localStorage.setItem(WASTE_LOGS_KEY, JSON.stringify(wasteLogs));
    }
  }, [wasteLogs]);

  useEffect(() => {
    const saved = localStorage.getItem('freshstock_products');
    if (saved) setProducts(JSON.parse(saved));
    else setProducts([{ id: 1, name: 'Fresh Tomatoes', inStock: 50, sellingPrice: 0.5 }, { id: 2, name: 'Nasi Lemak Pre-pack', inStock: 50, sellingPrice: 2 }]);
  }, []);

  const getAiSuggestion = (productName: string, wasteReason: string, totalCostLost: number, calculatedWasteRate: number) => {
    return handleSubmit(`1. Product name: ${productName}\n2. Wastage reason: ${wasteReason}\n3. Revenue loss: ${totalCostLost}\n4. Waste rate from original stock quantity: ${calculatedWasteRate}`)
  };

  const handleLogWaste = async () => {
    const product = products.find(p => p.id.toString() === selectedProductId);
    if (!product || !quantity || !reason || !calculatedCost || !totalBatchStock) return alert("Please fill in all fields");

    const qty = parseFloat(quantity);

    if (qty > product.inStock) return alert(`Waste quantity cannot exceed stock (${product.inStock} units)`);

    const batchStock = parseFloat(totalBatchStock);
    const totalCostLost = qty * product.sellingPrice;
    const calculatedWasteRate = (qty / batchStock) * 100;

    const newLog: WasteLog = {
      id: Date.now().toString(),
      productName: product.name,
      quantity: qty,
      reason: reason,
      costLost: totalCostLost,
      wasteRate: calculatedWasteRate,
      aiSuggestion: await getAiSuggestion(product.name, reason, totalCostLost, calculatedWasteRate),
      date: new Date().toLocaleDateString('en-MY')
    };

    setWasteLogs(prev => [newLog, ...prev]);
    setQuantity(''); setReason(''); setTotalBatchStock('');
    setSelectedProductId('');
  };

  const removeLog = (id: string) => setWasteLogs(prev => prev.filter(log => log.id !== id));
  const totalFinancialLoss = wasteLogs.reduce((sum, log) => sum + log.costLost, 0);

  return (
    <div className="p-10 bg-[#FFFCF6] min-h-screen font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-950 mb-1">Waste & Impact Tracker</h1>
        <p className="text-gray-500 text-lg">Calculate loss, waste rates, and discover sustainable solutions</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Log Food Waste</h2>
          <div className="space-y-4">
            <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)} className="w-full p-3 bg-red-50 rounded-lg border border-red-100 outline-none focus:outline-solid" aria-label='Select product combo box'>
              <option value="">Select Product...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" htmlFor='waste-qty'>
                  Waste Qty
                  {selectedProduct && (
                    <span className="text-xs text-gray-500 font-normal ml-1">(max {selectedProduct.inStock})</span>
                  )}
                </label>
                <input
                  type="number"
                  value={quantity}
                  min={0}
                  max={selectedProduct?.inStock ?? ''}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Units wasted"
                  className="w-full p-3 bg-red-50 rounded-lg border border-red-100 outline-none focus:outline-solid"
                  id='waste-qty'
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" htmlFor='total-batch-stock'>Total Batch Stock</label>
                <input
                  type="number"
                  value={totalBatchStock}
                  readOnly
                  placeholder="Select a product"
                  className="w-full p-3 bg-gray-100 rounded-lg border border-gray-200 outline-none opacity-60 cursor-not-allowed focus:outline-solid"
                  id='total-batch-stock'
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor='cost-price' className="block text-sm font-semibold mb-1.5" >Cost Price (RM)</label>
                <input
                  id='cost-price'
                  type="number"
                  value={calculatedCost}
                  readOnly
                  placeholder="Auto-calculated"
                  className="w-full p-3 bg-gray-100 rounded-lg border border-gray-200 outline-none opacity-60 cursor-not-allowed focus:outline-solid"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" htmlFor='reason'>Reason</label>
                <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full p-3 bg-red-50 rounded-lg border border-red-100 outline-none focus:outline-solid" id='reason'>
                  <option value="">Select...</option>
                  <option value="Returned">Returned</option>
                  <option value="Unsold">Unsold</option>
                  <option value="Expired">Expired</option>
                  <option value="Spoiled">Spoiled</option>
                </select>
              </div>
            </div>

            <button type='button' onClick={handleLogWaste} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition mt-2">
              Calculate Impact & Log
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
           <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex flex-col justify-center items-center text-center mb-6">
              <DollarSign size={32} className="text-red-500 mb-2" />
              <p className="text-sm text-red-700 font-bold uppercase tracking-wider mb-1">Total Profit Loss</p>
              <p className="text-5xl font-black text-red-600">RM {totalFinancialLoss.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-sm flex gap-3 items-start">
              <Sprout size={24} className="text-green-600 shrink-0 mt-0.5" />
              <p className="text-green-800 font-medium">
                Turning waste into fertilizer (Buat Baja) supports local agriculture, creating a circular food economy right here in our community.
              </p>
            </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Waste History & AI Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wasteLogs.map((log) => (
          <div key={log.id} className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:border-red-200 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{log.productName}</h3>
                <span className="text-xs font-bold text-red-600 uppercase">{log.reason}</span>
              </div>
              <button type='button' onClick={() => removeLog(log.id)} className="text-gray-300 hover:text-red-500" aria-label='Delete waste log'><Trash2 size={18} /></button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold">Profit Loss</p>
                <p className="text-lg font-bold text-red-6  00">RM {log.costLost.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-bold">Waste Rate</p>
                <p className="text-lg font-bold text-red-600">{log.wasteRate.toFixed(1)}%</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start mt-2">
              <Sparkles size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-blue-700 font-bold uppercase mb-1">AI Recommendation</p>
                <p className="text-sm text-blue-900 font-medium">{log.aiSuggestion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}