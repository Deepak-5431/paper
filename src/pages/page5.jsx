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
} from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#2196F3" },
    secondary: { main: "#6c757d" },
    success: { main: "#4CAF50" },
    error: { main: "#f44336" },
    background: {
      default: "#f6f8fb",
      paper: "#ffffff",
    },
    divider: "#e5e7eb",
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h4: { fontWeight: 700, letterSpacing: 0.2 },
    h6: { fontWeight: 600 },
    body2: { lineHeight: 1.6 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: "0 10px 30px rgba(2,6,23,0.06)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          paddingInline: 20,
          paddingBlock: 10,
          boxShadow: "0 6px 16px rgba(33,150,243,0.15)",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          alignItems: "flex-start",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          paddingTop: 8,
          paddingBottom: 8,
        },
      },
    },
  },
});

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'correct'
})(
  ({ theme, correct }) => ({
    borderLeft: `5px solid ${correct ? theme.palette.success.main : theme.palette.error.main}`,
    marginBottom: theme.spacing(2.5),
    background:
      correct
        ? "linear-gradient(0deg, rgba(76,175,80,0.06), rgba(76,175,80,0.06))"
        : "linear-gradient(0deg, rgba(244,67,54,0.06), rgba(244,67,54,0.06))",
    borderRadius: 12,
    padding: theme.spacing(2.25),
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: "0 6px 16px rgba(2,6,23,0.05)",
    transition: "transform .15s ease, box-shadow .15s ease",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: "0 10px 24px rgba(2,6,23,0.08)",
    },
    "& .MuiListItemIcon-root": {
      minWidth: 40,
    },
    "& .MuiListItemText-root": {
      wordBreak: "break-word",
    },
  })
);

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
    const inputAsString = String(html ?? '');
    // This regex replaces all HTML tags (e.g., <br>, <strong>) with an empty string.
    return inputAsString.replace(/<[^>]*>/g, '').trim();
  }, []);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
        const questionsRes = await api.get(`/questions/${paperId}`);
        const fetchedQuestions = questionsRes.data.map((q) => ({
            ...q,
            question: stripHTML(q.question),
            options: (q.options || []).map((opt) => stripHTML(opt)),
        }));
        setQuestions(fetchedQuestions);

        const storedAnswers = JSON.parse(localStorage.getItem('userAnswers') || '{}');
        setUserAnswers(storedAnswers);

        let calculatedScore = 0;
        const norm = (v) => stripHTML(String(v ?? '')).trim();
        const asIndex = (v) => {
          const n = Number(v);
          return Number.isInteger(n) ? n : null;
        };
        fetchedQuestions.forEach((q) => {
          const userAnswer = storedAnswers[q.id];
          const correctAnswerRaw = q.answers && q.answers.length > 0 ? q.answers[0] : undefined;
          if (userAnswer === undefined || correctAnswerRaw === undefined) return;

          let isCorrect = false;

          if (q.questionType === 'checkbox') {
            if (Array.isArray(userAnswer)) {
              const userAnswerTexts = userAnswer
                .map((val) => {
                  const idx = asIndex(val);
                  if (idx !== null && Array.isArray(q.options) && q.options[idx] !== undefined) {
                    return norm(q.options[idx]);
                  }
                  return norm(val);
                })
                .sort();
              const correctAnswerTexts = String(correctAnswerRaw)
                .split(',')
                .map((s) => norm(s))
                .sort();
              if (JSON.stringify(userAnswerTexts) === JSON.stringify(correctAnswerTexts)) isCorrect = true;
            }
          } else if (q.questionType === 'radio') {
            const idx = asIndex(userAnswer);
            const userAnswerText = idx !== null && Array.isArray(q.options) && q.options[idx] !== undefined
              ? norm(q.options[idx])
              : norm(userAnswer);
            if (userAnswerText === norm(correctAnswerRaw)) isCorrect = true;
          } else {
            if (norm(userAnswer) === norm(correctAnswerRaw)) isCorrect = true;
          }

          if (isCorrect) calculatedScore += q.marks?.positive || 1;
        });
        setScore(calculatedScore);

    } catch (e) {
        setError(e.message || "Failed to fetch results.");
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

  const handleRetry = () => {
    navigate(`/page3/${paperId}`);
  };

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
        <Button onClick={fetchResults} sx={{ mt: 2 }}>Try Again</Button>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          bgcolor: 'background.default',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          p: { xs: 2, sm: 4, md: 6 },
          boxSizing: 'border-box',
          backgroundImage: 'radial-gradient(circle at 10% 10%, rgba(33,150,243,.08), transparent 40%), radial-gradient(circle at 90% 20%, rgba(33,150,243,.05), transparent 35%)'
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 920,
            p: { xs: 2.5, sm: 4, md: 5 },
            borderRadius: 14,
            background: 'linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 800,
              color: 'primary.main',
              mb: 1,
              letterSpacing: 0.2,
            }}
          >
            Test Result
          </Typography>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{
              mb: 4,
              color: 'text.secondary',
              '& strong': {
                color: 'text.primary',
              },
              backgroundColor: 'rgba(33,150,243,0.08)',
              display: 'inline-block',
              px: 2,
              py: 1,
              borderRadius: 999,
            }}
          >
            You scored: <strong>{score}</strong> / <strong>{questions.length}</strong>
          </Typography>

          {questions.length > 0 && (
            <>
              <List sx={{ width: '100%', bgcolor: 'transparent' }}>
                {questions.map((q, index) => {
                  const userAnswer = userAnswers[q.id];
                  const correctAnswerText = q.answers && q.answers.length > 0 ? q.answers[0] : "N/A";

                  const norm = (v) => stripHTML(String(v ?? '')).trim();
                  const asIndex = (v) => {
                    const n = Number(v);
                    return Number.isInteger(n) ? n : null;
                  };
                  let isCorrect = false;
                  let displayUserAnswer = "Not Answered";

                  if (userAnswer !== undefined && correctAnswerText) {
                    if (q.questionType === 'checkbox' && Array.isArray(userAnswer)) {
                      const userAnswerTexts = userAnswer
                        .map((val) => {
                          const idx = asIndex(val);
                          if (idx !== null && Array.isArray(q.options) && q.options[idx] !== undefined) {
                            return norm(q.options[idx]);
                          }
                          return norm(val);
                        })
                        .sort();
                      const correctAnswerTexts = String(correctAnswerText)
                        .split(',')
                        .map((s) => norm(s))
                        .sort();
                      if (JSON.stringify(userAnswerTexts) === JSON.stringify(correctAnswerTexts)) isCorrect = true;
                      displayUserAnswer = userAnswerTexts.join(', ');
                    } else if (q.questionType === 'radio') {
                      const idx = asIndex(userAnswer);
                      const userAnswerText = idx !== null && Array.isArray(q.options) && q.options[idx] !== undefined
                        ? norm(q.options[idx])
                        : norm(userAnswer);
                      if (userAnswerText === norm(correctAnswerText)) isCorrect = true;
                      displayUserAnswer = userAnswerText;
                    } else {
                      if (norm(userAnswer) === norm(correctAnswerText)) isCorrect = true;
                      displayUserAnswer = String(userAnswer);
                    }
                  }

                  return (
                    <StyledListItem key={q.id} correct={isCorrect}>
                      <ListItemText
                        primary={
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              fontSize: { xs: '1rem', sm: '1.05rem' },
                              color: 'text.primary',
                            }}
                          >
                            Question #{index + 1}: {q.question}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1.25 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                color: isCorrect ? 'success.main' : 'error.main',
                                mb: !isCorrect ? 0.75 : 0,
                                fontWeight: isCorrect ? 600 : 400,
                              }}
                            >
                              <b>Your Answer:</b> {displayUserAnswer || 'Not Answered'}
                            </Typography>
                            {!isCorrect && (
                            <Typography
                              variant="body2"
                              sx={{
                                color: 'success.main',
                                mb: q.explanation ? 0.75 : 0,
                                fontWeight: isCorrect ? 600 : 400,
                              }}
                            >
                              <b>Correct Answer:</b> {stripHTML(correctAnswerText)}
                            </Typography>
                            )}
                            {q.explanation && (
                              <Box mt={1} p={1.25} sx={{ bgcolor: 'grey.100', borderRadius: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  <b>Explanation:</b> {stripHTML(q.explanation)}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        }
                        secondaryTypographyProps={{ component: 'div' }}
                      />
                    </StyledListItem>
                  );
                })}
              </List>

              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/page4')}
                  sx={{ px: 3, py: 1.1 }}
                >
                  Back to Dashboard
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRetry}
                  sx={{ px: 3, py: 1.1 }}
                >
                  Retry Test
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