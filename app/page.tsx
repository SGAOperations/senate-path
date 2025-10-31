'use client';

import { Box, Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { FaArrowDown } from 'react-icons/fa';

const Hero = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '90vh',
  width: '100vw',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('sm')]: {
    height: '70vh',
  },
}));

const BackgroundImageContainer = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -2,
  backgroundImage: 'url(/images/front-page.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const Overlay = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.44)',
  zIndex: -1,
}));

const ContentOverlay = styled(Box)(() => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 3,
  textAlign: 'center',
  color: 'white',
  zIndex: 1,
  padding: 3,
}));

const Arrow = styled(Box)(() => ({
  position: 'absolute',
  bottom: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  cursor: 'pointer',
  zIndex: 1,
  transition: 'all 0.3s',
  '&:hover': {
    transform: 'translateX(-50%) translateY(5px)',
  },
}));

const InfoSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#f9f9f9',
  minHeight: '90vh',
  padding: theme.spacing(8, 4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 2),
  },
}));

const Line = styled(Box)(({ theme }) => ({
  height: '4px',
  flex: 1,
  backgroundColor: 'black',
  borderRadius: '50px',
  marginTop: theme.spacing(4),
  marginRight: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

export default function Home() {
  const handleScrollToSGA = () => {
    const sgaSection = document.getElementById('sga-section');
    if (sgaSection) {
      sgaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Hero>
        <BackgroundImageContainer />
        <Overlay />
        
        <ContentOverlay>
          <Typography
            variant="h1"
            sx={{
              fontStyle: 'italic',
              fontWeight: 'bold',
              textShadow: '7px 7px 10px rgba(0, 0, 0, 0.8)',
              fontSize: { xs: '1.75rem', md: '3.5rem' },
            }}
          >
            SENATE NOMINATIONS & APPLICATIONS
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              textShadow: '5px 5px 7px rgba(0, 0, 0, 0.7)',
              fontSize: { xs: '1rem', md: '1.5rem' },
            }}
          >
            NORTHEASTERN'S STUDENT GOVERNMENT ASSOCIATION
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              component={Link}
              href="/applications"
              variant="contained"
              size="large"
              sx={{ fontWeight: 'bold', minWidth: '150px', minHeight: '56px' }}
            >
              Apply
            </Button>
            <Button
              component={Link}
              href="/nominations"
              variant="contained"
              size="large"
              sx={{ fontWeight: 'bold', minWidth: '150px', minHeight: '56px' }}
            >
              Nominate
            </Button>
          </Box>
        </ContentOverlay>

        <Arrow onClick={handleScrollToSGA}>
          <FaArrowDown size={30} color="white" />
        </Arrow>
      </Hero>

      {/* Info Section */}
      <InfoSection id="sga-section">
        <Container maxWidth="lg">
          {/* What's SGA Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Typography
              variant="h3"
              sx={{
                fontStyle: 'italic',
                fontWeight: 'bold',
                textShadow: 'none',
              }}
            >
              WHAT IS SGA?
            </Typography>
            <Line sx={{ ml: 2 }} />
          </Box>
          
          <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
            The Northeastern University Student Government Association (or SGA for
            short) is the representative body serving over 15,000 undergraduate
            students and to change our Boston campus for the better. We take on
            different projects and initiatives, write legislation, and advocate to
            members of the University administration to improve student life,
            classroom programs, and the overall Northeastern Boston campus
            undergraduate experience.
          </Typography>
          
          <Button
            href="https://www.northeasternsga.com/senate"
            variant="contained"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ fontWeight: 'bold', mb: 6 }}
          >
            About the Senate
          </Button>

          {/* Why Senator Section */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              mb: 3,
            }}
          >
            <Line sx={{ mr: 2 }} />
            <Typography
              variant="h3"
              sx={{
                fontStyle: 'italic',
                fontWeight: 'bold',
                textShadow: 'none',
              }}
            >
              WHY BE A SENATOR?
            </Typography>
          </Box>
          
          <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
            Becoming a senator offers the chance to represent the student body,
            advocate for their concerns, and shape the future of campus life.
            Senators propose legislation, approve budgets, and influence
            university policies. They work collaboratively to address critical
            issues and implement meaningful, lasting changes. If you're passionate
            about leadership, representation, and driving impactful change, this
            role is for you.
          </Typography>
          
          <Button
            href="https://www.northeasternsga.com/become-a-senator"
            variant="contained"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ fontWeight: 'bold' }}
          >
            Requirements & Responsibilities
          </Button>
        </Container>
      </InfoSection>
    </Box>
  );
}
