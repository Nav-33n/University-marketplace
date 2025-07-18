import { useParams } from 'react-router-dom';
import API from '../../services/api';
import { useQuery } from "@tanstack/react-query";
import { useState } from 'react';
import { MessagesSquare, Heart, Share2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';


const getProductData = async (id) => {
    const res = await API.get(`/items/${id}`);
    return res.data.item;
}

function ProductInfo() {
   const { id } = useParams();
   const [selectedImage, setSelectedImage] = useState(0);

   const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: ()=> getProductData(id),
    staleTime: 2 * 60 * 1000,
   })

   console.log(id)
  
    console.log(product);

      if (isLoading) return <div className="p-6 text-gray-500">Loading product...</div>;
      if (error) return <div>Error: Product not found.</div>;

      const images = product.imageUrls;

  return (
    <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 border-b-4 rounded pb-5 border-[#ced7dfbb]">
        <div className='w-full overflow-hidden'>
            <div className='pr-10'>
            <img
            src={images[selectedImage]}
            alt="Main Product"
            className="w-full h-[90%] rounded-xl border object-contain"
            />

            <div className="flex gap-3 mt-3 justify-center">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Preview ${idx}`}
              className={`w-20 h-20 object-cover rounded-xl border p-[0.02em] mb-1 cursor-pointer ${
                selectedImage === idx ? 'ring-2 ring-black' : ''
              }`}
              onClick={() => setSelectedImage(idx)}
            />
          ))}
        </div>
        </div>
        </div>

        {/* Right Info Section */}
<div className="flex flex-col justify-between h-full min-h-[400px] px-4">

  {/* Top Content with spacing */}
  <div className="space-y-4">
    {/* Title */}
    <h1 className="font-normal uppercase text-black text-2xl">
      {product.title}
    </h1>

    {/* Description */}
    <p className="font-light italic text-gray-600">
      {product.description}
    </p>

    {/* Sell Type & User */}
    <div className="text-[#365349] text-[14px]">
      {product.type} by{' '}
      <span className="font-normal italic text-black">
        {product.user.username}
      </span>
    </div>

    {/* Price */}
    <div className="flex items-center gap-3">
      <span className="font-semibold text-3xl text-neutral-700">
        ₹{product.price}
      </span>
    </div>
  </div>

  {/* Bottom Button Section */}
  <div className="space-y-4 mt-6">
    <button className="w-full py-3 text-center bg-cyan-500 hover:bg-cyan-800 rounded-md font-normal text-white cursor-pointer">
      Send Offer
    </button>
    <button className="w-full py-3 bg-white border hover:bg-cyan-300 hover:text-white rounded-md font-normal text-center text-cyan-600 cursor-pointer">
      Buy this Item
    </button>
        <nav className='flex justify-between mb-1'>
          <NavLink className={({ isActive }) =>
            `flex items-center hover:text-cyan-500 ${
              isActive ? 'hover:text-cyan-500' : ''
            }`}>
           <MessagesSquare className='text-black ml-20 mr-1 w-3 h-3'/><span className='font-semibold text-black '>Chat</span>
          </NavLink>

<NavLink className={({ isActive }) =>
            `flex items-center hover:text-cyan-500 ${
              isActive ? 'hover:text-cyan-500' : ''
            }`}>
            <Heart  className='text-black mr-1 w-3 h-3'/><span className=' font-semibold text-black'>Wishlist</span>
          </NavLink>

          <NavLink className={({ isActive }) =>
            `flex items-center hover:text-cyan-500 ${
              isActive ? 'hover:text-cyan-500' : ''
            }`}>
            <Share2 className='text-black mr-1 w-3 h-3'/><span className='font-semibold text-black mr-20'>Share</span>
          </NavLink>

        </nav>
  </div>


    </div>
    </div>
  )
}

export default ProductInfo;
