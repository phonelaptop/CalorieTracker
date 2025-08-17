import { Box, Typography, Link, Container, Divider } from '@mui/material';

export const Footer = () => {
  return (
    <Box>
      <Divider />
      <Box component="footer" sx={{ py: 3, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link href="#about" color="text.secondary" underline="hover" sx={{ fontFamily: "Montserrat" }}>
                About
              </Link>
              <Link href="#privacy" color="text.secondary" underline="hover" sx={{ fontFamily: "Montserrat" }}>
                Privacy
              </Link>
              <Link href="#terms" color="text.secondary" underline="hover" sx={{ fontFamily: "Montserrat" }}>
                Terms
              </Link>
              <Link href="#contact" color="text.secondary" underline="hover" sx={{ fontFamily: "Montserrat" }}>
                Contact
              </Link>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "Montserrat" }}>
              © 2025 Jake Company
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};