import { Box, Button, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { tokens } from "../theme";
import ReactDOM from "react-dom";

const NavigateButton = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [click, setClick] = useState(props.enabled)

  return (
    <Button startIcon={props.icon}
    id = {props.id}
    sx = {{
        height: "100%", width: "100%", 
        backgroundColor: click ? colors.greenAccent[700] : colors.primary[400],
        "&:hover": {
          backgroundColor: colors.blueAccent[700],
        },
      }} 
        
        onClick={() => {
            if(!click) {
              setClick(!click);
              props.newFuncSelection(props.title);
            }
        }}
        >
        <Typography variant="h4" fontWeight="bold" sx={{ color: colors.grey[100] }}>
            {props.title}
        </Typography>    
    </Button>
  );
};

export default NavigateButton;
