import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Box,
  styled,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  FormControlLabel,
  Checkbox,
  useTheme,
  useMediaQuery,
  CssBaseline,
  ThemeProvider,
  CircularProgress
} from "@mui/material";
import Header from "../components/header";

const Scroll = styled(Box)(({ theme }) => ({
  height: "auto",
  maxHeight: "180px",
  overflowY: "auto",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1],
  [theme.breakpoints.up("md")]: {
    maxHeight: "250px",
  },
  [theme.breakpoints.up("lg")]: {
    maxHeight: "300px",
  },
}));

const sourceText = {
  title: "Read the following instructions carefully.",
  instructions: [
    "The test contains 4 sections having 100 questions.",
    "Each question has 4 options out of which only one is correct.",
    "You have to finish the test in 60 minutes.",
    "You will be awarded 2 marks for each correct answer and 0.5 will be deducted for wrong answer.",
    "There is no negative marking for the questions that you have not attempted.",
    "You can write this test only once. Make sure that you complete the test before you submit the test and/or close the browser.",
  ],
  languageLabel: "Choose Your Default Language",
  languageNote: "Please note all questions will appear in your default language. This language can be changed for a particular question later on.",
  declaration: "Declaration:",
  declarationText: "I have read all the instructions carefully and have understood them. I agree not to cheat or use unfair means in this examination. I understand that using unfair means of any sort for my own or someone else's advantage will lead to my immediate disqualification. The decision of Testbook.com will be final in these matters and cannot be appealed.",
  previousButton: "Previous",
  readyButton: "I am ready to Begin",
  duration: "Duration: 60 Mins",
  maxMarks: "Maximum Marks: 200",
};

const Page2 = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("english");
  const [isChecked, setIsChecked] = useState(false);
  const [translatedText, setTranslatedText] = useState(sourceText);
  const [isTranslating, setIsTranslating] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const translateContent = async (text, targetLang) => {
    if (targetLang === "english") return text;
    
    try {
      const response = await axios.post(
        "https://libretranslate.de/translate",
        {
          q: text,
          source: "en",
          target: "hi",
          format: "text"
        },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data?.translatedText || text;
    } catch (error) {
      console.error("Translation failed:", error);
      return text;
    }
  };

  useEffect(() => {
    const updateTranslations = async () => {
      setIsTranslating(true);
      try {
        if (language === "hindi") {
          const newTranslations = {};
          const translationPromises = Object.entries(sourceText).map(
            async ([key, value]) => {
              if (Array.isArray(value)) {
                return Promise.all(value.map(item => translateContent(item, language)));
              }
              return translateContent(value, language);
            }
          );
          const results = await Promise.all(translationPromises);
          Object.keys(sourceText).forEach((key, index) => {
            newTranslations[key] = results[index];
          });
          setTranslatedText(newTranslations);
        } else {
          setTranslatedText(sourceText);
        }
      } finally {
        setIsTranslating(false);
      }
    };

    updateTranslations();
  }, [language]);

  const handleReadyClick = () => {
    if (!isChecked) {
      console.log("Please agree to the declaration to proceed.");
    } else {
      navigate('/page3/2841');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}>
        <Header />

        <Box component="main" sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4, lg: 6 },
          marginTop: '40px',
          paddingBottom: { xs: theme.spacing(4), md: theme.spacing(6) },
          paddingTop: { xs: theme.spacing(2), md: theme.spacing(4) },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '-20px'
        }}>
          <Box sx={{
            maxWidth: 'lg',
            width: '100%',
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
            borderRadius: theme.shape.borderRadius,
            p: { xs: 3, md: 5 },
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start', 
              mb: 3, 
              flexWrap: 'wrap', 
              gap: { xs: 1, md: 2 } 
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                gap: { xs: 0.5, sm: 101 } 
              }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {translatedText.duration}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {translatedText.maxMarks}
                </Typography>
              </Box>
            </Box>

            <Typography variant="h5" gutterBottom sx={{
              fontWeight: "bold",
              mt: { xs: 3, md: 4 },
              color: "text.primary",
              borderBottom: `1px solid ${theme.palette.divider}`,
              pb: 1,
            }}>
              {translatedText.title}
            </Typography>

            <Box component="ol" sx={{
              listStyleType: "decimal",
              pl: { xs: 2, md: 4 },
              color: "text.secondary",
              '& li': {
                mb: 1,
                fontSize: theme.typography.body1.fontSize,
                lineHeight: theme.typography.body1.lineHeight,
              }
            }}>
              {translatedText.instructions.map((item, index) => (
                <Typography component="li" key={index}>
                  {item}
                </Typography>
              ))}
            </Box>

            <Scroll sx={{ mt: { xs: 4, md: 6 } }}>
              <Typography variant="body1" sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}>
                {translatedText.languageLabel}
              </Typography>
              <FormControl fullWidth sx={{ maxWidth: { xs: "100%", sm: 300 }, mb: 2 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={isTranslating}
                >
                  <MenuItem value="english">English</MenuItem>
                  <MenuItem value="hindi">Hindi</MenuItem>
                </Select>
                {isTranslating && (
                  <CircularProgress size={24} sx={{ 
                    position: 'absolute', 
                    right: 40, 
                    top: '50%', 
                    transform: 'translateY(-50%)' 
                  }} />
                )}
              </FormControl>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {translatedText.languageNote}
              </Typography>
            </Scroll>

            <Box sx={{ mt: { xs: 4, md: 6 } }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}>
                {translatedText.declaration}
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    sx={{
                      alignSelf: "flex-start",
                      mt: 0.5,
                      "& .MuiSvgIcon-root": { fontSize: isMobile ? 24 : 28 },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.5 }}>
                    {translatedText.declarationText}
                  </Typography>
                }
                sx={{ alignItems: "flex-start", m: 0 }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{
          position: "sticky",
          bottom: 0,
          width: "99vw",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "background.paper",
          padding: 2,
          boxShadow: 3,
          zIndex: 1000,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            disabled={isTranslating}
            sx={{
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.divider,
              },
            }}
          >
            {translatedText.previousButton}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReadyClick}
            disabled={!isChecked || isTranslating}
          >
            {translatedText.readyButton}
            {isTranslating && (
              <CircularProgress size={24} sx={{ color: 'white', ml: 1 }} />
            )}
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Page2; 