import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import Autocomplete from '@mui/material/Autocomplete';

import API from "../../API"

import { useEffect, useState } from "react";

import moment from "moment";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  const [positions, setPositions] = useState([]);
  const [exact, setExact] = useState([]);
  const [place, setPlace] = useState([]);

  useEffect(() => {
    API.get('/GetRoles').then(function (response) {
      setPositions(response?.data)
    }).catch(function (error) {
      console.error(error);
    });

    API.get('/GetExacts').then(function (response) {
      setExact(response?.data)
    }).catch(function (error) {
      console.error(error);
    });

    API.get('/GetPlaces').then(function (response) {
      setPlace(response?.data)
    }).catch(function (error) {
      console.error(error);
    });
  }, [])

  return (
    <Box m="20px">
      <Header title="Форма пользователя" subtitle="Добавьте нового сотрудника" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Фамилия"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.surname}
                name="surname"
                error={!!touched.surname && !!errors.surname}
                helperText={touched.surname && errors.surname}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Имя"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Логин"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.login}
                name="login"
                error={!!touched.login && !!errors.login}
                helperText={touched.login && errors.login}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Отчество"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.patronymic}
                name="patronymic"
                error={!!touched.patronymic && !!errors.patronymic}
                helperText={touched.patronymic && errors.patronymic}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Пароль"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Телефон"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 2" }}
              />
              <Box sx={{ gridColumn: "span 2", marginTop: -1}}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DemoContainer components={['DateTimePicker']}>
                    <DateTimePicker
                      slotProps={{
                        error: !!touched.date && !!errors.date,
                        helperText: touched.date && errors.date
                      }}
                      value={moment(values.date)}
                      name="date"
                      onBlur={handleBlur}
                      label="Дата наёма"
                      onChange={(val) => {
                        values.date = val.toDate();
                        handleChange(moment(val).toString())
                      }} />
                  </DemoContainer>
                </LocalizationProvider>
              </Box>
              <Autocomplete
                onBlur={handleBlur}
                sx={{ gridColumn: "span 1"}}
                disablePortal
                name="emplPosition"
                value={values?.emplPosition}
                options={positions}
                onChange={(event, val) => {values.emplPosition = val; handleChange(val);}}
                renderInput={(params) => <TextField {...params} label="Должность" />}
              />
              <Autocomplete
                onBlur={handleBlur}
                sx={{ gridColumn: "span 1"}}
                disablePortal
                name="emplExact"
                value={values?.emplExact}
                options={exact}
                onChange={(event, val) => {values.emplExact = val; handleChange(val);}}
                renderInput={(params) => <TextField {...params} label="Место работы" />}
              />
              <Autocomplete
                onBlur={handleBlur}
                sx={{ gridColumn: "span 1"}}
                disablePortal
                name="emplPlace"
                value={values?.emplPlace}
                options={place}
                onChange={(event, val) => {values.emplPlace = val; handleChange(val);}}
                renderInput={(params) => <TextField {...params} label="Принадлежность" />}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Добавить нового сотрудника
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp = /^(\+[1-9]{1}-[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2})$/;
const loginAndPassRegExp = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]{6,}$/g;

const checkoutSchema = yup.object().shape({
  surname: yup.string().required("Обязательно"),
  name: yup.string().required("Обязательно"),
  patronymic: yup.string(),

  login: yup
    .string()
    .matches(loginAndPassRegExp, "Длина логина не может быть меньше 6 и не содержать кириллицу")
    .required("Обязательно"),
  password: yup
    .string()
    .matches(loginAndPassRegExp, "Длина пароля не может быть меньше 6 и не содержать кириллицу")
    .required("Обязательно"),

  contact: yup
    .string()
    .matches(phoneRegExp, "Введите валидный номер телефона")
    .required("Обязательно"),

  date: yup
    .string()
    .required("Обязательно"),

  emplPosition: yup.string().nullable(),
  emplExact: yup.string().nullable(),
  emplPlace: yup.string().nullable(),
});
const initialValues = {
  surname: "",
  name: "",
  patronymic: "",
  login: "",
  password: "",
  contact: "",
  date: null,
  emplPosition: null,
  emplExact: null,
  emplPlace: null,
};

export default Form;
