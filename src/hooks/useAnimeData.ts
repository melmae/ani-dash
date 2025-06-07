import { useQuery } from '@tanstack/react-query'
import {User} from "@/types/User.ts";

export function useAnimeData(user: User, ) {
    return useQuery({
        queryKey: ['animeData', user.username],
        placeholderData: [],
        queryFn: () => getData(user),
        enabled: !!user.username,
    })
}

async function getData(user: User) {
    const query = `query {
            MediaListCollection (userName: "${user.username}" userId: ${user.id} type: ANIME) {
                lists {
                    name
                    entries {
                        status
                        progress
                        completedAt {
                            day,
                            month,
                            year
                        }
                        media {
                            genres
                            title {
                                english
                                romaji
                            }
                            chapters
                            siteUrl
                            coverImage {
                                large
                            }
                        }
                    }
                }
            }
        }`

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

    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Failed to fetch data.');
    const json = await response.json();
    return json.data.MediaListCollection.lists;
}