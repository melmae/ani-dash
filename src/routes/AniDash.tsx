import {GenresCompleted} from "@/components/ani-dash/Charts/GenresCompleted.tsx";
import {TitlesCompleted} from "@/components/ani-dash/Charts/TitlesCompleted.tsx";
import {ChaptersAndEpisodes} from "@/components/ani-dash/Charts/ChaptersAndEpisodes.tsx";
import {useContext, useState} from "react";
import {AppContext} from "@/AppContext.ts";
import {createFileRoute} from "@tanstack/react-router";
import {useAnimeData} from "@/hooks/useAnimeData.ts";
import {useMangaData} from "@/hooks/useMangaData.ts";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {months} from "@/lib/chartUtils.ts";
import {AniDashContext} from "@/components/ani-dash/AniDashContext.ts";

export const Route = createFileRoute('/AniDash')({
    component: Dashboard
})

function Dashboard() {
    const [range, setRange] = useState({month: new Date().getMonth(), year: new Date().getFullYear()});

    const { user } = useContext(AppContext);

    const { data: animeMediaData } = useAnimeData(user);
    const { data: mangaMediaData } = useMangaData(user);

    function previousMonth() {
        if (range.month <= 0) {
            setRange({month: 11, year: range.year - 1});
        } else {
            setRange({month: range.month - 1, year: range.year});
        }
    }

    function nextMonth() {
        if (range.month >= 11) {
            setRange({month: 0, year: range.year + 1});
        } else {
            setRange({month: range.month + 1, year: range.year});
        }
    }

    return (
        <AniDashContext.Provider value={{range: range}}>
            <div className="w-full flex gap-4 justify-center items-center">
                <Button className="outlineButton" variant='outline' onClick={previousMonth}>{'<'}</Button>
                <Label className="text-lg">{months[range.month]} {range.year}</Label>
                <Button className="outlineButton" variant='outline' onClick={nextMonth}>{'>'}</Button>
            </div>
            <div className="flex flex-wrap gap-2 m-4 w-full justify-center items-center">
                <TitlesCompleted rawData={animeMediaData} mediaType={'Anime'} />
                <TitlesCompleted rawData={mangaMediaData} mediaType={'Manga'} />
                <GenresCompleted rawData={animeMediaData} mediaType={'Anime'} />
                <GenresCompleted rawData={mangaMediaData} mediaType={'Manga'} />
                <ChaptersAndEpisodes mediaType={'Manga'} />
                <ChaptersAndEpisodes mediaType={'Anime'} />
            </div>
        </AniDashContext.Provider>
    )
}