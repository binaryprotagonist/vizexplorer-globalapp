import { Box, Typography, useTheme } from "@mui/material";
import { Card, BlueCardHeader } from "../../view/card";
import { EditProfileForm } from "./edit-profile-form";
import { useNavigate } from "react-router-dom";
import { useCurrentUserQuery } from "generated-graphql";

export function BasicInfoUpdate() {
  const theme = useTheme();
  const { data: curUserData, error: curUserErr } = useCurrentUserQuery();
  const navigate = useNavigate();

  if (curUserErr) throw curUserErr;

  const currentUser = curUserData?.currentUser;
  return (
    <>
      <span data-testid={"basic-info-update"} />
      <Box padding={theme.spacing(6, 3)} flex={1} overflow={"auto"}>
        {currentUser && (
          <Card sx={{ minWidth: 360, maxWidth: "500px", margin: "0 auto" }}>
            <BlueCardHeader>
              <Typography variant={"h4"} align={"center"}>
                Update Basic Info
              </Typography>
            </BlueCardHeader>
            <Box padding={theme.spacing(4)}>
              <EditProfileForm
                user={currentUser}
                onDone={() => navigate("/settings/personal-info")}
              />
            </Box>
          </Card>
        )}
      </Box>
    </>
  );
}
