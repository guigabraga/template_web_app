import { AppBar, Container, Toolbar } from "@mui/material";
import { ButtonTheme } from "../../../../../../shared";

export default function Navbar() {
  return (
    <AppBar
      component="header"
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "flex-end" }}>
          <ButtonTheme />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
