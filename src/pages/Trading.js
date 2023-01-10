import TrendingCoins from "../components/TradingPage/TrendingCoins";
import TradingDatagrid from "../components/TradingPage/TradingDatagrid";

function Trading() {
  return (
    <div style={{ display:"flex", flexDirection:"column", marginBottom:"2em"}}>
      <TrendingCoins />
      <TradingDatagrid />
    </div>
  );
}

export default Trading;
