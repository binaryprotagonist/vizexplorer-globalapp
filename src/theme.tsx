import { ReactNode } from "react";
import { GlobalUITheme } from "@vizexplorer/global-ui-core";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline, tableRowClasses } from "@mui/material";

export const globalTheme: GlobalUITheme = {
  palette: {
    main: "#EDEDED"
  }
};

const theme = createTheme({
  palette: {
    text: {
      primary: "#000",
      secondary: "#868484"
    },
    secondary: {
      main: "#7A7A7A"
    }
  },
  typography: {
    body1: {
      fontSize: "14px"
    },
    h1: {
      fontSize: "48px"
    },
    h2: {
      fontSize: "38px"
    },
    h4: {
      fontSize: "26px",
      fontWeight: 500
    },
    h5: {
      fontSize: "26px"
    },
    h6: {
      fontSize: "18px",
      fontWeight: 500
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)"
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        footer: {
          minWidth: 0
        },
        root: {
          // hover effect shown when `onRowClick` or `onRowDoubleClick` is available https://github.com/material-table-core/core/issues/425
          [`&.${tableRowClasses.hover}`]: {
            "&:hover": {
              backgroundColor: "#F6FBFE"
            }
          }
        }
      }
    }
  }
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
