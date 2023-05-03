import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCurrencyContext } from "../../hooks/currencyHooks/useCurrencyContext";
import { useAuthContext } from "../../hooks/authHooks/useAuthContext";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Days_Data } from "../../days/Days_Data";
import CurrencyTab from "../../currency/Currency_Tab";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import CircularProgress from "@mui/material/CircularProgress";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; /* eslint-disable no-unused-vars */
import { useLogout } from "../../hooks/authHooks/useLogout";

const fetchChart = (id, days, currency, user) => {
  return axios.get(
    `https://crypto-amigo-api.onrender.com/api/coins/${id}/market_chart?days=${days}&currency=${currency.value}`,
    {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
  );
};

function Chart() {
  const { logout } = useLogout();
  const [days, setDays] = useState("1");
  const [displayLast, setDisplayLast] = useState(false);
  const [custom, setCustom] = useState(0);

  const { id } = useParams();
  const { user } = useAuthContext();
  const { currency } = useCurrencyContext();
  const matches = useMediaQuery("(min-width:800px)");

  const handleChange = (event, index) => {
    setDays(event.target.value);
    if (index.props.children === "Custom") {
      setDisplayLast(true);
    } else {
      setDisplayLast(false);
    }
  };

  const {
    isLoading: chartIsLoading,
    isError: chartIsError,
    error: chartError,
    data: chart,
    isFetching: chartIsFetching,
  } = useQuery(
    ["crypto-chart", id, days, currency, user],
    () => fetchChart(id, days, currency, user),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      staleTime: 60000,
      refetchInterval: 125000,
    }
  );

  if (chartIsLoading) {
    return <CircularProgress size="5em" />;
  }

  if (chartIsError) {
    return <h2>Something went wrong: {chartError.message}</h2>;
  }

  const selectDays = (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <FormControl fullWidth>
        <Select
          labelId="select-days"
          id="select-days"
          value={days}
          size={matches ? "medium" : "small"}
          onChange={handleChange}
        >
          {Days_Data.map((day) => (
            <MenuItem key={day.id} value={day.value} label={day.label}>
              {day.label}
            </MenuItem>
          ))}
          <MenuItem key={custom} defaultValue={custom} value={custom}>
            Custom
          </MenuItem>
        </Select>

        {/* Textfield when the client wants to add a custom number the days before */}
        {displayLast ? (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              placeholder="Days ago"
              type="number"
              value={days}
              margin="dense"
              size={matches ? "medium" : "small"}
              onChange={(event) => {
                setCustom(event.target.value);
                setDays(event.target.value);
              }}
            />
          </Box>
        ) : null}
      </FormControl>
    </Box>
  );

  const lineChart = (
    <>
      {selectDays}
      <CurrencyTab/>
      <Line
        data={{
          labels: chart?.data.prices.map((coin) => {
            let date = new Date(coin[0]);
            let time =
              date.getHours() > 12
                ? `${date.getHours() - 12} PM`
                : `${date.getHours()} AM`;
            return days === "1" ? time : date.toLocaleDateString();
            // 1 day -> show hours
            // more than one day -> show days
          }),
          datasets: [
            {
              data: chart?.data.prices.map((coin) => coin[1]),
              label: `Price ( Past ${days} Days )`,
              borderWidth: `${matches ? 2 : 1}`,
              radius: `${matches ? 0 : 2}`,
              borderColor: "#4d4dff",
            },
          ],
        }}
        options={{
          responsive: true,
          aspectRatio: `${matches ? 2 : 1}`,
          spanGaps: true,
          elements: {
            line: {
              tension: `${matches ? 1 : 0}`,
              pointRadius: 0,
            },
            point: {
              radius: 0,
            },
          },
          plugins: {
            legend: false,
          },
        }}
      />
    </>
  );

  return lineChart;
}

export default Chart;
