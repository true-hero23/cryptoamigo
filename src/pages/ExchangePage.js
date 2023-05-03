import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCurrencyContext } from "../hooks/currencyHooks/useCurrencyContext";
import { useAuthContext } from "../hooks/authHooks/useAuthContext";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Moment from "react-moment";
import CurrencyTab from "../currency/Currency_Tab";
import Avatar from "@mui/material/Avatar";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { useLogout } from "../hooks/authHooks/useLogout";

const fetchExchange = (id, user) => {
  return axios.get(`https://crypto-amigo-api.onrender.com/api/exchanges/${id}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
};

function ExchangePage() {
  let { id } = useParams();
  const { user } = useAuthContext();
  const { currency } = useCurrencyContext();
  const { logout } = useLogout();

  const {
    isLoading: exchangeIsLoading,
    isFetching: exchangeIsFetching,
    isSuccess: exchangeIsSuccess,
    isError: exchangeIsError,
    error: exchangeError,
    data: exchange,
  } = useQuery(
    ["crypto-exchange", id, currency, user],
    () => fetchExchange(id, user),
    { staleTime: 60000, refetchInterval: 125000 }
  );

  if (exchangeIsLoading || exchangeIsFetching) {
    return <CircularProgress size="5em" />;
  }

  if (exchangeIsError) {
    return <h2>Something went wrong: {exchangeError.message}</h2>;
  }

  const tickers =
    exchangeIsSuccess &&
    exchange?.data.tickers.map((ticker) =>
      ticker.target === currency.value.toUpperCase() ? (
        <div key={ticker.last}>
          <Typography sx={{ fontSize: "1em", fontWeight: 500 }}>
            Traded Coin: {ticker.coin_id}
          </Typography>

          <Typography sx={{ fontSize: "1em", fontWeight: 500 }}>
            Traded at:{" "}
            <Moment format="MMMM Do YYYY, h:mm:ss a">
              {ticker.last_traded_at}
            </Moment>
          </Typography>

          <Typography sx={{ fontSize: "1em", fontWeight: 500 }}>
            Converted Last (usd): {ticker.converted_last.usd}
          </Typography>

          <Typography sx={{ fontSize: "1em", fontWeight: 500 }}>
            Converted Volume (usd): {ticker.converted_volume.usd}
          </Typography>

          <Typography sx={{ fontSize: "1em", fontWeight: 500 }}>
            Bid-Ask difference:{" "}
            {`${ticker.bid_ask_spread_percentage} %`}
          </Typography>

          <Typography sx={{ fontSize: "1em", fontWeight: 500 }}>
            trade url (graph):{" "}
            <a href={ticker.trade_url} target="_blank" rel="noreferrer">
              <QueryStatsIcon />
            </a>
          </Typography>
        </div>
      ) : null
    );

  const statistics = (
    <Card
      key={exchange?.data.id}
      sx={{
        borderRadius: 5,
        padding: "0.5em",
        mt: "2em",
        background: "#FDFEFE",
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            alt="exchange"
            src={exchange?.data.image}
            aria-label="Exchange"
            sx={{ height: "2em", width: "2em" }}
          />
        }
        title={
          <>
            <Typography sx={{ fontSize: "1.3em", fontWeight: 700 }}>
              {exchange?.data.name}
            </Typography>
            <Typography
              sx={{ fontSize: "1.1em", fontWeight: 600 }}
              color="text.secondary"
            >
              Trust Score {exchange?.data.trust_score}
            </Typography>
            <Typography
              sx={{ fontSize: "1.1em", fontWeight: 600 }}
              color="text.secondary"
            >
              Official site:{" "}
              <a href={exchange?.data.url} target="_blank" rel="noreferrer">
                {exchange?.data.url}
              </a>
            </Typography>
          </>
        }
      />
      <CardContent>
        <CurrencyTab />
        <div style={{ fontSize: "1.3em", fontWeight: "700", padding: "1em" }}>
          {" "}
          Stats - Last Tickers By Currency
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            columnGap: "2em",
            rowGap: "2.5em",
          }}
        >
          {tickers}
        </Box>
      </CardContent>
    </Card>
  );

  return statistics;
}

export default ExchangePage;
