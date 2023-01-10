import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCurrencyContext } from "../hooks/currencyHooks/useCurrencyContext";
import { useAuthContext } from "../hooks/authHooks/useAuthContext";
import { useLogout } from "../hooks/authHooks/useLogout";
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

import Chart from "../components/CoinPage/Chart";

const fetchCoin = (id, user) => {
  return axios.get(`https://crypto-amigo-api.onrender.com/api/coins/${id}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
};
function CoinPage() {
  let { id } = useParams();
  const { user } = useAuthContext();
  const { currency } = useCurrencyContext();
  const [positive] = useState("green");
  const [negative] = useState("red");
  const { logout } = useLogout();

  const {
    isLoading: coinIsLoading,
    isError: coinIsError,
    data: coin,
  } = useQuery(["crypto-coin", id, user], () => fetchCoin(id, user), {
    staleTime: 60000,
    refetchInterval: 125000,
  });

  if (coinIsLoading) {
    return <CircularProgress size="5em" />;
  }

  if (coinIsError) {
    return logout();
  }

  const statistics = (
    <Card
      key={coin?.id}
      sx={{
        borderRadius: 5,
        padding: "0.5em",
        mt: "1em",
        background: "#FDFEFE",
      }}
    >
      <CardHeader
        title={
          <>
            <Typography sx={{ fontSize: "0.9em", fontWeight: "800" }}>
              Coin Stats
            </Typography>
            <Typography
              sx={{ fontSize: "0.7em", fontWeight: 600 }}
              color="text.secondary"
            >
              Updated at{" "}
              <Moment format="MMMM Do YYYY, h:mm:ss a">
                {coin?.data.last_updated}
              </Moment>
            </Typography>
          </>
        }
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            columnGap: "2em",
            rowGap: "2.5em",
          }}
        >
          <div>
            <Typography
              sx={{ fontSize: "1em", fontWeight: 700 }}
              color="text.secondary"
            >
              {" "}
              Market Cap
            </Typography>
            <Typography sx={{ fontSize: "1em", fontWeight: 600 }}>
              {" "}
              {`${coin?.data.market_data.market_cap[
                currency.value
              ]} ${currency.symbol}`}
            </Typography>
            <Typography
              sx={{
                fontSize: "1em",
                fontWeight: 600,
                color: `${
                  coin?.data.market_data.market_cap_change_percentage_24h > 0
                    ? positive
                    : negative
                }`,
              }}
            >
              {" "}
              {`${Number(
                coin?.data.market_data
                  .market_cap_change_percentage_24h_in_currency[currency.value]
              )} %`}
            </Typography>
          </div>
          <div>
            <Typography
              sx={{ fontSize: "1em", fontWeight: 700 }}
              color="text.secondary"
            >
              {" "}
              Total Volume
            </Typography>
            <Typography sx={{ fontSize: "1em", fontWeight: 600 }}>
              {" "}
              {`${coin?.data.market_data.total_volume[
                currency.value
              ]} ${currency.symbol}`}
            </Typography>
          </div>
          <div>
            <Typography
              sx={{ fontSize: "1em", fontWeight: 700 }}
              color="text.secondary"
            >
              {" "}
              Liquidity Score
            </Typography>
            <Typography sx={{ fontSize: "1em", fontWeight: 600 }}>
              {" "}
              {`${(coin?.data.liquidity_score / 100)} `}
            </Typography>
          </div>
          <div>
            <Typography
              sx={{ fontSize: "1em", fontWeight: 700 }}
              color="text.secondary"
            >
              {" "}
              CoinGecko Score
            </Typography>
            <Typography sx={{ fontSize: "1em", fontWeight: 600 }}>
              {" "}
              {`${coin?.data.coingecko_score} %`}
            </Typography>
          </div>
          <div>
            <Typography
              sx={{ fontSize: "1em", fontWeight: 700 }}
              color="text.secondary"
            >
              {" "}
              Community Score
            </Typography>
            <Typography sx={{ fontSize: "1em", fontWeight: 600 }}>
              {" "}
              {`${coin?.data.community_score} %`}
            </Typography>
          </div>
          <div>
            <Typography
              sx={{ fontSize: "1em", fontWeight: 700 }}
              color="text.secondary"
            >
              {" "}
              Alexa Rank
            </Typography>
            <Typography sx={{ fontSize: "1em", fontWeight: 600 }}>
              {" "}
              {coin?.data.public_interest_stats.alexa_rank}{" "}
            </Typography>
          </div>
          <div>
            <Typography
              sx={{ fontSize: "1em", fontWeight: 700 }}
              color="text.secondary"
            >
              {" "}
              Highest in 24h
            </Typography>
            <Typography sx={{ fontSize: "1em", fontWeight: 600 }}>
              {" "}
              {`${coin?.data.market_data.high_24h[
                currency.value
              ]} ${currency.symbol}`}{" "}
            </Typography>
          </div>
          <div>
            <Typography
              sx={{ fontSize: "0.9em", fontWeight: 700 }}
              color="text.secondary"
            >
              {" "}
              Lowest in 24h
            </Typography>
            <Typography sx={{ fontSize: "1em", fontWeight: 600 }}>
              {" "}
              {`${coin?.data.market_data.low_24h[
                currency.value
              ]} ${currency.symbol}`}{" "}
            </Typography>
          </div>
          <div>
            <Typography
              sx={{ fontSize: "1em", fontWeight: 700 }}
              color="text.secondary"
            >
              {" "}
              Price Change 1H
            </Typography>
            <Typography
              sx={{
                fontSize: "1em",
                fontWeight: 600,
                color: `${
                  coin?.data.market_data.price_change_percentage_1h_in_currency[
                    currency.value
                  ] > 0
                    ? positive
                    : negative
                }`,
              }}
            >
              {" "}
              {`${Number(
                coin?.data.market_data.price_change_percentage_1h_in_currency[
                  currency.value
                ]
              )} %`}
            </Typography>
          </div>
          <div>
            <Typography
              sx={{ fontSize: "1em", fontWeight: 700 }}
              color="text.secondary"
            >
              {" "}
              Price Change 1D
            </Typography>
            <Typography
              sx={{
                fontSize: "1em",
                fontWeight: 600,
                color: `${
                  coin?.data.market_data
                    .price_change_percentage_24h_in_currency[currency.value] > 0
                    ? positive
                    : negative
                }`,
              }}
            >
              {" "}
              {`${Number(
                coin?.data.market_data.price_change_percentage_24h_in_currency[
                  currency.value
                ]
              )} %`}
            </Typography>
          </div>
          <div>
            <Typography
              sx={{ fontSize: "1em", fontWeight: 700 }}
              color="text.secondary"
            >
              {" "}
              Price Change 1W
            </Typography>
            <Typography
              sx={{
                fontSize: "1em",
                fontWeight: 600,
                color: `${
                  coin?.data.market_data.price_change_percentage_7d_in_currency[
                    currency.value
                  ] > 0
                    ? positive
                    : negative
                }`,
              }}
            >
              {" "}
              {`${Number(
                coin?.data.market_data.price_change_percentage_7d_in_currency[
                  currency.value
                ]
              )} %`}
            </Typography>
          </div>
          <div>
            <Typography
              sx={{ fontSize: "1em", fontWeight: 700 }}
              color="text.secondary"
            >
              {" "}
              Price Change 1M
            </Typography>
            <Typography
              sx={{
                fontSize: "1em",
                fontWeight: 600,
                color: `${
                  coin?.data.market_data
                    .price_change_percentage_30d_in_currency[currency.value] > 0
                    ? positive
                    : negative
                }`,
              }}
            >
              {" "}
              {`${Number(
                coin?.data.market_data.price_change_percentage_30d_in_currency[
                  currency.value
                ]
              )} %`}
            </Typography>
          </div>
          <div>
            <Typography
              sx={{ fontSize: "1em", fontWeight: 700 }}
              color="text.secondary"
            >
              {" "}
              Price Change 2M
            </Typography>
            <Typography
              sx={{
                fontSize: "1em",
                fontWeight: 600,
                color: `${
                  coin?.data.market_data
                    .price_change_percentage_60d_in_currency[currency.value] > 0
                    ? positive
                    : negative
                }`,
              }}
            >
              {" "}
              {`${Number(
                coin?.data.market_data.price_change_percentage_60d_in_currency[
                  currency.value
                ]
              )} %`}
            </Typography>
          </div>
          <div>
            <Typography
              sx={{ fontSize: "1em", fontWeight: 700 }}
              color="text.secondary"
            >
              {" "}
              Price Change 1Y
            </Typography>
            <Typography
              sx={{
                fontSize: "1em",
                fontWeight: 600,
                color: `${
                  coin?.data.market_data.price_change_percentage_1y_in_currency[
                    currency.value
                  ] > 0
                    ? positive
                    : negative
                }`,
              }}
            >
              {" "}
              {`${Number(
                coin?.data.market_data.price_change_percentage_1y_in_currency[
                  currency.value
                ]
              )} %`}
            </Typography>
          </div>
        </Box>
      </CardContent>
    </Card>
  );

  const tickers = coin?.data.tickers.map(
    (ticker) =>
      ticker.coin_id === coin?.data.id &&
      ticker.target === currency.value.toUpperCase() && (
        <div key={ticker.market.name}>
          <Typography
            color="text.secondary"
            sx={{ fontSize: "1em", fontWeight: 700 }}
          >
            {ticker.market.name}
          </Typography>

          <Typography sx={{ fontSize: "1em", fontWeight: 600 }}>
            Volume: {ticker.volume}
          </Typography>

          <Typography sx={{ fontSize: "1em", fontWeight: 600 }}>
            Bid-Ask difference:{" "}
            {`${ticker.bid_ask_spread_percentage} %`}
          </Typography>
        </div>
      )
  );

  const tickerBox = (
    <Card
      key={coin?.id}
      sx={{
        borderRadius: 5,
        padding: "0.5em",
        mt: "1em",
        background: "#FDFEFE",
      }}
    >
      <CardHeader
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div>
              <Typography
                component={"span"}
                sx={{
                  fontSize: "0.9em",
                  fontWeight: 800,
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                Ticker ({coin?.data.symbol}/{currency.value})
              </Typography>
              <Typography
                sx={{ fontSize: "0.7em", fontWeight: 600, mb: "0.9em" }}
                color="text.secondary"
                gutterBottom
              >
                Updated at{" "}
                <Moment format="MMMM Do YYYY, h:mm:ss a">
                  {coin?.data.last_updated}
                </Moment>
              </Typography>
            </div>
            <CurrencyTab />
          </div>
        }
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            columnGap: "2em",
            rowGap: "2em",
          }}
        >
          {tickers}
        </Box>
      </CardContent>
    </Card>
  );

  const chartBox = (
    <Card
      key={coin?.id}
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
            alt="crypto"
            src={coin?.data.image.large}
            aria-label="Coin"
            sx={{ height: "1.5em", width: "1.5em" }}
          />
        }
        title={
          <Typography component={"div"}>
            <Typography sx={{ fontSize: "0.9em", fontWeight: 700 }}>
              {coin?.data.name}
            </Typography>
            <Typography
              sx={{ fontSize: "0.9em", fontWeight: 600 }}
              color="text.secondary"
            >
              {coin?.data.symbol.toUpperCase()}{" "}
            </Typography>
          </Typography>
        }
      />
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Chart />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {chartBox}
      {statistics}
      {tickerBox}
    </div>
  );
}

export default CoinPage;
