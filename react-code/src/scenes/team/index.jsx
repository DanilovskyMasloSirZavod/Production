import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, ruRU } from "@mui/x-data-grid";
import { tokens } from "../../theme";

import React, { useState, useEffect } from "react";

import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";

import API from "../../API";
import EditDialog from "../../components/EditDialog";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tableData, setTableData] = useState([])

  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState({role: null, id: null});
  const [rolesArr, setRolesArr] = React.useState([]);

  useEffect(() => {
    API.get('/GetAllCredentials')
      .then(function (response) {
        setTableData(response?.data);
      })
      .catch(function (error) {
        console.log(error?.response?.data ? error?.response?.data : error?.message);
      });
  }, []);

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const assignNewRole = (value) => {
    handleClose(value);

    API.put('/SetRole', {id: value?.id, role: value?.role})
      .then(function (response) {
        tableData.find(x=>x.employeeId === response?.data.employeeId).role = response?.data.role;
        setTableData(tableData);
      })
      .catch(function (error) {
        console.log(error?.response?.data ? error?.response?.data : error?.message);
      });

      setTableData([]);
      setSelectedValue({id: null, role: null});
  };

  const columns = [
    {
      field: "employeeId",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "login",
      headerName: "Логин",
      cellClassName: "name-column--cell",
      flex: 0.7
    },
    {
      field: "password",
      headerName: "Пароль",
      headerAlign: "left",
      align: "left",
      flex: 0.5
    },
    {
      field: "role",
      headerName: "Уровень доступа",
      flex: 2,
      renderCell: ({ row: { role, employeeId } }) => {

        const getRights = (x,y) => {
          setSelectedValue({id: y, role: x});

          API.get('/GetRoles')
            .then(function (response) {
              setRolesArr(response?.data);
            })
            .catch(function (error) {
              console.log(error?.response?.data ? error?.response?.data : error?.message);
            });

          setOpen(true);
        }

        return (
          <Box
            sx={{
              '&:hover': {
                opacity: [0.9, 0.8, 0.7],
                cursor: "pointer",
              },
            }}
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            onClick={() => getRights(role, employeeId)}
            backgroundColor={
              role === "Суперадмин"
                ? colors.redAccent[700]
                : role === "Админ"
                  ? colors.greenAccent[700]
                  : colors.blueAccent[900]
            }
            borderRadius="4px"
          >          
            {
              role === "Суперадмин" ? <AdminPanelSettingsOutlinedIcon />
                : role === "Админ" ? <SecurityOutlinedIcon />
                : <LockOpenOutlinedIcon />
            }
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {role}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header title="Доступ" subtitle="Управляйте доступом ваших сотрудников" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.blueAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.greenAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.greenAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.blueAccent[200]} !important`,
          },
        }}
      >
        <DataGrid getRowId={(row) => row.employeeId} checkboxSelection rows={tableData} columns={columns} localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} />
      </Box>
      <EditDialog
        title="Настройка доступа"
        selectedValue={selectedValue}
        colors={colors}
        data={rolesArr}
        open={open}
        onClose={handleClose}
        onNewRole={assignNewRole} />
    </Box>
  );
};

export default Team;
