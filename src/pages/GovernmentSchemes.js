import React from 'react';
import { Container, Typography, Card, CardContent, Grid, CardMedia, Box } from '@mui/material';

// List of government schemes with placeholder images from a reliable CDN
const schemes = [
  {
    id: 1,
    title: 'PM-KISAN',
    description: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector Scheme with 100% funding from Government of India. Under the scheme, income support of ₹6,000 per year is provided to all farmer families across the country in three equal installments of ₹2,000 every four months.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    link: 'https://pmkisan.gov.in/'
  },
  {
    id: 3,
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'PMFBY is an insurance scheme for crops to provide comprehensive insurance coverage against crop failure, helping farmers cope with agricultural risks such as droughts, floods, pests, and diseases.',
    image: 'https://images.unsplash.com/photo-1500382014312-7c4a97a4c0a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    link: 'https://pmfby.gov.in/'
  },
  {
    id: 4,
    title: 'Kisan Credit Card (KCC) Scheme',
    description: 'KCC provides farmers with timely access to credit for their agricultural needs at a reduced interest rate of 4% per annum with interest subvention and prompt repayment incentive.',
    image: 'https://images.unsplash.com/photo-1559131407-0b29d3f7d5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    link: 'https://pmkmy.gov.in/kcc/'
  },
  {
    id: 5,
    title: 'National Mission for Sustainable Agriculture (NMSA)',
    description: 'NMSA aims to promote sustainable agriculture through climate change adaptation measures, enhancing agriculture productivity especially in rainfed areas focusing on integrated farming, soil health management, and synergizing resource conservation.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    link: 'https://nmsa.dac.gov.in/'
  },
  {
    id: 6,
    title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    description: 'PKVY promotes organic farming in the country through adoption of organic village by cluster approach and PGS certification. The scheme aims to support and promote organic farming, in turn resulting in improvement of soil health.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    link: 'https://pgsindia-ncof.dacnet.nic.in/'
  }
];

const GovernmentSchemes = () => {
  const handleCardClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleImageError = (e) => {
    try {
      e.target.onerror = null; // Prevent infinite loop
      // Fallback to a placeholder image with the scheme title
      const title = e.target.alt || 'Scheme';
      e.target.src = `https://via.placeholder.com/400x200?text=${encodeURIComponent(title)}`;
      e.target.style.objectFit = 'contain';
      e.target.parentElement.style.backgroundColor = '#f5f5f5';
    } catch (error) {
      console.error('Error handling image error:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4, color: '#2e7d32' }}>
        Government Schemes for Farmers
      </Typography>
      <Typography variant="subtitle1" paragraph align="center" sx={{ mb: 4, color: 'text.secondary' }}>
        Explore various government initiatives and financial assistance programs available for farmers across India.
      </Typography>
      
      <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
        {schemes.map((scheme) => (
          <Grid item xs={12} sm={6} md={6} key={scheme.id} sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: { sm: 'calc(50% - 32px)', md: 'calc(50% - 32px)' },
            flex: '0 0 auto'
          }}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                  cursor: 'pointer'
                },
                flex: 1
              }}
              onClick={() => handleCardClick(scheme.link)}
            >
              <Box sx={{ 
                height: 200, 
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                position: 'relative'
              }}>
                <CardMedia
                  component="img"
                  src={scheme.image}
                  alt={scheme.title}
                  onError={handleImageError}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    transition: 'transform 0.5s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                  loading="lazy"
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {scheme.title}
                </div>
              </Box>
              <CardContent sx={{ 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '180px',
                overflow: 'hidden'
              }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    flexGrow: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {scheme.description}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ 
                    mt: 2, 
                    display: 'inline-block',
                    '&:hover': {
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }
                  }}
                >
                  Learn more →
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default GovernmentSchemes;
