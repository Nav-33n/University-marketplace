import {Truck} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ConfirmSaleBtn() {
     const navigate = useNavigate();

   return (
    <button 
        onClick={() => navigate('/orders')}
    className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-9 bg-[#f0f2f5] text-[#111418] gap-2  px-2.5">
      <Truck size={16} className='text-[#000000] ' />
    </button>
  );
}