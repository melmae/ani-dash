import {GenresCompleted} from "@/Charts/GenresCompleted.tsx";
import {TitlesCompleted} from "@/Charts/TitlesCompleted.tsx";
import {ChaptersAndEpisodes} from "@/Charts/ChaptersAndEpisodes.tsx";
import {useContext, useState, useEffect} from "react";
import {AniDashContext} from "@/AniDashContext.ts";

export default function Dashboard() {
    const [animeMediaData, setAnimeMediaData] = useState([]);
    const [mangaMediaData, setMangaMediaData] = useState([]);

    const { user } = useContext(AniDashContext);

    useEffect(() => {
        getMediaData('Anime');
        getMediaData('Manga')
    }, []);

    function getMediaData(mediaType: string) {
        const query = `
            query { 
                MediaListCollection(userName: "${user.username}", userId: ${user.id}, type: ${mediaType.toUpperCase()}) {
                    lists {
                        name,
                        entries {
                            completedAt {
                                day,
                                month,
                                year
                            }
                            media {
                                genres
                            }
                        }
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
            .then((data) => {
                if (mediaType === 'Anime') {
                    setAnimeMediaData(data.data.MediaListCollection.lists);
                } else {
                    setMangaMediaData(data.data.MediaListCollection.lists);
                }
            })
            .catch(console.log);
    }

    return (
        <div className="flex flex-wrap gap-2 m-4 w-full justify-center items-center">
            <TitlesCompleted rawData={animeMediaData} mediaType={'Anime'} />
            <TitlesCompleted rawData={mangaMediaData} mediaType={'Manga'} />
            <GenresCompleted rawData={animeMediaData} mediaType={'Anime'} />
            <GenresCompleted rawData={mangaMediaData} mediaType={'Manga'} />
            <ChaptersAndEpisodes mediaType={'Manga'} />
            <ChaptersAndEpisodes mediaType={'Anime'} />
        </div>
    )
}