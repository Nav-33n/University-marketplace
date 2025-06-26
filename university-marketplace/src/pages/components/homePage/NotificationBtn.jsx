import { Bell } from 'lucide-react';

export default function NotificationButton() {
  return (
    <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-9 bg-[#f0f2f5] text-[#111418] gap-2  px-2.5">
      <Bell size={15} className='text-[#e2e6ed]' />
    </button>
  );
}