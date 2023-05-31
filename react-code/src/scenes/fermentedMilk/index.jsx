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

import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import FullScreenDialog from "../../components/FullScreenDialog";
import ComboBoxCheckBoxes from "../../components/ComboBoxCheckBoxes";
import EditDialog from "../../components/EditDialog";
import BarChart from "../../components/BarChart";
import ListOfItems from "../../components/ListOfItems";

const FermentedMilk = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentVal, setCurrentVal] = useState("Производство");
    const DashboardContext = createContext({ value: currentVal });
    const stringArr = [
        { id: 0, value: "Несортовое" },
        { id: 1, value: "Второй сорт" },
        { id: 2, value: "Первый сорт" },
        { id: 3, value: "Высший сорт" },
    ]

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
                    <NavigateButton title="Производство"
                        icon={<PointOfSaleIcon />}
                        enabled={"Производство" === currentVal}
                        newFuncSelection={() => onClick("Производство")} />
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

    const ProductionChild = (props) => {
        const { value } = useValue();
        const [click, setClick] = useState(false);

        const [click2, setClick2] = useState(false);
        const [item, setItem] = useState(null);
        const [listData, setListData] = useState([{ id: null, primaryText: null, secondaryText: null, icon: null, data: null }])
        const handleItemClick = (val) => {
            setItem(val);
            setClick2(true);
        }

        const [barChartData, setBarChartData] = useState({ data: [], keys: [] })
        const [tableData, setTableData] = useState([])

        const handleClose = (value) => {
            setOpen(false);
        };
        const selectedEmployee = (value) => {
            setOpen(false);
            handleWithEmplOpen(value);
        };
        const [open, setOpen] = useState(false);
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

        const [creatorsObj, setCreatorsObj] = useState({ id: null, data: [], role: null });
        const handleShiftOpen = (val) => {
            setOpen(true);
            API.get(`/GetCreatorsByBatchId?batchId=${val}`)
                .then(function (response) {
                    let arr = response?.data;
                    let array = [];
                    arr.forEach(x => {
                        array.push({
                            id: x.creatorEmployeeId,
                            textValue: `${x.employee.surname} ${x.employee.name} ${x.employee?.patronymic}`
                        });
                    });
                    setCreatorsObj({ id: val, data: array });
                })
                .catch(function (error) {
                    console.log(error?.response?.data ? error?.response?.data : error?.message);
                });
        }

        const columnsSirie = [
            { field: "batchNumber", headerName: "ID Партии", flex: 0.8 },
            {
                field: "productName",
                headerName: "Название",
                flex: 1,
                renderCell: ({ row: { productName } }) => {
                    return (
                        <Typography color={colors.grey[100]}>
                            {productName}
                        </Typography>
                    );
                }
            },
            {
                field: "date",
                headerName: "Дата",
                flex: 1,
            },
            {
                field: "practWeight",
                headerName: "Вес реальный",
                flex: 0.5,
                type: "number",
                headerAlign: "left",
                align: "left",
                renderCell: ({ row: { practWeight } }) => {
                    return (
                        <Tooltip TransitionComponent={Zoom} title="Вес в тоннах">
                            <Box sx={{
                                width: "100%",
                                '&:hover': {
                                    opacity: [0.9, 0.8, 0.7],
                                    cursor: "pointer"
                                },
                            }}>
                                <Typography color={colors.grey[100]}>
                                    {practWeight}
                                </Typography>
                            </Box>
                        </Tooltip>
                    );
                }
            },
            {
                field: "theorWeight",
                headerName: "Вес теоретический",
                flex: 0.5,
                type: "number",
                headerAlign: "left",
                align: "left",
                renderCell: ({ row: { theorWeight } }) => {
                    return (
                        <Tooltip TransitionComponent={Zoom} title="Вес в тоннах">
                            <Box sx={{
                                width: "100%",
                                '&:hover': {
                                    opacity: [0.9, 0.8, 0.7],
                                    cursor: "pointer"
                                },
                            }}>
                                <Typography color={colors.grey[100]}>
                                    {theorWeight}
                                </Typography>
                            </Box>
                        </Tooltip>
                    );
                }
            },
            {
                field: "isOk",
                headerName: "Совпадение",
                flex: 0.5,
                renderCell: ({ row: { isOk } }) => {
                    return (
                        <Typography color={colors.grey[100]}>
                            {isOk ? "Да" : "Нет"}
                        </Typography>
                    );
                }
            },
            {
                field: "shiftNumber",
                headerName: "Смена",
                flex: 1.5,
                renderCell: ({ row: { shiftNumber } }) => {
                    return (<> {shiftNumber &&
                        <Box sx={{
                            width: "100%",
                            '&:hover': {
                                opacity: [0.9, 0.8, 0.7],
                                cursor: "pointer"
                            },
                        }}>
                            <Typography color={colors.grey[100]} onClick={() => handleShiftOpen(shiftNumber)}>
                                {shiftNumber}
                            </Typography>
                            <FullScreenDialog openClick={click} closeFunc={() => setClick(false)} title="Профиль сотрудника">
                                <Box sx={{ m: 5 }}>
                                    <h1>{`${employeeObj?.surname} ${employeeObj?.name} ${employeeObj?.patronymic}`}</h1>
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
        ];

        useEffect(() => {
            if (props.title === value) {
                API.get('/GetProductionsOfExact?exact=Кисломолочный')
                    .then(function (response) {
                        console.log(response?.data);
                        let res = response?.data.data;
                        let arr = [];
                        res.forEach(x => {
                            let temp = x.lastIndexOf(':');
                            let sub = x.substring(temp + 1);
                            let neww = sub.replaceAll(',', '.');
                            let reslt = x.split(sub).join(neww);
                            arr.push(JSON.parse(reslt));
                        })
                        setBarChartData({ data: arr, keys: response?.data.keys });
                    })
                    .catch(function (error) {
                        console.log(error?.response?.data ? error?.response?.data : error?.message);
                    });

                API.get('/GetCreationsHistoryCalculated')
                    .then(function (response) {
                        let res = [];
                        let arrFromResp = response?.data.filter(x => x?.product?.exact?.clarification == "Кисломолочный");
                        arrFromResp.forEach(item => {
                            res.push({
                                batchNumber: item.batchNumber,
                                productName: item?.product?.productName,
                                date: new Date(Date.parse(item.date)).toLocaleString('ru-RU'),
                                practWeight: item.practicalWeightResult,
                                theorWeight: item.theoreticalWeightResult,
                                isOk: item?.isOk,
                                shiftNumber: item?.shiftNumber,
                                product: item?.product,
                            });
                        });

                        setTableData(res);
                    })
                    .catch(function (error) {
                        console.log(error?.response?.data ? error?.response?.data : error?.message);
                    });

                API.get('/GetLabResultsByDate?dateString=28.08.2022')
                    .then(function (response) {
                        let res = [];
                        let arrFromResp = response?.data.filter(x => x?.selectedProduct?.exact?.clarification == "Кисломолочный");
                        arrFromResp.forEach(item => {
                            res.push({
                                id: item.batchNumber,
                                primaryText: item.selectedProduct.productName,
                                secondaryText: stringArr.find(x => x.id == item.sort).value,
                                icon: <PointOfSaleIcon />,
                                data: item
                            });
                        });

                        setListData(res);
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
                            gridColumn="span 10"
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
                                        Произведено продукции
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
                                <BarChart keys={barChartData.keys} data={barChartData.data} bottom="Период" left="Тонны" />
                            </Box>
                        </Box>
                        <Box
                            gridColumn="span 4"
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
                                        Сегодня в производстве:
                                    </Typography>
                                </Box>
                            </Box>
                            <Box height="250px">
                                <FullScreenDialog openClick={click2} closeFunc={() => setClick2(false)} title="Продукт">
                                    <Box sx={{ m: 5 }}>
                                        <h1>{`Производимый продукт: ${item?.primaryText}`}</h1>
                                        <h1>{`${item?.secondaryText}`}</h1>
                                        <h1>{`Жирность: ${item?.data?.richness}`}</h1>
                                        <h1>{`Соматика: ${item?.data?.somatics}`}</h1>
                                        <>
                                            <Typography
                                                variant="h2"
                                                fontWeight="600"
                                                color={colors.grey[100]}>
                                                Ответсвенный лаборант:
                                            </Typography>
                                            <Box sx={{
                                                width: "100%",
                                                '&:hover': {
                                                    opacity: [0.9, 0.8, 0.7],
                                                    cursor: "pointer"
                                                },
                                            }}>
                                                <Typography
                                                    variant="h2"
                                                    fontWeight="600"
                                                    color={colors.blueAccent[500]}
                                                    onClick={() => handleWithEmplOpen({ id: item?.data?.employee?.id })}
                                                >
                                                    {`${item?.data?.employee?.surname} ${item?.data?.employee?.name} ${item?.data?.employee?.patronymic}`}
                                                </Typography>
                                            </Box>
                                        </>
                                    </Box>
                                </FullScreenDialog>
                                <ListOfItems data={listData} clickFunction={handleItemClick} />
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
                                    getRowId={(row) => row.shiftNumber}
                                    rows={tableData}
                                    columns={columnsSirie}
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
                        let arrFromResp = (response?.data).filter(x => x.job?.exact?.clarification == "Кисломолочный");
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

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Кисломолочный цех" subtitle="Отслеживайте статистику производства кисломолочной продукции" />
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
                <DashboardProvider>
                    {/* HEADER */}
                    <ProductionChild title="Производство" />
                    <EmployeesChild title="Сотрудники" />
                </DashboardProvider>
            </Box>
        </Box>
    );
}

export default FermentedMilk;