import { css, Theme } from "@emotion/react";
import { Box, Paper, Typography } from "@mui/material";
import { OrgAppFragment, LAST_ACCESSED_APP } from "@vizexplorer/global-ui-core";
import { useState } from "react";

const root = css({
  width: "320px",
  height: "320px",
  borderRadius: "10px",
  cursor: "pointer",
  "&:hover": {
    "& h5": {
      fontWeight: 500
    }
  }
});

const containerStyle = (theme: Theme) =>
  css({
    gridTemplateRows: "100px 100px auto",
    padding: theme.spacing(7, 2, 3, 2)
  });

const expiredTextStyle = css({
  fontSize: "21px"
});

type Props = {
  application: OrgAppFragment;
};

export function ApplicationCard({ application }: Props) {
  const { id, name, url, icon, isValid } = application;
  const [elevation, setElevation] = useState<number>(4);

  function handleClick() {
    if (!isValid) {
      window.location.href = `mailto:support@vizexplorer.com?subject=Support Request - ${name}`;
      return;
    }

    localStorage.setItem(LAST_ACCESSED_APP, id);
    window.location.href = url;
  }

  return (
    <Paper
      data-testid={"app-card"}
      css={root}
      elevation={elevation}
      onClick={handleClick}
      onMouseOver={() => setElevation(2)}
      onMouseOut={() => setElevation(4)}
    >
      <Box
        css={containerStyle}
        display={"grid"}
        alignItems={"center"}
        justifyItems={"center"}
      >
        <img data-testid={"app-card-icon"} src={icon} width={111} height={96} />
        <Typography data-testid={"app-card-name"} variant={"h5"} align={"center"}>
          {name}
        </Typography>
        {!isValid && (
          <Typography
            data-testid={"app-card-expired"}
            css={expiredTextStyle}
            color={"text.secondary"}
          >
            Expired
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
