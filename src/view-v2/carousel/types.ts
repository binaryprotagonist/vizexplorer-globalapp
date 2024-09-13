import { PaginationOptions } from "swiper/types";

export type HorizontalCarouselProps = {
  slidesPerView?: number | "auto";
  spaceBetween?: string | number;
  pagination?: boolean | PaginationOptions;
  showOutlyingContent?: boolean;
  scrollToLastOnSlideAdd?: boolean;
  children?: React.ReactNode;
};
