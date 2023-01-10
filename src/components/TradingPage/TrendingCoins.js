import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";

import { useCurrencyContext } from "../../hooks/currencyHooks/useCurrencyContext";
import { useAuthContext } from "../../hooks/authHooks/useAuthContext";
import { useLogout } from "../../hooks/authHooks/useLogout";

const fetchTrendingCoins = (currency, user) => {
  return axios.get(`https://crypto-amigo-api.onrender.com/api/coins/trending?currency=${currency.value}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
};

function TrendingCoins() {
  const { currency } = useCurrencyContext();
  const { user } = useAuthContext();
  const matches = useMediaQuery("(min-width:800px)");
  const { logout } = useLogout();

  const {
    isLoading: trendingCoinsIsLoading,
    isError: trendingCoinsIsError,
    data: trendingCoins,
  } = useQuery(
    ["crypto-coins", currency, user],
    () => fetchTrendingCoins(currency, user),
    {
      staleTime: 60000,
      refetchInterval: 70000,
      select: (trendingCoins) => {
        const cryptoCoins =
          currency.value === "eur"
            ? Object.values(trendingCoins.data.map((d) => d.data))
            : Object.values(trendingCoins.data.map((d) => d[currency.value]));
        return cryptoCoins;
      },
    }
  );

  if (trendingCoinsIsLoading) {
    return <CircularProgress size="5em" />;
  }

  if (trendingCoinsIsError) {
    return logout();
  }

  const CarouselItems = trendingCoins?.map((coin) => (
    <Card
      key={coin.id}
      sx={{
        padding: "0 5% 5% 5%",
        margin: "0 5% 5% 5%",
        borderRadius: 5,
        justifyContent: "center",
        minHeight: "80%",
        background:"#FDFEFE"
      }}
    >
      <Link
        to={`/coins/${coin.id}`}
        style={{ color: "inherit", textDecoration: "inherit" }}
      >
        <CardHeader
          component={"div"}
          sx={{ padding: "10%", maxHeight: 50 }}
          avatar={
            <Avatar
              alt="crypto-image"
              src={coin.image}
              aria-label="Trending Coins"
            />
          }
          title={
            <div>
              <Typography sx={{ fontSize: "1.2em", fontWeight: 400 }}>
                {matches && coin.name}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ fontSize: "1.2em", fontWeight: 500 }}
              >
                {coin.symbol.toUpperCase()}
              </Typography>
            </div>
          }
        />
      </Link>
      <CardContent>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography align="center" sx={{ fontSize: "1em", fontWeight: 500 }}>
            {currency.symbol} {Number(coin.current_price)}
          </Typography>
          <Typography
            align="center"
            sx={{
              fontSize: "1em",
              fontWeight: 700,
              color: coin.price_change_percentage_24h >= 0 ? "green" : "red",
              "&::after": {
                content: `'${coin.price_change_percentage_24h}%'`,
              },
            }}
          >
            {coin.price_change_percentage_24h >= 0 ? (
              <ArrowUpwardRoundedIcon />
            ) : (
              <ArrowDownwardRoundedIcon />
            )}
          </Typography>
        </div>
      </CardContent>
    </Card>
  ));

  const responsive = {
    0: {
      items: 2,
    },
    360: {
      items: 2,
    },
    576: {
      items: 2,
    },
    768: {
      items: 4,
    },
    992: {
      items: 5,
    },
    1200: {
      items: 6,
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        flexWrap: "wrap",
      }}
    >
      <Typography variant="h2" sx={{fontSize:"1.8em", fontWeight:700, padding:"1em"}}> Todays Trending Assets</Typography>
      <AliceCarousel
        autoHeight
        autoPlayInterval={1000}
        animationDuration={1500}
        infinite
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        items={CarouselItems}
        mouseTracking
        touchTracking
        autoPlay
      />
    </div>
  );
}

export default TrendingCoins;
