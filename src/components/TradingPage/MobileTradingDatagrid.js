import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCurrencyContext } from "../../hooks/currencyHooks/useCurrencyContext";
import { useAuthContext } from "../../hooks/authHooks/useAuthContext";
import { useLogout } from "../../hooks/authHooks/useLogout";

import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

import CurrencyTab from "../../currency/Currency_Tab";

const fetchCoins = (pageNumber, currency, user) => {
  return axios.get(`https://crypto-amigo-api.onrender.com/api/coins/?currency=${currency.value}&page=${pageNumber}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
};

const fetchSearch = (query, currency, user) => {
  return axios.get(
    `https://crypto-amigo-api.onrender.com/api/coins/search_coin?query=${query}&currency=${currency.value}`,
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );
};

const fetchWatchlist = (currency, user) => {
  return axios.get(`https://crypto-amigo-api.onrender.com/api/watchlist/get_watchlist/?currency=${currency.value}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
};

function MobileTradingDatagrid() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { currency } = useCurrencyContext();
  const [pageNumber, setPageNumber] = useState(0);
  const [query, setQuery] = useState("");
  const queryClient = useQueryClient();
  const { logout } = useLogout();

  // function to get the Search query
  // users have 3 seconds to type
  let useTimeout;
  const handleSearch = (e) => {
    clearTimeout(useTimeout);
    if (e !== "") {
      useTimeout = setTimeout(() => {
        setQuery(e);
      }, 3000);
    } else {
      setQuery("");
    }
  };

  const {
    isLoading: coinsIsLoading,
    isError: coinsIsError,
    data: coins,
    isFetching: coinsIsFetching,
  } = useQuery(
    ["crypto-coins", pageNumber, currency, user],
    () => fetchCoins(pageNumber, currency, user),
    {
      staleTime: 60000,
      refetchInterval: 60000,
      select: (coins) => {
        const cryptoCoins =
          currency.value === "eur"
            ? Object.values(coins.data.map((d) => d.data))
            : Object.values(coins.data.map((d) => d[currency.value]));
        return cryptoCoins;
      },
    }
  );

  const {
    data: search,
    isFetching: searchIsFetching,
    refetch: searchRefetch,
    isSuccess: searchIsSuccess,
  } = useQuery(
    ["crypto-search", query, currency, user],
    () => fetchSearch(query, currency, user),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      staleTime: 60000,
      select: (search) => {
        const searchCoins =
          currency.value === "eur"
            ? Object.values(search.data.map((d) => d.data))
            : Object.values(search.data.map((d) => d[currency.value]));
        return searchCoins;
      },
    }
  );

  const { data: watchlist, isSuccess: watchlistIsSuccess } = useQuery(
    ["crypto-watchlist", currency, user],
    () => fetchWatchlist(currency, user),
    {
      select: (watchlist) => {
        const watchlistCoins =
          currency.value === "eur"
            ? Object.values(watchlist.data.map((d) => d.data))
            : Object.values(watchlist.data.map((d) => d[currency.value]));
        return watchlistCoins;
      },
    }
  );

  const { mutate: addCoin, isLoading: addIsLoading } = useMutation(
    (coin) => {
      return axios.post(`https://crypto-amigo-api.onrender.com/watchlist/post_watchlist`, coin, {
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

  if (coinsIsLoading || addIsLoading || deleteIsLoading) {
    return <CircularProgress size="5em" />;
  }

  if (coinsIsError) {
    return logout();
  }
  if (query.length >= 3) {
    searchRefetch();
  }

  const columns = [
    {
      field: "Watchlist",
      headerName: "Watchlist ",
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderHeader: () => <BookmarkIcon />,
      renderCell: (params) => {
        let flag = false;
        let postBody = { id: params.row.id };
        if (watchlistIsSuccess) {
          watchlist?.some((v) => {
            if (v.id === params.row.id) {
              return (flag = true);
            } else {
              return (flag = false);
            }
          });
        }
        return flag ? (
          <button onClick={() => deleteCoin(params.row.id)}>
            <BookmarkAddedIcon />
          </button>
        ) : (
          <button onClick={() => addCoin(postBody)}>
            <BookmarkAddIcon />
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
            <Avatar alt={params.row.name} src={params.row.image} sizes="small"/>
            <Typography
              color="text.secondary"
              sx={{ fontWeight: "500" }}
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
    <>
      <Typography
        variant="h2"
        sx={{ fontSize: "1.8em", fontWeight: 700, padding: "1em" }}
      >
        {" "}
        Explore Assets
      </Typography>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignItems: "baseline",
          }}
        >
          <TextField
            placeholder="Search"
            defaultValue=""
            size="small"
            sx={{width:"10em"}}
            onChange={(e) => handleSearch(e.target.value)}
          />
            <CurrencyTab />
        </div>

        <Box sx={{ height: "30em", width: "100%" }}>
          <DataGrid
            rows={searchIsSuccess ? search : coins}
            rowCount={5300}
            loading={searchIsSuccess ? coinsIsFetching : searchIsFetching}
            columns={columns}
            pagination
            page={pageNumber}
            paginationMode="server"
            onPageChange={(newPage) => {
              setPageNumber(newPage);
            }}
            pageSize={30}
            rowsPerPageOptions={[30]}
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
              marginBottom: 100,
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

export default MobileTradingDatagrid;
