import React, { Children } from 'react'

const page = async () => {
  let res = await fetch("https://fakestoreapi.com/products")
  let products = await res.json()

  console.log(products)
  return (
    <div>Product</div>
  )
}

export default page