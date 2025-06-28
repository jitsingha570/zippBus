import React from 'react';
import SearchBus from './SearchBus';
import Slider from 'react-slick';
import Img1 from '../assets/images/Imghome.jpg';
import Img2 from '../assets/images/Imghome2.jpg';
import Img3 from '../assets/images/Imghome3.jpg';
import Img4 from '../assets/images/Imghome4.jpg';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import PopularRoutes from './PopularRoutes';
import PopularBuses from './PopularBuses';
import UserCount from './UserCount';

const images = [Img1, Img2, Img3, Img4];

function Home() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    arrows: false,
    pauseOnHover: false
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <div className="relative w-full h-screen overflow-hidden">
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={index}>
              <div
                className="w-full h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${img})` }}
              />
            </div>
          ))}
        </Slider>

        {/* Search Box over the slider */}
        <div className="absolute inset-0 flex justify-center items-center">
          <SearchBus />
        </div>
      </div>

      {/* Other Sections */}
      <PopularRoutes />
      <PopularBuses />
      <UserCount />
    </div>
  );
}

export default Home;
