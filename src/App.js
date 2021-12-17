
import Login from "./Components/Login/Login";
import {useState} from 'react';
import Tabs from "./Components/Tabs/Tabs";

function App() {
    const [page,setPage] = useState('login')
  return (
      <>
          {
              page === "login" && <Login continue={()=>{setPage("Tabs")}}/>
          }
          {
              page === 'Tabs' && <Tabs/>
          }

      </>
  );
}

export default App;
