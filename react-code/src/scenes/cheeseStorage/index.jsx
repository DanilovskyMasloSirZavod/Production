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

const CheeseStorage = (props) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentVal, setCurrentVal] = useState("Созревание");
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
                    <NavigateButton title="Созревание"
                        icon={<PointOfSaleIcon />}
                        enabled={"Созревание" === currentVal}
                        newFuncSelection={() => onClick("Созревание")} />
                </Box>
                <Box
                    gridColumn="span 4"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <NavigateButton title="Готово"
                        icon={<PointOfSaleIcon />}
                        enabled={"Готово" === currentVal}
                        newFuncSelection={() => onClick("Готово")} />
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

    const SozrevChild = (props) => {
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
                API.get('GetCreationsHistoriesFull?val=false')
                    .then(function (response) {
                        let res = [];
                        let arrFromResp = (response?.data)//.filter(x=> new Date(Date.parse(x?.cheeseStorageProcess?.middleDate)) >= new Date());
                        arrFromResp.forEach(item => {
                            res.push({
                                batchNumber: item?.batchNumber,
                                employeeName: `${item?.employee?.surname} ${item?.employee?.name} ${item?.employee?.patronymic}`,
                                employee: item?.employee,
                                date: new Date(Date.parse(item?.date)).toLocaleString('ru-RU'),
                                value: item?.value,
                                possibleNowLoss: item?.cheeseStorageProcess?.possibleNowLoss,
                                middleDate: item?.cheeseStorageProcess?.middleDate,
                                resultMass: item?.cheeseStorageProcess?.resultMass,
                                summedLoss: item?.cheeseStorageProcess?.summedLoss,
                                dateOfRecv: item?.cheeseStorageProcess?.dateOfRecv,
                                productName: item?.cheeseStorageProcess?.creationsHistory?.product?.productName,
                                product: item?.cheeseStorageProcess?.creationsHistory?.product,
                                massWhenRecv: item?.cheeseStorageProcess?.massWhenRecv
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
                field: "batchNumber",
                headerName: "Партия",
                flex: 0.8,
            },
            {
                field: "productName",
                headerName: "Продукт",
                headerAlign: "left",
                align: "left",
                flex: 0.8,
            },
            {
                field: "dateOfRecv",
                headerName: "Дата получения",
                headerAlign: "left",
                align: "left",
                flex: 0.8,
            },
            {
                field: "middleDate",
                headerName: "Дата готовности",
                headerAlign: "left",
                align: "left",
                flex: 0.8,
            },
            {
                headerName: "Cостояние",
                renderCell: () => {
                    return (
                        <Typography color={colors.grey[100]}>
                            Вызревает
                        </Typography>);
                },
                headerAlign: "left",
                align: "left",
                flex: 0.4,
            },
            {
                field: "massWhenRecv",
                type: "number",
                headerName: "Масса при получении",
                renderCell: ({ row: { massWhenRecv } }) => {
                    return (
                      <ToolTipExtended value={massWhenRecv} text="Вес в тоннах"/>
                    );
                },
                headerAlign: "left",
                align: "left",
                flex: 0.6,
            },
            {
                field: "resultMass",
                type: "number",
                headerName: "Текущая масса",
                renderCell: ({ row: { resultMass } }) => {
                    return (
                      <ToolTipExtended value={resultMass} text="Вес в тоннах"/>
                    );
                },
                headerAlign: "left",
                align: "left",
                flex: 0.6,
            },
            {
                field: "summedLoss",
                type: "number",
                headerName: "Сумма потерь",
                renderCell: ({ row: { summedLoss } }) => {
                    return (
                      <ToolTipExtended value={summedLoss} text="Вес в тоннах"/>
                    );
                },
                headerAlign: "left",
                align: "left",
                flex: 0.6,
            },
            {
                field: "possibleNowLoss",
                type: "number",
                headerName: "Допустимые потери",
                renderCell: ({ row: { possibleNowLoss } }) => {
                    return (
                      <ToolTipExtended value={possibleNowLoss} text="Вес в тоннах"/>
                    );
                },
                headerAlign: "left",
                align: "left",
                flex: 0.6,
            },
            {
                field: "value",
                type: "number",
                headerName: "Последнее списание",
                renderCell: ({ row: { value } }) => {
                    return (
                      <ToolTipExtended value={value} text="Вес в тоннах"/>
                    );
                },
                headerAlign: "left",
                align: "left",
                flex: 0.6,
            },
            {
                field: "date",
                headerName: "Дата последнего списания",
                headerAlign: "left",
                align: "left",
                flex: 0.6,
            },
            {
                field: "employeeName",
                headerName: "Ответственный",
                flex: 1,
                headerAlign: "left",
                align: "left",
                cellClassName: "name-column--cell",
                renderCell: ({ row: { employeeName, employee } }) => {
                    return (<Box sx={{
                        width: "100%",
                        '&:hover': {
                            opacity: [0.9, 0.8, 0.7],
                            cursor: "pointer"
                        },
                    }}>
                        <Typography color={colors.grey[100]} onClick={() => handleWithEmplOpen({ id: employee?.id })}>
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
                                    getRowId={(row) => row.batchNumber}
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

    const DoneChild = (props) => {
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
                API.get('/GetCreationsHistoriesFull?val=true')
                    .then(function (response) {
                        let res = [];
                        let arrFromResp = (response?.data)//.filter(x=> new Date(Date.parse(x?.cheeseStorageProcess?.middleDate)) <= new Date());
                        arrFromResp.forEach(item => {
                            res.push({
                                batchNumber: item?.batchNumber,
                                employeeName: `${item?.employee?.surname} ${item?.employee?.name} ${item?.employee?.patronymic}`,
                                employee: item?.employee,
                                date: new Date(Date.parse(item?.date)).toLocaleString('ru-RU'),
                                value: item?.value,
                                possibleNowLoss: item?.cheeseStorageProcess?.possibleNowLoss,
                                middleDate: item?.cheeseStorageProcess?.middleDate,
                                resultMass: item?.cheeseStorageProcess?.resultMass,
                                summedLossOfDone: item?.cheeseStorageProcess?.summedLossOfDone,
                                dateOfDate: item?.cheeseStorageProcess?.dateOfDate,
                                productName: item?.cheeseStorageProcess?.creationsHistory?.product?.productName,
                                product: item?.cheeseStorageProcess?.creationsHistory?.product,
                                resultMassOfDone: item?.cheeseStorageProcess?.resultMassOfDone
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
                field: "batchNumber",
                headerName: "Партия",
                flex: 0.8,
            },
            {
                field: "productName",
                headerName: "Продукт",
                headerAlign: "left",
                align: "left",
                flex: 0.8,
            },
            {
                field: "middleDate",
                headerName: "Дата получения",
                headerAlign: "left",
                align: "left",
                flex: 0.8,
            },
            {
                field: "dateOfDate",
                headerName: "Дата готовности",
                headerAlign: "left",
                align: "left",
                flex: 0.8,
            },
            {
                headerName: "Cостояние",
                renderCell: () => {
                    return (
                        <Typography color={colors.grey[100]}>
                            Готов
                        </Typography>);
                },
                headerAlign: "left",
                align: "left",
                flex: 0.4,
            },
            {
                field: "resultMass",
                type: "number",
                headerName: "Масса при получении",
                renderCell: ({ row: { resultMass } }) => {
                    return (
                      <ToolTipExtended value={resultMass} text="Вес в тоннах"/>
                    );
                },
                headerAlign: "left",
                align: "left",
                flex: 0.6,
            },
            {
                field: "resultMassOfDone",
                type: "number",
                headerName: "Текущая масса",
                renderCell: ({ row: { resultMassOfDone } }) => {
                    return (
                      <ToolTipExtended value={resultMassOfDone} text="Вес в тоннах"/>
                    );
                },
                headerAlign: "left",
                align: "left",
                flex: 0.6,
            },
            {
                field: "summedLossOfDone",
                type: "number",
                headerName: "Сумма потерь",
                renderCell: ({ row: { summedLossOfDone } }) => {
                    return (
                      <ToolTipExtended value={summedLossOfDone} text="Вес в тоннах"/>
                    );
                },
                headerAlign: "left",
                align: "left",
                flex: 0.6,
            },
            {
                field: "possibleNowLoss",
                type: "number",
                headerName: "Допустимые потери",
                renderCell: ({ row: { possibleNowLoss } }) => {
                    return (
                      <ToolTipExtended value={possibleNowLoss} text="Вес в тоннах"/>
                    );
                },
                headerAlign: "left",
                align: "left",
                flex: 0.6,
            },
            {
                field: "value",
                type: "number",
                headerName: "Последнее списание",
                renderCell: ({ row: { value } }) => {
                    return (
                      <ToolTipExtended value={value} text="Вес в тоннах"/>
                    );
                },
                headerAlign: "left",
                align: "left",
                flex: 0.6,
            },
            {
                field: "date",
                headerName: "Дата последнего списания",
                headerAlign: "left",
                align: "left",
                flex: 0.6,
            },
            {
                field: "employeeName",
                headerName: "Ответственный",
                flex: 1,
                cellClassName: "name-column--cell",
                headerAlign: "left",
                align: "left",
                renderCell: ({ row: { employeeName, employee } }) => {
                    return (<Box sx={{
                        width: "100%",
                        '&:hover': {
                            opacity: [0.9, 0.8, 0.7],
                            cursor: "pointer"
                        },
                    }}>
                        <Typography color={colors.grey[100]} onClick={() => handleWithEmplOpen({ id: employee?.id })}>
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
                                    getRowId={(row) => row.batchNumber}
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
                        let arrFromResp = (response?.data).filter(x => x.job?.exact?.clarification == "Сырохранилище");
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
            <SozrevChild title="Созревание" />
            <DoneChild title="Готово" />
            <EmployeesChild title="Сотрудники" />
        </DashboardProvider>);

    const otherPage = (
        <h1>otherPage</h1>
    );

    const rolesForRights = ["Суперадмин"];

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="Сырохранилище" subtitle="Отслеживайте статистику товаров на сырохранилище" />
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

export default CheeseStorage;
