"use client";

import { useState, useEffect } from 'react';
import { Package, Trash2, Plus } from 'lucide-react';
import type { Product, Ingredient } from '@/constants';

export default function ProductStockPage() {
  // --- State ---
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Form State ---
  const [productName, setProductName] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'Rice', quantity: 200, unit: 'g', price: 0 }
  ]);

  // --- Persistence Logic ---
  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('freshstock_products');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load products", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever products change
  useEffect(() => {
    const productsJSON = JSON.stringify(products);
    if (isLoaded && productsJSON !== "[]") {
      localStorage.setItem('freshstock_products', JSON.stringify(products));
    }
  }, [products, isLoaded]);

  // --- Logic Functions ---
  const addIngredientRow = () => {
    setIngredients([...ingredients, { id: Date.now().toString(), name: '', quantity: '', unit: 'g', price: '' }]);
  };

  const removeIngredientRow = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, [field]: value } : ing));
  };

  const calculateTotalCost = (ingreds: Ingredient[]) => {
    return ingreds.reduce((sum, ing) => sum + (Number(ing.price) || 0), 0);
  };

  const handleSaveProduct = () => {
    if (!productName) return alert("Please enter a product name");

    const newProduct: Product = {
      id: Date.now(),
      name: productName,
      sellingPrice: parseFloat(sellingPrice) || 0,
      inStock: parseInt(currentStock, 10) || 0,
      ingredients: [...ingredients]
    };

    setProducts(prev => [newProduct, ...prev]);
    resetForm();
  };

  const deleteFullProduct = (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setProductName('');
    setSellingPrice('');
    setCurrentStock('');
    setIngredients([{ id: '1', name: 'Rice', quantity: 200, unit: 'g', price: 0 }]);
  };

  // Wait for hydration to prevent layout shift
  if (!isLoaded) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-10 bg-[#FFFCF6] min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-950 mb-1">Product Stock</h1>
          <p className="text-gray-500 text-lg">Manage your products and calculate costs</p>
        </div>
        {!showAddForm && (
          <button 
            type='button'
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 transition shadow-md"
          >
            <Plus size={20} /> Add Product
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {showAddForm ? (
        <div className="bg-white p-8 rounded-2xl border border-orange-200 shadow-sm max-w-5xl animate-in fade-in zoom-in duration-200">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Add New Product</h2>
          <p className="text-sm text-gray-500 mb-8">Enter product details and ingredients</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label htmlFor='product-name' className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
              <input 
                id='product-name'
                value={productName} 
                onChange={(e) => setProductName(e.target.value)} 
                className="w-full px-4 py-2.5 bg-orange-50 rounded-lg border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-200" 
                placeholder="e.g. Nasi Lemak" 
              />
            </div>
            <div>
              <label htmlFor='selling-price' className="block text-sm font-semibold text-gray-700 mb-1.5">Selling Price (RM)</label>
              <input
                id='selling-price'
                value={sellingPrice} 
                onChange={(e) => setSellingPrice(e.target.value)} 
                className="w-full px-4 py-2.5 bg-orange-50 rounded-lg border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-200" 
                placeholder="0.00" 
              />
            </div>
            <div>
              <label htmlFor='current-stock' className="block text-sm font-semibold text-gray-700 mb-1.5">Current Stock</label>
              <input
                id='current-stock'
                value={currentStock} 
                onChange={(e) => setCurrentStock(e.target.value)} 
                className="w-full px-4 py-2.5 bg-orange-50 rounded-lg border border-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-200" 
                placeholder="0" 
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800 text-lg">Ingredients</h3>
              <button 
                type='button'
                onClick={addIngredientRow} 
                className="text-orange-600 text-sm font-bold flex items-center gap-1.5 bg-orange-50 px-4 py-2 rounded-lg hover:bg-orange-100 transition"
              >
                <Plus size={18} /> Add Ingredient
              </button>
            </div>

            <div className="space-y-3 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
              {ingredients.map((ing) => (
                <div key={ing.id} className="grid grid-cols-[2fr,1fr,1fr,1.5fr,auto] gap-4 items-center">
                  <input 
                    placeholder="Name" 
                    value={ing.name} 
                    onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)} 
                    className="w-full px-4 py-2 rounded-lg border border-gray-100 focus:ring-2 focus:ring-orange-200" 
                  />
                  <input 
                    placeholder="Qty" 
                    type="number" 
                    value={ing.quantity} 
                    onChange={(e) => updateIngredient(ing.id, 'quantity', e.target.value)} 
                    className="w-full px-4 py-2 rounded-lg border border-gray-100" 
                  />
                  <input 
                    placeholder="Unit" 
                    value={ing.unit} 
                    onChange={(e) => updateIngredient(ing.id, 'unit', e.target.value)} 
                    className="w-full px-4 py-2 rounded-lg border border-gray-100" 
                  />
                  <input 
                    placeholder="Price (RM)" 
                    type="number" 
                    value={ing.price} 
                    onChange={(e) => updateIngredient(ing.id, 'price', e.target.value)} 
                    className="w-full px-4 py-2 rounded-lg border border-gray-100 font-medium text-gray-900" 
                  />
                  <button 
                    type='button'
                    onClick={() => removeIngredientRow(ing.id)} 
                    className="text-gray-400 hover:text-red-500 p-1 transition"
                    aria-label='Remove ingredient'
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center bg-green-50 p-6 rounded-xl mb-10 border border-green-100">
            <div>
              <p className="text-sm text-green-700 font-medium mb-1">Total Cost</p>
              <p className="text-3xl font-bold text-gray-900">RM {calculateTotalCost(ingredients).toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-700 font-medium mb-1">Profit per Unit</p>
              <p className="text-3xl font-bold text-green-600">
                RM {( (parseFloat(sellingPrice) || 0) - calculateTotalCost(ingredients) ).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              type='button'
              onClick={handleSaveProduct} 
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition"
            >
              Add Product
            </button>
            <button 
              type='button'
              onClick={resetForm} 
              className="px-10 py-4 bg-white border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-400 font-medium text-lg">No products added yet. Click 'Add Product' to start.</p>
            </div>
          ) : (
            products.map((p) => (
              <div key={p.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative group hover:shadow-md transition-shadow">
                <button 
                  type='button'
                  onClick={() => deleteFullProduct(p.id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"
                  aria-label="Delete product"
                >
                  <Trash2 size={18} />
                </button>
                
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-5">
                  <Package className="text-orange-500" size={24} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{p.name}</h3>
                <p className="text-gray-500 font-medium mb-6">{p.inStock} units in stock</p>
                
                <div className="space-y-2.5 text-sm mb-8 border-t border-gray-50 pt-5">
                  <p className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-3">Ingredients</p>
                  {p.ingredients?.map((ing) => (
                    <div key={ing.name} className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">{ing.name} <span className="text-gray-400 text-xs ml-1">({ing.quantity}{ing.unit})</span></span>
                      <span className="font-bold text-gray-800">RM {Number(ing.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-end border-t border-gray-50 pt-5 mt-auto">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Total Cost</p>
                    <p className="text-lg font-bold text-gray-900">RM {calculateTotalCost(p.ingredients ?? []).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Selling</p>
                    <p className="text-lg font-bold text-gray-900">RM {p.sellingPrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Profit</p>
                    <p className="text-lg font-bold text-[#008a00]">RM {(p.sellingPrice - calculateTotalCost(p.ingredients ?? [])).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}