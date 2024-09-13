import { Collapse, CollapseProps } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import styled from "@emotion/styled";

const ErrorContainer = styled.label({
  display: "flex",
  alignItems: "center",
  border: "1px solid #f44336",
  backgroundColor: "rgb(253, 236, 234)",
  borderRadius: "4px",
  color: "rgb(97, 26, 21)",
  padding: "6px 12px",
  fontSize: "16px",
  lineHeight: "25px"
});

const ErrorIcon = styled(ErrorOutline)({
  color: "#f44336",
  opacity: 0.9,
  marginRight: "12px",
  height: "20px"
});
0;
export function FormError({ children, ...rest }: CollapseProps) {
  return (
    <Collapse data-testid={"form-error"} style={{ width: "100%" }} {...rest}>
      <ErrorContainer>
        <ErrorIcon />
        {children}
      </ErrorContainer>
    </Collapse>
  );
}
