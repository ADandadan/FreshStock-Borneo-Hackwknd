"use client";

import React, { useState, useEffect } from 'react';
import { Store, TrendingUp, TrendingDown, PlusCircle, Trash2, HelpCircle, FileText, UploadCloud, Globe, CloudRain, Truck } from 'lucide-react';

interface Supplier {
  id: string; name: string; ingredient: string;
  prevPrice: number; currentPrice: number;
  percentIncrease: number; marginImpact: number;
}

export default function SupplierPricesPage() {
  const [name, setName] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [prevPrice, setPrevPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [showReasonId, setShowReasonId] = useState<string | null>(null);

  // Start with an empty array so we can load from memory first
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- THE MAGIC MEMORY TRICK ---
  
  // 1. LOAD DATA when the page opens
  useEffect(() => {
    const saved = localStorage.getItem('freshstock_suppliers');
    if (saved) {
      setSuppliers(JSON.parse(saved));
    } else {
      // If no memory exists (first time visitor), load the cool defaults
      setSuppliers([
        { id: '1', name: 'Borneo Agri-Coop', ingredient: 'White Rice (10kg)', prevPrice: 28.00, currentPrice: 35.00, percentIncrease: 25.0, marginImpact: 7.00 },
        { id: '2', name: 'Ipoh Poultry', ingredient: 'Fresh Chicken (1kg)', prevPrice: 8.50, currentPrice: 9.80, percentIncrease: 15.3, marginImpact: 1.30 },
        { id: '3', name: 'Cameron Greens', ingredient: 'Cabbage (1kg)', prevPrice: 3.00, currentPrice: 4.50, percentIncrease: 50.0, marginImpact: 1.50 }
      ]);
    }
    setIsLoaded(true);
  }, []);

  // 2. SAVE DATA every time the 'suppliers' list changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('freshstock_suppliers', JSON.stringify(suppliers));
    }
  }, [suppliers, isLoaded]);

  // ------------------------------

  const handleAddSupplier = () => {
    if (!name || !ingredient || !prevPrice || !currentPrice) return alert("Fill all fields");
    const oldP = parseFloat(prevPrice);
    const newP = parseFloat(currentPrice);
    const margin = newP - oldP;
    const percent = oldP > 0 ? ((newP - oldP) / oldP) * 100 : 0;

    const newSupplier: Supplier = {
      id: Date.now().toString(), name, ingredient,
      prevPrice: oldP, currentPrice: newP, marginImpact: margin, percentIncrease: percent,
    };

    setSuppliers([newSupplier, ...suppliers]);
    setName(''); setIngredient(''); setPrevPrice(''); setCurrentPrice('');
  };

  const removeSupplier = (id: string) => setSuppliers(suppliers.filter(s => s.id !== id));
  const toggleReason = (id: string) => setShowReasonId(showReasonId === id ? null : id);

  // --- SMART REASON GENERATOR ---
  const getCustomReasons = (ingredientName: string) => {
    const lower = ingredientName.toLowerCase();
    
    if (lower.includes('rice') || lower.includes('beras')) {
      return [
        { icon: <CloudRain size={14}/>, text: "Climate Factors: Droughts in Southeast Asia reducing paddy yields." },
        { icon: <Globe size={14}/>, text: "Import Dependency: Export restrictions from major global suppliers (e.g. India)." }
      ];
    } else if (lower.includes('chicken') || lower.includes('ayam') || lower.includes('poultry')) {
      return [
        { icon: <Globe size={14}/>, text: "Feed Costs: Global spikes in imported corn and soybean prices affecting poultry feed." },
        { icon: <Truck size={14}/>, text: "Logistics: Higher diesel costs impacting transport from rural farms." }
      ];
    } else if (lower.includes('veg') || lower.includes('cabbage') || lower.includes('tomato') || lower.includes('sayur')) {
      return [
        { icon: <CloudRain size={14}/>, text: "Weather Extremes: Monsoon rains damaging highland crop yields (e.g. Cameron Highlands)." },
        { icon: <Globe size={14}/>, text: "Fertilizer Costs: Currency exchange rates increasing the price of imported agricultural chemicals." }
      ];
    } else {
      return [
        { icon: <Globe size={14}/>, text: "Macroeconomics: General food inflation and currency fluctuations." },
        { icon: <Truck size={14}/>, text: "Supply Chain: Increased fuel and distribution costs nationwide." }
      ];
    }
  };

  // Prevent hydration mismatch by not rendering the list until loaded
  if (!isLoaded) return <div className="ml-64 p-10 bg-[#FFFCF6] min-h-screen">Loading...</div>;

  return (
    <div className="ml-64 p-10 bg-[#FFFCF6] min-h-screen font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-950 mb-1">Market Price Intelligence</h1>
        <p className="text-gray-500 text-lg">Track ingredient inflation, margin impact, and global factors</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold mb-6">Log Supplier Price Change</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Supplier Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Borneo Agri-Coop" className="w-full p-3 bg-blue-50 rounded-lg border border-blue-100 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Ingredient</label>
                <input type="text" value={ingredient} onChange={(e) => setIngredient(e.target.value)} placeholder="e.g. White Rice (10kg)" className="w-full p-3 bg-blue-50 rounded-lg border border-blue-100 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Previous Price (RM)</label>
                <input type="number" value={prevPrice} onChange={(e) => setPrevPrice(e.target.value)} placeholder="0.00" className="w-full p-3 bg-blue-50 rounded-lg border border-blue-100 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Current Price (RM)</label>
                <input type="number" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} placeholder="0.00" className="w-full p-3 bg-blue-50 rounded-lg border border-blue-100 outline-none" />
              </div>
            </div>

            <button onClick={handleAddSupplier} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition mt-2 flex justify-center items-center gap-2">
              <PlusCircle size={18} /> Analyze Price Change
            </button>
          </div>
        </div>

        <div className="bg-purple-50 p-8 rounded-2xl border-2 border-dashed border-purple-200 shadow-sm flex flex-col items-center justify-center text-center relative hover:border-purple-400 hover:bg-purple-100 transition-all group">
            <input type="file" accept=".csv" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" title="Click to upload CSV" />
            <div className="bg-white p-4 rounded-full mb-3 shadow-sm group-hover:-translate-y-1 transition-transform">
              <UploadCloud size={32} className="text-purple-500" />
            </div>
            <h3 className="text-lg font-bold text-purple-900 mb-1">Bulk Import Quotes</h3>
            <p className="text-xs text-purple-600 mb-4 px-2">Upload your market spreadsheet to instantly calculate margin impacts.</p>
            <div className="bg-purple-500 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2">
              <FileText size={16} /> Select File
            </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Inflation & Margin Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col hover:border-blue-200 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{supplier.name}</h3>
                <span className="text-xs font-bold text-gray-500">{supplier.ingredient}</span>
              </div>
              <button onClick={() => removeSupplier(supplier.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Old</p>
                <p className="text-lg font-semibold text-gray-400 line-through">RM{supplier.prevPrice.toFixed(2)}</p>
              </div>
              <div className="text-gray-300">➔</div>
              <div>
                <p className="text-xs text-gray-800 font-bold uppercase">New</p>
                <p className="text-2xl font-black text-gray-900">RM{supplier.currentPrice.toFixed(2)}</p>
              </div>
            </div>

            <div className={`p-3 rounded-xl border flex items-center justify-between mb-4 ${supplier.percentIncrease > 0 ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'}`}>
               <div className="flex items-center gap-2">
                 {supplier.percentIncrease > 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                 <span className="font-bold">{Math.abs(supplier.percentIncrease).toFixed(1)}% {supplier.percentIncrease > 0 ? 'Increase' : 'Decrease'}</span>
               </div>
               <span className="text-xs font-bold">Margin: {supplier.marginImpact > 0 ? '-' : '+'}RM{Math.abs(supplier.marginImpact).toFixed(2)}</span>
            </div>

            <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 mb-4">
              <p className="text-xs text-orange-800 font-bold mb-1">💡 Action Required</p>
              <p className="text-sm text-orange-900">
                {supplier.marginImpact > 0 
                  ? `Suggest increasing menu price by RM ${supplier.marginImpact.toFixed(2)} to protect profit margins.` 
                  : `Cost decreased. Maintain prices to increase profit margin.`}
              </p>
            </div>

            <div className="mt-auto">
              <button onClick={() => toggleReason(supplier.id)} className="w-full flex items-center justify-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 py-2 rounded-lg hover:bg-blue-100 transition">
                <HelpCircle size={16} /> Why is this happening?
              </button>
              
              {showReasonId === supplier.id && (
                <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 space-y-3 animate-in fade-in zoom-in duration-200">
                  <p className="font-bold text-gray-900 border-b pb-1">AI Market Analysis:</p>
                  
                  {getCustomReasons(supplier.ingredient).map((reason, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="text-red-500 shrink-0 mt-0.5">{reason.icon}</div>
                      <p>{reason.text}</p>
                    </div>
                  ))}

                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}