

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '../context/UserContext';
import DOMPurify from 'dompurify';


import { Box,  CircularProgress,  Typography,  Alert,  List, ListItem,  Paper,} from '@mui/material';

const Page7 = () => {
  const { authState } = useUser();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuestions = async (token) => {
    try {    
      const res = await axios.post(
        "http://localhost:5000/api/questions",
        {},
        {
          headers: {
                       'Authorization': token
          }
        }
      );

      

      const possibleData = res.data?.data || res.data;
      

      if (!Array.isArray(possibleData)) {
        console.warn("Response is not an array:", possibleData); 
        setQuestions([]);
        setError("Invalid data format received from server.");
      } else {
        setError(""); 

        
        const sanitizedQuestions = possibleData.map(q => ({
          ...q,
          question: DOMPurify.sanitize(q.question, { USE_PROFILES: { html: true },
          
          }),
          explanation: q.explanation ? DOMPurify.sanitize(q.explanation, { USE_PROFILES: { html: true },FORBID_TAGS: ['img'] }) : null
        }));
        setQuestions(sanitizedQuestions);
       
      }
    } catch (err) {
      console.error("Error fetching questions:", err); 
      setError("Failed to fetch questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   
    
    setLoading(true);
    setError("");

    if (authState.accessToken) {
      fetchQuestions(authState.accessToken);
    } else {
      setLoading(false);
      setError("Authentication required. Please log in.");
    }
  }, [authState.accessToken]);


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading questions...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (questions.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">No questions found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Questions
      </Typography>
      {questions.map((q, idx) => (
        <Paper
          key={q.id || idx}
          elevation={3}
          sx={{ mb: 4, p: 3, borderRadius: '8px' }} 
        >
          
          <Typography
            variant="h5"
            component="h3"
            dangerouslySetInnerHTML={{ __html: `${idx + 1}. ${q.question}` }}
            gutterBottom
          />

          
          <List sx={{ listStyleType: 'upper-alpha', pl: '20px' }}>
            {q.options?.slice(0, 4).map((opt, i) => (
              <ListItem key={i} sx={{ display: 'list-item' }} >{opt}</ListItem>
            ))}
          </List>

          
          {q.explanation && (
            <Typography
              variant="body2"
              sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }} 
              dangerouslySetInnerHTML={{ __html: `<strong>Explanation:</strong> ${q.explanation}`,FORBID_TAGS: ['img']  }}
            />
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default Page7;