import styled from "@emotion/styled";
import { Footer, Header, useAuth, useDeliveryMethod } from "@vizexplorer/global-ui-core";
import { VizExplorerLogo } from "../view/header/shared/icons";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import { ThemeProvider } from "../theme";
import { useCompanyQuery } from "generated-graphql";

const GridBox = styled(Grid)({
  margin: "auto",
  width: "100%",
  maxWidth: "600px",
  textAlign: "center",
  justifyContent: "center"
});

export function Unauthorized() {
  const theme = useTheme();
  const { signOut } = useAuth();
  const { isOnprem, loading, error } = useDeliveryMethod();
  const { data: companyData, error: companyErr } = useCompanyQuery();

  const company = companyData?.currentOrg?.company;

  if (error) throw error;
  if (companyErr) throw companyErr;

  return (
    <>
      <span data-testid={"unauthorized"} />
      <Header logo={<VizExplorerLogo />} onLogoClick={() => {}} />
      <ThemeProvider>
        <Box display={"flex"} flex={1} padding={theme.spacing(4)} overflow={"auto"}>
          {!loading && (
            <GridBox container rowGap={theme.spacing(10)}>
              {!!company && (
                <Typography variant={"h1"} align={"center"}>
                  {company.name}
                </Typography>
              )}
              <Grid container rowGap={theme.spacing(4)} justifyContent={"center"}>
                <Typography variant={"h5"}>
                  Unauthorized {isOnprem ? "On-Premises" : "Cloud"} Access
                </Typography>
                <Typography variant={"h6"}>
                  This account doesn&apos;t have access to the requested{" "}
                  {isOnprem ? "On-Premises" : "Cloud"} resources. Please check you have
                  entered the correct URL or click logout below and try again with another
                  account.
                </Typography>
              </Grid>
              <Button variant={"contained"} onClick={signOut}>
                Logout
              </Button>
            </GridBox>
          )}
        </Box>
      </ThemeProvider>
      <Footer />
    </>
  );
}
