// app/(admin)/products/edit/[id]/page.tsx

import ProductForm from '@/components/ProductForm';
import Link from 'next/link';

// JSON Server Compatible Product Type
type Product = {
  id: string;
  name: string;
  price: number;
  cost: number;
  description: string;
  imageUrl: string;
  quantityInStock: number;
  size: string;
  rating: number;
  color: string;
  onSale: boolean;
  discountPercentage: number;
  isNewArrival: boolean;
  category: string;
  isInStock: boolean;
  isFeatured?: boolean;
  isExclusive?: boolean;
};

const API_BASE_URL = 'http://localhost:5000/products';

async function getProduct(id: string): Promise<Product | null> {
  try {
    console.log('🔍 [EDIT PAGE] Fetching product with ID:', id);
    console.log('📡 [EDIT PAGE] API URL:', `${API_BASE_URL}/${id}`);
    
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(' [EDIT PAGE] Response status:', res.status);
    console.log('[EDIT PAGE] Response ok:', res.ok);
    
    if (!res.ok) {
      console.error(`❌ [EDIT PAGE] Error fetching product: ${res.status} ${res.statusText}`);
      const errorText = await res.text();
      console.error('❌ [EDIT PAGE] Error response:', errorText);
      return null;
    }

    const product = await res.json();
    console.log('✅ [EDIT PAGE] Product data received:', product);
    console.log('📋 [EDIT PAGE] Product ID from API:', product.id);
    console.log('📋 [EDIT PAGE] Product name from API:', product.name);
    
    // Data validation aur mapping
    const mappedProduct = {
      id: product.id || product._id, // ✅ Dono fields check karein
      name: product.name || '',
      price: product.price || 0,
      cost: product.cost || 0,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      quantityInStock: product.quantityInStock || 0,
      size: product.size || 'One Size',
      rating: product.rating || 0,
      color: product.color || '',
      onSale: product.onSale || false,
      discountPercentage: product.discountPercentage || 0,
      isNewArrival: product.isNewArrival || false,
      category: product.category || 'Uncategorized',
      isInStock: product.isInStock !== undefined ? product.isInStock : (product.quantityInStock > 0),
      isFeatured: product.isFeatured || false,
      isExclusive: product.isExclusive || false,
    };

    console.log('✅ [EDIT PAGE] Mapped product:', mappedProduct);
    return mappedProduct;
  } catch (error) {
    console.error('❌ [EDIT PAGE] Network error fetching product:', error);
    return null;
  }
}

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  // PARAMS KO AWAIT KAREIN - YEH IMPORTANT HAI
  let id: string;
  
  try {
    const resolvedParams = await params;
    id = resolvedParams.id;
    console.log('🔄 [EDIT PAGE] Resolved Product ID from params:', id);
    console.log('📋 [EDIT PAGE] Full params object:', resolvedParams);
  } catch (error) {
    console.error('❌ [EDIT PAGE] Error resolving params:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-600 mb-6">
            There was an error loading the page parameters.
          </p>
          <Link 
            href="/admin/products" 
            className="bg-[#629D23] hover:bg-[#2D3B29] text-white font-semibold py-3 px-6 rounded-lg transition duration-300 inline-block"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }
  
  console.log('🔄 [EDIT PAGE] Final Product ID:', id);
  
  if (!id || id === 'undefined') {
    console.error('❌ [EDIT PAGE] Invalid ID received:', id);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Product ID</h1>
          <p className="text-gray-600 mb-6">
            Product ID is missing or invalid: "{id}"
          </p>
          <Link 
            href="/admin/products" 
            className="bg-[#629D23] hover:bg-[#2D3B29] text-white font-semibold py-3 px-6 rounded-lg transition duration-300 inline-block"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  console.log('⏳ [EDIT PAGE] Calling getProduct with ID:', id);
  const product = await getProduct(id);

  if (!product) {
    console.error('❌ [EDIT PAGE] Product not found for ID:', id);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">
            The product with ID "{id}" doesn't exist or has been deleted.
          </p>
          <Link 
            href="/admin/products" 
            className="bg-[#629D23] hover:bg-[#2D3B29] text-white font-semibold py-3 px-6 rounded-lg transition duration-300 inline-block"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  console.log('✅ [EDIT PAGE] Product successfully loaded:', product.name);
  console.log('📦 [EDIT PAGE] Final product data for form:', product);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button with Link component */}
        <div className="mb-6">
          <Link 
            href="/admin/products" 
            className="inline-flex items-center text-[#629D23] hover:text-[#2D3B29] font-semibold transition duration-300 px-4 py-2 border border-[#629D23] rounded-lg hover:bg-green-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
        </div>
        
        {/* Product Form with initial data */}
        <ProductForm initialData={product} />
      </div>
    </div>
  );
}