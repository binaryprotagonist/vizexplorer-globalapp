import React from "react";
import { Header as GlobalHeader, AppSwitcher, Avatar } from "@vizexplorer/global-ui-core";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  logo: React.ReactNode;
  showBurger?: boolean;
  onBurgerClick?: VoidFunction;
};

export function Header({ logo, showBurger, onBurgerClick }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogoClick() {
    if (!location.pathname.startsWith("/settings")) return;
    navigate("/settings");
  }

  return (
    <>
      <span data-testid={"header"} />
      <GlobalHeader
        logo={logo}
        onLogoClick={handleLogoClick}
        showBurger={showBurger}
        onBurgerClick={onBurgerClick}
      >
        <AppSwitcher />
        <Avatar />
      </GlobalHeader>
    </>
  );
}
