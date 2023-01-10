import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Currency_Data } from "../currency/Currency_Data";
import ListSubheader from "@mui/material/ListSubheader";
import useMediaQuery from "@mui/material/useMediaQuery";

import Divider from "@mui/material/Divider";
import { Typography } from "@mui/material";

import { useCurrencyContext } from "../hooks/currencyHooks/useCurrencyContext";

function Currency_Tab() {
  const { currency, dispatch } = useCurrencyContext();
  const matches = useMediaQuery("(min-width:800px)");

  const handleChange = (event, index) => {
    dispatch({
      type: "SET_CURRENCY",
      payload: {
        label: index.props.label,
        value: event.target.value,
        symbol: index.props.symbol,
      },
    });
  };
  return (
    <Box sx={{ mb: "1em", ml: "1em" }}>
      <FormControl fullWidth>
        <InputLabel id="select-currency">Currency</InputLabel>
        <Select
          labelId="select-currency"
          id="select-currency"
          value={currency.value}
          label="Currency"
          size={matches ? "medium" : "small"}
          onChange={handleChange}
        >
          <ListSubheader
            color="primary"
            sx={{ fontWeight: "fontWeightBold", fontSize: "1em" }}
          >
            Currencies
            <Divider
              flexItem={true}
              variant="middle"
              component="div"
              sx={{ bgcolor: "secondary.light" }}
            />
          </ListSubheader>

          {Currency_Data.currencies.map((currency) => (
            <MenuItem
              key={currency.label}
              label={currency.label}
              symbol={currency.symbol}
              value={currency.value}
            >
              <Typography sx={{ fontSize: "1em" }}>{currency.label}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default Currency_Tab;
