import {useState} from 'react'
import './App.css'
import Dashboard from "./Dashboard.jsx";
import Authentication from "@/Authentication.tsx";
import {AniDashContext} from "./AniDashContext.ts";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Button} from "@/components/ui/button.tsx";

function App() {
    const [refresh, setRefresh] = useState(0);
    const [user, setUser] = useState(localStorage.getItem('anidash-user') ? JSON.parse(localStorage.getItem('anidash-user')) : {username: '', id: -1, theme: 'default'});

    const queryClient = new QueryClient();

    const usernameIsSet = typeof(localStorage.getItem('anidash-user')) === "string" && JSON.parse(localStorage.getItem('anidash-user')).username;

    function clearUsername() {
        localStorage.setItem('anidash-user', JSON.stringify({username: '', id: -1, theme: 'default'}));
        setUser({username: '', id: -1});
    }

    return (
        <QueryClientProvider client={queryClient}>
            <AniDashContext.Provider value={{user, setUser}}>
                <div className="flex flex-wrap justify-center items-center w-screen">
                    <h1 className="text-4xl w-screen text-center">AniDash</h1>
                    {!usernameIsSet && <Authentication refresh={() => setRefresh(refresh + 1)}/>}
                    {usernameIsSet && <>
                        <div className="flex gap-2 justify-center items-center w-full my-2">
                            <h3 className="text-xl">Hello, {user.username}</h3>
                            <Button variant="outline" onClick={clearUsername}>Clear</Button>
                        </div>
                        <Dashboard />
                    </>}
                </div>
            </AniDashContext.Provider>
        </QueryClientProvider>
    )
}

export default App
