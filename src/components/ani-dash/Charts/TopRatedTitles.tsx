import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx"
import {useContext, useState} from "react";
import {AniDashContext} from "@/components/ani-dash/AniDashContext.ts";
import {MediaData} from "@/types/MediaData.ts";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

interface Props {
    mediaType: "Anime" | "Manga"
    rawData: MediaData[]
    isLoading?: boolean
}

export function TopRatedTitles({mediaType, rawData, isLoading}: Props) {
    const {range} = useContext(AniDashContext);
    const [count, setCount] = useState<5 | 10 | 20>(10);



    // Get completed titles for the current month with scores
    const completedTitles = rawData.find(list => list.name === "Completed")?.entries.filter(entry => {           
            const completedDate = entry.completedAt;
            return (entry.score || 0) > 0 && completedDate.month === (range.month + 1) && completedDate.year === range.year;
        }).map(entry => ({
            ...entry,
            rating: entry.score || 0
        })).sort((a, b) => b.rating - a.rating);

    const topTitles = completedTitles?.slice(0, count) || [];

    return (
        <Card className="h-full w-full flex flex-col" style={{ height: '100%', minHeight: '360px' }}>
            <CardHeader className="drag-handle cursor-move select-none">
                <CardTitle className="flex items-center justify-between">
                    <span>Top Rated {mediaType}</span>
                    <Select value={count.toString()} onValueChange={(value) => setCount(parseInt(value) as 5 | 10 | 20)}>
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                        </SelectContent>
                    </Select>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 w-full overflow-y-auto p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="text-sm text-muted-foreground">Loading...</span>
                        </div>
                    </div>
                ) : topTitles.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        No completed {mediaType.toLowerCase()} this month
                    </div>
                ) : (
                    <div className="space-y-2">
                        {topTitles.map((entry, index) => (
                            <div 
                                key={`${entry.media.title.english}-${index}`} 
                                className="card-item flex items-center gap-3 p-2 rounded-lg cursor-pointer"
                                onClick={() => window.open(entry.media.siteUrl, '_blank')}
                                title={`Click to view ${entry.media.title.english || entry.media.title.romaji} on AniList`}
                            >
                                <div className="flex-shrink-0 w-6 h-6 text-sm font-bold text-muted-foreground">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm truncate text-center" title={entry.media.title.english}>
                                        {entry.media.title.english || entry.media.title.romaji}
                                    </h3>
                                    <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground mt-1">
                                        <span>{mediaType === 'Anime' ? 'Episodes' : 'Chapters'}: {entry.progress}</span>
                                        {entry.rating > 0 && (
                                            <span className="flex items-center gap-1 font-medium">
                                                ⭐ {entry.rating}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {entry.media.coverImage?.large && (
                                    <img 
                                        src={entry.media.coverImage.large} 
                                        alt={entry.media.title.english || entry.media.title.romaji}
                                        className="w-12 h-16 object-cover rounded shadow-sm"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <h2 className="text-md">Completed this month:</h2>
                <h1 className="text-2xl">{isLoading ? "..." : completedTitles?.length || 0}</h1>
            </CardFooter>
        </Card>
    )
}
