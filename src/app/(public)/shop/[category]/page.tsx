// app/shop/[category]/page.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// UPDATED: id string type ki hai
interface Product {
  id: string; // CHANGED: number -> string
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  rating: number;
  discountPercentage: number;
  onSale: boolean;
  isFeatured?: boolean;
  isExclusive?: boolean;
  isNewArrival?: boolean;
}

async function getCategoryProducts(category: string): Promise<Product[]> {
  try {
    // NestJS backend se products fetch karein
    const res = await fetch('http://localhost:5000/products', {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error('Failed to fetch products:', res.status);
      return [];
    }
    
    const allProducts = await res.json();
    
    // Frontend mein category filter karein
    const filteredProducts = allProducts.filter((product: Product) => 
      product.category.toLowerCase() === category.toLowerCase()
    );
    
    console.log(` Category: ${category}, Found: ${filteredProducts.length} products`);
    
    return filteredProducts;
  } catch (error) {
    console.error('Error fetching category products:', error);
    return [];
  }
}

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // FIX: params ko await karein
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const products = await getCategoryProducts(decodedCategory);

  // Category name ko properly format karein
  const formattedCategory = decodedCategory
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-gray-200 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-[#629D23] hover:text-[#2D3B29] font-semibold mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 capitalize">
            {formattedCategory} Products
          </h1>
          <p className="text-gray-600 mt-2">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No Products Found</h2>
            <p className="text-gray-500 mb-6">
              No products available in <span className="font-semibold">{formattedCategory}</span> category yet.
            </p>
            <div className="space-y-3">
              <Link 
                href="/"
                className="block bg-[#629D23] hover:bg-[#2D3B29] text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
              >
                Back to Home
              </Link>
              <Link 
                href="/products/add"
                className="block border border-[#629D23] text-[#629D23] hover:bg-[#629D23] hover:text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
              >
                Add New Product
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 group">
                {/* Product Image - Size adjusted and white background */}
                <div className="relative h-56 bg-white overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={product.imageUrl || '/placeholder-image.jpg'}
                    alt={product.name}
                    className="max-w-full max-h-40 object-contain transition duration-300 group-hover:opacity-90"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col space-y-1">
                    {product.onSale && (
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {product.discountPercentage}% OFF
                      </span>
                    )}
                    {product.isNewArrival && (
                      <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  
                  {/* Featured/Exclusive Badges */}
                  <div className="absolute top-2 right-2 flex flex-col space-y-1">
                    {product.isFeatured && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                        FEATURED
                      </span>
                    )}
                    {product.isExclusive && (
                      <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                        EXCLUSIVE
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-[#629D23] transition duration-200">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Price and Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-[#2D3B29]">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="text-sm text-red-600 line-through">
                          ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600 ml-1">{product.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  {/* Category */}
                  <div className="mb-3">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-[#2D3B29] text-white py-2 rounded-lg hover:bg-[#4c781d] transition duration-300 font-semibold">
                      Add to Cart
                    </button>
                    <button className="px-6 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300">
                      ♡
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}