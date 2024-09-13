import styled from "@emotion/styled";
import { Box, Skeleton } from "@mui/material";
import { MobileSideNav, SideNav } from "@vizexplorer/global-ui-core";

const NavItemSkeleton = styled(Skeleton)({
  height: 27,
  margin: "8px 0",
  borderRadius: "4px",
  transform: "scale(1)"
});

const NestedNavItemSkeleton = styled(NavItemSkeleton)({
  margin: "8px 0 8px 32px"
});

function NestedNavSkeleton() {
  return (
    <Box marginTop={"12px"}>
      <NavItemSkeleton sx={{ marginBottom: "12px" }} />
      <NestedNavItemSkeleton />
      <NestedNavItemSkeleton />
    </Box>
  );
}

type Props = {
  isMobile: boolean;
  isOpen: boolean;
  onClose: VoidFunction;
};

export function SideNavLoading({ isMobile, isOpen, onClose }: Props) {
  if (isMobile) {
    return (
      <MobileSideNav
        open={isOpen}
        onClose={onClose}
        PaperProps={{ sx: { width: "70%" } }}
      >
        <span data-testid={"mobile-sidenav-loading"} />
        <NavItemSkeletons />
      </MobileSideNav>
    );
  }

  return (
    <SideNav>
      <span data-testid={"sidenav-loading"} />
      <NavItemSkeletons />
    </SideNav>
  );
}

function NavItemSkeletons() {
  return (
    <Box>
      {Array(5)
        .fill(null)
        .map((_, idx) => {
          return <NavItemSkeleton key={`sidenav-skele-item-${idx}`} />;
        })}
      <NestedNavSkeleton />
      <NestedNavSkeleton />
    </Box>
  );
}
