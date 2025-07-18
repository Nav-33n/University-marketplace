import { Mail } from 'lucide-react';

export default function MailButton() {
  return (
    <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-9 bg-[#f0f2f5] text-[#111418] gap-2 text-sm font-bold tracking-[0.015em] px-2.5">
      <Mail size={16} className='text-[#000000]'/>
    </button>
  );
}
