// page5.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { CheckCircleOutline, CancelOutlined } from "@mui/icons-material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "../components/header"; 

const theme = createTheme({
  palette: {
    primary: { main: "#2196F3" },
    success: { main: "#4CAF50" },
    error: { main: "#f44336" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

const ResultContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: "80px auto",
  maxWidth: "900px",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const StyledListItem = styled(ListItem)(({ theme, correct }) => ({
  borderLeft: `5px solid ${
    correct ? theme.palette.success.main : theme.palette.error.main
  }`,
  marginBottom: theme.spacing(2),
  backgroundColor: correct ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
  "& .MuiListItemIcon-root": {
    minWidth: "40px",
  },
}));

const Page5 = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const { authState } = useUser();
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);

  const api = useMemo(() => {
    const instance = axios.create({ baseURL: "/api" });
    instance.interceptors.request.use((config) => {
      if (authState?.accessToken) {
        config.headers.Authorization = authState.accessToken;
      }
      return config;
    });
    return instance;
  }, [authState]);

  const stripHTML = useCallback((html) => {
    if (!html) return "";
    return html.replace(/<img[^>]*>/gi, "").replace(/<\/?([^>]+)>/g, "").trim();
  }, []);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      
      const questionsRes = await api.get(`/questions/${paperId}`);
      const fetchedQuestions = questionsRes.data.map((q) => ({
        ...q,
        question: stripHTML(q.question),
        options: (q.options || [])
          .map((opt) => stripHTML(opt))
          .filter((opt) => opt && opt.trim() !== ""),
      }));
      setQuestions(fetchedQuestions);

    
      const storedAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
      setUserAnswers(storedAnswers);

     
      let calculatedScore = 0;
      fetchedQuestions.forEach((q) => {
        const userAnswer = storedAnswers[q.id];
        const correctAnswer = stripHTML(q.answers[0]);
        
        if (userAnswer && stripHTML(userAnswer) === correctAnswer) {
          calculatedScore += 1;
        }
      });
      setScore(calculatedScore);

    } catch (e) {
      setError(e.response?.data?.message || "Failed to fetch results.");
      console.error("Error fetching results:", e);
    } finally {
      setLoading(false);
    }
  }, [api, paperId, stripHTML]);

  useEffect(() => {
    if (authState?.accessToken && paperId) {
      fetchResults();
    }
  }, [authState, paperId, fetchResults]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{
        minHeight: "100vh",
        minWidth:'90vw',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "grey.100",
        px: { xs: 2, sm: 4 },
      }}>
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: 500,
            p: { xs: 2, sm: 4 },
            borderRadius: 4,
            boxShadow: 6,
            background: "linear-gradient(135deg, #e3f2fd 0%, #fff 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: "primary.main", mb: 2 }}>
            Test Result
          </Typography>
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress color="primary" size={40} />
            </Box>
          )}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {questions.length > 0 && (
            <>
              <List sx={{ width: "100%", bgcolor: "transparent" }}>
                {questions.map((q, index) => {
                  const userAnswerText = userAnswers[q.id];
                  const correctAnswerText = stripHTML(q.answers[0]);
                  const isCorrect = userAnswerText ? stripHTML(userAnswerText) === correctAnswerText : false;
                  
                  return (
                    <StyledListItem key={q.id} correct={isCorrect}>
                      
                      <ListItemText
                        primary={
                          <Typography fontWeight="bold">
                            Question #{index + 1}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body1" sx={{mb: 1}} dangerouslySetInnerHTML={{ __html: q.question }}/>
                            {userAnswerText !== undefined ? (
                                <Typography variant="body2" color={isCorrect ? "success.main" : "error.main"}>
                                    Your Answer: {userAnswerText}
                                </Typography>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    You did not answer this question.
                                </Typography>
                            )}
                            {!isCorrect && (
                                <Typography variant="body2" color="success.main">
                                    Correct Answer: {correctAnswerText}
                                </Typography>
                            )}
                            <Box sx={{mt:2}}>
                                <Typography variant="body2" color="text.secondary" dangerouslySetInnerHTML={{ __html: q.explanation }} />
                            </Box>
                          </Box>
                        }
                      />
                    </StyledListItem>
                  );
                })}
              </List>
              <Box sx={{mt: 4, textAlign: 'center'}}>
                <Button variant="contained" onClick={() => navigate('/')}>
                    Summary
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default Page5;