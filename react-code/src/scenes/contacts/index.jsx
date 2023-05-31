import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import NavigateButton from "../../components/NavigateButton";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import Header from "../../components/Header";
import React from "react";
import { createContext } from "react";
import { useMemo, useValue, useEffect, useState } from "react";
import API from "../../API";

import { DataGrid, GridToolbar, ruRU } from "@mui/x-data-grid";

import ToolTipExtended from "../../components/ToolTipExtended";
import FullScreenDialog from "../../components/FullScreenDialog";

const Contacts = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const EmployeesChild = (props) => {
    const [tableData, setTableData] = useState([])

    const [click, setClick] = useState(false);
    const [employeeObj, setEmployeeObj] = useState({});

    const handleWithEmplOpen = (val) => {
      setClick(true);
      API.get(`/GetEmployee?id=${val.id}`)
        .then(function (response) {
          setEmployeeObj(response?.data);
        })
        .catch(function (error) {
          console.log(error?.response?.data ? error?.response?.data : error?.message);
        });
    }

    useEffect(() => {
      API.get('/GetEmployees')
        .then(function (response) {
          let res = [];
          let arrFromResp = (response?.data).filter(x=>x?.job?.place?.workPlace === "Производство");
          arrFromResp.forEach(item => {
            res.push({
              id: item.id,
              workPlace: item?.job?.exact?.clarification,
              employeeName: `${item.surname} ${item.name} ${item?.patronymic}`,
              date: new Date(Date.parse(item?.dateOfEmployment)).toLocaleString('ru-RU'),
              job: item?.job
            });
          });

          setTableData(res);
        })
        .catch(function (error) {
          console.log(error?.response?.data ? error?.response?.data : error?.message);
        });
    }, []);

    const columnsProduction = [
      {
        field: "id",
        headerName: "ID",
        flex: 0.8,
      },
      {
        field: "workPlace",
        headerName: "Место работы",
        flex: 0.8,
      },
      {
        field: "employeeName",
        headerName: "ФИО",
        flex: 0.8,
        cellClassName: "name-column--cell",
        renderCell: ({ row: { employeeName, id } }) => {
          return (<Box sx={{
            width: "100%",
            '&:hover': {
              opacity: [0.9, 0.8, 0.7],
              cursor: "pointer"
            },
          }}>
            <Typography color={colors.grey[100]} onClick={() => handleWithEmplOpen({ id: id })}>
              {employeeName}
            </Typography>
            <FullScreenDialog openClick={click} closeFunc={() => setClick(false)} title="Профиль сотрудника">
              <Box sx={{ m: 5 }}>
                <h1>{employeeObj && `${employeeObj.surname} ${employeeObj.name} ${employeeObj?.patronymic}`}</h1>
                <h1>{employeeObj?.role}</h1>
                <h1>{employeeObj && employeeObj?.job?.position?.positionName + ` (${employeeObj?.job?.place?.workPlace})`}</h1>
                <h1>Номер телефона: {employeeObj && employeeObj?.phone}</h1>
                <h1>Взят на работу: {new Date(Date.parse(employeeObj && employeeObj?.dateOfEmployment))
                  .toLocaleString('ru-RU', {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</h1>
                <Button
                  sx={{
                    backgroundColor: colors.greenAccent[700],
                    color: colors.grey[100],
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    "&:hover": {
                      backgroundColor: colors.blueAccent[700],
                    },
                  }}
                >
                  Перейти в чат
                </Button>
              </Box>
            </FullScreenDialog>
          </Box>
          );
        }
      },
      {
        field: "date",
        headerName: "Дата принятия",
        flex: 0.8,
      },
    ];

    return (
      <Box
        gridColumn="span 14"
        gridRow="span 4"      
      >
        <Box
          height="100%"
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
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid
            getRowId={(row) => row.id}
            rows={tableData}
            columns={columnsProduction}
            components={{ Toolbar: GridToolbar }}
            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} />
        </Box>
      </Box>
    );
  };

  const firstPage = (<EmployeesChild />);


  const otherPage = (
    <h1>otherPage</h1>
  );

  const rolesForRights = ["Суперадмин"];

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Сотрудники" subtitle="Список всех ваших сотрудников" />
        <Box>
          <Button
            sx={{
              backgroundColor: colors.greenAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              "&:hover": {
                backgroundColor: colors.blueAccent[700],
              },
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Выгрузить
          </Button>
        </Box>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(14, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {
          props?.rolesArr?.length === 0 ? firstPage
            : props?.rolesArr?.includes(props?.currentRole?.userRole) ? rolesForRights.includes(props?.currentRole?.userRole)
              ? firstPage
              : otherPage
              : <Typography>Ошибка ролей</Typography>
        }
      </Box>
    </Box>
  );
}

export default Contacts;
