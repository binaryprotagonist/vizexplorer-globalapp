import { Box, styled, useTheme } from "@mui/material";
import { ProgramCard } from "./program-card";
import { ProgramActionType } from "./types";
import { ProgramCardProgramFragment } from "./__generated__/program-card";
import { Typography, useGlobalTheme } from "@vizexplorer/global-ui-v2";
import { isActiveProgramStatus } from "./utils";

const ProgramListContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(2.5)
}));

type Props = {
  loading: boolean;
  programList: ProgramCardProgramFragment[];
  expandedProgramId?: string | null;
  handleProgramActionClick: (
    actionType: ProgramActionType,
    program: ProgramCardProgramFragment
  ) => void;
};

export function ProgramList({
  loading,
  programList,
  expandedProgramId,
  handleProgramActionClick
}: Props) {
  const globalTheme = useGlobalTheme();
  const theme = useTheme();
  const activePrograms = programList.filter(({ status }) =>
    isActiveProgramStatus(status)
  );
  const inActivePrograms = programList.filter(
    ({ status }) => !isActiveProgramStatus(status)
  );

  if (loading) {
    return (
      <ProgramListContainer>
        {Array.from({ length: 6 }).map((_, idx) => (
          <ProgramCard
            data-testid={"programs-loading"}
            key={`loading-program-${idx}`}
            loading
          />
        ))}
      </ProgramListContainer>
    );
  }

  return (
    <Box
      data-testid={"program-list"}
      display={"flex"}
      flexDirection={"column"}
      rowGap={theme.spacing(2.5)}
      overflow={"hidden"}
    >
      {!!activePrograms.length && (
        <Box>
          <Typography gutterBottom color={globalTheme.colors.grey[600]} variant={"label"}>
            ACTIVE PROGRAMS
          </Typography>
          <ProgramListContainer>
            {activePrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                expanded={expandedProgramId === program.id}
                onClickAction={handleProgramActionClick}
              />
            ))}
          </ProgramListContainer>
        </Box>
      )}
      {!!inActivePrograms.length && (
        <Box>
          <Typography gutterBottom color={globalTheme.colors.grey[600]} variant={"label"}>
            HISTORY
          </Typography>
          <ProgramListContainer>
            {inActivePrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                expanded={expandedProgramId === program.id}
                onClickAction={handleProgramActionClick}
              />
            ))}
          </ProgramListContainer>
        </Box>
      )}
    </Box>
  );
}

ProgramList.fragments = {
  programCardProgram: ProgramCard.fragments.programCardProgram
};
