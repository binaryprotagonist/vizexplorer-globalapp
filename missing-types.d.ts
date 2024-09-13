import React from "react";
import type { SwiperSlideProps, SwiperProps } from "swiper/react";

// Add typing for SwiperJS which is not currently exposed by the library
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "swiper-container": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & SwiperProps,
        HTMLElement
      >;
      "swiper-slide": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & SwiperSlideProps,
        HTMLElement
      >;
    }
  }
}
