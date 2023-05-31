import { Box, Typography, useTheme } from "@mui/material";
import Zoom from '@mui/material/Zoom';
import { tokens } from "../theme";
import Tooltip from '@mui/material/Tooltip';

const ToolTipExtended = ({text, value}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
      <Tooltip TransitionComponent={Zoom} title={text}>
        <Box sx={{
          width: "100%",
          '&:hover': {
            opacity: [0.9, 0.8, 0.7],
            cursor: "pointer"
          },
        }}>
          <Typography color={colors.grey[100]}>
            {value}
          </Typography>
        </Box>
      </Tooltip>
    );
}

export default ToolTipExtended;