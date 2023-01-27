import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/authHooks/useAuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useMediaQuery from "@mui/material/useMediaQuery";

import Signup from "./pages/Signup";
import Login from "./pages/Login";

import Trading from "./pages/Trading";
import MobileTrading from "./pages/mobile/MobileTrading";
import CoinPage from "./pages/CoinPage";
import ExchangePage from "./pages/ExchangePage";
import Watchlist from "./pages/Watchlist";
import Layout from "./components/Layout/Layout";
import MobileLayout from "./components/Layout/MobileLayout";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import MobileWatchlist from "./pages/mobile/MobileWatchlist";
import Exchanges from "./pages/Exchanges";
import NotFoundPage from "./pages/NotFoundPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4169E1",
    },
    secondary: {
      main: "#ADD8E6",
    },
    info: {
      main: "#1F618D",
    },
  },
});

function App() {
  const client = new QueryClient({});
  const { user } = useAuthContext();
  const matches = useMediaQuery("(min-width:800px)");

  const StaticLayout = ({ children }) =>
    matches ? (
      <Layout>{children}</Layout>
    ) : (
      <MobileLayout>{children}</MobileLayout>
    );

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {user ? (
            <StaticLayout>
              <Routes>
                <Route path='*' element={<NotFoundPage />} />
                <Route
                  path="/"
                  element={matches ? <Trading /> : <MobileTrading />}
                />
                <Route
                  path="/watchlist"
                  element={matches ? <Watchlist /> : <MobileWatchlist />}
                />
                <Route
                  path="/exchanges"
                  element={matches ? <Exchanges /> : <Exchanges />}
                />
                <Route path="/coins/:id" element={<CoinPage />} />
                <Route path="/exchanges/:id" element={<ExchangePage />} />
                <Route path="/login" element={<Navigate to="/" />} />
                <Route path="/signup" element={<Navigate to="/" />} />
              </Routes>
            </StaticLayout>
          ) : (
            <Routes>
              <Route path='*' element={<NotFoundPage />} />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/watchlist" element={<Navigate to="/login" />} />
              <Route path="/exchanges" element={<Navigate to="/login" />} />
              <Route path="/coins/:id" element={<Navigate to="/login" />} />
              <Route path="/exchanges/:id" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          )}
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
