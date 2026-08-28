
import Link from 'next/link'
import React from 'react'

const page = async ({ params }) => {
    const { id } = await params
    let res = await fetch(`https://fakestoreapi.com/products/${id}`);
    let products = await res.json();
  
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <Link href={"/product"}>
                    <button className="mb-6 inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Products
                    </button>
                </Link>

                {/* Product Details Card */}
                <div className="bg-white dark:bg-[#0a0a0a] rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">

                        {/* Left Column - Product Image */}
                        <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg p-8 min-h-[300px] md:min-h-[400px]">
                            <img
                                src={products.image}
                                alt="Product Name"
                                className="max-h-[300px] md:max-h-[400px] w-auto object-contain"
                            />
                        </div>

                        {/* Right Column - Product Info */}
                        <div className="flex flex-col">
                            {/* Category Badge */}
                            <div className="mb-3">
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                    {products.category}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl md:text-3xl font-bold text-[#171717] dark:text-[#ededed] mb-3">
                                {products.title}
                            </h1>

                            {/* Price */}
                            <div className="mb-4">
                                <span className="text-3xl font-bold text-[#171717] dark:text-[#ededed]">
                                    ${products.price}
                                </span>

                                <span className="ml-3 text-sm font-medium text-green-600 dark:text-green-400">
                                    In Stock
                                </span>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {products.description}
                                </h3>

                            </div>

                            {/* Features/Specs */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Features
                                </h3>
                            </div>

                            {/* Quantity and Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">

                                <div className="flex gap-3 flex-1">
                                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                                        Add to Cart
                                    </button>
                                    <button className="flex-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-[#171717] dark:text-[#ededed] font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default page