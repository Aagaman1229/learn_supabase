import "./App.css";
import TaskManagement from "./components/taskmanagement";
import Auth from "./components/auth";
import { useEffect, useState } from "react";
import { supabase } from "./supabase-client";
function App() {
  const [session,setSession] = useState(null);
  const fetchSession = async () =>{
    const currentSession = await supabase.auth.getSession()
    console.log(currentSession)
    setSession(currentSession.data.session)
  }
  useEffect(() => {
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    }, []);

    const logout = async () => {
      await supabase.auth.signOut();
    };
  return (
    <div className="App">
      {session?(
        <><button onClick={logout}> Log Out</button>
          <TaskManagement session = {session} />
      </>)
      :
      <Auth />}
    </div>
  );
}

export default App;