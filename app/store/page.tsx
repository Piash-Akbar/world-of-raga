// src/app/store/page.tsx
"use client";

import { useState } from "react";
import { ShoppingBag, ShoppingCart, Plus, Minus, Search, ChevronDown } from "lucide-react";

const products = [
  {
    id: "1",
    name: "Premium Rosin",
    category: "Accessories",
    description: "High-quality rosin for optimal bow grip and tone production.",
    price: 850,
    image: "🎵",
    stock: 45,
  },
  {
    id: "2",
    name: "Violin String Set",
    category: "Accessories",
    description: "Premium violin strings set for rich, warm tone.",
    price: 1650,
    image: "🎻",
    stock: 28,
  },
  {
    id: "3",
    name: "Practice Notebook",
    category: "Books",
    description: "Dedicated practice notebook for tracking your progress and goals.",
    price: 420,
    image: "📓",
    stock: 120,
  },
  {
    id: "4",
    name: "World of Raag Tee",
    category: "Merchandise",
    description: "Premium quality t-shirt with the World of Raag logo.",
    price: 950,
    image: "👕",
    stock: 67,
  },
  {
    id: "5",
    name: "Violin Shoulder Rest",
    category: "Accessories",
    description: "Ergonomic shoulder rest for comfortable playing.",
    price: 1200,
    image: "🪑",
    stock: 34,
  },
  {
    id: "6",
    name: "Raga Practice Journal",
    category: "Books",
    description: "Comprehensive journal for raga practice and composition notes.",
    price: 550,
    image: "📖",
    stock: 89,
  },
];

const categories = ["All", "Accessories", "Books", "Merchandise"];

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<Record<string, number>>({});

  const filtered = products.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (productId: string) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => {
      const newCount = (prev[productId] || 0) - 1;
      if (newCount <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newCount };
    });
  };

  const totalItems = Object.values(cartItems).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cartItems).reduce((sum, [id, qty]) => {
    const product = products.find(p => p.id === id);
    return sum + (product?.price || 0) * qty;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Violin Store</h1>
            <p className="text-white/40">A small, curated shop for violin learners.</p>
          </div>
          
          {/* Cart Summary */}
          {totalItems > 0 && (
            <div className="bg-amber-400/10 border border-amber-400/20 rounded-lg px-4 py-2 flex items-center gap-4">
              <span className="text-white/60 text-sm">{totalItems} items</span>
              <span className="text-white font-semibold">৳{totalPrice}</span>
              <button className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-1 rounded font-medium transition text-sm">
                Checkout
              </button>
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition"
            />
          </div>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-400 transition cursor-pointer min-w-[150px]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-gray-900">
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => {
            const cartQty = cartItems[product.id] || 0;
            return (
              <div
                key={product.id}
                className="bg-white/5 hover:bg-white/10 rounded-xl overflow-hidden border border-white/10 transition group"
              >
                <div className="relative aspect-square bg-gradient-to-br from-amber-900/20 to-purple-900/20 flex items-center justify-center text-6xl">
                  {product.image}
                  <span className="absolute top-2 right-2 bg-white/10 text-white text-xs px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-semibold">{product.name}</h3>
                      <p className="text-white/40 text-sm mt-1 line-clamp-2">{product.description}</p>
                    </div>
                    <span className="text-amber-400 font-bold">৳{product.price}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-white/30 text-xs">In stock: {product.stock}</span>
                    {cartQty > 0 ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="bg-white/10 hover:bg-white/20 text-white p-1 rounded transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white w-6 text-center">{cartQty}</span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="bg-white/10 hover:bg-white/20 text-white p-1 rounded transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product.id)}
                        className="bg-amber-400 hover:bg-amber-500 text-black px-4 py-1.5 rounded font-medium transition flex items-center gap-1 text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/40">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}