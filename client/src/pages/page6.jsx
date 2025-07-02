import  { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Radio,
  FormControlLabel,
  Select,
  MenuItem,

  Grid,
 
  Avatar,
  Button,
  Collapse,
} from "@mui/material";
import {
  Menu as MenuIcon,
  
  Language,
  Report,
  Bolt,
  Timer,
  HourglassEmpty,
  Block,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header2 from "../components/header2";


const theme = createTheme({
  palette: {
    primary: {
      main: "#2196F3",
    },
    secondary: {
      main: "#007bff",
    },
    error: {
      main: "#f44336",
    },
    success: {
      main: "#4CAF50",
    },
    warning: {
      main: "#FF9800",
    },
    info: {
      main: "#9c27b0",
    },
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
  height: "calc(100vh - 70px)",
  marginBottom: "70px",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    height: "100vh",
    marginBottom: 0,
  },
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 3,
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 1,
  [theme.breakpoints.down("md")]: {
    flex: 1,
    width: "100%",
    borderRight: "none",
  },
}));

const ScrollableContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  padding: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    paddingBottom: "60px",
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
  },
}));

const RightSidebar = styled(Box)(({ theme, open }) => ({
  flex: 1,
  minWidth: "280px",
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  [theme.breakpoints.down("md")]: {
    position: "fixed",
    top: 0,
    right: open ? 0 : "-280px",
    width: "260px",
    height: "100%",
    zIndex: 102,
    boxShadow: theme.shadows[3],
    borderLeft: `1px solid ${theme.palette.divider}`,
    transition: "right 0.3s ease-in-out",
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
  justifyContent: "center",
  alignItems: "center",
  zIndex: 101,
  opacity: open ? 1 : 0,
  visibility: open ? "visible" : "hidden",
  transition: "opacity 0.3s ease-in-out",
}));

const QuestionNumBox = styled(Box)(({ theme, status, current }) => ({
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
    status === "correct"
      ? theme.palette.success.main
      : status === "marked"
      ? theme.palette.info.main
      : status === "unattempted"
      ? theme.palette.grey[300]
      : status === "marked-answered"
      ? theme.palette.warning.main
      : status === "incorrect"
      ? theme.palette.error.main
      : status === "partially-correct"
      ? theme.palette.primary.main
      : theme.palette.grey[200],
  color: [
    "correct",
    "marked",
    "marked-answered",
    "incorrect",
    "partially-correct",
  ].includes(status)
    ? theme.palette.common.white
    : theme.palette.text.primary,
  borderColor:
    status === "correct"
      ? theme.palette.success.main
      : status === "marked"
      ? theme.palette.info.main
      : status === "unattempted"
      ? theme.palette.grey[300]
      : status === "marked-answered"
      ? theme.palette.warning.main
      : status === "incorrect"
      ? theme.palette.error.main
      : status === "partially-correct"
      ? theme.palette.primary.main
      : theme.palette.divider,
  ...(current && {
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: `0 0 5px rgba(33, 150, 243, 0.5)`,
  }),
  [theme.breakpoints.down("md")]: {
    width: "35px",
    height: "35px",
    fontSize: "13px",
  },
}));

const IndicatorItem = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(1, 0.5),
  borderRadius: "4px",
  fontSize: "12px",
  color: theme.palette.text.secondary,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  minHeight: "60px",
  flex: "1 1 calc(50% - 4px)",
  maxWidth: "calc(50% - 4px)",
  textAlign: "center",
  fontWeight: "normal",
  "& .MuiSvgIcon-root": {
    color: theme.palette.text.secondary,
    fontSize: "18px",
  },
  [theme.breakpoints.down("md")]: {
    minHeight: "50px",
    padding: "6px 4px",
  },
}));

const SolutionBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  borderLeft: `4px solid ${theme.palette.success.main}`,
}));

const Page6 = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [showSolution, setShowSolution] = useState({});
  const [questionStatus, setQuestionStatus] = useState({
    1: "current",
    2: "correct",
    3: "marked",
    4: "marked-answered",
    5: "unattempted",
    6: "unattempted",
    7: "incorrect",
    8: "unattempted",
    9: "unattempted",
    10: "unattempted",
  });

  // Timer effect
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Format time
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle answer selection and automatically show solution
  const handleAnswerSelect = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));

    // **MODIFIED: Automatically show the solution on answer selection**
    setShowSolution((prev) => ({
      ...prev,
      [questionId]: true,
    }));

    if (
      !questionStatus[questionId] ||
      questionStatus[questionId] === "unattempted"
    ) {
      setQuestionStatus((prev) => ({
        ...prev,
        [questionId]: "correct",
      }));
    }
  };

  // Navigate to question
  const navigateToQuestion = (questionId) => {
    setCurrentQuestion(questionId);
    setQuestionStatus((prev) => ({
      ...prev,
      [questionId]: "current",
      [currentQuestion]:
        prev[currentQuestion] === "current"
          ? "unattempted"
          : prev[currentQuestion],
    }));
  };

  // Questions data with solutions
  const questions = [
    {
      id: 1,
      type: "MCQ",
      text: "A sum of money, at simple interest, doubles in 10 years. In how many years will it triple?",
      note: "Note: You can use the virtual keyboard for numerical input questions.",
      options: ["20 years", "15 years", "30 years", "25 years"],
      marks: { positive: 2, negative: 0.5 },
      solution:
        "If the money doubles in 10 years at simple interest, the interest rate is 10% per year. To triple, it would take an additional 10 years (total 20 years) because the interest is linear in simple interest calculations.",
    },
    {
      id: 2,
      type: "MCQ",
      text: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      solution:
        'The capital of France is Paris. It has been the capital since 508 AD and is known as the "City of Light".',
    },
    // ... (rest of the questions are the same)
    {
      id: 3,
      type: "MCQ",
      text: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      solution:
        "Mars is known as the Red Planet due to iron oxide (rust) on its surface giving it a reddish appearance.",
    },
    {
      id: 4,
      type: "MCQ",
      text: "What is the largest ocean on Earth?",
      options: [
        "Atlantic Ocean",
        "Indian Ocean",
        "Arctic Ocean",
        "Pacific Ocean",
      ],
      solution:
        "The Pacific Ocean is the largest and deepest ocean on Earth, covering about 30% of the Earth's surface.",
    },
    {
      id: 5,
      type: "MCQ",
      text: "Who painted the Mona Lisa?",
      options: [
        "Vincent van Gogh",
        "Leonardo da Vinci",
        "Pablo Picasso",
        "Claude Monet",
      ],
      solution:
        "Leonardo da Vinci painted the Mona Lisa between 1503 and 1506. It is now displayed at the Louvre Museum in Paris.",
    },
    {
      id: 6,
      type: "MCQ",
      text: "Which animal lays the largest eggs?",
      options: ["Hummingbird", "Ostrich", "Chicken", "Eagle"],
      solution:
        "The ostrich lays the largest eggs of any living land animal, with each egg weighing about 1.4 kg (3 pounds).",
    },
    {
      id: 7,
      type: "MCQ",
      text: "What is the chemical symbol for water?",
      options: ["O2", "H2O", "CO2", "NaCl"],
      solution:
        "The chemical symbol for water is H₂O, indicating two hydrogen atoms bonded to one oxygen atom.",
    },
    {
      id: 8,
      type: "MCQ",
      text: "How many continents are there in the world?",
      options: ["5", "6", "7", "8"],
      solution:
        "There are 7 continents: Africa, Antarctica, Asia, Europe, North America, Australia (Oceania), and South America.",
    },
    {
      id: 9,
      type: "MCQ",
      text: "What is the largest planet in our solar system?",
      options: ["Mars", "Jupiter", "Saturn", "Neptune"],
      solution:
        "Jupiter is the largest planet in our solar system, with a mass more than twice that of all other planets combined.",
    },
    {
      id: 10,
      type: "MCQ",
      text: "Which is the longest river in the world?",
      options: [
        "Amazon River",
        "Nile River",
        "Yangtze River",
        "Mississippi River",
      ],
      solution:
        "The Nile River is traditionally considered the longest river in the world at about 6,650 km (4,130 miles) in length.",
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer>
        <Header2 />
        <MainContainer>
          <LeftPanel>
            <ScrollableContent>
              {questions.map((question) => (
                <Box
                  key={question.id}
                  sx={{
                    mb: 5,
                    display: currentQuestion === question.id ? "block" : "none",
                  }}
                >
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
                    <Typography variant="h6" fontWeight={600}>
                      Question #{question.id}
                    </Typography>

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

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Language fontSize="small" color="action" />
                        <Select
                          size="small"
                          defaultValue="English"
                          sx={{ fontSize: "13px", minWidth: "100px" }}
                        >
                          <MenuItem value="English">English</MenuItem>
                          <MenuItem value="Hindi">Hindi</MenuItem>
                        </Select>
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
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      gutterBottom
                    >
                      Type: {question.type}
                    </Typography>

                    <Typography
                      variant="body1"
                      paragraph
                      sx={{ lineHeight: 1.8 }}
                    >
                      {question.text}
                    </Typography>

                    {question.note && (
                      <Box
                        sx={{
                          fontSize: "13px",
                          color: "text.secondary",
                          mt: 1,
                          p: 1,
                          borderLeft: `3px solid ${theme.palette.warning.main}`,
                          backgroundColor: "#fffde7",
                          borderRadius: "3px",
                        }}
                      >
                        {question.note}
                      </Box>
                    )}

                    <Box sx={{ mt: 2 }}>
                      {question.options.map((option, idx) => (
                        <FormControlLabel
                          key={idx}
                          control={
                            <Radio
                              checked={answers[question.id] === option}
                              onChange={() =>
                                handleAnswerSelect(question.id, option)
                              }
                              color="primary"
                              size="small"
                            />
                          }
                          label={option}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            mb: 1,
                            "& .MuiTypography-root": { fontSize: "15px" },
                          }}
                        />
                      ))}
                    </Box>

                    {/* Solution Section -- MODIFIED */}
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" gutterBottom>
                        Solution
                      </Typography>
                      {/* Button has been removed */}
                      <Collapse in={showSolution[question.id]}>
                        <SolutionBox sx={{ width: "400px" }}>
                          <Typography variant="body1">
                            {question.solution}
                          </Typography>
                        </SolutionBox>
                      </Collapse>
                    </Box>
                  </Box>
                </Box>
              ))}
            </ScrollableContent>
          </LeftPanel>

          <SidebarOverlay open={sidebarOpen} onClick={toggleSidebar} />
          <RightSidebar open={sidebarOpen}>
            <Box
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flexGrow: 1,
              }}
            >
              {/* Student Info */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  pb: 2,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: "primary.main",
                    mb: 1,
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  A
                </Avatar>
                <Typography variant="subtitle1" fontWeight={600}>
                  Abhishek Singh
                </Typography>
              </Box>

              {/* Question Status Legend */}
              <Box
                sx={{
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
                  { label: "Marked for review", color: "info.main" },
                  { label: "Not Visited", color: "grey.300" },
                  { label: "Answered & Marked", color: "warning.main" },
                  { label: "Not Answered", color: "error.main" },
                  { label: "Partially Answered", color: "primary.main" },
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

              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Question Palette
                </Typography>

                <Grid container spacing={1}>
                  {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
                    <Grid item xs={2} key={num} sx={{ minWidth: 0 }}>
                      <QuestionNumBox
                        status={questionStatus[num] || "unattempted"}
                        current={currentQuestion === num}
                        onClick={() => navigateToQuestion(num)}
                      >
                        {num}
                      </QuestionNumBox>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Speed Indicators */}
              <Box
                sx={{
                  borderTop: `1px solid ${theme.palette.divider}`,
                  pt: 2,
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  Speed Indicators
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <IndicatorItem active={false}>
                    <Bolt fontSize="small" />
                    <span>Fast</span>
                  </IndicatorItem>
                  <IndicatorItem active={true}>
                    <Timer fontSize="small" />
                    <span>Medium</span>
                  </IndicatorItem>
                  <IndicatorItem active={false}>
                    <HourglassEmpty fontSize="small" />
                    <span>Slow</span>
                  </IndicatorItem>
                  <IndicatorItem active={false}>
                    <Block fontSize="small" />
                    <span>Not Rated</span>
                  </IndicatorItem>
                </Box>
              </Box>
            </Box>
          </RightSidebar>
        </MainContainer>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default Page6;