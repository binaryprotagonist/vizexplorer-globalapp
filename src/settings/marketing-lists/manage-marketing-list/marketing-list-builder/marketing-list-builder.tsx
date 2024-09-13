import { useMemo, useState } from "react";
import { CreateGuestList } from "./create-guest-list";
import { useImmerReducer } from "use-immer";
import {
  ManageMarketingListReducerAction,
  ManageMarketingListReducerState,
  emptyManageMarketingListReducerState,
  manageMarketingListReducer
} from "../reducer";
import { useNavigate } from "react-router-dom";
import { goBackUrl } from "../utils";
import { Box, useTheme } from "@mui/material";
import { PageContainer, PageContainerBreakout } from "view-v2/page";
import { Typography } from "@vizexplorer/global-ui-v2";
import { gql } from "@apollo/client";
import { useMarketingProgramsQuery } from "./__generated__/marketing-list-builder";

type Props = {
  title: string;
  siteId: string;
};

export function MarketingListBuilder({ title, siteId }: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [state, dispatch] = useImmerReducer<
    ManageMarketingListReducerState,
    ManageMarketingListReducerAction
  >(manageMarketingListReducer, emptyManageMarketingListReducerState());

  const {
    data: programsData,
    loading: programsLoading,
    error: programsErr
  } = useMarketingProgramsQuery({ variables: { siteId } });

  function handleClickCancel() {
    navigate(goBackUrl(siteId));
  }

  const takenNamesLowerCase = useMemo(() => {
    const programs = programsData?.pdMarketingPrograms || [];
    return new Set(programs.map(({ name }) => name.toLowerCase()));
  }, [programsData]);
  const isNameTaken = useMemo(() => {
    const normalizedName = state.marketingList.name.trim().toLowerCase();
    return takenNamesLowerCase.has(normalizedName);
  }, [state.marketingList.name, takenNamesLowerCase]);

  if (programsErr) throw programsErr;

  return (
    <PageContainer
      data-testid={"marketing-list-builder"}
      gridTemplateRows={"max-content auto"}
    >
      <Typography variant={"h1"} fontWeight={700} mb={theme.spacing(3)}>
        {title}
      </Typography>

      <PageContainerBreakout start={"page-start"} end={"page-end"}>
        <Box display={"flex"} flexDirection={"column"} overflow={"hidden"}>
          {step === 0 && (
            <CreateGuestList
              state={state}
              dispatch={dispatch}
              isNameTaken={isNameTaken}
              // TODO process on click continue, if necessary. Otherwise remove prop
              continuing={false}
              disabled={programsLoading}
              onClickCancel={handleClickCancel}
              onClickContinue={() => {
                setStep(1);
              }}
            />
          )}
        </Box>
      </PageContainerBreakout>
    </PageContainer>
  );
}

const _MARKETING_PROGRAMS_QUERY = gql`
  query marketingPrograms($siteId: ID!) {
    pdMarketingPrograms(siteId: $siteId) {
      id
      name
    }
  }
`;
