import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <Box
      sx={{
        display:"flex",
        flexDirection:"column",
        textAlign:"center",
        maxWidth:"30em",
        padding: "4em",
        background: "#fff",
        borderRadius: 5,
        margin: "3em auto",
      }}
    >
      <Typography sx={{ fontSize: "2.5em", fontWeight: 800, mb:"0.8em" }}>
        Lost your way Amigo?
      </Typography>
      <Typography sx={{ fontSize: "1.5em", fontWeight: 600, mb:"0.5em" }}>
        Sorry.. We cant find this page but we are sure you can find loads to
        explore on our HomePage
      </Typography>
      <Link to={`/`} style={{ color: "inherit", textDecoration: "inherit", }}>
        <button style={{width:"15em"}}>Crypto Amigo</button>
      </Link>
    </Box>
  );
}

export default NotFoundPage;
