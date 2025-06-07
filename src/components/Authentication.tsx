import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";
import {User} from "@/types/User.ts";

interface Props {
    setUser: (user: User) => void;
}

export default function Authentication({setUser}: Props) {
    const [username, setUsername] = useState(localStorage.getItem('anidash-user') ? JSON.parse(localStorage.getItem('anidash-user') as string).username : "")

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
            .catch(err => {
                console.log(err);
                const user = {username: '', id: -1, theme: "default"}
                setUser(user as User);
                localStorage.setItem('anidash-user', JSON.stringify(user));
            });
    }

    function setUsernameInStorage(data: any) {
        const user = {username: username, id: data.data.User.id, theme: data.data.User.options.profileColor}
        setUser(user);
        localStorage.setItem('anidash-user', JSON.stringify(user));
    }

    return (
        <div className="flex gap-2 justify-center items-center">
            <Label className="mx-2" htmlFor="email">Username: </Label>
            <Input
                className="w-50"
                type="text" id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && validateUsername()}
            />
            <Button onClick={validateUsername} type="button">Set</Button>
        </div>
    )
}