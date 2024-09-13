import { MarketingListBuilder } from "./marketing-list-builder";
import { useCurrentUserQuery } from "generated-graphql";
import { useNavigate, useParams } from "react-router-dom";
import { goBackUrl, sitesWithPermission } from "./utils";
import { useEffect } from "react";

type Params = {
  siteId: string;
};

export default function MarketingListCreate() {
  const navigate = useNavigate();
  const { siteId } = useParams<Params>() as Params;

  const { data: curUserData, loading: curUserLoading } = useCurrentUserQuery({
    onError: () => {
      navigate(goBackUrl());
    }
  });

  const currentUser = curUserData?.currentUser;
  const accessibleSites = currentUser ? sitesWithPermission(currentUser) : [];
  const targetSite = accessibleSites.find((site) => site.id === siteId);

  useEffect(() => {
    if (currentUser && !targetSite) {
      navigate(goBackUrl());
    }
  }, [currentUser, targetSite]);

  if (curUserLoading || (currentUser && !targetSite)) {
    return null;
  }

  return (
    <>
      <span data-testid={"marketing-list-create"} />
      <MarketingListBuilder title={"Create a new marketing list"} siteId={siteId} />
    </>
  );
}
