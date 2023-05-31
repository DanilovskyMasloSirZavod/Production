import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import NavigateButton from "../../components/NavigateButton";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import React from "react";
import { createContext } from "react";
import { useMemo, useValue, useEffect, useState } from "react";
import API from "../../API";

import { DataGrid, GridToolbar, ruRU } from "@mui/x-data-grid";

import ToolTipExtended from "../../components/ToolTipExtended";

import FullScreenDialog from "../../components/FullScreenDialog";

const Receiving = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentVal, setCurrentVal] = useState("Сводка");
  const DashboardContext = createContext({ value: currentVal });

  const DashboardProvider = ({ children }) => {
    const [state, setState] = useState(currentVal);

    const onClick = (selVal) => {
      setState(selVal);
      setCurrentVal(selVal);
    };

    const value = React.useMemo(
      () => ({
        value: state
      }),
      [state]
    );
    return (
      <DashboardContext.Provider value={value}>
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <NavigateButton title="Сводка"
            icon={<PointOfSaleIcon />}
            enabled={"Сводка" === currentVal}
            newFuncSelection={() => onClick("Сводка")} />
        </Box>
        <Box
          gridColumn="span 4"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <NavigateButton title="Сотрудники"
            icon={<PointOfSaleIcon />}
            enabled={"Сотрудники" === currentVal}
            newFuncSelection={() => onClick("Сотрудники")} />
        </Box>
        {children}
      </DashboardContext.Provider>
    );
  };

  const useValue = () => React.useContext(DashboardContext);

  const StatChild = (props) => {
    const { value } = useValue();
    const [lineChartData, setLineChartData] = useState([])
    const [tableData, setTableData] = useState([])

    const [click, setClick] = useState(false);
    const [click2, setClick2] = useState(false);
    const [employeeObj, setEmployeeObj] = useState({});

    const handleWithEmplOpen = (val) => {
      setClick(true);
      API.get(`/GetEmployee?id=${val}`)
        .then(function (response) {
          setEmployeeObj(response?.data);
        })
        .catch(function (error) {
          console.log(error?.response?.data ? error?.response?.data : error?.message);
        });
    }

    const [deliveryObj, setDeliveryObj] = useState(null);
    const handleClick2 = (val) => {
      setClick2(true)
      setDeliveryObj(val);
    }

    const columnsSirie = [
      { field: "deliveryBatchNumber", headerName: "ID Партии", flex: 0.8 },
      {
        field: "sender",
        headerName: "Поставщик",
        flex: 1,
        renderCell: ({ row: { sender, delivery } }) => {
          return (
            <Box sx={{
              width: "100%",
              '&:hover': {
                opacity: [0.9, 0.8, 0.7],
                cursor: "pointer"
              },
            }}>
              <Typography color={colors.grey[100]} onClick={() => handleClick2(delivery)}>
                {sender}
              </Typography>
              <FullScreenDialog openClick={click2} closeFunc={() => setClick2(false)} title="Профиль поставщика">
                <Box sx={{ m: 5 }}>
                  <h1>{deliveryObj?.provider?.providerName}</h1>
                  <h1>Начало сотрудничества: {new Date(Date.parse(deliveryObj?.provider?.dateOfCoop))
                    .toLocaleString('ru-RU', {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</h1>
                </Box>
              </FullScreenDialog>
            </Box>
          );
        }
      },
      {
        field: "date",
        headerName: "Дата",
        flex: 1,
      },
      {
        field: "weight",
        headerName: "Масса",
        flex: 0.5,
        type: "number",
        headerAlign: "left",
        align: "left",
        renderCell: ({ row: { weight } }) => {
          return (
            <ToolTipExtended value={weight} text="Вес в тоннах"/>
          );
        }
      },
      {
        field: "employeeName",
        headerName: "Приемщик",
        flex: 1.5,
        cellClassName: "name-column--cell",
        renderCell: ({ row: { employeeName, employee } }) => {
          return (<> {employeeName &&
            <Box sx={{
              width: "100%",
              '&:hover': {
                opacity: [0.9, 0.8, 0.7],
                cursor: "pointer"
              },
            }}>
              <Typography color={colors.grey[100]} onClick={() => handleWithEmplOpen(employee.id)}>
                {employeeName}
              </Typography>
              <FullScreenDialog openClick={click} closeFunc={() => setClick(false)} title="Профиль сотрудника">
                <Box sx={{ m: 5 }}>
                  <h1>{employeeObj && `${employeeObj.surname ? employeeObj?.surname : ""} ${employeeObj.surname ? employeeObj?.name : ""} ${employeeObj.surname ? employeeObj?.patronymic : ""}`}</h1>
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
          }</>);
        }
      },
      {
        field: "createdProduct",
        headerName: "Продукт",
        flex: 2,
        cellClassName: "name-column--cell",
      }
    ];

    useEffect(() => {
      if (props.title === value) {
        API.get('/GetDeliverySummedToCurrent')
          .then(function (response) {
            setLineChartData([response?.data]);
          })
          .catch(function (error) {
            console.log(error?.response?.data ? error?.response?.data : error?.message);
          });

        API.get('/GetDeliveriesWithRecivers')
          .then(function (response) {
            let res = [];
            let arrFromResp = response?.data;

            arrFromResp.forEach(item => {
              res.push({
                deliveryBatchNumber: item.deliveryBatchNumber,
                sender: item.delivery.provider.providerName,
                date: new Date(Date.parse(item.delivery.date)).toLocaleString('ru-RU'),
                weight: item.delivery.weight,
                employeeName: `${item.employee ? item?.employee?.surname : ""} ${item.employee ? item?.employee?.name : ""} ${item.employee ? item?.employee?.patronymic : ""}`,
                createdProduct: item?.delivery?.createdProduct?.productName,
                employee: item?.employee,
                delivery: item.delivery,
              });
            });

            setTableData(res);
          })
          .catch(function (error) {
            console.log(error?.response?.data ? error?.response?.data : error?.message);
          });
      }
    }, []);

    return (
      <>
        {props.title === value ?
          <>
            {/* ROW 2 */}
            {/* Карточка с графиком линия. */}
            <Box
              gridColumn="span 14"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
            >
              <Box
                mt="25px"
                p="0 30px"
                display="flex "
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    color={colors.grey[100]}
                  >
                    Приёмка молока
                  </Typography>
                </Box>
                <Box>
                  <IconButton>
                    <DownloadOutlinedIcon
                      sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                    />
                  </IconButton>
                </Box>
              </Box>
              <Box height="250px" m="-20px 0 0 0">
                <LineChart data={lineChartData} bottom="Период" left="Тонны" />
              </Box>
            </Box>
            <Box
              gridColumn="span 14"
              gridRow="span 2"
              backgroundColor={colors.primary[400]}
            >
              <Box
                height="400px"
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
                  getRowId={(row) => row.deliveryBatchNumber}
                  rows={tableData}
                  columns={columnsSirie}
                  components={{ Toolbar: GridToolbar }}
                  localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} />
              </Box>
            </Box>
          </>
          : null}
      </>
    );
  };

  const EmployeesChild = (props) => {
    const { value } = useValue();
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
      if (props.title === value) {
        API.get('/GetEmployees')
          .then(function (response) {
            let res = [];
            let arrFromResp = (response?.data).filter(x => x.job?.exact?.clarification == "Приемно-аппаратный");
            arrFromResp.forEach(item => {
              res.push({
                id: item.id,
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
      }
    }, []);

    const columnsProduction = [
      {
        field: "id",
        headerName: "ID",
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
      <>
        {props.title === value ?
          <>
            <Box
              gridColumn="span 14"
              gridRow="span 3"
              backgroundColor={colors.primary[400]}
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
          </>
          : null}
      </>
    );
  };

  const firstPage = (
    <DashboardProvider>
      <StatChild title="Сводка" />
      <EmployeesChild title="Сотрудники" />
    </DashboardProvider> );

  const otherPage = (
    <h1>otherPage</h1>
  );

  const rolesForRights = ["Суперадмин"]; 

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Приемно-аппаратный цех" subtitle="Отслеживайте сводку по молоку" />
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

export default Receiving;