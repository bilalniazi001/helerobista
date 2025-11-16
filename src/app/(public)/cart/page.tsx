// app/cart/page.tsx
'use client';

import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Shield, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import Header from '@/components/UI-UX/common/Header';
import Footer from '@/components/UI-UX/common/Footer';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = getCartTotal();
  const shippingFee = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingFee + tax;

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    setIsCheckingOut(true);
    // Here you would typically integrate with a payment processor
    setTimeout(() => {
      alert('Order placed successfully!');
      clearCart();
      setIsCheckingOut(false);
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
            <Link 
              href="/product"
              className="bg-[#629D23] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#4a7a1b] transition-colors inline-flex items-center"
            >
              Continue Shopping
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      
      <div className="min-h-screen bg-gray-50 flex flex-col">
        
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-[#2D3B29] mb-2">Shopping Cart</h1>
              <p className="text-gray-600">Review your items and proceed to checkout</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Cart Header */}
                  <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-[#2D3B29]">
                        Cart Items ({cartItems.length})
                      </h2>
                      <button
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Clear Cart
                      </button>
                    </div>
                  </div>

                  {/* Cart Items List */}
                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-6 flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-2">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.src = `https://placehold.co/100x100/4f46e5/ffffff?text=${item.name.substring(0, 10)}`;
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-[#2D3B29] truncate">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm">{item.category}</p>
                          <p className="text-xl font-bold text-[#629D23] mt-1">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="text-lg font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Item Total & Remove */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-[#2D3B29]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 mt-2 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                    <Truck className="w-8 h-8 text-[#629D23] mx-auto mb-2" />
                    <p className="font-semibold text-sm">Free Shipping</p>
                    <p className="text-xs text-gray-600">On orders over $50</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                    <Shield className="w-8 h-8 text-[#629D23] mx-auto mb-2" />
                    <p className="font-semibold text-sm">Secure Payment</p>
                    <p className="text-xs text-gray-600">100% Protected</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                    <RotateCcw className="w-8 h-8 text-[#629D23] mx-auto mb-2" />
                    <p className="font-semibold text-sm">Easy Returns</p>
                    <p className="text-xs text-gray-600">30 Day Policy</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                  <h3 className="text-xl font-bold text-[#2D3B29] mb-6 pb-4 border-b">
                    Order Summary
                  </h3>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-[#2D3B29] pt-4 border-t">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-[#629D23] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#4a7a1b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isCheckingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        Proceed to Checkout
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </button>

                  {/* Continue Shopping */}
                  <Link
                    href="/product"
                    className="w-full mt-4 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    Continue Shopping
                  </Link>

                  {/* Security Note */}
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start space-x-2">
                      <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-green-700">
                        <strong>Secure checkout:</strong> Your personal and payment information is encrypted and protected.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
}