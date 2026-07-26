import { AppBar, Container, Toolbar } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar
      component="header"
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters></Toolbar>
      </Container>
    </AppBar>
  );
}
