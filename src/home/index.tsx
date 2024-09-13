import { css, Theme } from "@emotion/react";
import { Box, Link, Typography } from "@mui/material";
import { useOrgApps, Footer } from "@vizexplorer/global-ui-core";
import { AppHeader } from "../view/header";
import { ApplicationCard } from "./application-card";
import { useApplicationRedirect } from "./hooks/application-redirect";
import { VizExplorerLogo } from "../view/header/shared/icons";
import { ThemeProvider } from "../theme";
import { useCompanyQuery } from "generated-graphql";

const root = (theme: Theme) =>
  css({
    display: "grid",
    gridTemplateColumns: "100%",
    flex: 1,
    justifyContent: "center",
    padding: theme.spacing(2),
    overflow: "auto"
  });

const content = css({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%"
});

const companyContainerStyle = (theme: Theme) =>
  css({
    width: "100%",
    margin: theme.spacing(4, 2, 8, 2),
    [`@media (max-width: ${theme.breakpoints.values.sm - 1}px)`]: {
      margin: theme.spacing(4)
    }
  });

const appContainerStyle = (theme: Theme) =>
  css({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, 320px)",
    justifyItems: "center",
    justifyContent: "center",
    width: "100%",
    gridGap: theme.spacing(4),
    margin: theme.spacing(4)
  });

const viewMoreContainerStyle = (theme: Theme) =>
  css({
    padding: theme.spacing(8, 4)
  });

export function Home() {
  const { applications, loading: loadingApps, error: appsErr } = useOrgApps();
  const {
    data: companyData,
    loading: loadingCompany,
    error: companyErr
  } = useCompanyQuery();
  const { attemptingRedirect } = useApplicationRedirect();

  if (appsErr) throw appsErr;
  if (companyErr) throw companyErr;

  if (attemptingRedirect) {
    return null;
  }

  if (loadingApps || loadingCompany) {
    return <div data-testid={"app-selector-loading"} css={root} />;
  }

  const company = companyData?.currentOrg?.company;
  const accessibleApps = applications.filter(({ hasAccess }) => hasAccess);

  return (
    <>
      <AppHeader logo={<VizExplorerLogo />} />
      <ThemeProvider>
        <div data-testid={"app-selector"} css={root}>
          <div css={content}>
            <div css={companyContainerStyle}>
              <Typography
                data-testid={"app-selector-company-name"}
                variant={"h1"}
                align={"center"}
                gutterBottom
              >
                {company?.name}
              </Typography>
              <Typography variant={"h2"} align={"center"}>
                Apps and Services
              </Typography>
            </div>
            {!accessibleApps.length && (
              <Box data-testid={"no-app-access"} maxWidth={700} marginTop={"30px"}>
                <Typography variant={"h6"} align={"center"}>
                  You do not have permission to access any application. Please contact an
                  Org or App Admin to grant you access.
                </Typography>
              </Box>
            )}
            <div css={appContainerStyle}>
              {accessibleApps.map((app) => (
                <ApplicationCard key={`app-sel-${app.id}`} application={app} />
              ))}
            </div>
            <div css={viewMoreContainerStyle}>
              <Link
                data-testid={"app-selector-view-more"}
                href={"https://www.vizexplorer.com/solutions"}
                target={"_blank"}
                underline={"none"}
              >
                More from VizExplorer
              </Link>
            </div>
          </div>
        </div>
      </ThemeProvider>
      <Footer />
    </>
  );
}
