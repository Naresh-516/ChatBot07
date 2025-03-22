import React,{useState,useContext} from "react";
import Chat from "./Chat";
import { createContext } from "react";

export const ThemeContext=createContext()
const App = () => {
  const [dark, setDark] = useState(true);
  return (
    <div>
      <ThemeContext.Provider value={{dark,setDark}}>
      <Chat/>
      </ThemeContext.Provider>
    </div>
  );
};

export default App;
