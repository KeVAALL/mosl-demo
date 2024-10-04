import { Tooltip, tooltipClasses } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";

export const HtmlLightTooltip = styled(({ className, maxWidth, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme, maxWidth }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5ecd7",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: maxWidth || 220,
    height: 30,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#f5ecd7", // Match this to the backgroundColor of the tooltip
    "&:before": {
      border: "1px solid #000",
    },
  },
}));
export const HtmlSecondaryTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "fdaf17",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    height: 30,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "fdaf17", // Match this to the backgroundColor of the tooltip
    "&:before": {
      border: "1px solid #000",
    },
  },
}));
