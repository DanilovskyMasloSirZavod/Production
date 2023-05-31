//mui import
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
//!mui import

//theme and colors import
import { tokens } from "../../theme";
//!theme and colors import

//icons import
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
//!icons import

//react import
import React from "react";
import { useEffect, useState, createContext } from "react";
//!react import

//api import
import API from "../../API";
//!api import

//table import
import { DataGrid, GridToolbar, ruRU } from "@mui/x-data-grid";
//!table import

//custom items import
import FullScreenDialog from "../../components/FullScreenDialog";
import ComboBoxCheckBoxes from "../../components/ComboBoxCheckBoxes";
import EditDialog from "../../components/EditDialog";
import ToolTipExtended from "../../components/ToolTipExtended";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import NavigateButton from "../../components/NavigateButton";
//!custom items import

const Dashboard = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentVal, setCurrentVal] = useState("Сырье");
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
          <NavigateButton title="Сырье"
            icon={<PointOfSaleIcon />}
            enabled={"Сырье" === currentVal}
            newFuncSelection={() => onClick("Сырье")} />
        </Box>
        <Box
          gridColumn="span 4"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <NavigateButton title="Продукция"
            icon={<PointOfSaleIcon />}
            enabled={"Продукция" === currentVal}
            newFuncSelection={() => onClick("Продукция")} />
        </Box>
        {children}
      </DashboardContext.Provider>
    );
  };

  const useValue = () => React.useContext(DashboardContext);

  const SirieChild = (props) => {
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
        type: "dateTime",
      },
      {
        field: "weight",
        headerName: "Вес",
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
              gridColumn="span 16"
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
                    Закупка сырья
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
              gridColumn="span 16"
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
                  disableSelectionOnClick
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

  const ProductionChild = (props) => {
    const { value } = useValue();
    const [products, setProducts] = useState([])
    const [lineChartData, setLineChartData] = useState([])
    const [tableData, setTableData] = useState([])
    const [showValue, setShowValue] = useState([])

    const results = React.useRef([]);

    const [open, setOpen] = useState(false);
    const [creatorsObj, setCreatorsObj] = useState({ id: null, data: [], role: null });

    const [click, setClick] = useState(false);
    const [employeeObj, setEmployeeObj] = useState({ id: null, data: null, role: null });

    const handleWithEmplOpen = (val) => {
      setClick(true);
      API.get(`/GetEmployee?id=${val.id}`)
        .then(function (response) {
          setEmployeeObj({ id: val.id, data: response?.data, role: val?.role });
          setClick(true);
        })
        .catch(function (error) {
          console.log(error?.response?.data ? error?.response?.data : error?.message);
        });
    }

    const handleCreatorsOpen = (batchId) => {
      setOpen(true);
      API.get(`/GetCreatorsByBatchId?batchId=${batchId}`)
        .then(function (response) {
          let arr = response?.data;
          let array = [];
          arr.forEach(x => {
            array.push({
              id: x.creatorEmployeeId,
              textValue: `${x.employee.surname} ${x.employee.name} ${x.employee?.patronymic}`
            });
          });
          setCreatorsObj({ id: batchId, data: array });
        })
        .catch(function (error) {
          console.log(error?.response?.data ? error?.response?.data : error?.message);
        });
    }

    const valueUpdater = (selection, first = false) => {
      debugger;
      let res = [];
      if (selection.length > 0) {
        if (first) {
          selection.forEach(x => {
            let found = results.current.find(item => item.id === x)
            if (found != undefined)
              res.push(found);
          });
          res[0] != undefined ? setLineChartData(res) : setLineChartData([]);
          return;
        }

        selection.forEach(x => {
          let found = showValue.find(item => item.id === x)
            if (found != undefined)
              res.push(found);
        });
      }

      res[0] != undefined ? setLineChartData(res) : setLineChartData([]);
    }

    const handleClose = (value) => {
      setOpen(false);
    };

    const selectedEmployee = (value) => {
      setOpen(false);
      handleWithEmplOpen(value);
    };

    useEffect(() => {
      if (props.title === value) {
        API.get('/GetProducts')
          .then(function (response) {
            setProducts(response?.data);
          })
          .catch(function (error) {
            console.log(error?.response?.data ? error?.response?.data : error?.message);
          });

        API.get('/GetTopCreatedProducts')
          .then(function (response) {
            let res = [];
            let start = 1;
            response?.data.forEach(x=>{
              res.push({id: start++, name: x?.name, sum: x?.sum});
            });
            setTopProductionTableData(res);
          })
          .catch(function (error) {
            console.log(error?.response?.data ? error?.response?.data : error?.message);
          });

        API.get('/GetProductions')
          .then(function (response) {
            results.current = response?.data;
            setShowValue(results.current);
            valueUpdater(["Всего"], true)
          })
          .catch(function (error) {
            console.log(error?.response?.data ? error?.response?.data : error?.message);
          });

        API.get('/GetTopSellingPoints')
          .then(function (response) {
            let res = [];
            let arrFromResp = response?.data;

            arrFromResp.forEach(item => {
              res.push({
                id: count,
                addres: item?.pointOfSale?.addres,
                sumSold: item?.sumSold,
                city: item?.pointOfSale?.city,
                pointOfSale: item?.pointOfSale,
              });
            });

            setTableData(res);
          })
          .catch(function (error) {
            console.log(error?.response?.data ? error?.response?.data : error?.message);
          });
      }
    }, []);

    const setup = (arr, def) => {
      if (arr.length < 1) return [];
      if (arr[0].productName != def)
        arr.unshift({ productName: "Всего" });
      return arr;
    }

    const columnsProduction = [
      {
        field: "shift",
        headerName: "Смена",
        flex: 0.8,
        renderCell: ({ row: { shift } }) => {
          return (<Box sx={{
            width: "100%",
            '&:hover': {
              opacity: [0.9, 0.8, 0.7],
              cursor: "pointer"
            },
          }}>
            <Typography color={colors.grey[100]} onClick={() => handleCreatorsOpen(shift)}>
              {shift}
            </Typography>
            <FullScreenDialog openClick={click} closeFunc={() => setClick(false)} title="Профиль сотрудника">
              <Box sx={{ m: 5 }}>
                <h1>{employeeObj?.role}</h1>
                <h1>{employeeObj && employeeObj?.data?.job?.position?.positionName + ` (${employeeObj?.data?.job?.place?.workPlace})`}</h1>
                <h1>Номер телефона: {employeeObj && employeeObj?.data?.phone}</h1>
                <h1>Взят на работу: {new Date(Date.parse(employeeObj && employeeObj?.data?.dateOfEmployment))
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
        field: "manufactured",
        headerName: "Масса",
        flex: 0.8,
        type: "number",
        headerAlign: "left",
        align: "left",
        renderCell: ({ row: { manufactured } }) => {
          return (
            <ToolTipExtended value={manufactured} text="Вес в тоннах"/>
          );
        }
      },
      {
        field: "date",
        headerName: "Дата",
        flex: 0.8,
      },
      {
        field: "createdProduct",
        headerName: "Продукт",
        flex: 1,
        cellClassName: "name-column--cell",
      }
    ];

    const [topProductionTableData, setTopProductionTableData] = useState([]);
    const columnsTopProduction = [
      {
        headerName: "№",
        flex: 0.3,
        type: "number",
        field: "id"
      },
      {
        field: "name",
        headerName: "Продукт",
        flex: 1
      },
      {
        field: "sum",
        headerName: "Масса",
        flex: 0.5,
        type: "number",
        headerAlign: "left",
        align: "left",
        renderCell: ({ row: { sum } }) => {
          return (
            <ToolTipExtended value={sum} text="Вес в тоннах"/>
          );
        },
      }
    ];

    const [topSellsTableData, setTopSellsTableData] = useState([]);
    const columnsTopSell = [
      {
        headerName: "№",
        flex: 0.3,
        type: "number",
        field: "id"
      },
      {
        field: "name",
        headerName: "Продукт",
        flex: 1
      },
      {
        field: "sum",
        headerName: "Масса",
        flex: 0.5,
        type: "number",
        headerAlign: "left",
        align: "left",
        renderCell: ({ row: { sum } }) => {
          return (
            <ToolTipExtended value={sum} text="Вес в тоннах"/>
          );
        },
      },
    ];

    return (
      <>
        {props.title === value ?
          <>
            {/* ROW 2, ITEM 1 */}
            {/* Карточка с графиком линия. */}
            <Box
              gridColumn="span 14"
              gridRow="span 3"
              backgroundColor={colors.primary[400]}
            >
              <Box
                mt="45px"
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
                    Произведено продукции
                  </Typography>
                </Box>
                <ComboBoxCheckBoxes changed={valueUpdater} title="Фильтр" inner="Тип" defaultVal={{ productName: "Всего" }} data={setup(products, "Всего")} width="33%" />
              </Box>
              <Box height="300px" m="-5px 0 0 0">
                <LineChart data={lineChartData} bottom="Период" left="Тонны" minVal={0} />
              </Box>
            </Box>
            {/* ROW 3, ITEM 1 */}
            {/* Карточка с историей производства. */}
            <Box
              gridColumn="span 6"
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
                <Typography variant="h5"
                  marginTop={1}
                  align="center"
                  fontWeight="600"
                  color={colors.grey[100]}>
                  История производства
                </Typography>
                <DataGrid
                  disableSelectionOnClick
                  getRowId={(row) => row.shift}
                  rows={tableData}
                  columns={columnsProduction}
                  components={{ Toolbar: GridToolbar }}
                  localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} />
                <EditDialog
                  title="Смена"
                  selectedValue={employeeObj}
                  colors={colors}
                  data={creatorsObj.data}
                  open={open}
                  onClose={handleClose}
                  onNewRole={selectedEmployee} />
              </Box>
            </Box>
            {/* ROW 3, ITEM 2 */}
            {/* Карточка с топом производства. */}
            <Box
              gridColumn="span 4"
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
                <Typography variant="h5"
                  marginTop={1}
                  align="center"
                  fontWeight="600"
                  color={colors.grey[100]}>
                  Топ производства
                </Typography>
                <DataGrid
                  disableSelectionOnClick
                  getRowId={(row) => row.name}
                  rows={topProductionTableData}
                  columns={columnsTopProduction}
                  components={{ Toolbar: GridToolbar }}
                  localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} />
              </Box>
            </Box>
            {/* ROW 3, ITEM 3 */}
            {/* Карточка с топом продаж. */}
            <Box
              gridColumn="span 4"
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
                <Typography variant="h5"
                  marginTop={1}
                  align="center"
                  fontWeight="600"
                  color={colors.grey[100]}>
                  Топ продаж
                </Typography>
                <DataGrid
                  disableSelectionOnClick
                  getRowId={(row) => row?.name}
                  rows={topSellsTableData}
                  columns={columnsTopSell}
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
      <SirieChild title="Сырье" />
      <ProductionChild title="Продукция" /> 
    </DashboardProvider> );

  const otherPage = (
    <h1>otherPage</h1>
  );

  const rolesForRights = ["Суперадмин"];  

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Cтатистика" subtitle="Отслеживайте статистику" />
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
};

export default Dashboard;
