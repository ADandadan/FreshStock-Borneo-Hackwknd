import { useState, useEffect } from 'react';

// --- Data Models ---
export interface Product {
  id: number;
  name: string;
  inStock: number;
  sellingPrice: number;
}

export interface SaleEntry {
  id: string;
  date: string;
  productId: number;
  productName: string;
  sellingPrice: number;
  quantitySold: number;
  revenue: number;
}

export interface WasteLog {
  id: string;
  quantity: number;
  costLost: number;
}

export function useSalesTracker() {
  // 1. State Management
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleEntry[]>([]);
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantitySold, setQuantitySold] = useState('');

  // 2. Persistence Logic (localStorage)
  useEffect(() => {
    const savedProducts = localStorage.getItem('freshstock_products');
    const savedSales = localStorage.getItem('freshstock_sales');
    const savedWaste = localStorage.getItem('freshstock_waste');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedSales) setSales(JSON.parse(savedSales));
    
    // Fallback dummy data
    if (!savedSales) {
        setSales([{ id: "s1", date: new Date().toISOString().split("T")[0], productId: 1, productName: "Fresh Tomatoes", sellingPrice: 5.0, quantitySold: 10, revenue: 50.0 }]);
    }
    if (savedWaste) setWasteLogs(JSON.parse(savedWaste));
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('freshstock_sales', JSON.stringify(sales));
    }
  }, [sales, isLoaded]);

  // 3. Actions
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
    setDate(new Date().toISOString().split("T")[0]);
    setSelectedProductId('');
    setQuantitySold('');
    setShowAddForm(false);
  };

  // 4. Computed Metrics (Calculations)
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

  const wasteScore = Math.max(0, 100 - parseFloat(wasteRate as string) * 5);
  const stockScore = products.every((p) => p.inStock > 10) ? 100 : 70;
  const salesScore = totalQuantitySold > 100 ? 100 : (totalQuantitySold / 100) * 100;
  const foodSecurityScore = Math.round((wasteScore + stockScore + salesScore) / 3) || 0;

  // 5. Expose everything the UI needs
  return {
    isLoaded,
    showAddForm, setShowAddForm,
    showInfo, setShowInfo,
    date, setDate,
    selectedProductId, setSelectedProductId,
    quantitySold, setQuantitySold,
    products,
    handleLogSale,
    totalRevenue,
    totalQuantitySold,
    wasteRate,
    overstockRate,
    revenueByDate,
    bestSelling,
    lowPerforming,
    foodSecurityScore
  };
}
