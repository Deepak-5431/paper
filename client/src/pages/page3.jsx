import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import Header2 from "../components/header2";
import { Box,   Typography,   Button,   Radio,   RadioGroup,   Checkbox,   FormControlLabel,   Select,   MenuItem,   IconButton,   Grid,   Paper,   Modal,   Avatar,   Tooltip, CircularProgress,
  Alert, TextField,
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
import { MathJaxContext, MathJax } from "better-react-mathjax";



const mathJaxConfig = {
  loader: { 
    load: ['[tex]/html', '[tex]/ams'] 
  },
  tex: {
    packages: { '[+]': ['html', 'ams'] },
    inlineMath: [
      ['$', '$'],
      ['\\(', '\\)']
    ],
    displayMath: [
      ['$$', '$$'],
      ['\\[', '\\]']
    ],
    processEscapes: true
  },
  startup: {
    typeset: false
  }
};

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
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
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
  height: "auto",
  marginBottom: "70px",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    height: "auto",
    marginBottom: 0,
  },
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  width: "1198px",
  flexShrink: 0,
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  height: "auto",
  minHeight: "fit-content",
  overflow: "hidden",
  position: "relative",
  zIndex: 1,
  [theme.breakpoints.down("md")]: {
    flex: 1,
    width: "100%",
    borderRight: "none",
    height: "auto",
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

const SidebarOverlay = styled(Box)(({ open }) => ({
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

const num = (v, d = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

const processHTMLContent = (html) => {
  if (!html) return { text: "", image: null, htmlContent: "" };
  

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const firstImage = doc.querySelector("img");
  const imageSrc = firstImage ? firstImage.getAttribute("src") : null;
  const text = doc.body.textContent?.trim() || "";

  return {
    text,
    image: imageSrc,
    htmlContent: html, 
  };
};

const normalizeQuestion = (raw, idx, sections) => {
  const id =
    raw.id ?? raw.qid ?? raw._id ?? raw.questionId ?? raw.uuid ?? String(idx);

  const {
    text: questionText,
    image: questionImage,
    htmlContent: questionHtml,
  } = processHTMLContent(raw.question ?? raw.q ?? raw.text ?? "");

  const processedOptions = (raw.options ?? raw.choices ?? raw.opts ?? []).map(
    (optionHtml, index) => {
      const {
        text: optionText,
        image: optionImage,
        htmlContent: optionFullHtml,
      } = processHTMLContent(optionHtml);
      return {
        text: optionText,
        image: optionImage,
        html: optionFullHtml, 
        originalIndex: index,
        isEmpty: !optionText && !optionImage,
      };
    }
  );

  const m = raw.marks ?? {};
  const marks = {
    positive: num(
      m.positive ?? m.pos ?? raw.positiveMarks ?? raw.mark ?? raw.marksPositive,
      1
    ),
    negative: num(
      m.negative ??
        m.neg ??
        raw.negativeMarks ??
        raw.negMark ??
        raw.marksNegative,
      0.25
    ),
  };

  const t = String(
    raw.type ?? raw.questionType ?? raw.answerType ?? ""
  ).toLowerCase();

  const allowMultiple =
    raw.allowMultiple === true ||
    /multiple|multi|checkbox/.test(t) ||
    (Array.isArray(raw.correctAnswer) && raw.correctAnswer.length > 1);

  const isText =
    /fitb|fib|fill|blank|text|input|typing/.test(t) ||
    processedOptions.every((opt) => opt.isEmpty);

  let kind = "single";
  if (isText) kind = "text";
  else if (allowMultiple) kind = "multiple";

  const questionNumber = idx + 1;
  const sec =
    sections?.find((s) => questionNumber >= s.start && questionNumber <= s.end)
      ?.name ?? "General";

  return {
    ...raw,
    id,
    qid: raw.qid ?? id,
    questionText,
    questionImage,
    questionHtml,
    processedOptions,
    marks,
    kind,
    section: sec,
    __idx: idx,
  };
};

const parseSections = (sectionsString, totalQuestions = 0) => {
  if (!sectionsString)
    return [{ name: "All Questions", start: 1, end: totalQuestions || 0 }];
  try {
    return sectionsString.split("@@@").map((sectionStr) => {
      const [name, s, e] = sectionStr.split("#@#");
      return {
        name: name || "Section",
        start: parseInt(s, 10) || 1,
        end: parseInt(e, 10) || totalQuestions || 0,
      };
    });
  } catch (error){
    console.error("Failed to parse sections:", error)
  }
};

const buildResponsePayload = (q, answerValue) => {
  let response = "";
  if (q.kind === "single") {
    if (
      answerValue !== undefined &&
      answerValue !== null &&
      String(answerValue) !== ""
    ) {
      response = String(answerValue);
    }
  } else if (q.kind === "multiple") {
    if (Array.isArray(answerValue) && answerValue.length > 0) {
      response = [
        ...new Set(answerValue.map((i) => Number(i)).filter(Number.isInteger)),
      ]
        .sort((a, b) => a - b)
        .join(",");
    }
  } else if (q.kind === "text") {
    response = (answerValue ?? "").toString().trim();
  }
  return { data: q.qid, response };
};

const MemoizedQuestionNumBox = React.memo(
  ({ current, status, onClick, children }) => (
    <QuestionNumBox $current={current} status={status} onClick={onClick}>
      {children}
    </QuestionNumBox>
  )
);

const QuestionPalette = React.memo(
  ({ questions, currentQuestionIndex, questionStatus, navigateToQuestion }) => (
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
  )
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
      sx={{ width: 60, height: 60, bgcolor: "primary.main" }}
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

const SidebarButtons = React.memo(({ navigate, paperId }) => (
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
      onClick={() => navigate(`/page2/${paperId}`)}
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


const MathContent = React.memo(({ htmlContent }) => {
  if (!htmlContent) return null;

  
  const convertApiMathToLatex = (apiString) => {
    
    let cleanStr = apiString.replace(/`/g, "").replace(/<br\s*\/?>/gi, "").trim();

    
    if (!cleanStr.includes('/') && !cleanStr.includes('sqrt')) {
        return cleanStr; 
    }
    

    let latexStr = cleanStr.replace(/(\d*)sqrt\((\d+)\)/g, (match, coeff, content) => {
        const coefficient = coeff ? coeff.trim() : '';
        return `${coefficient}\\sqrt{${content}}`;
    });

    
    const parts = latexStr.split('/');
    if (parts.length === 2) {
        let numerator = parts[0].trim();
        let denominator = parts[1].trim();

        
        if (numerator.startsWith('(') && numerator.endsWith(')')) {
            numerator = numerator.slice(1, -1);
        }
        if (denominator.startsWith('(') && denominator.endsWith(')')) {
            denominator = denominator.slice(1, -1);
        }

        latexStr = `\\frac{${numerator}}{${denominator}}`;
    }

    return latexStr;
  };
  
  const latexString = convertApiMathToLatex(htmlContent);


  const finalContent = latexString.includes('\\') ? `$${latexString}$` : latexString;
  
  return (
      <MathJax dynamic>
        <div
          style={{ lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: finalContent }}
        />
      </MathJax>
  );
});

const QuestionContent = React.memo(
  ({
    question,
    index,
    answers,
    onSingleSelect,
    onMultiToggle,
    onTextChange,
  }) => {
    if (!question) return null;

    const selectedSingleIndex =
      answers[question.id] !== undefined ? Number(answers[question.id]) : null;

    const selectedMulti = Array.isArray(answers[question.id])
      ? answers[question.id]
      : [];
    const textValue =
      typeof answers[question.id] === "string" ? answers[question.id] : "";

    const getImageUrl = (relativePath) => {
      if (!relativePath) return "";
      if (relativePath.startsWith("http") || relativePath.startsWith("data:")) {
        return relativePath;
      }
      
      return new URL(relativePath, import.meta.env.VITE_API_BASE_URL).href;
    };

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
              Question - {index + 1 } 
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
          <Box sx={{ typography: "body1" }}>
            
            <MathContent htmlContent={question.questionHtml} />
            {question.questionImage && (
              <Box sx={{ my: 2 }}>
                <img
                  src={getImageUrl(question.questionImage)}
                  alt="Question illustration"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: "4px",
                  }}
                />
              </Box>
            )}
          </Box>

          {question.kind === "single" && (
            <RadioGroup
              sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}
              value={
                selectedSingleIndex !== null
                  ? String(selectedSingleIndex)
                  : ""
              }
              onChange={(e) =>
                onSingleSelect(question, Number(e.target.value))
              }
            >
              {question.processedOptions.map((opt) =>
                !opt.isEmpty ? (
                  <FormControlLabel
                    key={opt.originalIndex}
                    value={String(opt.originalIndex)}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, width: '100%' }}>
                        <Typography component="span" fontWeight="bold" sx={{ pt: '2px' }}>
                          ({String.fromCharCode(65 + opt.originalIndex)})
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
                          
                          <MathContent htmlContent={opt.html} />
                          {opt.image && (
                            <img
                              src={getImageUrl(opt.image)}
                              alt={`Option ${opt.originalIndex + 1}`}
                              style={{
                                maxWidth: 200,
                                maxHeight: 150,
                                borderRadius: 4,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                    sx={{
                      alignItems: "flex-start",
                      mb: 1,
                      width: "100%",
                      "& .MuiFormControlLabel-label": { mt: 0.5 },
                    }}
                  />
                ) : null
              )}
            </RadioGroup>
          )}

          
          {question.kind === "multiple" && (
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              {question.processedOptions.map((opt) =>
                !opt.isEmpty ? (
                  <FormControlLabel
                    key={opt.originalIndex}
                    control={
                      <Checkbox
                        checked={selectedMulti.includes(opt.originalIndex)}
                        onChange={() =>
                          onMultiToggle(question, opt.originalIndex)
                        }
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, width: '100%' }}>
                        <Typography component="span" fontWeight="bold" sx={{ pt: '2px' }}>
                          ({String.fromCharCode(65 + opt.originalIndex)})
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
                          <MathContent htmlContent={opt.html} />
                          {opt.image && (
                            <img
                              src={getImageUrl(opt.image)}
                              alt={`Option ${opt.originalIndex + 1}`}
                              style={{
                                maxWidth: 200,
                                maxHeight: 150,
                                borderRadius: 4,
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                    sx={{
                      alignItems: "flex-start",
                      mb: 1,
                      width: "100%",
                      "& .MuiFormControlLabel-label": { mt: 0.5 },
                    }}
                  />
                ) : null
              )}
            </Box>
          )}
            {question.kind === "text" && (
            <Box sx={{ mt: 1, maxWidth: 640 }}>
              <TextField
                fullWidth
                multiline
                minRows={1}
                maxRows={6}
                placeholder="Type your answer here…"
                value={textValue}
                onChange={(e) => onTextChange(question, e.target.value)}
              />
            </Box>
          )}
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
  const [questionStatus, setQuestionStatus] = useState({});
  const [sections, setSections] = useState([]);
  const [currentSectionName, setCurrentSectionName] = useState("");

  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [timerColor, setTimerColor] = useState("inherit");
  const [error, setError] = useState(null);

  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex] || null,
    [questions, currentQuestionIndex]
  );

  const api = useMemo(() => {
   
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 15000
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

  
  const saveLocal = useCallback((key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, []);

  const saveAnswersLocally = useCallback(() => {
    const enhancedAnswers = { ...answers };
    questions.forEach((question) => {
      const answerId = question.id;
      const answerQid = question.qid;
      const userAnswer = answers[answerId];

      if (userAnswer !== undefined) {
        enhancedAnswers[answerId] = userAnswer;
        if (answerQid && answerQid !== answerId) {
          enhancedAnswers[answerQid] = userAnswer;
        }
      }
    });

    saveLocal("userAnswers", enhancedAnswers);
    saveLocal("questionStatus", questionStatus);
    saveLocal("questions", questions);
    if (paperId) localStorage.setItem("currentPaperId", String(paperId));
  }, [answers, questionStatus, questions, paperId, saveLocal]);

  useEffect(() => {
    const t = setTimeout(saveAnswersLocally, 250);
    return () => clearTimeout(t);
  }, [answers, questionStatus, questions, saveAnswersLocally]);

  const fetchAllData = useCallback(async () => {
    if (!authState?.accessToken) {
      setError("Authentication required. Please log in to take the test.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
     
      const questionsRes = await api.get(`/api/questions/${paperId}`);
      const testPaperRes = await api.get(`/api/testpaper/${paperId}`);

      const fetchedQuestionsData = Array.isArray(questionsRes.data)
        ? questionsRes.data
        : [];
      const testPaperData = testPaperRes.data || {};

      const parsedSections = parseSections(
        testPaperData.sections,
        fetchedQuestionsData.length
      );
      const normalized = fetchedQuestionsData.map((q, idx) =>
        normalizeQuestion(q, idx, parsedSections)
      );

      setSections(parsedSections);
      if (testPaperData.duration) {
        setTimeLeft(num(testPaperData.duration, 0) * 60);
      }
      
      setQuestions(normalized);

      const cachedPaperId = localStorage.getItem("currentPaperId");
      if (String(cachedPaperId) === String(paperId)) {
        console.log(
          "Resuming same paper. Attempting to load state from localStorage."
        );
        const cachedAns = localStorage.getItem("userAnswers");
        const cachedStatus = localStorage.getItem("questionStatus");

        if (cachedAns && cachedStatus) {
          setAnswers(JSON.parse(cachedAns));
          setQuestionStatus(JSON.parse(cachedStatus));
          return;
        }
      }

      console.log("Starting a new test session.");
      const initialStatus = {};
      normalized.forEach((q) => {
        initialStatus[q.id] = "not-visited";
      });
      if (normalized.length > 0) {
        initialStatus[normalized[0].id] = "not-answered";
      }
      setAnswers({});
      setQuestionStatus(initialStatus);
    } catch (e) {
      console.error("Failed to fetch test data:", e);
      setError("Could not load the test. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [paperId, authState, api]); 
  
  const saveCurrentAnswer = useCallback(async () => {
    const q = currentQuestion;
    if (!q) return;
    const payload = buildResponsePayload(q, answers[q.id]);
    try {
      
      await api.post(`/api/testpaper/questions/${paperId}`, payload);
    } catch (err) {
      console.error("Failed to save current answer:", err);
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
          const curId = currentQuestion?.id;
          if (curId) {
            const hasAns =
              answers[curId] !== undefined &&
              answers[curId] !== null &&
              String(answers[curId]) !== "";
            const isMulti =
              Array.isArray(answers[curId]) && answers[curId].length > 0;
            const answered = isMulti || hasAns;
            const wasMarked =
              prev[curId] === "marked" || prev[curId] === "answered-marked";

            newStatus[curId] = answered
              ? wasMarked
                ? "answered-marked"
                : "answered"
              : "not-answered";
          }
          return newStatus;
        });

        setCurrentQuestionIndex(index);

        setQuestionStatus((prev) => {
          const nextId = questions[index]?.id;
          if (nextId && prev[nextId] === "not-visited") {
            const copy = { ...prev };
            copy[nextId] = "not-answered";
            return copy;
          }
          return prev;
        });
      } catch (e) {
        console.error("Error navigating to question:", e);
      }
    },
    [
      answers,
      currentQuestion,
      currentQuestionIndex,
      questions,
      saveCurrentAnswer,
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
          const curId = currentQuestion?.id;
          if (curId) {
            const hasAns =
              answers[curId] !== undefined &&
              answers[curId] !== null &&
              String(answers[curId]) !== "";
            const isMulti =
              Array.isArray(answers[curId]) && answers[curId].length > 0;
            const wasMarked =
              prev[curId] === "marked" || prev[curId] === "answered-marked";
            newStatus[curId] =
              isMulti || hasAns
                ? wasMarked
                  ? "answered-marked"
                  : "answered"
                : "not-answered";
          }
          return newStatus;
        });
      } catch (e) {
        console.error("Error on final save:", e);
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

  const onSingleSelect = useCallback((question, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [question.id]: Number(optionIndex) }));
    setQuestionStatus((prev) => ({
      ...prev,
      [question.id]:
        prev[question.id] === "marked" ||
        prev[question.id] === "answered-marked"
          ? "answered-marked"
          : "answered",
    }));
  }, []);

  const onMultiToggle = useCallback(
    (question, optionIndex) => {
      const currentSelection = Array.isArray(answers[question.id])
        ? [...answers[question.id]]
        : [];
      const optionIdx = currentSelection.indexOf(optionIndex);
      if (optionIdx > -1) {
        currentSelection.splice(optionIdx, 1);
      } else {
        currentSelection.push(optionIndex);
      }
      const nextSelection = currentSelection;

      const currentStatus = questionStatus[question.id];
      const isMarked =
        currentStatus === "marked" || currentStatus === "answered-marked";

      let nextStatus;
      if (nextSelection.length > 0) {
        nextStatus = isMarked ? "answered-marked" : "answered";
      } else {
        nextStatus = isMarked ? "marked" : "not-answered";
      }

      setAnswers((prev) => ({ ...prev, [question.id]: nextSelection }));
      setQuestionStatus((prev) => ({ ...prev, [question.id]: nextStatus }));
    },
    [answers, questionStatus]
  );

  const onTextChange = useCallback(
    (question, value) => {
      const hasValue = value && value.trim() !== "";
      const currentStatus = questionStatus[question.id];
      const isMarked =
        currentStatus === "marked" || currentStatus === "answered-marked";

      let nextStatus;
      if (hasValue) {
        nextStatus = isMarked ? "answered-marked" : "answered";
      } else {
        nextStatus = isMarked ? "marked" : "not-answered";
      }

      setAnswers((prev) => ({ ...prev, [question.id]: value }));
      setQuestionStatus((prev) => ({ ...prev, [question.id]: nextStatus }));
    },
    [questionStatus]
  );

  const clearResponse = useCallback(async () => {
    const q = currentQuestion;
    if (!q) return;

    setAnswers((prev) => {
      const clone = { ...prev };
      delete clone[q.id];
      return clone;
    });
    setQuestionStatus((prev) => ({
      ...prev,
      [q.id]: prev[q.id] === "answered-marked" ? "marked" : "not-answered",
    }));

    try {
      const payload = buildResponsePayload(q, "");
      await api.post(`/api/testpaper/questions/${paperId}`, payload);
    } catch (err) {
      console.error("Failed to clear response on server:", err);
    }
  }, [api, paperId, currentQuestion]);

  const markForReview = useCallback(() => {
    const q = currentQuestion;
    if (!q) return;
    const payload = buildResponsePayload(q, answers[q.id]);
    api.post(`/api/testpaper/questions/${paperId}`, payload).catch(() => {
      setError("Failed to save answer (mark for review). Please try again.");
    });
    setQuestionStatus((prev) => {
      const has = answers[q.id];
      const answered =
        (Array.isArray(has) && has.length > 0) ||
        (has !== undefined && has !== null && String(has) !== "");
      return { ...prev, [q.id]: answered ? "answered-marked" : "marked" };
    });
  }, [api, paperId, currentQuestion, answers]);

  const markAndNext = useCallback(() => {
    markForReview();
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setQuestionStatus((prev) => {
        const nextId = questions[nextIndex]?.id;
        if (nextId && prev[nextId] === "not-visited") {
          const copy = { ...prev };
          copy[nextId] = "not-answered";
          return copy;
        }
        return prev;
      });
    }
  }, [markForReview, currentQuestionIndex, questions]);

  const handleSubmitTest = useCallback(() => setSubmitModalOpen(true), []);

  const confirmSubmit = useCallback(async () => {
    setSubmitModalOpen(false);
    setLoading(true);

    try {
      const lastQuestion = currentQuestion;
      const lastResponse = answers[lastQuestion.id] || "";

      await api.post(`/api/submit/${paperId}`, {
        data: lastQuestion.qid,
        response: String(lastResponse),
      });

      const submittedPapersRaw = localStorage.getItem("submittedPapers");
      const submittedPapers = submittedPapersRaw
        ? JSON.parse(submittedPapersRaw)
        : [];
      if (!submittedPapers.includes(paperId)) {
        submittedPapers.push(paperId);
      }
      localStorage.setItem("submittedPapers", JSON.stringify(submittedPapers));

      setIsTestCompleted(true);
      navigate(`/result/${paperId}`, {
        replace: true,
        state: { userAnswers: answers },
      });
    } catch (e) {
      console.error("Failed to submit test:", e);
      setError("An error occurred while submitting the test. Please try again.");
      setLoading(false);
    }
  }, [api, paperId, answers, navigate, currentQuestion]);

  useEffect(() => {
    if (!isPaused && timeLeft > 0 && !loading && !isTestCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const v = prev > 0 ? prev - 1 : 0;
          if (v <= 600) setTimerColor("error.main");
          else if (v <= 1200) setTimerColor("warning.main");
          else setTimerColor("inherit");
          return v;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, isPaused, loading, isTestCompleted]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };
  const timerValue = useMemo(() => formatTime(timeLeft), [timeLeft]);

  useEffect(() => {
    if (
      timeLeft === 0 &&
      !loading &&
      questions.length > 0 &&
      !isTestCompleted
    ) {
      (async () => {
        await confirmSubmit();
      })();
    }
  }, [
    timeLeft,
    loading,
    questions.length,
    isTestCompleted,
    confirmSubmit,
  ]);

  useEffect(() => {
    if (sections.length > 0) {
      const n = currentQuestionIndex + 1;
      const sec = sections.find((s) => n >= s.start && n <= s.end);
      if (sec) setCurrentSectionName(sec.name);
    }
  }, [currentQuestionIndex, sections]);

  useEffect(() => {
    if (authState?.accessToken && paperId) {
      fetchAllData();
    }
  }, [authState?.accessToken, paperId, fetchAllData]);

  const popupRef = useRef();
  useEffect(() => {
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSectionClick = useCallback(
    (startQuestionNumber) => {
      navigateToQuestion(startQuestionNumber - 1);
    },
    [navigateToQuestion]
  );

  const toggleSidebar = useCallback(() => setSidebarOpen((p) => !p), []);
  const toggleMenu = useCallback(() => setMenuOpen((p) => !p), []);
  

  if (isTestCompleted) {
    return (
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <CompletionScreen navigate={navigate} />
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
            onSidebarToggle={toggleSidebar}
            paperId={paperId}
          />

          <MainContainer>
            <LeftPanel>
              <ScrollableContent>
                {!loading && !error && questions.length > 0 ? (
                  <QuestionContent
                    question={currentQuestion}
                    index={currentQuestionIndex}
                    answers={answers}
                    onSingleSelect={onSingleSelect}
                    onMultiToggle={onMultiToggle}
                    onTextChange={onTextChange}
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
              <SidebarButtons navigate={navigate} paperId={paperId} />
            </RightSidebar>
            <SidebarOverlay open={sidebarOpen} onClick={toggleSidebar} />
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
                disabled={
                  !(
                    answers[currentQuestion?.id] !== undefined &&
                    answers[currentQuestion?.id] !== null &&
                    ((Array.isArray(answers[currentQuestion?.id]) &&
                      answers[currentQuestion?.id].length > 0) ||
                      (typeof answers[currentQuestion?.id] === "string" &&
                        String(answers[currentQuestion?.id]).trim() !== "") ||
                      typeof answers[currentQuestion?.id] === "number")
                  )
                }
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
                      Submit Test
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
                      disabled={
                        !(
                          answers[currentQuestion?.id] !== undefined &&
                          answers[currentQuestion?.id] !== null &&
                          ((Array.isArray(answers[currentQuestion?.id]) &&
                            answers[currentQuestion?.id].length > 0) ||
                            (typeof answers[currentQuestion?.id] ===
                              "string" &&
                              String(answers[currentQuestion?.id]).trim() !==
                                "") ||
                            typeof answers[currentQuestion?.id] === "number")
                        )
                      }
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
                gap: 2,
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={saveAndNext}
                endIcon={<ArrowForward />}
                sx={{ marginRight: 6 }}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Save & Next
              </Button>

              <Button
                variant="contained"
                color="error"
                sx={{ display: { xs: "none", md: "block", marginRight: 6 } }}
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
              }}
            >
              <Typography id="submit-modal-title" variant="h6">
                Confirm Submission
              </Typography>
              <Typography sx={{ mt: 2 }}>
                Are you sure you want to submit? You cannot change your answers
                after this.
              </Typography>
              <Box
                sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setSubmitModalOpen(false)}
                >
                  Go Back
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={confirmSubmit}
                >
                  Confirm & Submit
                </Button>
              </Box>
            </Box>
          </Modal>
        </StyledContainer>
      </ThemeProvider>
    </ErrorBoundary>
  );
};


const Page3WithMathJax = () => (
  <MathJaxContext
    version={3}
    config={mathJaxConfig}
    onError={(error) => console.error('MathJax error:', error)}
    onLoad={() => console.log('MathJax loaded successfully')}
  >
    <Page3 />
  </MathJaxContext>
);

export default Page3WithMathJax;