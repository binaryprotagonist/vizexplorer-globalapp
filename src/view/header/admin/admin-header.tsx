import { Header as GlobalHeader } from "@vizexplorer/global-ui-core";
import { useNavigate } from "react-router-dom";
import { VizExplorerLogo } from "./vizexplorer-logo";

type Props = {
  showBurger?: boolean;
  onBurgerClick?: VoidFunction;
  children?: React.ReactNode;
};

export function AdminHeader({ showBurger, onBurgerClick, children }: Props) {
  const navigate = useNavigate();

  function handleLogoClick() {
    navigate("/org");
  }

  return (
    <>
      <span data-testid={"admin-header"} />
      <GlobalHeader
        logo={<VizExplorerLogo />}
        onLogoClick={handleLogoClick}
        showBurger={showBurger}
        onBurgerClick={onBurgerClick}
      >
        {children}
      </GlobalHeader>
    </>
  );
}
