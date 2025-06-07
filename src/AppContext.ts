import {createContext} from "react";
import {AppContextType} from "@/types/AppContextType.ts";

export const AppContext = createContext<AppContextType>({
    user: {
        username: '',
        id: -1,
        theme: "default",
    },
});