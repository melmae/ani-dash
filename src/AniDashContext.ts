import {createContext} from "react";

export const AniDashContext = createContext({
    user: {
        username: '',
        id: -1
    },
    setUser: ({}) => {},
});