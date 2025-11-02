import {createRootRoute, Outlet, useNavigate, useRouterState} from '@tanstack/react-router'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useState} from "react";
import Authentication from "@/components/Authentication.tsx";
import {AppContext} from "@/AppContext.ts";
import {User} from "@/types/User.ts";
import {AppContextType} from "@/types/AppContextType.ts";

export const Route = createRootRoute({
    component: RootComponent
})

function RootComponent() {
    const [user, setUser] = useState<User>(localStorage.getItem('anidash-user') ? JSON.parse(localStorage.getItem('anidash-user') as string) : {username: '', id: -1, theme: 'default'});

    const context: AppContextType = {user: user};

    const navigate = useNavigate();
    const routerState = useRouterState();
    const currentPath = routerState.location.pathname;

    const pages = [
        { name: "AniDash", path: "/ani-dash/AniDash"},
        { name: "AniComplete", path: "/ani-dash/AniComplete"},
    ]

    return (
        <AppContext.Provider value={context}>
            <div className="sticky top-0 z-50 bg-white dark:bg-[#0b1622] border-b w-full px-4 py-2 flex items-center justify-between">
                <Select value={currentPath} onValueChange={(value) => navigate({ to: value })}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Page" />
                    </SelectTrigger>
                    <SelectContent>
                        {pages.map((page) => (
                            <SelectItem
                                key={page.path}
                                value={page.path}
                                disabled={currentPath === page.path}
                            >
                                {page.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-extrabold truncate max-w-[60%] text-center" style={{color: user.theme}}>
                    {currentPath.replace('/ani-dash/', '')}
                </h1>
                <div className="flex-shrink-0">
                    <Authentication setUser={setUser} />
                </div>
            </div>
            <hr />
            <div className="flex flex-wrap justify-center items-center w-full py-2">
                {user && <Outlet />}
            </div>
        </AppContext.Provider>
    )
}