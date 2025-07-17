import React, { useState } from 'react';
import { useKeenSlider } from "keen-slider/react";
import {ArrowLeft, ArrowRight} from 'lucide-react';

const ProductImageSlider = ({ images = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider(
    {
    
      slides: { perView: 1 },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true)
      }
    }
  );

  const goTo = (direction) => {
    if (!instanceRef.current) return;
    direction === 'prev'
      ? instanceRef.current.prev()
      : instanceRef.current.next();
  };

  return (
    <div className="relative w-full items-center mb-5 overflow-hidden">
      {/* Slider */}
      <div
        ref={sliderRef}
        className="keen-slider rounded-md sm:w-full sm:h-full"
      >
        {loaded && images.map((imgUrl, idx) => (
      <div key={idx}
        className="keen-slider__slide w-full h-full rounded-md aspect-auto"
      >
        <img
          src={imgUrl}
          alt={`product-${idx}`}
          className="w-full h-full object-cover"
        />
      </div>
        ))}
      </div>

      {/* Arrows */}
      {loaded && images.length > 1 && (
        <>
          <button
            onClick={() => goTo('prev')}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-1 shadow"
          >
        <ArrowLeft size={12} className="text-black" />
          </button>
          <button
            onClick={() => goTo('next')}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white text-white rounded-full p-1 shadow"
          >
            <ArrowRight size={12} className="text-black" />
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="flex justify-center mt-2 space-x-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-2.5 h-2.5 rounded-full ${
                currentSlide === idx ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageSlider;
