import { useEffect, useState } from "react";
import { SwiperContainer } from "swiper/element";
import { SwiperProps, SwiperSlideProps } from "swiper/react";
import { register } from "swiper/element/bundle";

// Make init required as we will lazy init by default and only init when the consumer lets this component know its ready
type SwiperContainerProps = Omit<SwiperProps, "init"> & {
  init: boolean;
  scrollToLastOnSlideAdd?: boolean;
};

export function Swiper(props: SwiperContainerProps) {
  const [node, setNode] = useState<SwiperContainer | null>(null);
  const [destroyed, setDestroyed] = useState<boolean>(false);
  const [slideCount, setSlideCount] = useState<number>(0);

  const { children, init, scrollToLastOnSlideAdd, slidesPerView, spaceBetween, ...rest } =
    props;
  const initProps = { slidesPerView, spaceBetween, ...rest };

  // swiper isn't initialized - initialize with provided props
  useEffect(() => {
    if (!node || !init || !!node?.swiper?.params) return;

    register();
    Object.assign(node, { ...initProps });
    node.initialize();
    setDestroyed(false);

    // track when swiper is destroyed so we can try re-initialize it if it's still mounted
    // the common case of this is Edit Mode when re-ordering sections
    node.swiper.on("destroy", () => {
      setDestroyed(true);
    });
  }, [node, destroyed]);

  // TODO find a way to detect changes and update swiper accordingly
  // this is most noticeable in edit mode when removing widgets - swiper can't detect a carousel item being removed
  // and without calling `update` the carousel assumes the removed widget is still present.
  // Rerun on each render for the time being - performance impact seems minimal
  useEffect(() => {
    if (!node?.swiper?.params || destroyed) return;

    node.swiper.params.slidesPerView = slidesPerView;
    node.swiper.params.spaceBetween = spaceBetween;
    node.swiper.update();

    // scroll to the last slide if a new slide has been added and scrollToLastOnSlideAdd is true
    const newSlideCount = node.swiper.slides.length;
    if (scrollToLastOnSlideAdd && newSlideCount > slideCount) {
      node.swiper.slideTo(slideCount - 1);
    }
    setSlideCount(newSlideCount);
  });

  return (
    <swiper-container init={false} ref={(node) => setNode(node as SwiperContainer)}>
      {children}
    </swiper-container>
  );
}

export function SwiperSlide(props: SwiperSlideProps) {
  const { children, ...rest } = props;

  // don't currently support function children, especially as it's not obvious where its props are meant to come from
  if (typeof children === "function") {
    return null;
  }

  return <swiper-slide {...rest}>{children}</swiper-slide>;
}
