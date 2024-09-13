import { Box, styled, useTheme } from "@mui/material";
import { Swiper } from "./swiper";
import { forwardRef, useState } from "react";
import { HorizontalCarouselProps } from "./types";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { IconButton, IconButtonProps } from "../icon-button";
import { GlobalTheme, useGlobalTheme } from "@vizexplorer/global-ui-v2";

// Container initializes far exceeding the bounds of a flex or grid container without additional styles
// https://github.com/nolimits4web/swiper/issues/3599
const StyledSwiper = styled(Swiper)({
  width: "100%",
  maxWidth: "100%",
  minHeight: 0,
  minWidth: 0
});

const DefaultPagination = styled(Box, {
  shouldForwardProp: (prop) => prop !== "globalTheme"
})<{ globalTheme: GlobalTheme }>(({ globalTheme }) => ({
  display: "flex",
  justifyContent: "center",
  height: "max-content",
  marginTop: "12px",
  width: "100%",
  "--swiper-pagination-color": globalTheme.colors.primary[500],
  "--swiper-pagination-bullet-inactive-color": globalTheme.colors.grey[400],
  "--swiper-pagination-bullet-inactive-opacity": 1
}));

const DefaultNavigation = forwardRef<
  HTMLButtonElement,
  { position: "left" | "right" } & IconButtonProps
>(({ position, children, ...rest }, ref) => {
  const theme = useTheme();
  const globalTheme = useGlobalTheme();

  return (
    <IconButton
      disableRipple
      ref={ref}
      sx={{
        width: "18px",
        height: "25px",
        position: "absolute",
        transition: "opacity .3s",
        padding: 0,
        borderRadius: position === "right" ? "4px 0 0 4px" : "0 4px 4px 0",
        color: "#FFF",
        background: globalTheme.colors.grey[700],
        transform: "translateY(-50%)",
        // margin: 0,
        "&.swiper-button-prev.swiper-button-disabled": { opacity: 0 },
        "&.swiper-button-next.swiper-button-disabled": { opacity: 0 },
        "& svg": {
          width: "20px"
        },
        // Using SwiperJS breakpoints to control when to hide navigation simply didn't work - hide navigation for mobile
        [theme.breakpoints.down("sm")]: {
          display: "none !important"
        }
      }}
      {...rest}
    >
      {children}
    </IconButton>
  );
});

export function HorizontalCarousel({
  slidesPerView,
  pagination,
  spaceBetween = "16px",
  scrollToLastOnSlideAdd,
  children
}: HorizontalCarouselProps) {
  const [paginationRef, setPaginationRef] = useState<HTMLDivElement>();
  const [navNextRef, setNavNextRef] = useState<HTMLButtonElement | null>();
  const [navPrevRef, setNavPrevRef] = useState<HTMLButtonElement | null>();
  const globalTheme = useGlobalTheme();

  return (
    <Box>
      <StyledSwiper
        init={(!!pagination || !!paginationRef) && !!navNextRef && !!navPrevRef}
        spaceBetween={spaceBetween}
        pagination={
          pagination ?? {
            enabled: true,
            el: paginationRef
          }
        }
        navigation={{
          enabled: true,
          nextEl: navNextRef,
          prevEl: navPrevRef
        }}
        injectStyles={DEFAULT_INJECT_STYLES}
        slidesPerView={slidesPerView}
        scrollToLastOnSlideAdd={scrollToLastOnSlideAdd}
      >
        <DefaultNavigation
          ref={setNavPrevRef}
          position={"left"}
          slot={"container-start"}
          className={"swiper-button-prev swiper-button-disabled"}
        >
          <ArrowBackIosNewRoundedIcon />
        </DefaultNavigation>
        <DefaultNavigation
          ref={setNavNextRef}
          position={"right"}
          slot={"container-end"}
          // Having swiper-button-disabled applied prevents flickering on load. It will be removed by Swiper if it is not disabled
          className={"swiper-button-next swiper-button-disabled"}
        >
          <ArrowBackIosNewRoundedIcon sx={{ transform: "rotate(180deg)" }} />
        </DefaultNavigation>
        {children}
      </StyledSwiper>
      {pagination === undefined && (
        <DefaultPagination ref={setPaginationRef} globalTheme={globalTheme} />
      )}
    </Box>
  );
}

const DEFAULT_INJECT_STYLES = [
  `
   :host { --swiper-navigation-sides-offset: 0; }
`
];
