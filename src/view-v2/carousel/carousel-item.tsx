import { SwiperSlideProps } from "swiper/react";
import { SwiperSlide } from "./swiper";

export function CarouselItem(props: SwiperSlideProps) {
  return <SwiperSlide {...props} />;
}
