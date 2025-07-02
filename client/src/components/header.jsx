import { AppBar,Toolbar,styled,Typography } from "@mui/material";


const Navbar = styled(AppBar)({
  backgroundColor: '#FFF',
  color: 'black'
})
   
const Header = () => {
  return(
    <Navbar>
      <Toolbar>
        <Typography>SSC CGL TIER-1 2023 TIER 1 OFFICIAL PAPER</Typography>
      </Toolbar>
    </Navbar>
  )
}
export default Header;