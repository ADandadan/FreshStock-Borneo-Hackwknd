"use client"

import { useState, useEffect } from "react"
import { WasteLog, SaleEntry, Product, PredictionResult } from "@/constants";

const WASTE_LOGS_KEY = 'freshstock_waste'
const SALES_KEY = 'freshstock_sales'
const SUPPLIERS_KEY = 'freshstock_suppliers'
const PRODUCTS_KEY = 'freshstock_products'
const PREDICTIONS_KEY = 'freshstock_predictions'
const MISC_KEY = 'freshstock_misc'


const MOCK_PREDICTIONS: PredictionResult[] = [
  {
    id: 'pred-1',
    productName: 'Fresh Tomatoes',
    avgDailySales: 10.7,
    currentStock: 45,
    nextWeekNeeded: 75,
    isShortage: true
  },
  {
    id: 'pred-2',
    productName: 'Nasi Lemak Pre-pack',
    avgDailySales: 12.5,
    currentStock: 8,
    nextWeekNeeded: 88,
    isShortage: true  // 88 needed, only 8 in stock
  },
  {
    id: 'pred-3',
    productName: 'Cabbage Heads',
    avgDailySales: 6.5,
    currentStock: 20,
    nextWeekNeeded: 46,
    isShortage: true
  },
  {
    id: 'pred-4',
    productName: 'White Rice (10kg)',
    avgDailySales: 9.3,
    currentStock: 30,
    nextWeekNeeded: 65,
    isShortage: true  // 65 needed, only 30 in stock
  },
  {
    id: 'pred-5',
    productName: 'Fresh Chicken (1kg)',
    avgDailySales: 17.0,
    currentStock: 15,
    nextWeekNeeded: 119,
    isShortage: true  // highest velocity item, critically short
  },
];

const MOCK_SUPPLIERS = [
    { 
		id: '1', 
		name: 'Borneo Agri-Coop', 
		ingredient: 'White Rice (10kg)', 
		prevPrice: 28.00, 
		currentPrice: 35.00, 
		percentIncrease: 25.0, 
		marginImpact: 7.00 
	},
    { 
		id: '2', 
		name: 'Ipoh Poultry', 
		ingredient: 'Fresh Chicken (1kg)', 
		prevPrice: 8.50, 
		currentPrice: 9.80, 
		percentIncrease: 15.3, 
		marginImpact: 1.30 
	},
    { 
		id: '3', 
		name: 'Cameron Greens', 
		ingredient: 'Cabbage (1kg)', 
		prevPrice: 3.00, 
		currentPrice: 4.50, 
		percentIncrease: 50.0, 
		marginImpact: 1.50 
	}
]

const MOCK_WASTE: WasteLog[] = [
  {
	id: 'mock-1', productName: 'Fresh Tomatoes', quantity: 5, reason: 'Spoiled',
	costLost: 15.00, wasteRate: 10.0, aiSuggestion: 'Check storage temperatures immediately. Compost if organic & safe.',
	date: new Date().toLocaleDateString('en-MY')
  },
  {
	id: 'mock-2', productName: 'Nasi Lemak Pre-pack', quantity: 12, reason: 'Unsold',
	costLost: 36.00, wasteRate: 24.0, aiSuggestion: 'Donate to local food banks or sell on surplus apps at 50% off.',
	date: new Date().toLocaleDateString('en-MY')
  },
  {
	id: 'mock-3', productName: 'Cabbage Heads', quantity: 3, reason: 'Expired',
	costLost: 9.00, wasteRate: 6.0, aiSuggestion: 'Convert to compost (Buat Baja) for community gardens.',
	date: new Date().toLocaleDateString('en-MY')
  }
];

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Fresh Tomatoes', inStock: 45, sellingPrice: 5.00 },
  { id: 2, name: 'Nasi Lemak Pre-pack', inStock: 8, sellingPrice: 3.00 },
  { id: 3, name: 'Cabbage Heads', inStock: 20, sellingPrice: 4.50 },
  { id: 4, name: 'White Rice (10kg)', inStock: 30, sellingPrice: 38.00 },
  { id: 5, name: 'Fresh Chicken (1kg)', inStock: 15, sellingPrice: 12.00 },
];

const today = new Date();
const daysAgo = (n: number) => new Date(today.getTime() - n * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const MOCK_SALES: SaleEntry[] = [
  { id: 's1', date: daysAgo(6), productId: 1, productName: 'Fresh Tomatoes', sellingPrice: 5.00, quantitySold: 10, revenue: 50.00 },
  { id: 's2', date: daysAgo(6), productId: 2, productName: 'Nasi Lemak Pre-pack', sellingPrice: 3.00, quantitySold: 25, revenue: 75.00 },
  { id: 's3', date: daysAgo(5), productId: 3, productName: 'Cabbage Heads', sellingPrice: 4.50, quantitySold: 8, revenue: 36.00 },
  { id: 's4', date: daysAgo(5), productId: 4, productName: 'White Rice (10kg)', sellingPrice: 38.00, quantitySold: 12, revenue: 456.00 },
  { id: 's5', date: daysAgo(4), productId: 5, productName: 'Fresh Chicken (1kg)', sellingPrice: 12.00, quantitySold: 18, revenue: 216.00 },
  { id: 's6', date: daysAgo(4), productId: 1, productName: 'Fresh Tomatoes', sellingPrice: 5.00, quantitySold: 14, revenue: 70.00 },
  { id: 's7', date: daysAgo(3), productId: 2, productName: 'Nasi Lemak Pre-pack', sellingPrice: 3.00, quantitySold: 30, revenue: 90.00 },
  { id: 's8', date: daysAgo(3), productId: 4, productName: 'White Rice (10kg)', sellingPrice: 38.00, quantitySold: 9, revenue: 342.00 },
  { id: 's9', date: daysAgo(2), productId: 3, productName: 'Cabbage Heads', sellingPrice: 4.50, quantitySold: 5, revenue: 22.50 },
  { id: 's10', date: daysAgo(2), productId: 5, productName: 'Fresh Chicken (1kg)', sellingPrice: 12.00, quantitySold: 22, revenue: 264.00 },
  { id: 's11', date: daysAgo(1), productId: 1, productName: 'Fresh Tomatoes', sellingPrice: 5.00, quantitySold: 8, revenue: 40.00 },
  { id: 's12', date: daysAgo(1), productId: 2, productName: 'Nasi Lemak Pre-pack', sellingPrice: 3.00, quantitySold: 20, revenue: 60.00 },
  { id: 's13', date: daysAgo(0), productId: 4, productName: 'White Rice (10kg)', sellingPrice: 38.00, quantitySold: 7, revenue: 266.00 },
  { id: 's14', date: daysAgo(0), productId: 5, productName: 'Fresh Chicken (1kg)', sellingPrice: 12.00, quantitySold: 11, revenue: 132.00 },
];

const MOCK_MISC = {
  wasteRate: 14.5,
  totalRevenue: 2119.5,
  foodSecurityScore: 66
}

export function DemoDataButton() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
	const waste = localStorage.getItem(WASTE_LOGS_KEY);
	const sales = localStorage.getItem(SALES_KEY);
	const suppliers = localStorage.getItem(SUPPLIERS_KEY);
	const products = localStorage.getItem(PRODUCTS_KEY);
	const predictions = localStorage.getItem(PREDICTIONS_KEY)

	if (waste !== null || sales !== null || suppliers !== null || products !== null || predictions !== null) {
    setLoaded(true);
	}
  }, [])

  const loadDemoData = () => {
    localStorage.setItem(WASTE_LOGS_KEY, JSON.stringify(MOCK_WASTE))
    localStorage.setItem(SALES_KEY, JSON.stringify(MOCK_SALES))
    localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(MOCK_SUPPLIERS))
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(MOCK_PRODUCTS))
    localStorage.setItem(PREDICTIONS_KEY, JSON.stringify(MOCK_PREDICTIONS))
    localStorage.setItem(MISC_KEY, JSON.stringify(MOCK_MISC))
    setLoaded(true)
    window.location.reload()
  }

  const clearData = () => {
	setLoaded(false)
    localStorage.clear()
    window.location.reload()
  }

  return (
    <div className="fixed bottom-4 right-4 flex gap-2 z-50">
      {!loaded ? (
        <button onClick={loadDemoData}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg text-sm hover:bg-indigo-700">
          Load Demo Data
        </button>
      ) : (
        <button onClick={clearData}
          className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg text-sm hover:bg-red-600">
          Clear Data
        </button>
      )}
    </div>
  )
}