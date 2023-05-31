import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState, useRef, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";

import { useNavigate } from "react-router-dom";

import Badge from '@mui/material/Badge';

const Topbar = (props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [notifications, setNotifications] = useState(0);

  const notificationsUpdate = (val) => {
    count.current = val;
    setNotifications(val);
  }

  const count = useRef(2);
  /*useEffect(() => {
    const interval = setInterval(() =>{
      count.current = count.current + 1;
      notificationsUpdate(count.current)
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);*/



  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={() => {notificationsUpdate(0); navigate("/notifications", {state: 
          {
            notificationsArr: [
              {
                date: "12.08.2022", 
                where: "Сырцех", 
                message: "Ожидаемый результат выпускаемой продукции 1.2т. Выходной результат 1т. Учитывая максимальную погрешность на данный период (0.3т) недобор выходного веса продукции равен 0.2т. Данные предоставил Юшкин Максим Сергеевич.", 
                who: {fullName: "Юшкин Максим Сергеевич"}
              },
              {
                date: "29.09.2022", 
                where: "Сырцех", 
                message: "Ожидаемый результат выпускаемой продукции 2.1т. Выходной результат 1.9т. Учитывая максимальную погрешность на данный период (0.1т) недобор выходного веса продукции равен 0.2т. Данные предоставил Иванов Иван Иванович.", 
                who: {fullName: "Иванов Иван Иванович"}
              },
            ], 
            pageHeight: document.body.scrollHeight * 0.7
            }});
          }}>
          <Badge badgeContent={count.current} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={() => navigate("/profile", {state: {pageHeight: document.body.scrollHeight * 0.7}})}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
