import { useState } from 'react';

const images = [
  {
    src: 'https://picsum.photos/id/600/600/400',
    alt: 'Forest',
  },
  {
    src: 'https://picsum.photos/id/100/600/400',
    alt: 'Beach',
  },
  {
    src: 'https://picsum.photos/id/200/600/400',
    alt: 'Yak',
  },
  {
    src: 'https://picsum.photos/id/300/600/400',
    alt: 'Hay',
  },
  {
    src: 'https://picsum.photos/id/400/600/400',
    alt: 'Plants',
  },
  {
    src: 'https://picsum.photos/id/500/600/400',
    alt: 'Building',
  },
];

function ImageCarouselComp({ images }: { images: any[] }) {
  return (
    <>
      {images.map((item) => (
        <img
          key={item.src}
          src={item.src}
          alt={item.alt}
          style={{
            width: '300px',
            height: '200px',
            objectFit: 'cover',
            margin: '10px',
          }}
        />
      ))}
    </>
  );
}

export default function ImageCarousel() {
  const [message] = useState('Image Carousel');

  return (
    <div>
      <h1>{message}</h1>
      <ImageCarouselComp images={images} />
    </div>
  );
}
