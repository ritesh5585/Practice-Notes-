// app/products/page.js (Simpler version)
import React from 'react';
import Link from 'next/link';

const ProductsPage = async () => {
  let res = await fetch("https://fakestoreapi.com/products");
  let products = await res.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#171717] dark:text-[#ededed] mb-8">
        Our Products
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-[#0a0a0a] rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-800"
          >
            {/* Product Image */}
            <div className="h-48 w-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>

            {/* Product Details */}
            <div className="p-4">
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                {product.category}
              </span>

              <h2 className="text-sm font-semibold text-[#171717] dark:text-[#ededed] mt-2 mb-2 line-clamp-2 min-h-[40px]">
                {product.title}
              </h2>

              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className={`w-4 h-4 ${index < Math.round(product.rating.rate)
                          ? 'text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                        }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  ({product.rating.count})
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 min-h-[40px]">
                {product.description.length > 80
                  ? `${product.description.substring(0, 80)}...`
                  : product.description}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-[#171717] dark:text-[#ededed]">
                  ${product.price.toFixed(2)}
                </span>
                <Link
                  href={`/product/${product.id}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;