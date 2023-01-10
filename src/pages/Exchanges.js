import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthContext } from "../hooks/authHooks/useAuthContext";
import { DataGrid } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLogout } from "../hooks/authHooks/useLogout";

const fetchExchanges = (pageNumber, user) => {
  return axios.get(`https://crypto-amigo-api.onrender.com/api/exchanges/?page=${pageNumber}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
};
const fetchSearch = (query, user) => {
  return axios.get(`https://crypto-amigo-api.onrender.com/api/exchanges/search_exchange?query=${query}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
};

function Exchanges() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(0);
  const [query, setQuery] = useState("");
  const matches = useMediaQuery("(min-width:800px)");

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
    isLoading: exchangesIsLoading,
    isError: exchangesIsError,
    data: exchanges,
    isFetching: exchangesIsFetching,
  } = useQuery(
    ["crypto-exchanges", pageNumber, user],
    () => fetchExchanges(pageNumber, user),
    {
      staleTime: 60000,
      refetchInterval: 1250000,
      select: (exchanges) => {
        const cryptoExchanges = Object.values(
          exchanges.data.map((d) => d.data)
        );
        return cryptoExchanges;
      },
    }
  );

  const {
    data: search,
    isFetching: searchIsFetching,
    refetch: searchRefetch,
    isSuccess: searchIsSuccess,
  } = useQuery(
    ["crypto-search-exchange", query, user],
    () => fetchSearch(query, user),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      staleTime: 60000,
      select: (search) => {
        const searchCoins = Object.values(search.data.map((d) => d.data));
        return searchCoins;
      },
    }
  );

  if (exchangesIsLoading) {
    return <CircularProgress size="5em" />;
  }
  if (exchangesIsError) {
    return logout();
  }
  if (query.length >= 3) {
    searchRefetch();
  }

  const columns = 
   matches ?
    [
    {
      field: "trust_score_rank",
      headerName: "TRUST_RANK",
      headerAlign: "center",
      align: "center",
      flex: 0.1,
    },
    {
      field: "name",
      headerName: "NAME",
      headerAlign: "center",
      align: "left",
      flex: 0.15,
      renderCell: (params) => {
        return (
          <>
            <Avatar
              alt={params.row.name}
              src={params.row.image}
              sx={{ padding: "10px" }}
            />
            {params.row.name || ""}
          </>
        );
      },
    },
    {
      field: "trade_volume_24h_btc",
      headerName: "TRADE_VOLUME_DAILY",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.2,
      valueFormatter: (params) => {
        return params && `${params.value}`;
      },
    },
    {
      field: "country",
      headerName: "COUNTRY",
      headerAlign: "center",
      align: "left",
      flex: 0.2,
    },
    {
      field: "year_established",
      headerName: "YEAR",
      headerAlign: "center",
      align: "center",
      flex: 0.1,
    },
  ]
  : 
  [
    {
      field: "trust_score_rank",
      headerName: "TRUST_RANK",
      headerAlign: "center",
      align: "center",
      flex: 0.1,
    },
    {
      field: "name",
      headerName: "NAME",
      headerAlign: "center",
      align: "left",
      flex: 0.3,
      renderCell: (params) => {
        return (
          <>
            <Avatar
              alt={params.row.name}
              src={params.row.image}
              sx={{ padding: "10px" }}
            />
            {params.row.name || ""}
          </>
        );
      },
    },
    {
      field: "trade_volume_24h_btc",
      headerName: "TRADE_VOLUME_DAILY",
      headerAlign: "center",
      align: "center",
      type: "number",
      flex: 0.2,
      valueFormatter: (params) => {
        return params && `${params.value}`;
      },
    },
  ]

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
        Explore Exchanges
      </Typography>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          padding: "2em",
        }}
      >
        <TextField
          placeholder="Search"
          defaultValue=""
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <Box sx={{ height: "60em", width: "100%", background: "#FDFEFE" }}>
        <DataGrid
          rows={searchIsSuccess ? search : exchanges}
          rowCount={250}
          loading={searchIsSuccess ? exchangesIsFetching : searchIsFetching}
          columns={columns}
          pagination
          page={pageNumber}
          pageSize={20}
          rowsPerPageOptions={[20]}
          paginationMode="server"
          onPageChange={(newPage) => {
            setPageNumber(newPage);
          }}
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
            padding: "1em",
            cursor: "pointer",
            marginBottom: 100,
          }}
          onCellClick={(params) => {
            navigate(`/exchanges/${params.id}`);
          }}
        />
      </Box>
    </>
  );
}

export default Exchanges;
