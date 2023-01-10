import React, { useState } from "react";
import Drawer from "@mui/material//Drawer";
import Typography from "@mui/material//Typography";
import { useNavigate, useLocation } from "react-router-dom";
import List from "@mui/material//List";
import ListItem from "@mui/material//ListItem";
import ListItemIcon from "@mui/material//ListItemIcon";
import ListItemText from "@mui/material//ListItemText";
import AppBar from "@mui/material//AppBar";
import Toolbar from "@mui/material//Toolbar";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/authHooks/useLogout";
import { useAuthContext } from "../../hooks/authHooks/useAuthContext";

import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CurrencyExchangeRoundedIcon from "@mui/icons-material/CurrencyExchangeRounded";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const { logout } = useLogout();
  const handleClick = () => {
    logout();
  };

  const menuItems = [
    {
      text: "Trading",
      icon: <ShowChartRoundedIcon color="primary" />,
      path: "/",
    },
    {
      text: "Watchlist",
      icon: <AddBoxOutlinedIcon color="primary" />,
      path: "/watchlist",
    },
    {
      text: "Exchanges",
      icon: <CurrencyExchangeRoundedIcon color="primary" />,
      path: "/exchanges",
    },
  ];

  return (
    <div style={{ display: "flex" }}>
      {/* app bar */}
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          height: "4em",
        }}
        elevation={0}
        color="info"
      >
        <Toolbar sx={{display:"flex", justifyContent:"space-between"}}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <nav>
            {user && (
              <div>
                <span>{user.email}</span>
                <button onClick={handleClick}>Log out</button>
              </div>
            )}
            {!user && (
              <div>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </div>
            )}
          </nav>
        </Toolbar>
      </AppBar>

      {/* side drawer */}
      <Drawer
        PaperProps={{
          sx: {
            backgroundColor: "#FDFEFE",
          },
        }}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "15em",
          },
        }}
        anchor="left"
      >
        <Toolbar>
        <Typography
          sx={{ padding: "1em", fontWeight: "800", fontSize: "1.6em" }}
        >
          Crypto Amigo
        </Typography>
        {mobileOpen && (
          <IconButton
            onClick={() => {
              setMobileOpen(false);
            }}
          >
            <ArrowBackIosNewRoundedIcon color="secondary" />
          </IconButton>
        )}
      </Toolbar>

      {/* links/list section */}
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{
              background: `${location.pathname === item.path && "#f4f4f4"}`,
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              disableTypography
              primary={
                <Typography sx={{ fontWeight: "500", fontSize: "1.1em" }}>
                  {item.text}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
      </Drawer>

      {/* main content */}
      <div
        style={{
          width: "100%",
          marginTop:"2em",
          marginBottom:"5em",
          padding:"1em",
          alignItems:"center",
          overflow:"hidden",
          background: "#F8F9F9",
        }}
      >
        {children}
      </div>
    </div>
  );
}
