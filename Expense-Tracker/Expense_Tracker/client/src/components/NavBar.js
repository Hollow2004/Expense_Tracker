import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../store/auth.js";
import Cookies from "js-cookie";

export default function NavBar() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  function _logOut() {
    Cookies.remove("token");
    dispatch(logOut());
    navigate("/login");
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#2C3E50" }}>
        <Toolbar>
          {/* Logo and SpendWise Text */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img
              src="/logo.png" 
              alt="Spendwise Logo"
              style={{ height: "40px", marginRight: "10px", borderRadius: "50%" }}
            />
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "white",
                  letterSpacing: "1px",
                }}
              >
                SpendWise
              </Link>
            </Typography>
          </Box>

          {/* Display User Information */}
          {user && isAuthenticated && (
            <Typography sx={{ marginRight: 2, fontStyle: "italic", color: "#ECF0F1" }}>
              Welcome, {user.firstName}
            </Typography>
          )}

          {/* Responsive Menu for Authenticated Users */}
          {isAuthenticated && (
            <>
              <Link to="/category" style={{ textDecoration: "none" }}>
                <Button
                  sx={{
                    color: "#ECF0F1",
                    textTransform: "capitalize",
                    fontWeight: "bold",
                  }}
                >
                  Categories
                </Button>
              </Link>
              <IconButton
                color="inherit"
                onClick={_logOut}
                sx={{
                  marginLeft: 2,
                  color: "#E74C3C",
                  "&:hover": { backgroundColor: "#E74C3C20" },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </>
          )}

          {/* Buttons for Non-Authenticated Users */}
          {!isAuthenticated && (
            <>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button
                  sx={{
                    color: "#ECF0F1",
                    textTransform: "capitalize",
                    fontWeight: "bold",
                  }}
                >
                  Login
                </Button>
              </Link>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <Button
                  sx={{
                    color: "#ECF0F1",
                    textTransform: "capitalize",
                    fontWeight: "bold",
                  }}
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
