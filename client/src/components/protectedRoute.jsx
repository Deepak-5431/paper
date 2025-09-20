import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { Box, CircularProgress, Typography, Alert,Button } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const { authState } = useUser();

  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    let isMounted = true; 

    const verifyTestAccess = async () => {
      
      if (!authState?.accessToken) {
        navigate(`/page2/${paperId}`, { replace: true }); 
        return;
      }

     
      if (!paperId) {

        setIsVerifying(false);
        return;
      }
      
      
      const storedQpCode = localStorage.getItem('qp_code');
      if (!storedQpCode || storedQpCode !== paperId) {

        navigate(storedQpCode ? `/page2/${storedQpCode}` : '/select-test', { replace: true });
        return;
      }


      try {
        const token = authState.accessToken;
        const response = await axios.get(`/api/testpaper/${paperId}`, {
          headers: { 'Authorization': token },
        });

        if (!isMounted) return; 

        const isCompleted = response.data?.isCompleted == "1";

        if (isCompleted) {
        
          navigate(`/page6/${paperId}`, { replace: true });
        } else {
          
          setIsVerifying(false);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to verify test status. Please go back and try again.");
          setIsVerifying(false);
        }
      }
    };

    verifyTestAccess();

    
    return () => {
      isMounted = false;
    };

  }, [paperId, authState, navigate]);

  if (isVerifying) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Verifying Access...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="outlined" onClick={() => navigate('/select-test')}>
          Back to Tests
        </Button>
      </Box>
    );
  }

  
  return children;
};

export default ProtectedRoute;