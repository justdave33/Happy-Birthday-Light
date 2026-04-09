import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";



export default function Slider() {
  const images = [
    "/images/wife1.jpg",
    "/images/wife2.jpg",
    "/images/wife3.jpg",
    "/images/wife4.jpg",
    "/images/wife17.jpg",
    "/images/wife6.jpg",
    "/images/wife7.jpg",
    "/images/wife8.jpg",
    "/images/wife9.jpg",
    "/images/wife10.jpg",
    "/images/wife11.jpg",
    "/images/wife12.jpg",
    "/images/wife13.jpg",
    "/images/wife14.jpg",
    "/images/wife15.jpg",
    "/images/wife18.jpg",
    "/images/wifekiss.jpg",
    "/images/wifemarriage14.jpg",
  ];

  return (
    <motion.div
     className="glass"
     initial={{ opacity: 0, y: 50 }}
     whileInView={{ opacity: 1, y: 0 }}
     transition={{ duration: 1 }}
     >   
      <h2>Our Memories 💞</h2>
      <Swiper modules={[Autoplay]} autoplay={{ delay: 2500 }} loop>
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <img src={img} style={{
                 width: "100%",
                 borderRadius: "15px",
                 height: "300px",
                 objectFit: "cover"
               }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
}