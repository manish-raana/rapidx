import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";

const Shop = ({ products }) => {
  const [Products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(products);
  }, [products]);
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap -m-4">
          {Products.map((item) => (
            <div key={item.id} className="lg:w-1/4 md:w-1/2 p-4 w-full">
              <a className="block relative h-48 rounded overflow-hidden">
                <Image layout="fill" alt={item.title} className="object-cover object-center w-full h-full block" src={item.thumbnail} />
              </a>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <h2 className="text-gray-400 title-font text-lg font-medium">{item.title}</h2>
                  <p className="mt-1">EUR {item.price}</p>
                </div>
                <div>
                  <button className="px-5 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 hover:text-white ">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export async function getStaticProps() {
  const res = await fetch("https://dummyjson.com/products");
  const posts = await res.json();
  const products = posts.products;
  return {
    props: { products }, // will be passed to the page component as props
  };
}
export default Shop;
