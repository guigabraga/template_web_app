import { Box, Container, Paper, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Paper
      component="footer"
      square
      elevation={0}
      sx={{
        position: "fixed",
        right: 0,
        bottom: 0,
        left: 0,
        height: { xs: 48, sm: 52 },
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Container maxWidth="lg" sx={{ height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography variant="body2" color="text.secondary" noWrap>
            © {new Date().getFullYear()} Template Web App
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
}
