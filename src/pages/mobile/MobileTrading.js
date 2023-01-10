import TrendingCoins from "../../components/TradingPage/TrendingCoins";
import MobileTradingDatagrid from "../../components/TradingPage/MobileTradingDatagrid";

function Trading() {
  return (
    <div style={{marginBottom:"2em"}}>
      <TrendingCoins />
      <MobileTradingDatagrid />
    </div>
  );
}

export default Trading;
