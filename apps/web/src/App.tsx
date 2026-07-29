import { useAuthStore } from "./stores";
import Private from "./routes/Private";
import Public from "./routes/Public";

const App = () => {
  const token = useAuthStore((state) => state.token);

  return token ? <Private /> : <Public />;
};

export default App;
