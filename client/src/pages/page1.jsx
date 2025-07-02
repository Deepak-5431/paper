import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import Header from '../components/header';

import { ArrowBack, ArrowForward } from '@mui/icons-material';


const theme = createTheme({
  palette: {
    primary: {
      main: '#4285f4',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f0f2f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '1.125rem',
      fontWeight: 500,
      '@media (max-width: 992px)': {
        fontSize: '1rem',
      },
      '@media (max-width: 768px)': {
        fontSize: '0.9375rem',
        textAlign: 'center',
      },
      '@media (max-width: 480px)': {
        fontSize: '0.875rem',
      },
    },
    h2: {
      fontSize: '1.625rem',
      fontWeight: 600,
      borderBottom: '1px solid #e0e0e0',
      paddingBottom: '10px',
      marginBottom: '15px',
      '@media (max-width: 992px)': {
        fontSize: '1.5rem',
      },
      '@media (max-width: 768px)': {
        fontSize: '1.3rem',
      },
      '@media (max-width: 480px)': {
        fontSize: '1.15rem',
      },
      '@media (max-width: 360px)': {
        fontSize: '1.05rem',
      },
    },
    body1: {
      '@media (max-width: 992px)': {
        fontSize: '0.9375rem',
      },
      '@media (max-width: 768px)': {
        fontSize: '0.875rem',
      },
      '@media (max-width: 480px)': {
        fontSize: '0.8125rem',
      },
      '@media (max-width: 360px)': {
        fontSize: '0.75rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: '48px',
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          padding: '10px 20px',
          whiteSpace: 'nowrap',
          '@media (max-width: 992px)': {
            fontSize: '0.9375rem',
            padding: '10px 15px',
            minHeight: '44px',
          },
          '@media (max-width: 768px)': {
            fontSize: '0.875rem',
            padding: '10px 15px',
            minHeight: '44px',
            flexShrink: 1,
            maxWidth: '50%',
          },
          '@media (max-width: 480px)': {
            fontSize: '0.8125rem',
            padding: '8px 10px',
            minHeight: '40px',
            maxWidth: '49%',
          },
          '@media (max-width: 360px)': {
            fontSize: '0.75rem',
            padding: '7px 5px',
            minHeight: '38px',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '@media (max-width: 992px)': {
            fontSize: '0.9375rem',
          },
          '@media (max-width: 768px)': {
            fontSize: '0.875rem',
          },
          '@media (max-width: 480px)': {
            fontSize: '0.8125rem',
          },
          '@media (max-width: 360px)': {
            fontSize: '0.75rem',
          },
        }
      }
    }
  },
});

// 2. Helper Component for Status Boxes
const StatusBox = ({ color }) => (
  <Box
    sx={{
      width: '1.125rem',
      height: '1.125rem',
      borderRadius: '4px',
      backgroundColor: color,
      border: '1px solid #e0e0e0',
      flexShrink: 0,
    }}
  />
);


const InstructionsComponent = () => {

  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: 'background.default', marginLeft: '150px' }}>
      <Header />

      <Container
        component="main"
        maxWidth="lg"
        sx={{
          mt: { xs: '55px', md: '60px' },
          mb: { xs: '65px', md: '80px' },
          flex: 1,
          p: { xs: 0.5, sm: 1.25, md: 2.5 },
        }}
      >
        <Paper elevation={1} sx={{ p: { xs: 1.25, sm: 2, md: 3, lg: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="h2" component="h2" sx={{ mt: 0 }}>General Instructions</Typography>
              <Typography variant="body1" color="text.secondary">Duration: 60 Mins</Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">Maximum Marks: 200</Typography>
          </Box>

          <Typography variant="body1" paragraph>Read the following instructions carefully.</Typography>
          <Box component="ol" sx={{ pl: { xs: 2.5, sm: 3 }, mb: 2, 'li': { mb: 1.25 } }}>
            <Typography component="li" variant="body1">The test contain 4 sections having 100 questions.</Typography>
            <Typography component="li" variant="body1">Each question has 4 options out of which only one is correct.</Typography>
            <Typography component="li" variant="body1">You have to finish the test in 60 minutes.</Typography>
            <Typography component="li" variant="body1">You will be awarded 2 mark for each correct answer and 0.5 will be deducted for wrong answer.</Typography>
            <Typography component="li" variant="body1">There is no negative marking for the questions that you have not attempted.</Typography>
            <Typography component="li" variant="body1">You can write this test only once. Make sure that you complete the test before you submit the test and/or close the browser.</Typography>
          </Box>

          <Typography variant="body1" paragraph>The clock will be set at the server. The countdown timer at the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You need not terminate the examination or submit your paper.</Typography>
          <Typography variant="body1" paragraph>The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:</Typography>

          <List sx={{ mb: 2, p: 0 }}>
            <ListItem disablePadding sx={{ mb: 1.25 }}>
              <ListItemIcon sx={{ minWidth: 25, mr: 1.25 }}><StatusBox color="#f8f9fa" /></ListItemIcon>
              <ListItemText primary="You have not visited the question yet." primaryTypographyProps={{ variant: 'body1' }} />
            </ListItem>
            <ListItem disablePadding sx={{ mb: 1.25 }}>
              <ListItemIcon sx={{ minWidth: 25, mr: 1.25 }}><StatusBox color="#dc3545" /></ListItemIcon>
              <ListItemText primary="You have not answered the question." primaryTypographyProps={{ variant: 'body1' }} />
            </ListItem>
            <ListItem disablePadding sx={{ mb: 1.25 }}>
              <ListItemIcon sx={{ minWidth: 25, mr: 1.25 }}><StatusBox color="#28a745" /></ListItemIcon>
              <ListItemText primary="You have answered the question." primaryTypographyProps={{ variant: 'body1' }} />
            </ListItem>
            <ListItem disablePadding sx={{ mb: 1.25 }}>
              <ListItemIcon sx={{ minWidth: 25, mr: 1.25 }}><StatusBox color="#fd7e14" /></ListItemIcon>
              <ListItemText primary="You have NOT answered the question, but have marked the question for review." primaryTypographyProps={{ variant: 'body1' }} />
            </ListItem>
            <ListItem disablePadding sx={{ mb: 1.25 }}>
              <ListItemIcon sx={{ minWidth: 25, mr: 1.25 }}><StatusBox color="#6f42c1" /></ListItemIcon>
              <ListItemText primary="You have answered the question, but marked it for review." primaryTypographyProps={{ variant: 'body1' }} />
            </ListItem>
          </List>

          <Typography variant="body1" paragraph>The <b>Mark For Review</b> status for a question simply indicates that you would like to look at that question again. If a question is answered, but marked for review, that answer will be considered for evaluation unless the status is modified by the candidate.</Typography>

          <Typography variant="h2" component="h2">Navigating to a Question :</Typography>
          <Box component="ol" sx={{ pl: { xs: 2.5, sm: 3 }, mb: 2, 'li': { mb: 1.25 } }}>
            <Typography component="li" variant="body1">To answer a question, do the following:
              <Box component="ol" type="a" sx={{ pl: { xs: 2.5, sm: 3 }, mt: 1, 'li': { mb: 1.25 } }}>
                <Typography component="li" variant="body1">Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.</Typography>
                <Typography component="li" variant="body1">Click on <b>Save & Next</b> to save your answer for the current question and then go to the next question.</Typography>
                <Typography component="li" variant="body1">Click on <b>Mark for Review & Next</b> to save your answer for the current question and also mark it for review, and then go to the next question.</Typography>
              </Box>
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>Note that your answer for the current question will not be saved, if you navigate to another question directly by clicking on a question number without saving the answer to the previous question.</Typography>
          <Typography variant="body1" paragraph>You can view all the questions by clicking on the <b>Question Paper</b> button. This feature is provided, so that if you want you can just see the entire question paper at a glance.</Typography>

          <Typography variant="h2" component="h2">Answering a Question :</Typography>
          <Box component="ol" sx={{ pl: { xs: 2.5, sm: 3 }, mb: 2, 'li': { mb: 1.25 } }}>
            <Typography component="li" variant="body1">Procedure for answering a multiple choice (MCQ) type question:
              <Box component="ol" type="a" sx={{ pl: { xs: 2.5, sm: 3 }, mt: 1, 'li': { mb: 1.25 } }}>
                <Typography component="li" variant="body1">Choose one answer from the 4 options (A,B,C,D) given below the question, click on the bubble placed before the chosen option.</Typography>
                <Typography component="li" variant="body1">To deselect your chosen answer, click on the bubble of the chosen option again or click on the <b>Clear Response</b> button</Typography>
                <Typography component="li" variant="body1">To change your chosen answer, click on the bubble of another option.</Typography>
                <Typography component="li" variant="body1">To save your answer, you MUST click on the <b>Save & Next</b></Typography>
              </Box>
            </Typography>
            <Typography component="li" variant="body1">Procedure for answering a numerical answer type question :
              <Box component="ol" type="a" sx={{ pl: { xs: 2.5, sm: 3 }, mt: 1, 'li': { mb: 1.25 } }}>
                <Typography component="li" variant="body1">To enter a number as your answer, use the virtual numerical keypad.</Typography>
                <Typography component="li" variant="body1">A fraction (e.g. -0.3 or -3) can be entered as an answer with or without "0" before the decimal point. As many as four decimal points, e.g. 12.5436 or 0.003 or -632.6711 or 12.82 can be entered.</Typography>
                <Typography component="li" variant="body1">To clear your answer, click on the <b>Clear Response</b> button</Typography>
                <Typography component="li" variant="body1">To save your answer, you MUST click on the <b>Save & Next</b></Typography>
              </Box>
            </Typography>
            <Typography component="li" variant="body1">To mark a question for review, click on the <b>Mark for Review & Next</b> button. If an answer is selected (for MCQ/CAQ) entered (for numerical answer type) for a question that is <b>Marked for Review</b>, that answer will be considered in the evaluation unless the status is modified by the candidate.</Typography>
            <Typography component="li" variant="body1">To change your answer to a question that has already been answered, first select that question for answering and then follow the procedure for answering that type of question.</Typography>
            <Typography component="li" variant="body1">Note that ONLY Questions for which answers are <b>saved</b> or marked for review after answering will be considered for evaluation.</Typography>
            <Typography component="li" variant="body1">Sections in this question paper are displayed on the top bar of the screen. Sections in a Section can be viewed by clicking on the name of that Section. The Section you are currently viewing will be highlighted.</Typography>
            <Typography component="li" v="body1">After clicking the <b>Save & Next</b> button for the last question in a Section, you will automatically be taken to the first question of the next Section in sequence.</Typography>
            <Typography component="li" variant="body1">You can move the mouse cursor over the name of a Section to view the answering status for that Section.</Typography>
          </Box>
        </Paper>
      </Container>

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: 'auto',
          bottom: 0,
          backgroundColor: 'background.paper',
          boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
          borderTop: '1px solid #e0e0e0',
          height: { xs: 65, md: 80 },
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', height: '100%', px: { xs: 1, sm: 2, md: 3 } }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            sx={{
              borderColor: '#e0e0e0',
              color: 'text.primary',
              '&:hover': {
                backgroundColor: '#e9ecef',
                borderColor: '#e0e0e0'
              },
              '@media (max-width: 480px)': {
                fontSize: '0.75rem',
                padding: '8px 5px'
              },
              '@media (max-width: 360px)': {
                fontSize: '0.7rem',
                padding: '7px 4px'
              },
            }}
          >
            Go to Tests
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => navigate('/page2')}
            sx={{
              '&:hover': {
                backgroundColor: '#3367d6'
              }
            }}
          >
            Next
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};


// 4. Final Exported Component (combining App.js and InstructionsPage.js)
const Page1 = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <InstructionsComponent />
    </ThemeProvider>
  );
}

export default Page1;