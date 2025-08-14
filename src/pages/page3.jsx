import React from "react";
import { useUser } from "../context/UserContext";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,
  IconButton,
  Grid,
  Paper,
  Modal,
  Avatar,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Language,
  Report,
  ArrowBack,
  Eject,
  ArrowForward,
  Replay,
  Analytics,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header2 from "../components/header2"
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Something went wrong. Please refresh the page.
          </Alert>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </Box>
      );
    }
    return this.props.children;
  }
}
const theme = createTheme({
  palette: {
    primary: { main: "#2196F3" },
    secondary: { main: "#007bff" },
    error: { main: "#f44336" },
    success: { main: "#4CAF50" },
    warning: { main: "#FF9800" },
    info: { main: "#9c27b0" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

const StyledContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: theme.palette.grey[100],
  overflow: "hidden",
}));

const MainContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexGrow: 1,
  height: "auto", // Changed from 'calc(100vh - 70px)'
  marginBottom: "70px",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    height: "auto", // Changed from '100vh'
    marginBottom: 0,
  },
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  width: "1200px", // Keep your reduced width
  flexShrink: 0,
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  height: "auto", // Changed from '100%' to 'auto'
  minHeight: "fit-content", // Added to fit its content
  overflow: "hidden",
  position: "relative",
  zIndex: 1,
  [theme.breakpoints.down("md")]: {
    flex: 1,
    width: "100%",
    borderRight: "none",
    height: "auto", // Also adjust for mobile
  },
}));
const ScrollableContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    paddingBottom: "60px",
  },
}));

const RightSidebar = styled(Box)(({ theme, open }) => ({
  width: "100%",
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  [theme.breakpoints.down("md")]: {
    position: "fixed",
    top: 0,
    right: open ? 0 : "-280px",
    width: "260px",
    height: "100%",
    zIndex: 102,
    boxShadow: theme.shadows[3],
    borderLeft: `1px solid ${theme.palette.divider}`,
    transition: "right 0.1s ease-in-out",
  },
}));

const SidebarOverlay = styled(Box)(({ theme, open }) => ({
  display: open ? "flex" : "none",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 101,
  opacity: open ? 1 : 0,
  transition: "opacity 0.3s ease-in-out",
}));

const BottomNav = styled(Paper)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.grey[100],
  borderTop: `1px solid ${theme.palette.divider}`,
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  zIndex: 10,
  height: "70px",
  [theme.breakpoints.down("md")]: {
    height: "60px",
    padding: theme.spacing(1),
  },
}));

const QuestionNumBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "$current",
})(({ theme, status, $current }) => ({
  width: "38px",
  height: "38px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "4px",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s ease",
  backgroundColor:
    status === "answered"
      ? theme.palette.success.main
      : status === "marked"
      ? theme.palette.info.main
      : status === "not-answered"
      ? theme.palette.grey[300]
      : status === "answered-marked"
      ? theme.palette.warning.main
      : status === "partially-answered"
      ? theme.palette.primary.main
      : theme.palette.grey[200],
  color: [
    "answered",
    "marked",
    "answered-marked",
    "not-answered",
    "partially-answered",
  ].includes(status)
    ? theme.palette.common.white
    : theme.palette.text.primary,
  borderColor:
    status === "answered"
      ? theme.palette.success.main
      : status === "marked"
      ? theme.palette.info.main
      : status === ""
      ? theme.palette.grey[300]
      : status === "answered-marked"
      ? theme.palette.warning.main
      : status === "partially-answered"
      ? theme.palette.primary.main
      : theme.palette.divider,
  ...($current && {
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: `0 0 5px rgba(33, 150, 243, 0.5)`,
  }),
}));

const MemoizedQuestionNumBox = React.memo(
  ({ current, status, onClick, children }) => (
    <QuestionNumBox $current={current} status={status} onClick={onClick}>
      {children}
    </QuestionNumBox>
  )
);

const QuestionPalette = React.memo(
  ({ questions, currentQuestionIndex, questionStatus, navigateToQuestion }) => {
    return (
      <Box sx={{ overflow: "visible" }}>
        <Typography variant="subtitle2" fontWeight={800} gutterBottom>
          Question Palette
        </Typography>
        <Grid container spacing={2}>
          {questions.map((q, index) => (
            <Grid item xs={2} key={q.id || index}>
              <MemoizedQuestionNumBox
                current={currentQuestionIndex === index}
                status={questionStatus[q.id] || "not-visited"}
                onClick={() => navigateToQuestion(index)}
              >
                {index + 1}
              </MemoizedQuestionNumBox>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
);

const UserProfile = React.memo(({ authState }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      pb: 2,
      borderBottom: `1px solid ${theme.palette.divider}`,
      padding: "16px",
      gap: "16px",
    }}
  >
    <Avatar
      src={authState?.user?.image}
      alt={authState?.user?.name}
      sx={{
        width: 60,
        height: 60,
        bgcolor: "primary.main",
        fontSize: "24px",
        fontWeight: "bold",
      }}
    >
      {!authState?.user?.image && authState?.user?.name?.[0]}
    </Avatar>
    <Box>
      <Typography variant="subtitle1" fontWeight={600}>
        {authState?.user?.name || "Guest User"}
      </Typography>
    </Box>
  </Box>
));

const QuestionStatusLegend = React.memo(() => (
  <Box
    sx={{
      marginLeft: "20px",
      borderTop: `1px solid ${theme.palette.divider}`,
      borderBottom: `1px solid ${theme.palette.divider}`,
      pt: 2,
      pb: 2,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      gap: 1,
    }}
  >
    {[
      { label: "Answered", color: "success.main" },
      { label: "Review", color: "info.main" },
      { label: "Not Answered", color: "grey.300" },
      { label: "Answer&Review", color: "warning.main" },
    ].map((item, idx) => (
      <Box
        key={idx}
        sx={{
          display: "flex",
          alignItems: "center",
          fontSize: "13px",
          flexBasis: "calc(50% - 8px)",
          maxWidth: "calc(50% - 8px)",
          whiteSpace: "nowrap",
        }}
      >
        <Box
          sx={{
            width: 16,
            height: 16,
            borderRadius: "3px",
            mr: 1,
            backgroundColor: item.color,
            border: `1px solid ${theme.palette.divider}`,
          }}
        />
        {item.label}
      </Box>
    ))}
  </Box>
));
const SidebarButtons = React.memo(() => (
  <Box
    sx={{
      mt: "auto",
      borderTop: `1px solid ${theme.palette.divider}`,
      pt: 2,
      pb: 4,
      display: "flex",
      flexDirection: "column",
      gap: 1,
    }}
  >
    <Button
      variant="contained"
      sx={{
        backgroundColor: "grey.300",
        color: "text.primary",
        "&:hover": { backgroundColor: "grey.400" },
      }}
      fullWidth
    >
      Instructions
    </Button>
  </Box>
));

const CompletionScreen = React.memo(({ navigate }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      textAlign: "center",
      p: 3,
    }}
  >
    <Typography variant="h4" component="h1" gutterBottom>
      Test Submitted Successfully!
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
      What would you like to do next?
    </Typography>
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button
        variant="outlined"
        startIcon={<Replay />}
        onClick={() => window.location.reload()}
      >
        Retake Test
      </Button>
      <Button
        variant="contained"
        startIcon={<Analytics />}
        onClick={() => navigate("/page4")}
      >
        View Results
      </Button>
    </Box>
  </Box>
));

const QuestionContent = React.memo(
  ({ question, index, answers, onAnswerSelect }) => {
    if (!question) return null;

    return (
      <Box key={question.id} sx={{ mb: 5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            pb: 1,
            borderBottom: `1px solid ${theme.palette.divider}`,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Question #{index + 1}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {question.marks && (
              <Typography variant="body2" color="text.secondary">
                Marks:{" "}
                <Typography
                  component="span"
                  color="success.main"
                  fontWeight="bold"
                >
                  +{question.marks.positive}
                </Typography>{" "}
                /{" "}
                <Typography
                  component="span"
                  color="error.main"
                  fontWeight="bold"
                >
                  -{question.marks.negative}
                </Typography>
              </Typography>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Language fontSize="small" color="action" />
              <Select
                size="small"
                defaultValue="English"
                sx={{ fontSize: "13px", minWidth: "100px" }}
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Hindi">Hindi</MenuItem>
              </Select>
            </Box>

            <Button
              size="small"
              color="primary"
              sx={{ fontSize: "13px", minWidth: 0 }}
              startIcon={<Report fontSize="small" />}
            >
              Report
            </Button>
          </Box>
        </Box>

        <Box>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            {question.question}
          </Typography>

          <Box sx={{ mt: 2 }}>
            {question.options &&
              question.options.slice(0, 4).map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  control={
                    <Radio
                      checked={answers[question.id] === option}
                      onChange={() => onAnswerSelect(question, idx)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={option}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    "& .MuiTypography-root": { fontSize: "15px" },
                  }}
                />
              ))}
          </Box>
        </Box>
      </Box>
    );
  }
);

const Page3 = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const { authState, setAuthState } = useUser();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionStatus, setQuestionStatus] = useState({});
  const [sections, setSections] = useState([]);
  const [currentSectionName, setCurrentSectionName] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [timerColor, setTimerColor] = useState("inherit");
  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex] || null,
    [questions, currentQuestionIndex]
  );

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: "/api",
    });

    instance.interceptors.request.use(
      (config) => {
        if (authState?.accessToken) {
          config.headers.Authorization = authState.accessToken;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setAuthState(null);
          setError("Authentication expired. Please log in again.");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [authState?.accessToken, setAuthState]);

  const stripHTML = useCallback((html) => {
    if (!html) return "";
    return html
      .replace(/<img[^>]*>/gi, "")
      .replace(/<\/?([^>]+)>/g, "")
      .trim();
  }, []);

  const parseSections = useCallback((sectionsString) => {
    if (!sectionsString) return [];
    try {
      return sectionsString.split("@@@").map((sectionStr) => {
        const parts = sectionStr.split("#@#");
        return {
          name: parts[0],
          start: parseInt(parts[1], 10),
          end: parseInt(parts[2], 10),
        };
      });
    } catch (e) {
      console.error("Failed to parse sections string:", e);
      return [];
    }
  }, []);

  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  }, []);

  const timerValue = useMemo(
    () => formatTime(timeLeft),
    [timeLeft, formatTime]
  );

  const saveCurrentAnswer = useCallback(async () => {
    if (!currentQuestion) return;

    const response =
      answers[currentQuestion.id] !== undefined
        ? String(currentQuestion.options.indexOf(answers[currentQuestion.id]))
        : "";

    const payload = {
      data: currentQuestion.qid,
      response: response,
    };

    console.log("[Save Answer] Saving to backend:", payload);
    try {
      await api.post(`/testpaper/questions/${paperId}`, payload);
    } catch (err) {
      setError("Failed to save your progress. Please check your connection.");
      throw err;
    }
  }, [api, paperId, currentQuestion, answers]);

  const navigateToQuestion = useCallback(
    async (index) => {
      if (
        index < 0 ||
        index >= questions.length ||
        index === currentQuestionIndex
      )
        return;

      try {
        await saveCurrentAnswer();

        setQuestionStatus((prev) => {
          const newStatus = { ...prev };
          const currentStatus = prev[currentQuestion.id];
          if (
            currentStatus !== "marked" &&
            currentStatus !== "answered-marked"
          ) {
            newStatus[currentQuestion.id] = answers[currentQuestion.id]
              ? "answered"
              : "not-answered";
          }
          return newStatus;
        });

        setCurrentQuestionIndex(index);

        setQuestionStatus((prev) => {
          const newQuestionId = questions[index]?.id;
          if (newQuestionId && prev[newQuestionId] === "not-visited") {
            const newStatus = { ...prev };
            newStatus[newQuestionId] = "not-answered";
            return newStatus;
          }
          return prev;
        });
      } catch (error) {
        console.error("Navigation was stopped because save failed:", error);
      }
    },
    [
      saveCurrentAnswer,
      currentQuestion,
      currentQuestionIndex,
      questions,
      answers,
    ]
  );

  const saveAndNext = useCallback(async () => {
    if (currentQuestionIndex < questions.length - 1) {
      await navigateToQuestion(currentQuestionIndex + 1);
    } else {
      try {
        await saveCurrentAnswer();
        setQuestionStatus((prev) => {
          const newStatus = { ...prev };
          const currentStatus = prev[currentQuestion.id];
          if (
            currentStatus !== "marked" &&
            currentStatus !== "answered-marked"
          ) {
            newStatus[currentQuestion.id] = answers[currentQuestion.id]
              ? "answered"
              : "not-answered";
          }
          return newStatus;
        });
      } catch (error) {
        console.error("Failed to save the last question:", error);
      }
    }
  }, [
    navigateToQuestion,
    saveCurrentAnswer,
    currentQuestionIndex,
    questions.length,
    currentQuestion,
    answers,
  ]);

  const handleAnswerSelect = useCallback((question, optionIndex) => {
    if (!question) return;
    const selectedOptionText = question.options[optionIndex];

    setAnswers((prev) => ({ ...prev, [question.id]: selectedOptionText }));
    setQuestionStatus((prev) => ({
      ...prev,
      [question.id]:
        prev[question.id] === "marked" ||
        prev[question.id] === "answered-marked"
          ? "answered-marked"
          : "answered",
    }));
  }, []);

  const clearResponse = useCallback(async () => {
    if (!currentQuestion) return;

    const payload = {
      data: currentQuestion.qid,
      response: "",
    };

    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[currentQuestion.id];
      return newAnswers;
    });
    setQuestionStatus((prev) => ({
      ...prev,
      [currentQuestion.id]:
        prev[currentQuestion.id] === "answered-marked"
          ? "marked"
          : "not-answered",
    }));

    try {
      console.log(`[Clear Response] Clearing in backend:`, payload);
      await api.post(`/testpaper/questions/${paperId}`, payload);
    } catch (err) {
      setError("Failed to clear response. Please try again.");
    }
  }, [currentQuestion, api, paperId]);

  const markForReview = useCallback(() => {
    if (!currentQuestion) return;
    const questionId = currentQuestion.id;

    const response =
      answers[questionId] !== undefined
        ? String(currentQuestion.options.indexOf(answers[questionId]))
        : "";
    const payload = {
      data: currentQuestion.qid,
      response: response,
    };
    console.log("[Mark For Review] Saving to backend:", payload);

    api.post(`/testpaper/questions/${paperId}`, payload).catch(() => {
      setError("Failed to save answer (mark for review). Please try again.");
    });

    setQuestionStatus((prev) => {
      const newStatus = { ...prev };
      newStatus[questionId] = answers[questionId]
        ? "answered-marked"
        : "marked";
      return newStatus;
    });
  }, [currentQuestion, answers, api, paperId]);

  const markAndNext = useCallback(() => {
    markForReview();
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setQuestionStatus((prev) => {
        const newQuestionId = questions[nextIndex]?.id;
        if (newQuestionId && prev[newQuestionId] === "not-visited") {
          const newStatus = { ...prev };
          newStatus[newQuestionId] = "not-answered";
          return newStatus;
        }
        return prev;
      });
    }
  }, [markForReview, currentQuestionIndex, questions]);

  const handleSubmitTest = useCallback(() => setSubmitModalOpen(true), []);

  const confirmSubmit = useCallback(async () => {
    setSubmitModalOpen(false);
    setLoading(true);
    console.log("[Final Submission] Starting the process to submit the test.");

    try {
      const answeredOptionText = answers[currentQuestion.id];
      const optionIndex =
        answeredOptionText !== undefined
          ? currentQuestion.options.indexOf(answeredOptionText)
          : -1;

      const payload = {
        data: currentQuestion.qid,
        response: optionIndex !== -1 ? String(optionIndex) : "",
      };

      console.log(
        "[Final Submission] Submitting the last answer and finalizing the test.",
        payload
      );
      const submitEndpoint = `/testpaper/questions/${paperId}?isSubmit=1`;
      await api.post(submitEndpoint, payload);

      console.log("Final submission successful. Navigating to results page.");

      setIsTestCompleted(true);
      navigate(`/page4/`);
    } catch (e) {
      console.error("Submission failed:", e);
      setError(
        `Failed to submit test. Server says: ${
          e.response?.data?.message || e.message
        }`
      );
    } finally {
      setLoading(false);
    }
  }, [
    api,
    paperId,
    answers,
    currentQuestion,
    navigate,
    setIsTestCompleted,
    setError,
    setLoading,
  ]);

  const fetchAllData = useCallback(async () => {
    if (!authState?.accessToken) {
      setError("Authentication required. Please log in to take the test.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [testPaperRes, questionsRes] = await Promise.all([
        api.get(`/testpaper/${paperId}`),
        api.get(`/questions/${paperId}`),
      ]);

      const testPaperData = testPaperRes.data;
      const possibleData = questionsRes.data;

      if (testPaperData) {
        const parsedSections = testPaperData.sections
          ? parseSections(testPaperData.sections)
          : [
              {
                name: "All Questions",
                start: 1,
                end: testPaperData.questions || 0,
              },
            ];
        setSections(parsedSections);

        if (testPaperData.duration) {
          setTimeLeft(testPaperData.duration * 60);
        }
      }

      if (Array.isArray(possibleData)) {
        const fetchedQuestions = possibleData.map((q) => ({
          ...q,
          question: stripHTML(q.question),
          options: (q.options || [])
            .map((opt) => stripHTML(opt))
            .filter((opt) => opt && opt.trim() !== ""),
        }));

        setQuestions(fetchedQuestions);

        const initialStatus = {};
        fetchedQuestions.forEach((q) => {
          initialStatus[q.id] = "not-visited";
        });
        if (fetchedQuestions.length > 0) {
          initialStatus[fetchedQuestions[0].id] = "not-answered";
        }
        setQuestionStatus(initialStatus);
      }
    } catch (e) {
      const errorMessage =
        e.response?.data?.message || e.message || "Failed to fetch test data.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api, paperId, authState?.accessToken, stripHTML, parseSections]);

  const saveTimeoutRef = useRef(null);
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const popupRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isPaused && timeLeft > 0 && !loading && !isTestCompleted) {
      const timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev > 0 ? prev - 1 : 0;

          if (newTime <= 600 && timerColor !== "error.main") {
            setTimerColor("error.main");
          } else if (
            newTime <= 1200 &&
            newTime > 600 &&
            timerColor !== "warning.main"
          ) {
            setTimerColor("warning.main");
          } else if (newTime > 1200 && timerColor !== "inherit") {
            setTimerColor("inherit");
          }

          return newTime;
        });
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [timeLeft, isPaused, loading, isTestCompleted, timerColor]);

  useEffect(() => {
    if (
      timeLeft === 0 &&
      !loading &&
      questions.length > 0 &&
      !isTestCompleted
    ) {
      (async () => {
        await confirmSubmit();
        navigate(`/page4/`);
      })();
    }
  }, [
    timeLeft,
    loading,
    questions.length,
    isTestCompleted,
    confirmSubmit,
    navigate,
  ]);

  useEffect(() => {
    if (sections.length > 0) {
      const currentQuestionNumber = currentQuestionIndex + 1;
      const foundSection = sections.find(
        (section) =>
          currentQuestionNumber >= section.start &&
          currentQuestionNumber <= section.end
      );
      if (foundSection) {
        setCurrentSectionName(foundSection.name);
      }
    }
  }, [currentQuestionIndex, sections]);

  useEffect(() => {
    if (authState?.accessToken && paperId) {
      fetchAllData();
    }
  }, [authState?.accessToken, paperId, fetchAllData]);

  const handleSectionClick = useCallback(
    (startQuestionNumber) => {
      navigateToQuestion(startQuestionNumber - 1);
    },
    [navigateToQuestion]
  );

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  if (isTestCompleted) {
    return (
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <CompletionScreen paperId={paperId} navigate={navigate} />
        </ThemeProvider>
      </ErrorBoundary>
    );
  }
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <StyledContainer>
          <Header2
            sections={sections}
            currentSectionName={currentSectionName}
            onSectionClick={handleSectionClick}
            timeDisplay={timerValue}
            timerColor={timerColor}
            isPaused={isPaused}
            onPauseToggle={() => setIsPaused((prev) => !prev)}
            questions={questions}
            questionStatus={questionStatus}
            currentQuestionNumber={currentQuestionIndex + 1}
            onQuestionSelect={(qNum) => navigateToQuestion(qNum - 1)}
            authState={authState}
          />

          <MainContainer>
            <LeftPanel>
              <ScrollableContent>
                {!loading && !error && questions.length > 0 ? (
                  <QuestionContent
                    question={currentQuestion}
                    index={currentQuestionIndex}
                    answers={answers}
                    onAnswerSelect={handleAnswerSelect}
                  />
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      flexDirection: "column",
                      textAlign: "center",
                      color: "text.secondary",
                    }}
                  >
                    {loading && <CircularProgress size={40} />}
                    {!loading && error && (
                      <Alert severity="error" sx={{ mt: 2, width: "80%" }}>
                        {error}
                      </Alert>
                    )}
                    {!loading && !error && questions.length === 0 && (
                      <Typography variant="h6" sx={{ mt: 2 }}>
                        No questions are available for this test.
                      </Typography>
                    )}
                  </Box>
                )}
              </ScrollableContent>
            </LeftPanel>

            <RightSidebar open={sidebarOpen}>
              <UserProfile authState={authState} />
              <QuestionStatusLegend />
              <Box sx={{ flexGrow: 1, overflowY: "visible", p: 2 }}>
                <QuestionPalette
                  questions={questions}
                  currentQuestionIndex={currentQuestionIndex}
                  questionStatus={questionStatus}
                  navigateToQuestion={navigateToQuestion}
                />
              </Box>
              <SidebarButtons />
            </RightSidebar>
          </MainContainer>

          <BottomNav elevation={3}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexGrow: 1,
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                disabled={currentQuestionIndex === 0}
                onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
                sx={{ whiteSpace: "nowrap" }}
              >
                Previous
              </Button>

              <Button
                variant="outlined"
                onClick={clearResponse}
                disabled={!answers[currentQuestion?.id]}
                sx={{
                  display: { xs: "none", md: "flex" },
                  whiteSpace: "nowrap",
                }}
              >
                Clear Response
              </Button>

              <Button
                variant="outlined"
                onClick={markAndNext}
                sx={{
                  display: { xs: "none", md: "flex" },
                  whiteSpace: "nowrap",
                }}
              >
                Mark for Review
              </Button>

              <Box
                sx={{
                  position: "relative",
                  display: { xs: "block", md: "none" },
                }}
                ref={popupRef}
              >
                <Tooltip title="Quick actions">
                  <IconButton
                    color="primary"
                    onClick={toggleMenu}
                    sx={{
                      backgroundColor: "primary.main",
                      color: "common.white",
                      "&:hover": { backgroundColor: "primary.dark" },
                    }}
                  >
                    <Eject />
                  </IconButton>
                </Tooltip>
                {menuOpen && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "60px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "background.paper",
                      boxShadow: 3,
                      borderRadius: 1,
                      p: 2,
                      minWidth: "200px",
                      zIndex: 1001,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => {
                        handleSubmitTest();
                        setMenuOpen(false);
                      }}
                    >
                      Submit
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        markForReview();
                        setMenuOpen(false);
                      }}
                    >
                      Mark For Review
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        clearResponse();
                        setMenuOpen(false);
                      }}
                    >
                      Clear Response
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginLeft: "2px",
                justifyContent: { xs: "flex-end", md: "space-between" },
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={saveAndNext}
                sx={{
                  whiteSpace: "nowrap",
                  display: { xs: "flex", md: "flex" },
                }}
                endIcon={<ArrowForward />}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Save & Next
              </Button>

              <Button
                variant="contained"
                color="error"
                sx={{
                  display: { xs: "none", md: "block", marginRight: "20px" },
                  whiteSpace: "nowrap",
                }}
                onClick={handleSubmitTest}
              >
                Submit Test
              </Button>
            </Box>
          </BottomNav>

          <Modal
            open={submitModalOpen}
            onClose={() => setSubmitModalOpen(false)}
            aria-labelledby="submit-modal-title"
            aria-describedby="submit-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "90%", sm: 450 },
                bgcolor: "background.paper",
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                textAlign: "center",
                outline: "none",
              }}
            >
              <Typography id="submit-modal-title" variant="h6" component="h2">
                Confirm Submission
              </Typography>
              <Typography id="submit-modal-description" sx={{ mt: 2 }}>
                Are you sure you want to submit the test? You can also retry if
                you have time left.
              </Typography>
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setSubmitModalOpen(false)}
                  sx={{ minWidth: 100 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={confirmSubmit}
                  sx={{ minWidth: 100 }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Modal>
        </StyledContainer>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default Page3;