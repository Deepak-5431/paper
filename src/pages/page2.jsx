import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Typography, Box, styled, FormControl, InputLabel, MenuItem,
  Select, Button, FormControlLabel, Checkbox, useTheme,
  CssBaseline, ThemeProvider, CircularProgress, Alert
} from "@mui/material";
import Header from '../components/header'
import { useUser } from "../context/UserContext";

const Scroll = styled(Box)(({ theme }) => ({
  height: "auto",
  maxHeight: "180px",
  overflowY: "auto",
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1],
}));


const generateInstructions = (details) => {
  
  const parseSections = (sectionsString) => {
    if (!sectionsString || typeof sectionsString !== 'string' || sectionsString.trim() === '') {
      return [];
    }
    
    return sectionsString.split('@@@').map(s => {
      const parts = s.split('#@#');
      return { name: parts[0], start: parseInt(parts[1]), end: parseInt(parts[2]) };
    });
  };

  const sections = parseSections(details.sections);
  const totalQuestions = details.questions || 'several';

  const dynamicInstructions = [];

  
  if (sections.length > 0) {
    const sectionSummary = sections.map(s => `${s.name} (${s.end - s.start + 1} questions)`).join(', ');
    dynamicInstructions.push(`This test has ${totalQuestions} questions `);
  } else {
    dynamicInstructions.push(`This test contains 1 section and a total of ${totalQuestions} questions.`);
  }

  
  dynamicInstructions.push(`The total duration for the test is ${details.duration || 'N/A'} minutes.`);

  
  dynamicInstructions.push(`Each question has multiple options, out of which only one is correct.`);
  dynamicInstructions.push(`Marks for correct answers and penalties for wrong answers (if any) are indicated for each question.`);
  
  
  dynamicInstructions.push("The clock has been set at the server. The countdown timer at the top of the screen will display the remaining time. The test will submit automatically when the time reaches zero.");

 
  dynamicInstructions.push("To navigate to a question, click on its number in the Question Palette. To save your answer, you must click the 'Save & Next' button.");
  dynamicInstructions.push("You can mark a question for review to look at it again later. Answers to questions that are answered and marked for review will be considered for evaluation.");

  
  const stripHtml = (html) => html ? html.replace(/<\/?[^>]+(>|$)/g, "") : "";
  const additionalInstructions = stripHtml(details.details);
  if (additionalInstructions) {
    dynamicInstructions.push(additionalInstructions);
  }

  
  return {
    title: `Instructions for ${details.name}`,
    instructions: dynamicInstructions,
    parsedSections: sections,
    languageLabel: "Choose Your Default Language",
    languageNote: "Please note all questions will appear in your default language. This language can be changed for a particular question later on.",
    declaration: "Declaration:",
    declarationText: "I have read all the instructions carefully and have understood them. I agree not to cheat or use unfair means in this examination...",
    previousButton: "Previous",
    readyButton: "I am ready to Begin",
    duration: `Duration: ${details.duration || 'N/A'} Mins`,
    maxMarks: `Maximum Marks: ${details.marks || 'N/A'}`,
  };
};


const Page2 = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const { authState } = useUser();
  const theme = useTheme();

  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sourceInstructions, setSourceInstructions] = useState(null);
  const [displayText, setDisplayText] = useState(null);
  const [language, setLanguage] = useState("english");
  const [isChecked, setIsChecked] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  
  useEffect(() => {
    const fetchTestDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = authState.accessToken;
        const response = await axios.get(`/api/testpaper/${paperId}`, {
          headers: { 'Authorization': token }
        });
        
        const details = response.data;
        setTestDetails(details);

        const generated = generateInstructions(details);
        setSourceInstructions(generated);
        setDisplayText(generated);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load test instructions.");
      } finally {
        setLoading(false);
      }
    };

    if (authState && authState.accessToken && paperId) {
      fetchTestDetails();
    } else if (authState === null) {
      setError("You must be logged in to view instructions.");
      setLoading(false);
    }
  }, [paperId, authState]);

  
  useEffect(() => {
    const translateContent = async (text) => {
      if (language === 'english' || !text) return text;
      try {
        const response = await axios.post("https://libretranslate.de/translate", {
          q: text, source: "en", target: "hi", format: "text"
        }, { headers: { "Content-Type": "application/json" } });
        return response.data?.translatedText || text;
      } catch (error) {
        console.error("Translation failed:", error);
        return text;
      }
    };
    
    const updateTranslations = async () => {
      if (!sourceInstructions) return;
      if (language === "english") {
        setDisplayText(sourceInstructions);
        return;
      }

      setIsTranslating(true);
      try {
        const translated = { ...sourceInstructions };
        for (const key in translated) {
          const value = translated[key];
          if (Array.isArray(value)) {
            translated[key] = await Promise.all(value.map(item => translateContent(item)));
          } else if (typeof value === 'string') {
            translated[key] = await translateContent(value);
          }
        }
        setDisplayText(translated);
      } finally {
        setIsTranslating(false);
      }
    };
    
    updateTranslations();
  }, [language, sourceInstructions]);

  const handleReadyClick = () => {
    if (isChecked) {
      navigate(`/page3/${paperId}`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!displayText) {
    return null; 
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
        <Header />
        
        
        <Box component="main" sx={{
            flexGrow: 1,
            p: { xs: 2, md: 3 },
            mt: '64px', 
            display: 'flex',
            flexDirection: 'column',
        }}>
          <Box sx={{
            width: '100%',
            bgcolor: 'background.paper',
            boxShadow: 2,
            borderRadius: 1,
            p: { xs: 2, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="body2" color="text.secondary">{displayText.duration}</Typography>
              <Typography variant="body2" color="text.secondary">{displayText.maxMarks}</Typography>
            </Box>

            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", borderBottom: `1px solid ${theme.palette.divider}`, pb: 1 }}>
              {displayText.title}
            </Typography>


            <Box component="ol" sx={{ listStyleType: "decimal", pl: { xs: 2, md: 4 }, color: "text.secondary", '& li': { mb: 1.5 } }}>
              {displayText.instructions.map((item, index) => (
                index === 0 ? (
                  <React.Fragment key={index}>
                    <Typography component="li">{item}</Typography>
                    {Array.isArray(displayText.parsedSections) && displayText.parsedSections.length > 0 && (
                      <Box sx={{ mt: 1, mb: 1 }}>
                        {displayText.parsedSections.map((section, idx) => (
                          <Typography key={idx} variant="body1" sx={{ mb: 1, pl: 2,  }}>
                            {section.name}: Question {section.start} to question {section.end}. All questions are mandatory. No negative marking.
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </React.Fragment>
                ) : (
                  <Typography component="li" key={index}>{item}</Typography>
                )
              ))}
            </Box>

 <Box sx={{ 
              mt: 3,
              backgroundColor: theme.palette.background.default,
              padding: theme.spacing(3),
              borderRadius: theme.shape.borderRadius,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[1],
            }}>
              <Typography variant="body1" sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}>
                {displayText.languageLabel}
              </Typography>
              <FormControl fullWidth sx={{ maxWidth: { sm: 300 }, mb: 2 }}>
                <InputLabel>Language</InputLabel>
                <Select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)} 
                  disabled={isTranslating}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 'none' 
                      }
                    }
                  }}
                >
                  <MenuItem value="english">English</MenuItem>
                  <MenuItem value="hindi">Hindi</MenuItem>
                </Select>
                {isTranslating && <CircularProgress size={24} sx={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)' }} />}
              </FormControl>
              <Typography variant="body2" color="text.secondary">{displayText.languageNote}</Typography>
            </Box>


            <Box sx={{ mt: 4, flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}>
                {displayText.declaration}
              </Typography>
              <FormControlLabel
                control={<Checkbox checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />}
                label={<Typography variant="body2" color="text.secondary">{displayText.declarationText}</Typography>}
                sx={{ alignItems: "flex-start", m: 0 }}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ 
            position: "sticky", 
            bottom: 0, 
            width: "99vw",
            display: "flex", 
            justifyContent: "space-between", 
            bgcolor: "background.paper", 
            p: 2, 
            boxShadow: 3, 
            borderTop: `1px solid ${theme.palette.divider}` 
        }}>
          <Button variant="outlined" onClick={() => navigate('/select-test')} disabled={isTranslating}>
            {displayText.previousButton}
          </Button>
          <Button variant="contained" color="primary" onClick={handleReadyClick} disabled={!isChecked || isTranslating}>
            {displayText.readyButton}
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Page2;