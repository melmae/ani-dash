import {useContext} from 'react'
import { Card } from "@/components/ui/card.tsx"
import {AppContext} from "@/AppContext.ts";
import {createFileRoute} from "@tanstack/react-router";
import {useMangaData} from "@/hooks/useMangaData.ts";
import {MediaEntry} from "@/types/MediaData.ts";

export const Route = createFileRoute('/AniComplete')({
    component: DataList
})

function DataList() {
    const {user} = useContext(AppContext);

    const color = user.theme === 'default' ? 'inherit' : user.theme;

    const { data, isFetching } = useMangaData(user);
    const dataList: MediaEntry[] = data.find((l: { name: string }) => l.name === "Completed")?.entries || [];

    return (
        <div>
            <p style={{color: color}}>Total read: {dataList.length}</p>
            <p style={{color: color}} className="mb-2">Total mismatches: {dataList.filter((e )=> e.progress != e.media.chapters).length}</p>
            {isFetching && <p>Loading...</p>}
            {dataList.filter((e) =>
                e.progress !== e.media.chapters)
                .sort((e1, e2) =>
                    (e1.media.title.english || e1.media.title.romaji || '').localeCompare(e2.media.title.english || e2.media.title.romaji || ''))
                .map((item) => {
                    return (
                        <div className="w-full flex justify-center items-center m-2">
                            <a className="w-2/3 min-w-xs" href={item.media.siteUrl} key={item.media.title.english || item.media.title.romaji} target="_blank" rel="noopener noreferrer">
                                <Card className="flex flex-row gap-3 justify-center items-center p-2">
                                    <img src={item.media.coverImage.large} alt={item.media.title.english || item.media.title.romaji} style={{ height: '60px', width: '50px' }} />
                                    <p>{item.media.title.english || item.media.title.romaji}</p>
                                    <p>Progress: {`${item.progress}/${item.media.chapters || '?'}`}</p>
                                </Card>
                            </a>
                        </div>
                    )
                })
            }
        </div>
    )
}