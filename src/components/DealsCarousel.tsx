import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CarouselApi } from '@/components/ui/carousel';

// Featured deals/campaigns data
const campaignItems = [
  {
    id: '1',
    title: 'Elegance Collection',
    subtitle: 'True brilliance is found in subtlety',
    description: 'Discover our new collection of fine gold necklaces.',
    image: '/lovable-uploads/fd07ecbd-e6ae-4e6d-b5b4-fdcd00131ae9.png',
    linkTo: '/category/necklace',
    color: 'bg-cream-dark'
  },
  {
    id: '2',
    title: 'Summer Sale',
    subtitle: 'Up to 30% off on selected items',
    description: 'Limited time offer on our most exquisite pieces.',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=1000&h=400&q=80',
    linkTo: '/#products',
    color: 'bg-cream'
  },
  {
    id: '3',
    title: 'Gift Collection',
    subtitle: 'Perfect for your special someone',
    description: 'Timeless jewelry pieces for every occasion.',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1000&h=400&q=80',
    linkTo: '/#products',
    color: 'bg-cream-dark'
  }
];

const DealsCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="py-16 bg-gradient-to-r from-cream to-cream-dark overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-forest-green text-center mb-10">
          Special Collections
        </h2>
        
        <div className="relative mx-auto max-w-5xl">
          <Carousel opts={{ loop: true }} setApi={setApi}>
            <CarouselContent>
              {campaignItems.map((item) => (
                <CarouselItem key={item.id} className="md:basis-full">
                  <div className={`rounded-lg overflow-hidden shadow-lg ${item.color}`}>
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/2 h-60 md:h-auto overflow-hidden relative">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                        <h3 className="text-2xl md:text-3xl font-bold text-forest-green mb-3">
                          {item.title}
                        </h3>
                        <p className="text-lg md:text-xl text-forest-green/80 mb-2 font-light italic">
                          {item.subtitle}
                        </p>
                        <p className="text-forest-green/70 mb-6">
                          {item.description}
                        </p>
                        <Link 
                          to={item.linkTo}
                          className="inline-flex items-center text-forest-green hover:text-gold transition-all duration-300 group w-fit"
                        >
                          <span className="border-b border-forest-green group-hover:border-gold">
                            Explore Collection
                          </span>
                          <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-4 bg-white/80 hover:bg-white" />
              <CarouselNext className="right-4 bg-white/80 hover:bg-white" />
            </div>
          </Carousel>
          
          {/* Custom carousel indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {campaignItems.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === current ? 'bg-black' : 'bg-forest-green/30'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsCarousel;
