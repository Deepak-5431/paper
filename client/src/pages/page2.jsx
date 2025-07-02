import { useState } from "react";

import { useNavigate } from "react-router-dom";
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
  AppBar,
  Toolbar,
  CssBaseline,
  createTheme,
  ThemeProvider,
} from "@mui/material";

import Header from "../components/header"

const Scroll = styled(Box)(({ theme }) => ({
  height: "auto",
  maxHeight: "180px", // Increased max-height for better visibility
  overflowY: "auto",
  backgroundColor: theme.palette.background.default, // Use theme color
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`, // Added a subtle border
  boxShadow: theme.shadows[1], // Lighter shadow
  [theme.breakpoints.up("md")]: {
    maxHeight: "250px", // Increased for desktop
  },
  [theme.breakpoints.up("lg")]: {
    maxHeight: "300px", // Increased for large screens
  },
}));

const Page2 = () => {

  const navigate = useNavigate();
  const [option, setOption] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleReadyClick = () => {
    if (!isChecked) {
      console.log("Please agree to the declaration to proceed.");
      
    } else {
      console.log("Starting the test!");
      navigate('/page3')
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Header /> {/* Render the Header component */}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4, lg: 6 }, // Consistent padding
            marginTop: '40px',
            paddingBottom: { xs: theme.spacing(4), md: theme.spacing(6) },
            paddingTop: { xs: theme.spacing(2), md: theme.spacing(4) },
            display: 'flex', // Use flexbox for main content
            flexDirection: 'column', // Stack children vertically
            alignItems: 'center', // Center content horizontally
            justifyContent: 'center',
            marginBottom: '-20px' // Center content vertically if space allows
          }}
        >
          <Box
            sx={{
              maxWidth: 'lg', // Limit content width for readability
              width: '100%', // Take full width within maxWidth
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[2], // Slightly stronger shadow for the main card
              borderRadius: theme.shape.borderRadius,
              p: { xs: 3, md: 5 }, // Increased padding for the main card
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: { xs: 1, md: 2 } }}>

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0.5, sm: 101 } }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Duration: 60 Mins
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Maximum Marks: 200
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: "bold",
                mt: { xs: 3, md: 4 },
                color: "text.primary",
                borderBottom: `1px solid ${theme.palette.divider}`,
                pb: 1,
              }}
            >
              Read the following instructions carefully.
            </Typography>
            <Box
              component="ol"
              sx={{
                listStyleType: "decimal",
                pl: { xs: 2, md: 4 },
                color: "text.secondary",
                '& li': {
                  mb: 1,
                  fontSize: theme.typography.body1.fontSize,
                  lineHeight: theme.typography.body1.lineHeight,
                }
              }}
            >
              <Typography component="li">
                The test contains 4 sections having 100 questions.
              </Typography>
              <Typography component="li">
                Each question has 4 options out of which only one is correct.
              </Typography>
              <Typography component="li">
                You have to finish the test in 60 minutes.
              </Typography>
              <Typography component="li">
                You will be awarded 2 marks for each correct answer and 0.5 will
                be deducted for wrong answer.
              </Typography>
              <Typography component="li">
                There is no negative marking for the questions that you have not
                attempted.
              </Typography>
              <Typography component="li">
                You can write this test only once. Make sure that you complete the
                test before you submit the test and/or close the browser.
              </Typography>
            </Box>

            <Scroll sx={{ mt: { xs: 4, md: 6 } }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}
              >
                Choose Your Default Language
              </Typography>
              <FormControl
                fullWidth
                sx={{ maxWidth: { xs: "100%", sm: 300 }, mb: 2 }}
              >
                <InputLabel id="language-select-label">Select</InputLabel>
                <Select
                  labelId="language-select-label"
                  value={option}
                  label="Select"
                  onChange={(e) => setOption(e.target.value)}
                  MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                >
                  <MenuItem value="english">English</MenuItem>
                  <MenuItem value="hindi">Hindi</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Please note all questions will appear in your default language. This
                language can be changed for a particular question later on.
              </Typography>
            </Scroll>

            <Box sx={{ mt: { xs: 4, md: 6 } }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", mb: 2, color: "text.primary" }}
              >
                Declaration:
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
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", lineHeight: 1.5 }}
                  >
                    I have read all the instructions carefully and have understood
                    them. I agree not to cheat or use unfair means in this
                    examination. I understand that using unfair means of any sort
                    for my own or someone else's advantage will lead to my immediate
                    disqualification. The decision of Testbook.com will be final in
                    these matters and cannot be appealed.
                  </Typography>
                }
                sx={{ alignItems: "flex-start", m: 0 }}
              />
            </Box>
          </Box>
        </Box>

        {/* Footer Buttons */}
        <Box
          sx={{
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
          }}
        >
          <Button
            variant="outlined"
            onClick={()=>navigate('/')}
            sx={{
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.divider,
              },
            }}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!isChecked}
            onClick={handleReadyClick}
          >
            I am ready to Begin
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Page2;
