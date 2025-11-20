import React from 'react';
import { Container, Typography, Card, CardContent, Grid, CardMedia, Box } from '@mui/material';

const schemes = [
  {
    id: 1,
    title: 'PM-KISAN',
    description: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector Scheme with 100% funding from Government of India. Under the scheme, income support of ₹6,000 per year is provided to all farmer families across the country in three equal installments of ₹2,000 every four months.',
    image: 'https://www.india.gov.in/sites/upload_files/npi/theme/images/pm-kisan-logo.png',
    link: 'https://pmkisan.gov.in/'
  },
  {
    id: 2,
    title: 'Soil Health Card Scheme',
    description: 'Soil Health Card Scheme aims to issue soil health cards to farmers every 2 years to provide a basis to address nutrient deficiencies in fertilization practices.',
    image: 'https://www.india.gov.in/sites/upload_files/npi/theme/images/soil-health-card.jpg',
    link: 'https://soilhealth.dac.gov.in/'
  },
  {
    id: 3,
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'PMFBY is an insurance scheme for crops to provide comprehensive insurance coverage against crop failure, helping farmers cope with agricultural risks such as droughts, floods, pests, and diseases.',
    image: 'https://www.india.gov.in/sites/upload_files/npi/theme/images/pmfby-logo.png',
    link: 'https://pmfby.gov.in/'
  },
  {
    id: 4,
    title: 'Kisan Credit Card (KCC) Scheme',
    description: 'KCC provides farmers with timely access to credit for their agricultural needs at a reduced interest rate of 4% per annum with interest subvention and prompt repayment incentive.',
    image: 'https://www.india.gov.in/sites/upload_files/npi/files/ogp_blog_image_kcc.jpg',
    link: 'https://pmkmy.gov.in/kcc/'
  },
  {
    id: 5,
    title: 'National Mission for Sustainable Agriculture (NMSA)',
    description: 'NMSA aims to promote sustainable agriculture through climate change adaptation measures, enhancing agriculture productivity especially in rainfed areas focusing on integrated farming, soil health management, and synergizing resource conservation.',
    image: 'https://www.india.gov.in/sites/upload_files/npi/theme/images/nmsa-logo.png',
    link: 'https://nmsa.dac.gov.in/'
  },
  {
    id: 6,
    title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    description: 'PKVY promotes organic farming in the country through adoption of organic village by cluster approach and PGS certification. The scheme aims to support and promote organic farming, in turn resulting in improvement of soil health.',
    image: 'https://www.india.gov.in/sites/upload_files/npi/theme/images/pkvy-logo.png',
    link: 'https://pgsindia-ncof.dacnet.nic.in/'
  }
];

const GovernmentSchemes = () => {
  const handleCardClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleImageError = (e) => {
    e.target.onerror = null; // Prevent infinite loop if the fallback image also fails
    e.target.src = `https://via.placeholder.com/400x200?text=${encodeURIComponent(e.target.alt || 'Image+Not+Available')}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4, color: '#2e7d32' }}>
        Government Schemes for Farmers
      </Typography>
      <Typography variant="subtitle1" paragraph align="center" sx={{ mb: 4, color: 'text.secondary' }}>
        Explore various government initiatives and financial assistance programs available for farmers across India.
      </Typography>
      
      <Grid container spacing={4}>
        {schemes.map((scheme) => (
          <Grid item xs={12} sm={6} md={4} key={scheme.id}>
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
                }
              }}
              onClick={() => handleCardClick(scheme.link)}
            >
              <Box sx={{ height: 200, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="200"
                  src={scheme.image}
                  alt={scheme.title}
                  onError={handleImageError}
                  sx={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                    padding: 2,
                    backgroundColor: '#f9f9f9',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  {scheme.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
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
