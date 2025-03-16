import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useContext, useState} from "react";
import {AniDashContext} from "@/AniDashContext.ts";

export default function Authentication({refresh}) {
    const [username, setUsername] = useState(localStorage.getItem('anidash-user') ? JSON.parse(localStorage.getItem('anidash-user')).username : "")

    const {setUser} = useContext(AniDashContext);

    function validateUsername() {
        const query = `
            query {
                User (name: "${username}") { 
                    id
                    options {
                        profileColor
                    }
                }
            }
        `

        const url = 'https://graphql.anilist.co',
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                })
            };

        fetch(url, options)
            .then(res => res.ok ? res.json() : Promise.reject(res.json()))
            .then(setUsernameInStorage)
            .catch(console.log);
    }

    function setUsernameInStorage(data) {
        const user = {username: username, id: data.data.User.id, theme: data.data.User.options.profileColor}
        setUser(user);
        localStorage.setItem('anidash-user', JSON.stringify(user));
        refresh();
    }

    return (
        <div className="flex gap-2 justify-center items-center w-full my-4">
            <Label className="mx-2" htmlFor="email">Username: </Label>
            <Input
                className="w-md"
                type="text" id="username"
                placeholder="Username" v
                alue={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && validateUsername()}
            />
            <Button onClick={validateUsername} type="button">Set</Button>
        </div>
    )
}