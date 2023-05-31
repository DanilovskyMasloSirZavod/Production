import { useLocation } from "react-router-dom";
import NotificationCard from "../../components/NotificationCard";
import { Box, List, ListItem } from "@mui/material";
import { FixedSizeList } from "react-window";

import Header from "../../components/Header";

const Notifications = (props) => {
    const location = useLocation();
    //console.log(location?.state?.notificationsArr);
    //console.log(props?.currentRole)

    const renderRow = (props) => {
        let { index, style } = props;
        return (
            <ListItem style={style} key={index} component="div">
                <NotificationCard cardInfo={location?.state?.notificationsArr[index]} />
            </ListItem>);
    }

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Уведомления" subtitle="Решайте проблемы одним кликом" />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
                <FixedSizeList
                    height={location?.state?.pageHeight}
                    width={700}
                    itemSize={350}
                    itemCount={location?.state?.notificationsArr?.length}
                    overscanCount={3}
                >
                    {renderRow}
                </FixedSizeList>
            </Box>
        </Box>);
}

export default Notifications;