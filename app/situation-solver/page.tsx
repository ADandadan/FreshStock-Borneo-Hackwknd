"use client";

import { useState, useEffect } from 'react';
import { 
  CloudRain, Wind, Thermometer, Banknote, Fuel, 
  Ban, Snowflake, Ship, Bug, ArrowLeft, AlertTriangle, Info 
} from 'lucide-react';

import type { Scenario, Product } from '@/constants';

const SCENARIOS: Scenario[] = [
  // Climate & Natural Disaster
  {
    id: 'flood',
    category: 'Climate & Natural Disaster',
    title: 'Flood Disrupts Supply',
    icon: <CloudRain className="text-orange-500" size={20} />,
    priceImpactText: 'Logistic surcharge +15% due to alternative routing',
    wasteImpactText: '+20% spoilage due to high humidity and transit delays',
    priceMod: 0.15, wasteMod: 0.20, riskLevel: 'HIGH',
    recommendations: ["Review and optimize inventory levels", "Communicate price changes to customers in advance", "Increase monitoring of stock movement"]
  },
  {
    id: 'typhoon',
    category: 'Climate & Natural Disaster',
    title: 'Typhoon Hits Farming Region',
    icon: <Wind className="text-orange-500" size={20} />,
    priceImpactText: 'Raw material cost +20% due to crop destruction',
    wasteImpactText: '+15% "ugly food" waste (damaged-but-edible goods rejected by consumers)',
    priceMod: 0.20, wasteMod: 0.15, riskLevel: 'HIGH',
    recommendations: ["Review and optimize inventory levels", "Communicate price changes to customers in advance", "Increase monitoring of stock movement"]
  },
  {
    id: 'heatwave',
    category: 'Climate & Natural Disaster',
    title: 'Extreme Heat Wave',
    icon: <Thermometer className="text-orange-500" size={20} />,
    priceImpactText: '+12% operational cost (refrigeration power surge)',
    wasteImpactText: '+25% shelf-life reduction for fresh produce',
    priceMod: 0.12, wasteMod: 0.25, riskLevel: 'CRITICAL',
    recommendations: ["Implement emergency stock reduction measures immediately", "Consider temporary price adjustments to maintain margins", "Diversify suppliers to reduce dependency"]
  },
  // Economic & Policy Scenarios
  {
    id: 'currency',
    category: 'Economic & Policy Scenarios',
    title: 'Currency Depreciation (Imported Goods)',
    icon: <Banknote className="text-yellow-600" size={20} />,
    priceImpactText: '+18% increase in cost for imported ingredients (e.g., flour, dairy)',
    wasteImpactText: 'No direct waste impact',
    priceMod: 0.18, wasteMod: 0, riskLevel: 'HIGH',
    specialAlert: { title: 'Food Security Literacy', text: 'Global markets affect local breakfast prices. When currency weakens, imported goods become more expensive.', type: 'literacy' },
    recommendations: ["Review and optimize inventory levels", "Communicate price changes to customers in advance", "Increase monitoring of stock movement"]
  },
  {
    id: 'fuel',
    category: 'Economic & Policy Scenarios',
    title: 'Fuel Price Surge',
    icon: <Fuel className="text-orange-500" size={20} />,
    priceImpactText: '+10% "last-mile" delivery fee added to every item',
    wasteImpactText: 'Reduced delivery frequency leads to +5% overstocking risk to avoid shortages',
    priceMod: 0.10, wasteMod: 0.05, riskLevel: 'LOW',
    recommendations: ["Maintain current operations", "Use this as an opportunity to optimize processes", "Document learnings for future reference"]
  },
  {
    id: 'export-ban',
    category: 'Economic & Policy Scenarios',
    title: 'Export Ban on Staples',
    icon: <Ban className="text-red-500" size={20} />,
    priceImpactText: 'Local market price +30% due to artificial scarcity',
    wasteImpactText: 'No direct waste impact',
    priceMod: 0.30, wasteMod: 0, riskLevel: 'CRITICAL',
    specialAlert: { title: 'Security Score Impact', text: 'Significant drop in community food stability', type: 'security' },
    recommendations: ["Implement emergency stock reduction measures immediately", "Consider temporary price adjustments to maintain margins", "Diversify suppliers to reduce dependency"]
  },
  // Supply Chain & Food Safety
  {
    id: 'cold-storage',
    category: 'Supply Chain & Food Safety',
    title: 'Cold Storage Failure',
    icon: <Snowflake className="text-blue-500" size={20} />,
    priceImpactText: 'Immediate 10% price hike on remaining "safe" stock to cover losses',
    wasteImpactText: '100% loss of affected perishable batch',
    priceMod: 0.10, wasteMod: 1.0, riskLevel: 'CRITICAL',
    recommendations: ["Implement emergency stock reduction measures immediately", "Consider temporary price adjustments to maintain margins", "Diversify suppliers to reduce dependency"]
  },
  {
    id: 'port-delay',
    category: 'Supply Chain & Food Safety',
    title: 'Port Delay',
    icon: <Ship className="text-green-600" size={20} />,
    priceImpactText: 'Scarcity-driven price increase (+15%)',
    wasteImpactText: '+30% of goods arrive "near-expiry," forcing immediate 50% discounts or disposal',
    priceMod: 0.15, wasteMod: 0.30, riskLevel: 'CRITICAL',
    recommendations: ["Implement emergency stock reduction measures immediately", "Consider temporary price adjustments to maintain margins", "Diversify suppliers to reduce dependency"]
  },
  {
    id: 'pest',
    category: 'Supply Chain & Food Safety',
    title: 'Pest Contamination',
    icon: <Bug className="text-red-500" size={20} />,
    priceImpactText: '+5% cost increase for new preventive packaging',
    wasteImpactText: 'Immediate disposal of ~15% of total dry stock',
    priceMod: 0.05, wasteMod: 0.15, riskLevel: 'MEDIUM',
    recommendations: ["Monitor the situation closely", "Prepare contingency plans", "Consider incremental price adjustments"]
  }
];

export default function SituationSolverPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('freshstock_products');
    if (saved) setProducts(JSON.parse(saved));
  }, []);

  const calculateImpacts = (scenario: Scenario) => {
    // Standard baseline for calculation based on the visual video data
    const currentTotalStock = products.reduce((acc, p) => acc + p.inStock, 0) || 45; 
    const stockShortage = Math.ceil(currentTotalStock * scenario.wasteMod);
    const costIncrease = (currentTotalStock * scenario.priceMod * 2.30);
    const revenueImpact = (costIncrease + (stockShortage * 4.04)).toFixed(2); 
    
    return { stockShortage, revenueImpact };
  };

  // --- ANALYSIS VIEW (When a situation is selected) ---
  if (selectedScenario) {
    const { stockShortage, revenueImpact } = calculateImpacts(selectedScenario);
    const riskColors = { LOW: 'text-green-500', MEDIUM: 'text-yellow-500', HIGH: 'text-orange-500', CRITICAL: 'text-red-600' };

    return (
      <div className="p-10 bg-[#FFFCF6] min-h-screen font-sans">
        <button type='button'
          onClick={() => setSelectedScenario(null)} 
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold mb-6 hover:bg-gray-50 transition"
        >
          <ArrowLeft size={16} /> Back to Situations
        </button>

        {/* Top Header Card */}
        <div className="bg-white p-6 rounded-2xl border border-orange-200 mb-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">{selectedScenario.icon}</div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-tight">{selectedScenario.category}</p>
              <h2 className="text-2xl font-black text-gray-950 leading-tight">{selectedScenario.title}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#FFF5F5] border border-red-100 rounded-xl">
              <p className="text-sm font-bold text-red-800 mb-1 flex items-center gap-2">💰 Price Impact</p>
              <p className="text-xs text-red-700 leading-relaxed">{selectedScenario.priceImpactText}</p>
            </div>
            <div className="p-4 bg-[#FFFAEC] border border-yellow-200 rounded-xl">
              <p className="text-sm font-bold text-yellow-800 mb-1 flex items-center gap-2">🗑️ Waste Impact</p>
              <p className="text-xs text-yellow-700 leading-relaxed">{selectedScenario.wasteImpactText}</p>
            </div>
          </div>

          {/* Alert Box for Literacy or Security Impact */}
          {selectedScenario.specialAlert && (
            <div className={`mt-4 p-4 rounded-xl border flex gap-3 items-center ${
              selectedScenario.specialAlert.type === 'security' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
            }`}>
              {selectedScenario.specialAlert.type === 'security' ? <AlertTriangle className="text-red-500" size={18} /> : <Info className="text-green-500" size={18} />}
              <div>
                <p className={`text-xs font-bold uppercase tracking-tight ${
                  selectedScenario.specialAlert.type === 'security' ? 'text-red-800' : 'text-green-800'
                }`}>{selectedScenario.specialAlert.title}</p>
                <p className="text-xs text-gray-600 leading-tight">{selectedScenario.specialAlert.text}</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Analysis Card */}
        <div className="bg-white p-8 rounded-3xl border border-orange-100 shadow-sm border-b-4 border-b-orange-400">
          <h3 className="text-lg font-bold text-gray-900">Impact Analysis on Your Business</h3>
          <p className="text-sm text-gray-500 mb-8">Based on your current inventory</p>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <div className="bg-white border border-gray-50 p-6 rounded-2xl text-center shadow-sm">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Revenue Impact</p>
              <p className="text-3xl font-black text-red-500">-RM {revenueImpact}</p>
            </div>
            <div className="bg-white border border-gray-50 p-6 rounded-2xl text-center shadow-sm">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Stock Shortage</p>
              <p className="text-3xl font-black text-yellow-500">{stockShortage} units</p>
            </div>
            <div className="bg-white border border-gray-50 p-6 rounded-2xl text-center shadow-sm">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Risk Level</p>
              <p className={`text-3xl font-black ${riskColors[selectedScenario.riskLevel]}`}>{selectedScenario.riskLevel}</p>
            </div>
          </div>

          {/* Detailed Breakdown List */}
          <div className="space-y-4 mb-10 text-sm">
             <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Cost Increase</span>
                <span className="font-bold text-gray-900">+RM {(parseFloat(revenueImpact) * 0.4).toFixed(2)}</span>
             </div>
             <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Price Impact</span>
                <span className="font-bold text-gray-900">+{selectedScenario.priceMod * 100}%</span>
             </div>
             <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Waste Increase</span>
                <span className="font-bold text-gray-900">+{selectedScenario.wasteMod * 100}%</span>
             </div>
          </div>

          {/* Recommendations Box */}
          <div className="bg-[#FFF4E5] p-6 rounded-2xl border border-orange-100">
            <h4 className="flex items-center gap-2 text-sm font-bold text-orange-900 mb-4 italic">💡 Recommendations</h4>
            <ul className="space-y-3">
              {selectedScenario.recommendations.map((rec) => (
                <li key={crypto.randomUUID()} className="text-xs text-gray-700 flex gap-2 leading-relaxed">
                  <span className="text-orange-700 font-bold">•</span> {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // --- GRID VIEW (Main Selection Page) ---
  return (
    <div className="p-10 bg-[#FFFCF6] min-h-screen font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-950 mb-1">Situation Problem Solver</h1>
        <p className="text-gray-500 text-lg">Simulate market scenarios and understand their impacts</p>
      </header>

      {['Climate & Natural Disaster', 'Economic & Policy Scenarios', 'Supply Chain & Food Safety'].map((cat) => (
        <div key={cat} className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-gray-800">{cat}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SCENARIOS.filter(s => s.category === cat).map((scenario) => (
              <div key={scenario.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition cursor-default">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-orange-50 rounded-lg">{scenario.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-950 text-sm leading-tight">{scenario.title}</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{cat}</p>
                  </div>
                </div>
                <button type='button'
                  onClick={() => setSelectedScenario(scenario)} 
                  className="w-full py-4 bg-white border border-gray-100 text-gray-500 text-sm font-bold rounded-2xl 
                             hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-200
                             active:bg-emerald-600 active:scale-[0.98] transition-all duration-200"
                >
                  View Impact
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}