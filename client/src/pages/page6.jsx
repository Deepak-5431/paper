
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Header2 from "../components/header2";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Avatar,
 Stack,
} from "@mui/material";
import {  Lens } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

const StyledContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
}));

const MainContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  overflow: 'hidden',
}));

const LeftPanel = styled('div')(({ theme }) => ({
  flexBasis: '70%',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  padding: theme.spacing(2),
  borderRight: `1px solid ${theme.palette.divider}`,
}));

const RightSidebar = styled('div')(({ theme }) => ({
  flexBasis: '30%',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  padding: theme.spacing(2),
}));

const ScrollableContent = styled('div')({
  flexGrow: 1,
  overflowY: 'auto',
  paddingRight: '8px',
  paddingLeft: '8px',
});


const ResultStatusLegend = () => (
  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Legend</Typography>
    <Stack spacing={1} sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Lens sx={{ color: 'success.main' }} fontSize="small" /><Typography variant="body2">Correct</Typography></Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Lens sx={{ color: 'error.main' }} fontSize="small" /><Typography variant="body2">Incorrect</Typography></Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Lens sx={{ color: 'grey.400' }} fontSize="small" /><Typography variant="body2">Not Answered</Typography></Box>
    </Stack>
  </Box>
);

const Page6 = () => {
  const { paperId } = useParams();
  const navigate = useNavigate();
  const { authState } = useUser();

  
  return (
    <ThemeProvider theme={theme}>
      <StyledContainer>
        <Header2 isPaused={true} />
        <MainContainer>
          <LeftPanel>
            <ScrollableContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 720, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>You have already given this test</Typography>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>We've recorded your submission for this paper. You can view your detailed result for this test.</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={() => navigate(`/result/${paperId}`)}>View Results</Button>
                    <Button variant="outlined" onClick={() => navigate('/select-test')}>Back to Tests</Button>
                  </Box>
                </Paper>
              </Box>
            </ScrollableContent>
          </LeftPanel>

          <RightSidebar>
            <Box sx={{ p:2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Avatar src={authState?.user?.image} />
              <Typography fontWeight="bold">{authState?.user?.name}</Typography>
            </Box>
            <ResultStatusLegend />
            <Box sx={{ p:2, flexGrow:1, overflowY: 'auto' }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Question Palette</Typography>
              <Grid container spacing={1}>
               
              </Grid>
            </Box>
          </RightSidebar>
        </MainContainer>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default Page6;