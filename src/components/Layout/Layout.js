import React from "react";
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

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();

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
          width: "calc(100% - 15em)",
          height: "4em",
          justifyContent: "center",
        }}
        elevation={0}
        color="info"
      >
        <Toolbar>
          <Typography sx={{ flexGrow: 1 }}>
            Today is the {format(new Date(), "do MMMM Y")}
          </Typography>
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
        }
      }}
        sx={{ width: "15em" }}
        variant="permanent"
        anchor="left"
      >
        <div>
          <Typography
            sx={{ padding: "1em", fontWeight: "800", fontSize: "1.6em" }}
          >
            Crypto Amigo
          </Typography>
        </div>

        {/* links/list section */}
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                background: `${location.pathname === item.path && "#f4f4f4"}`,
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText disableTypography primary={<Typography sx={{fontWeight: "500", fontSize: "1.1em"}}>{item.text}</Typography>} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* main content */}
      <div
        style={{
          width: "75em",
          padding: "2em",
          marginTop: "2em",
          background:"#F8F9F9"
        }}
      >
        {children}
      </div>
    </div>
  );
}
