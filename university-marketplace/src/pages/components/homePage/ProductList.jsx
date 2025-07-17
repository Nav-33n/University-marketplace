import api from '../../../services/api';
import "keen-slider/keen-slider.min.css";
import ProductImageSlider from '../UI_services/ProductImageSlider';
import { useQuery } from '@tanstack/react-query';
import { NavLink } from 'react-router-dom';


export default function ProductList() {
  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await api.get('/items');
      return res.data.items;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <p className="p-4">Loading items...</p>;
  if (isError) return <p className="p-4 text-red-500">Failed to load items.</p>;

  return (
    <div className="flex">
      <nav>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6" >
        
      {items.map((item) => (
            <NavLink to={`/product/${item._id}`} key={item._id} className="relative space-x-3 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-200  shadow-md cursor-pointer">

        <div className='relative mx-3 mt-3 flex h-60  rounded-xl overflow-hidden' >
          <ProductImageSlider images={item.imageUrls} />
      </div>
          <div className='mt-4 px-5 pb-5'>
              <h5 className="text-xl tracking-tight text-slate-900">{item.title}</h5>
            <div className="mt-2 mb-2 flex items-center justify-between">
               <p>
        <span className="text-2xl font-bold text-slate-900">₹{item.price}{item.type === 'Rent' && <span className="text-xs"> /day</span>}
        </span>
              </p>
              <div>
                <span className="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
                  {item.type}
                </span>
              </div>
              </div>
              <p className="font-semibold text-neutral-400 text-xs mt-4">By {item.user?.username || 'Unknown'}</p>
          </div>
      </NavLink>
      ))}
      </div>
      </nav>
    </div>
  )
  };
  
  
  
