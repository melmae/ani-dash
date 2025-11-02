import {GenresCompleted} from "@/components/ani-dash/Charts/GenresCompleted.tsx";
import {TitlesCompleted} from "@/components/ani-dash/Charts/TitlesCompleted.tsx";
import {ChaptersAndEpisodes} from "@/components/ani-dash/Charts/ChaptersAndEpisodes.tsx";
import {TopRatedTitles} from "@/components/ani-dash/Charts/TopRatedTitles.tsx";
import {useContext, useEffect, useMemo, useState} from "react";
import {AppContext} from "@/AppContext.ts";
import {createFileRoute} from "@tanstack/react-router";
import {useAnimeData} from "@/hooks/useAnimeData.ts";
import {useMangaData} from "@/hooks/useMangaData.ts";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {months} from "@/lib/chartUtils.ts";
import {AniDashContext} from "@/components/ani-dash/AniDashContext.ts";
import {Responsive, WidthProvider} from "react-grid-layout";
import type {Layouts} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export const Route = createFileRoute('/ani-dash/AniDash')({
    component: Dashboard
})

function Dashboard() {
    const [range, setRange] = useState({month: new Date().getMonth(), year: new Date().getFullYear()});

    const { user } = useContext(AppContext);

    const { data: animeMediaData, isFetching: isFetchingAnime } = useAnimeData(user);
    const { data: mangaMediaData, isFetching: isFetchingManga } = useMangaData(user);
    const isFetching = isFetchingAnime || isFetchingManga;

    const ResponsiveGridLayout = useMemo(() => WidthProvider(Responsive), []);

    const defaultLayouts: Layouts = {
        lg: [
            { i: "titles-anime", x: 0, y: 0, w: 4, h: 8 },
            { i: "titles-manga", x: 4, y: 0, w: 4, h: 8 },
            { i: "chapters-manga", x: 8, y: 0, w: 4, h: 8 },
            { i: "top-rated-anime", x: 0, y: 8, w: 6, h: 12 },
            { i: "top-rated-manga", x: 6, y: 8, w: 6, h: 12 },
            { i: "genres-anime", x: 0, y: 20, w: 6, h: 10 },
            { i: "genres-manga", x: 6, y: 20, w: 6, h: 10 },
            { i: "chapters-anime", x: 0, y: 30, w: 12, h: 8 },
        ],
        md: [
            { i: "titles-anime", x: 0, y: 0, w: 5, h: 8 },
            { i: "titles-manga", x: 5, y: 0, w: 5, h: 8 },
            { i: "chapters-manga", x: 0, y: 8, w: 10, h: 8 },
            { i: "top-rated-anime", x: 0, y: 16, w: 5, h: 12 },
            { i: "top-rated-manga", x: 5, y: 16, w: 5, h: 12 },
            { i: "genres-anime", x: 0, y: 28, w: 10, h: 10 },
            { i: "genres-manga", x: 0, y: 38, w: 10, h: 10 },
            { i: "chapters-anime", x: 0, y: 48, w: 10, h: 8 },
        ],
        sm: [
            { i: "titles-anime", x: 0, y: 0, w: 6, h: 8 },
            { i: "titles-manga", x: 0, y: 8, w: 6, h: 8 },
            { i: "chapters-manga", x: 0, y: 16, w: 6, h: 8 },
            { i: "top-rated-anime", x: 0, y: 24, w: 6, h: 12 },
            { i: "top-rated-manga", x: 0, y: 36, w: 6, h: 12 },
            { i: "genres-anime", x: 0, y: 48, w: 6, h: 10 },
            { i: "genres-manga", x: 0, y: 58, w: 6, h: 10 },
            { i: "chapters-anime", x: 0, y: 68, w: 6, h: 8 },
        ],
        xs: [
            { i: "titles-anime", x: 0, y: 0, w: 4, h: 8 },
            { i: "titles-manga", x: 0, y: 8, w: 4, h: 8 },
            { i: "chapters-manga", x: 0, y: 16, w: 4, h: 8 },
            { i: "top-rated-anime", x: 0, y: 24, w: 4, h: 12 },
            { i: "top-rated-manga", x: 0, y: 36, w: 4, h: 12 },
            { i: "genres-anime", x: 0, y: 48, w: 4, h: 10 },
            { i: "genres-manga", x: 0, y: 58, w: 4, h: 10 },
            { i: "chapters-anime", x: 0, y: 68, w: 4, h: 8 },
        ],
        xxs: [
            { i: "titles-anime", x: 0, y: 0, w: 2, h: 8 },
            { i: "titles-manga", x: 0, y: 8, w: 2, h: 8 },
            { i: "chapters-manga", x: 0, y: 16, w: 2, h: 8 },
            { i: "top-rated-anime", x: 0, y: 24, w: 2, h: 12 },
            { i: "top-rated-manga", x: 0, y: 36, w: 2, h: 12 },
            { i: "genres-anime", x: 0, y: 48, w: 2, h: 10 },
            { i: "genres-manga", x: 0, y: 58, w: 2, h: 10 },
            { i: "chapters-anime", x: 0, y: 64, w: 2, h: 8 },
        ],
    };

    const [layouts, setLayouts] = useState<Layouts>(() => {
        try {
            const stored = localStorage.getItem("aniDashLayouts");
            return stored ? JSON.parse(stored) : defaultLayouts;
        } catch {
            return defaultLayouts;
        }
    });

    const [layoutKey, setLayoutKey] = useState(0);

    // Only apply default layout if no stored layout exists (first time with new cards)
    useEffect(() => {
        const stored = localStorage.getItem("aniDashLayouts");
        if (!stored) {
            // First time with new cards - apply default layout
            console.log('First time with new cards - applying default layouts:', defaultLayouts);
            setLayouts(defaultLayouts);
            setLayoutKey(prev => prev + 1);
        }
    }, []);

    // Ensure Recharts recalculates after initial mount
    useEffect(() => {
        const id = window.setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
        return () => window.clearTimeout(id);
    }, []);

    // Nudge charts after data loads/layout changes
    useEffect(() => {
        if (!isFetching) {
            const id = window.setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
            return () => window.clearTimeout(id);
        }
    }, [isFetching, layouts, range]);

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
            <div className="w-full p-2 flex gap-4 justify-center items-center">
                <Button className="outlineButton" variant='outline' onClick={previousMonth}>{'<'}</Button>
                <Label className="text-lg">{months[range.month]} {range.year}</Label>
                <Button className="outlineButton" variant='outline' onClick={nextMonth}>{'>'}</Button>
            </div>
            {isFetching && <p>Loading...</p>}
            <div className="m-4 w-full" style={{ width: '100%', minHeight: '800px' }}>
                <ResponsiveGridLayout
                    key={layoutKey}
                    className="layout w-full"
                    layouts={layouts}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    rowHeight={30}
                    margin={[12, 12]}
                    containerPadding={[0, 0]}
                    // TS types for this prop vary; remove if causing issues
                    draggableHandle=".drag-handle"
                    isResizable
                    isDraggable
                    onLayoutChange={(_current: unknown, all: Layouts) => {
                        console.log('Layout changed:', all);
                        console.log('Current breakpoint:', window.innerWidth);
                        setLayouts(all);
                        try { localStorage.setItem("aniDashLayouts", JSON.stringify(all)); } catch {}
                    }}
                    
                    onDragStop={() => window.dispatchEvent(new Event('resize'))}
                >
                    <div key="titles-anime" className="h-full w-full min-w-0" style={{ height: '100%', minHeight: '240px' }}>
                        <TitlesCompleted rawData={animeMediaData} mediaType={'Anime'} isLoading={isFetchingAnime} />
                    </div>
                    <div key="titles-manga" className="h-full w-full min-w-0" style={{ height: '100%', minHeight: '240px' }}>
                        <TitlesCompleted rawData={mangaMediaData} mediaType={'Manga'} isLoading={isFetchingManga} />
                    </div>
                    <div key="chapters-manga" className="h-full w-full min-w-0" style={{ height: '100%', minHeight: '240px' }}>
                        <ChaptersAndEpisodes mediaType={'Manga'} />
                    </div>
                    <div key="top-rated-anime" className="h-full w-full min-w-0" style={{ height: '100%', minHeight: '360px' }}>
                        <TopRatedTitles rawData={animeMediaData} mediaType={'Anime'} isLoading={isFetchingAnime} />
                    </div>
                    <div key="top-rated-manga" className="h-full w-full min-w-0" style={{ height: '100%', minHeight: '360px' }}>
                        <TopRatedTitles rawData={mangaMediaData} mediaType={'Manga'} isLoading={isFetchingManga} />
                    </div>
                    <div key="genres-anime" className="h-full w-full min-w-0" style={{ height: '100%', minHeight: '300px' }}>
                        <GenresCompleted rawData={animeMediaData} mediaType={'Anime'} isLoading={isFetchingAnime} />
                    </div>
                    <div key="genres-manga" className="h-full w-full min-w-0" style={{ height: '100%', minHeight: '300px' }}>
                        <GenresCompleted rawData={mangaMediaData} mediaType={'Manga'} isLoading={isFetchingManga} />
                    </div>
                    <div key="chapters-anime" className="h-full w-full min-w-0" style={{ height: '100%', minHeight: '240px' }}>
                        <ChaptersAndEpisodes mediaType={'Anime'} />
                    </div>
                </ResponsiveGridLayout>
            </div>
        </AniDashContext.Provider>
    )
}