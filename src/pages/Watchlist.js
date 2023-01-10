import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCurrencyContext } from "../hooks/currencyHooks/useCurrencyContext";
import { useAuthContext } from "../hooks/authHooks/useAuthContext";
import { useLogout } from "../hooks/authHooks/useLogout";

import { DataGrid } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import BookmarkRemoveIcon from "@mui/icons-material/BookmarkRemove";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

import CurrencyTab from "../currency/Currency_Tab";

const fetchWatchlist = (currency, user) => {
  return axios.get(`api/watchlist/get_watchlist/?currency=${currency.value}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
};

function Watchlist() {
  const { user } = useAuthContext();
  const { currency } = useCurrencyContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout } = useLogout();

  const {
    data: watchlist,
    isLoading: watchlistIsLoading,
    isError: watchlistIsError,
    isFetching: watchlistIsFetching,
  } = useQuery(
    ["crypto-watchlist", currency, user],
    () => fetchWatchlist(currency, user),
    {
      refetchOnWindowFocus: false,
      staleTime: 5000,
      refetchIntervalInBackground: 125000,
      select: (watchlist) => {
        const watchlistCoins =
          currency.value === "eur"
            ? Object.values(watchlist.data.map((d) => d.data))
            : Object.values(watchlist.data.map((d) => d[currency.value]));
        return watchlistCoins;
      },
    }
  );

  const { mutate: deleteCoin, isLoading: deleteIsLoading } = useMutation(
    (coin) => {
      return axios.delete(`api/watchlist/delete_watchlist/${coin}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("crypto-watchlist");
        queryClient.invalidateQueries("crypto-coins");
      },
    }
  );

  if (watchlistIsLoading || deleteIsLoading) {
    return <CircularProgress size="5em" />;
  }
  if (watchlistIsError) {
    return logout();
  }

  const columns = [
    {
      field: "Watchlist",
      headerName: "Watchlist",
      flex: 0.15,
      minWidth: 50,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderHeader: () => <BookmarkIcon />,
      renderCell: (params) => {
        return (
          <button onClick={() => deleteCoin(params.row.id)}>
            <BookmarkRemoveIcon />
          </button>
        );
      },
    },
    {
      field: "market_cap_rank",
      headerName: "RANK",
      flex: 0.15,
      minWidth: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "ASSET",
      flex: 0.3,
      minWidth: 120,
      headerAlign: "center",
      align: "left",

      renderCell: (params) => {
        return (
          <>
            <Avatar
              alt={params.row.name}
              src={params.row.image}
              sx={{ padding: "10px" }}
            />
            {params.row.name || ""}
            <Typography
              color="text.secondary"
              variant="body1"
              sx={{ marginLeft: "5px", fontWeight: "500" }}
            >
              {params.row.symbol.toUpperCase() || ""}
            </Typography>
          </>
        );
      },
    },
    {
      field: "current_price",
      headerName: "PRICE",
      flex: 0.25,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      type: "number",
      valueFormatter: (params) => {
        return `${currency.symbol} ${params.value}`;
      },
    },
    {
      field: "price_change_percentage_24h",
      headerName: "DAILY %",
      flex: 0.2,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const valueFormatted = Number(params.value);
        return params.value > 0 ? (
          <>
            <ArrowUpwardRoundedIcon />
            {`${valueFormatted} %`}
          </>
        ) : (
          <>
            <ArrowDownwardRoundedIcon />
            {`${valueFormatted} %`}
          </>
        );
      },
    },
    {
      field: "price_change_percentage_7d_in_currency",
      headerName: "WEEKLY %",
      flex: 0.2,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const valueFormatted = Number(params.value);
        return params.value && params.value > 0 ? (
          <>
            <ArrowUpwardRoundedIcon />
            {`${valueFormatted} %`}
          </>
        ) : (
          <>
            <ArrowDownwardRoundedIcon />
            {`${valueFormatted} %`}
          </>
        );
      },
    },
    {
      field: "market_cap",
      headerName: "MARKET CAP",
      flex: 0.25,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => {
        return params && `${currency.symbol} ${params.value}`;
      },
    },
    {
      field: "total_volume",
      headerName: "VOLUME",
      flex: 0.25,
      minWidth: 120,
      headerAlign: "center",
      align: "center",
      valueFormatter: (params) => {
        return params && `${params.value}`;
      },
    },
  ];

  function CustomUnsortedIcon() {
    return <UnfoldMoreIcon />;
    // i use it as a component for sort icon in my datagrid
  }

  return (
    <>
      <Typography
        variant="h2"
        sx={{ fontSize: "1.8em", fontWeight: 700, padding: "1em" }}
      >
        {" "}
        Watchlist
      </Typography>
      <div style={{width:"15em"}}><CurrencyTab/></div>
      <Box sx={{ width: "100%", background: "#FDFEFE" }}>
        <DataGrid
          autoHeight={true}
          rows={watchlist}
          rowCount={watchlist.length}
          loading={watchlistIsFetching}
          columns={columns}
          pageSize={watchlist.length}
          rowsPerPageOptions={[watchlist.length]}
          disableSelectionOnClick
          checkboxSelection={false}
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          hideFooterSelectedRowCount
          scrollbarSize={2}
          components={{
            ColumnUnsortedIcon: CustomUnsortedIcon,
          }}
          sx={{
            // background: "#202020" for dark datagrid
            fontSize: "1em",
            cursor: "pointer",
            "& .negative": {
              color: "red",
              fontSize: "1em",
            },
            "& .positive": {
              color: "green",
              fontSize: "1em",
            },
          }}
          getCellClassName={(params) => {
            if (
              params.field === "price_change_percentage_24h" ||
              params.field === "price_change_percentage_7d_in_currency"
            ) {
              return params.value > 0 ? "positive" : "negative";
            }
            return "";
          }}
          onCellClick={(params) => {
            params.field !== "Watchlist" && navigate(`/coins/${params.id}`);
          }}
        />
      </Box>
    </>
  );
}

export default Watchlist;
