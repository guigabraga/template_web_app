import express from "express";
import Routes from "./Routes.js";

const App = express();

App.use(express.json());
App.use(Routes);

export default App;
