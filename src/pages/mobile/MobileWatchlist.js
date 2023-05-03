import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCurrencyContext } from "../../hooks/currencyHooks/useCurrencyContext";
import { useAuthContext } from "../../hooks/authHooks/useAuthContext";
import { useLogout } from "../../hooks/authHooks/useLogout";

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

import CurrencyTab from "../../currency/Currency_Tab";

const fetchWatchlist = (currency, user) => {
  return axios.get(`https://crypto-amigo-api.onrender.com/api/watchlist/get_watchlist/?currency=${currency.value}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
};

function MobileWatchlist() {
  const { user } = useAuthContext();
  const { currency } = useCurrencyContext();
  const queryClient = useQueryClient();
  const { logout } = useLogout();
  const navigate = useNavigate();

  const {
    data: watchlist,
    isLoading: watchlistIsLoading,
    isError: watchlistIsError,
    error: watchlistError,
    isFetching: watchlistIsFetching,
  } = useQuery(
    ["crypto-watchlist", currency, user],
    () => fetchWatchlist(currency, user),
    {
      refetchOnWindowFocus: false,
      staleTime: 60000,
      refetchInterval: 70000,
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
      return axios.delete(`https://crypto-amigo-api.onrender.com/api/watchlist/delete_watchlist/${coin}`, {
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
    return <h2>Something went wrong: {watchlistError.message}</h2>;
  }

  const columns = [
    {
      field: "Watchlist",
      headerName: "Watchlist",
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
      field: "name",
      headerName: "ASSET",
      headerAlign: "center",
      align: "left",

      renderCell: (params) => {
        return (
          <>
            <Avatar
              alt={params.row.name}
              src={params.row.image}
              sizes="small"
            />
            <Typography color="text.secondary" sx={{ fontWeight: "500" }}>
              {params.row.symbol.toUpperCase() || ""}
            </Typography>
          </>
        );
      },
    },
    {
      field: "current_price",
      headerName: "PRICE",
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
  ];

  function CustomUnsortedIcon() {
    return <UnfoldMoreIcon />;
    // i use it as a component for sort icon in my datagrid
  }

  return (
    <div style={{padding:"0.5em"}}>
      <Typography
        variant="h2"
        sx={{ fontSize: "1.8em", fontWeight: 700, padding: "1em" }}
      >
        {" "}
        Watchlist
      </Typography>
      <CurrencyTab />
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
    </div>
  );
}

export default MobileWatchlist;
