// src/components/UI-UX/common/FeaturedProducts.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import Link from 'next/link';

// --- TYPE DEFINITIONS & API CONFIG ---
interface ProductItem {
  id: string; 
  name: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number; 
  imageUrl: string;
  isNewArrival?: boolean; 
  _id?: string; //  MongoDB ID support
}

const API_URL = 'http://localhost:5000/products?isFeatured=true';

// --- FRAMER MOTION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// --- PRODUCT CARD COMPONENT ---
const ProductCard: React.FC<{ product: ProductItem; variants: any }> = ({ product, variants }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  //  Safe product ID getter
  const getProductId = () => {
    return product.id || product._id || `temp-${Math.random().toString(36).substr(2, 9)}`;
  };

  //  Safe product URL
  const getProductUrl = () => {
    const productId = getProductId();
    return productId && !productId.includes('temp-') ? `/product/${productId}` : '#';
  };

  //  Old Price Calculate Karne Ka Formula
  const oldPrice = product.discountPercentage > 0 
    ? product.price / (1 - product.discountPercentage / 100)
    : undefined;

  const stars = Array(5).fill(0).map((_, i) => (
    <Star 
      key={`star-${getProductId()}-${i}`} //  Unique key with product ID
      size={16} 
      fill={i < Math.floor(product.rating) ? '#FBBF24' : 'none'} 
      stroke="#FBBF24" 
    />
  ));

  const productUrl = getProductUrl();
  const productId = getProductId();

  return (
    <motion.div 
      variants={variants}
      initial="hidden"
      animate="visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative overflow-hidden bg-white group shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg"
    >
      {/*  IMAGE CONTAINER - White background aur centered image */}
      <div className="relative h-64 w-full overflow-hidden bg-white flex items-center justify-center p-4">
        {/*  Image with proper sizing - centered and medium size */}
        <img
          src={product.imageUrl || '/placeholder-image.jpg'}
          alt={product.name}
          className={`max-w-full max-h-48 object-contain transition-all duration-500 ease-in-out ${
            imageLoaded ? 'group-hover:opacity-70' : 'opacity-0'
          } ${imageError ? 'hidden' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        
        {/*  Fallback agar image load na ho */}
        {imageError && (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
            <div className="text-4xl mb-2"></div>
            <span className="text-sm text-center px-2">Image not available</span>
          </div>
        )}
        
        {/* Loading State */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="animate-pulse flex space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
        
        {/*  Hover Icons - Black hover effect remove kiya */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex space-x-3"
          >
            <button className="p-3 bg-white rounded-full shadow-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-110">
              <Heart size={20} className="text-gray-700 hover:text-red-500 transition-colors" />
            </button>
            
            {/*  Safe Link - only if valid product ID */}
            {productUrl !== '#' ? (
              <Link href={productUrl}>
                <button className="p-3 bg-green-700 rounded-full shadow-lg hover:bg-[#629D23] transition-all duration-300 transform hover:scale-110">
                  <Eye size={20} className="text-white transition-colors" />
                </button>
              </Link>
            ) : (
              <button 
                className="p-3 bg-gray-500 rounded-full shadow-lg cursor-not-allowed"
                title="Product not available"
              >
                <Eye size={20} className="text-white" />
              </button>
            )}
          </motion.div>
        </div>

        {/* 'New' Tag */}
        {product.isNewArrival && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
            NEW
          </span>
        )}

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            -{product.discountPercentage}%
          </span>
        )}

        {/*  Invalid Product Warning */}
        {productUrl === '#' && (
          <span className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            NO ID
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{product.category}</p>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
        
        <div className="flex justify-center items-center mb-2">
          {stars}
          <span className="text-sm text-gray-500 ml-1">({product.rating})</span>
        </div>
        
        <div className="flex justify-center items-center space-x-2">
          <span className={`text-xl font-bold ${oldPrice ? 'text-red-600' : 'text-gray-900'}`}>
            ${product.price.toFixed(2)}
          </span>
          {oldPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${oldPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
      
      {/* Add to Cart Button */}
      <AnimatePresence>
        {isHovered && (
          <motion.button
            key={`add-to-cart-${productId}`} //  Unique key for animation
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-[#2D3B29] text-white py-3 flex items-center justify-center font-semibold text-sm hover:bg-[#4c781d] transition-colors duration-200"
            onClick={(e) => {
              e.preventDefault();
              alert(`Added ${product.name} to cart!`);
            }}
          >
            <ShoppingBag size={18} className="mr-2" />
            Add to Cart
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
export default function FeaturedProducts() {
  const [products, setProducts] = useState<ProductItem[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //  DYNAMIC DATA FETCHING LOGIC
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Failed to fetch featured products. Status: ${res.status}`);
        }
        
        const data = await res.json();
        
        //  Data validation - ensure it's an array
        if (Array.isArray(data)) {
          //  Data mapping with proper IDs
          const mappedProducts = data.map((item: any, index: number) => {
            //  Multiple ID sources check karein
            const productId = item.id || item._id?.toString() || `temp-${index + 1}`;
            
            return {
              id: productId,
              _id: item._id,
              name: item.name || 'Unnamed Product',
              category: item.category || 'Uncategorized',
              price: item.price || 0,
              discountPercentage: item.discountPercentage || 0,
              rating: item.rating || 0,
              imageUrl: item.imageUrl || '',
              isNewArrival: item.isNewArrival || false,
            };
          });
          
          setProducts(mappedProducts);
        } else {
          throw new Error('Invalid data format received from API');
        }
        
      } catch (error) {
        console.error("Fetching featured products failed:", error);
        setError(error instanceof Error ? error.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Loading State
  if (isLoading) {
    return (
      <section className="bg-gray-200 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm text-gray-600 uppercase tracking-widest mb-2">Shop Our New Releases</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Featured Products</h2>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D3B29]"></div>
            <span className="ml-3 text-gray-600">Loading featured products...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className="bg-gray-200 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm text-gray-600 uppercase tracking-widest mb-2">Shop Our New Releases</p>
            <h2 className="text-4xl font-extrabold text-gray-900">Featured Products</h2>
          </div>
          <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg">
            <p className="text-lg font-semibold">Error loading products</p>
            <p className="text-sm mt-2">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-[#2D3B29] text-white rounded-md hover:bg-[#4c781d] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  //  Count valid vs invalid products
  const validProducts = products.filter(p => p.id && !p.id.includes('temp-'));
  const invalidProducts = products.filter(p => p.id.includes('temp-'));

  return (
    <section className="bg-gray-200 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-sm text-gray-600 uppercase tracking-widest mb-2">Shop Our New Releases</p>
          <h2 className="text-4xl font-extrabold text-gray-900">Featured Products</h2>
          
          {/*  Products Status Info */}
          {invalidProducts.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> {invalidProducts.length} products have invalid IDs and cannot be viewed in detail.
              </p>
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="text-lg mb-2">No featured products found.</p>
            <p className="text-sm">Check back later for new arrivals!</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {products.map((product, index) => (
              <ProductCard 
                key={product.id} // Now guaranteed to be unique
                product={product} 
                variants={itemVariants} 
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}