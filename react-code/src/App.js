import { useRef, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";

import LogIn from "./scenes/login";
import Dashboard from "./scenes/dashboard";
import Messenger from "./scenes/messenger";
import CheeseStorage from "./scenes/cheeseStorage";

import Receiving from "./scenes/receiving";
import FermentedMilk from "./scenes/fermentedMilk";
import ButterFactory from "./scenes/butterFactory";
import CheeseFactory from "./scenes/cheeseFactory";
import MilkSort from "./scenes/milkSort";

import Notifications from "./scenes/notifications";

import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import Form from "./scenes/form";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";

import { Navigate } from 'react-router-dom';

import React from "react";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import Crop32OutlinedIcon from '@mui/icons-material/Crop32Outlined';
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';
import LensOutlinedIcon from '@mui/icons-material/LensOutlined';

import Profile from "./scenes/profile/Profile";

function App() {
  const sidebarItemsProiz = [
    {
      type: "Item",
      roles: ["Суперадмин"],
      title: "Статистика",
      to: "/dashboard",
      icon: <HomeOutlinedIcon />
    },
    {
      roles: [],
      type: "Item",
      title: "Мессенджер",
      to: "/messenger",
      icon: <SmsOutlinedIcon />
    },
    {
      roles: ["Суперадмин", "Рабочий приемно-аппартного"],
      type: "Item",
      title: "Сырохранилище",
      to: "/cheeseStorage",
      icon: <Inventory2OutlinedIcon />
    },
    {
      roles: ["Суперадмин"],
      type: "Typography",
      title: "Цеха",
      marginLeft: 23
    },
    {
      roles: ["Суперадмин", "Рабочий приемно-аппартного"],
      type: "Item",
      title: "Приемно-аппаратный",
      to: "/receiving",
      icon: <PrecisionManufacturingOutlinedIcon />
    },
    {
      roles: ["Суперадмин"],
      type: "Item",
      title: "Кисломолочный",
      to: "/fermentedMilk",
      icon: <FactoryOutlinedIcon />
    },
    {
      roles: ["Суперадмин"],
      type: "Item",
      title: "Маслоцех",
      to: "/butterFactory",
      icon: <Crop32OutlinedIcon />
    },
    {
      roles: ["Суперадмин", "Рабочий сырцеха"],
      type: "Item",
      title: "Сырцех",
      to: "/cheeseFactory",
      icon: <LensOutlinedIcon />
    },
    {
      roles: ["Суперадмин"],
      type: "Item",
      title: "Фасовка молока",
      to: "/milkSort",
      icon: <ModelTrainingOutlinedIcon />
    },
    {
      roles: ["Суперадмин", "Админ"],
      type: "Typography",
      title: "Инфо",
      marginLeft: 20
    },
    {
      roles: ["Суперадмин", "Админ"],
      type: "Item",
      title: "Доступ",
      to: "/team",
      icon: <PeopleOutlinedIcon />,
    },
    {
      roles: ["Суперадмин", "Админ"],
      type: "Item",
      title: "Сотрудники",
      to: "/contacts",
      icon: <ContactsOutlinedIcon />
    },
    {
      roles: [],
      type: "Typography",
      title: "Доп",
      marginLeft: 25
    },
    {
      roles: ["Суперадмин", "Админ"],
      type: "Item",
      title: "Пользователь",
      to: "/form",
      icon: <PersonOutlinedIcon />
    },
    {
      roles: [],
      type: "Item",
      title: "Календарь",
      to: "/calendar",
      icon: <CalendarTodayOutlinedIcon />
    }
  ];

  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(false);
  const [getSideBarVisibility, setSideBarVisibility] = React.useState(false);
  const [getTopBarVisibility, setTopBarVisibility] = React.useState(false);
  const [userLoggedIn, setLoggedIn] = React.useState({ access: null, state: false });

  let loginPage = <LogIn
    setTopVis={setTopBarVisibility}
    setSideVis={setSideBarVisibility}
    setLogged={setLoggedIn} />

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {getSideBarVisibility && <Sidebar
            isSidebar={isSidebar}
            userInfo={userLoggedIn.access}
            items={sidebarItemsProiz.filter(x => !x?.roles.length || x?.roles.includes(userLoggedIn.access.userRole))} />}
          <main className="content">
            {getTopBarVisibility && <Topbar setIsSidebar={isSidebar} />}
            <Routes>
              <Route path="/" element={userLoggedIn.state ? <Navigate to={sidebarItemsProiz.filter(x => !x?.roles.length
                || x?.roles.includes(userLoggedIn.access.userRole))[0]?.to} /> : loginPage} />
              <Route path="/dashboard" element={userLoggedIn.state ? <Dashboard rolesArr={sidebarItemsProiz.find(x => x.to === "/dashboard").roles} currentRole={userLoggedIn.access} /> : loginPage} />
              <Route path="/messenger" element={userLoggedIn.state ? <Messenger rolesArr={sidebarItemsProiz.find(x => x.to === "/messenger").roles} currentRole={userLoggedIn.access} /> : loginPage} />
              <Route path="/cheeseStorage" element={userLoggedIn.state ? <CheeseStorage rolesArr={sidebarItemsProiz.find(x => x.to === "/cheeseStorage").roles} currentRole={userLoggedIn.access} /> : loginPage} />

              <Route path="/receiving" element={userLoggedIn.state ? <Receiving rolesArr={sidebarItemsProiz.find(x => x.to === "/receiving").roles} currentRole={userLoggedIn.access} /> : loginPage} />
              <Route path="/fermentedMilk" element={userLoggedIn.state ? <FermentedMilk rolesArr={sidebarItemsProiz.find(x => x.to === "/fermentedMilk").roles} currentRole={userLoggedIn.access} /> : loginPage} />
              <Route path="/butterFactory" element={userLoggedIn.state ? <ButterFactory rolesArr={sidebarItemsProiz.find(x => x.to === "/butterFactory").roles} currentRole={userLoggedIn.access} /> : loginPage} />
              <Route path="/cheeseFactory" element={userLoggedIn.state ? <CheeseFactory rolesArr={sidebarItemsProiz.find(x => x.to === "/cheeseFactory").roles} currentRole={userLoggedIn.access} /> : loginPage} />
              <Route path="/milkSort" element={userLoggedIn.state ? <MilkSort rolesArr={sidebarItemsProiz.find(x => x.to === "/milkSort").roles} currentRole={userLoggedIn.access} /> : loginPage} />

              <Route path="/team" element={userLoggedIn.state ? <Team rolesArr={sidebarItemsProiz.find(x => x.to === "/team").roles} currentRole={userLoggedIn.access} /> : loginPage} />
              <Route path="/contacts" element={userLoggedIn.state ? <Contacts rolesArr={sidebarItemsProiz.find(x => x.to === "/contacts").roles} currentRole={userLoggedIn.access} /> : loginPage} />
              <Route path="/form" element={userLoggedIn.state ? <Form rolesArr={sidebarItemsProiz.find(x => x.to === "/form").roles} currentRole={userLoggedIn.access} /> : loginPage} />
              <Route path="/calendar" element={userLoggedIn.state ? <Calendar rolesArr={sidebarItemsProiz.find(x => x.to === "/calendar").roles} currentRole={userLoggedIn.access} /> : loginPage} />

              {/* Other routes */}
              <Route path="/notifications" element={userLoggedIn.state ? <Notifications currentRole={userLoggedIn?.access} /> : loginPage} />
              <Route path="/profile" element={userLoggedIn.state ? <Profile currentRole={userLoggedIn?.access} /> : loginPage} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
