"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; 

interface CategoryItem {
  id: string;
  name: string;
  productCount: number;
  imageSrc: string; 
  href: string;
}

export default function ProductCategoryQueue() {
  const [categoriesData, setCategoriesData] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Categories ke liye background images
  const categoryImages = {
    'Protein': 'https://springs.com.pk/cdn/shop/files/705016500406.gif?v=1747852022',
    'Pre Workout': 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/bsn/bsn00160/l/43.jpg',
    'Weight Gainer': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrRHSoZidcPOMSOvON9_xusG_tVmdjlxhM4A&s',
    'Creatine': 'https://ronniecoleman.net/cdn/shop/products/ronnie-coleman-signature-series-creatine-xs-120-scoop-essentials-28840760115313_1024x1024.jpg?v=1628532764',
    'BCAA': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUAHgbw4AlifPEofQ0rV4U-Bfnhf78sXI2AQ&s',
    'Fat Burner': 'https://5.imimg.com/data5/SELLER/Default/2023/7/329254266/FR/AX/LT/54948872/muscletech-fat-burner-supplement-500x500.png',
    'Performance': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbPOGle6oNt7j1E9TaopqPIc6U9P_1NkTV_g&s'
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();

        // ✅ Dynamic categories generate karein products se
        const categoryCounts = products.reduce((acc: any, product: any) => {
          const category = product.category;
          if (category) {
            acc[category] = (acc[category] || 0) + 1;
          }
          return acc;
        }, {});

        // ✅ Categories array banayein
        const categories = Object.keys(categoryCounts).map(category => ({
  id: category,
  name: category,
  productCount: categoryCounts[category],
  imageSrc: categoryImages[category as keyof typeof categoryImages] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&auto=format&fit=crop&q=80',
  href: `/shop/${category}`
}));

        setCategoriesData(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoriesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
          Shop by Category
        </h2>
        <div className="text-center py-10">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">
        Shop by Category
      </h2>

      {categoriesData.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No categories found.</div>
      ) : (
        <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
          {categoriesData.map((category) => (
            <Link 
              key={category.id} 
              href={category.href}
              className="flex-shrink-0 w-64 h-64 relative bg-gray-100 p-6 flex flex-col justify-end rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out hover:scale-105 transform"
            >
              {/* ✅ Background Image */}
              <img
                src={category.imageSrc}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />

              {/* Dark Overlay for Better Text Readability */}
              <div className="absolute inset-0 hover:bg-black hover:opacity-70 rounded-lg"></div>

              {/* Text Content */}
              <div className="relative z-10 text-white">
                <h3 className="text-xl font-bold mb-1 drop-shadow-md">
                  {category.name}
                </h3>
                <p className="text-sm font-semibold text-gray-200">
                  {category.productCount} {category.productCount === 1 ? 'Product' : 'Products'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}