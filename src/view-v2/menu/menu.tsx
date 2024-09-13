import {
  Box,
  ClickAwayListener,
  Grow,
  Popper,
  PopperPlacementType,
  PopperProps,
  menuClasses,
  styled
} from "@mui/material";
import { Paper } from "@vizexplorer/global-ui-v2";

const StyledPopper = styled(Popper)(({ theme }) => ({
  zIndex: theme.zIndex.modal,
  overflow: "hidden"
}));

const PopperPaper = styled(Paper)({
  display: "flex",
  overflow: "hidden"
});

const PopperMenuList = styled(Box)({
  display: "flex",
  flexDirection: "column",
  overflow: "auto"
});

function transformOrigin(placement: PopperPlacementType): string | undefined {
  switch (placement) {
    case "bottom-end":
      return "right top";
    case "top-end":
      return "right bottom";
    default:
      return "center top";
  }
}

type MenuProps = Omit<PopperProps, "children"> & {
  onClose: VoidFunction;
  children: React.ReactNode;
};

export function Menu({ onClose, children, transition = true, ...rest }: MenuProps) {
  return (
    <StyledPopper className={menuClasses.root} transition={transition} {...rest}>
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: transformOrigin(placement) }}
        >
          <PopperPaper className={menuClasses.paper}>
            <ClickAwayListener onClickAway={onClose}>
              <PopperMenuList className={menuClasses.list}>{children}</PopperMenuList>
            </ClickAwayListener>
          </PopperPaper>
        </Grow>
      )}
    </StyledPopper>
  );
}
