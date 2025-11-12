'use client';

import Slider from 'react-slick';
import Image from 'next/image';
import Link from 'next/link';
import '@/styles/components/BannerSlider.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const slides = [
  {
    img: '/banner/ut-lan8.jpg',
    alt: 'Út Lan',
    link: '/movie/ut-lan'
  },
  {
    img: '/banner/elio.jpg',
    alt: 'Elio',
    link: '/movie/elio'
  },
  {
    img: '/banner/f1.jpg',
    alt: 'f1',
    link: '/movie/f1'
  }
];

// Custom Prev Arrow
const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <div className="custom-arrow left" onClick={onClick}>
    <FontAwesomeIcon icon={faChevronLeft} />
  </div>
);

// Custom Next Arrow
const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <div className="custom-arrow right" onClick={onClick}>
    <FontAwesomeIcon icon={faChevronRight} />
  </div>
);

export default function BannerSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "10%",
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />
  };

  return (
    <div className="banner-slider">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <Link href={slide.link} key={index}>
            <Image src={slide.img} alt={slide.alt} width={1200} height={400} />
          </Link>
        ))}
      </Slider>
      <div className='line-default'></div>
    </div>
  );
}
