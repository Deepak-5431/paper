import  { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { 
    AppBar, 
    Toolbar, 
    styled, 
    Typography, 
  
} from "@mui/material";

const Navbar = styled(AppBar)({
    backgroundColor: "#fff",
    color: 'black',
    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)',
});

const Header = () => {

    const [name, setName] = useState('');
    const { paperId } = useParams();
    const { authState } = useUser();

    useEffect(() => {
        const fetchPaperData = async () => {
            try {
                const token = authState.accessToken;
                const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/testpaper/${paperId}`;
                const response = await axios.get(apiUrl, {
                    headers: { 'Authorization': token }
                });
                setName(response.data.name);
            } catch (err) {
               
            }
        };

        if (authState && authState.accessToken && paperId) {
            fetchPaperData();
        } else {
            setLoading(false);
        }
    }, [paperId, authState]);

    

   

    return (
        <Navbar position="static">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography variant="h4" noWrap>
                    {name || "Test Paper"}
                </Typography>
                
               
            </Toolbar>
        </Navbar>
    );
};

export default Header;