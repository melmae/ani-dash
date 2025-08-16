import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart.tsx"
import {useContext} from "react";
import {AppContext} from "@/AppContext.ts";
import {MediaData} from "@/types/MediaData.ts";
import {AniDashContext} from "@/components/ani-dash/AniDashContext.ts";

interface Props {
    rawData: Array<MediaData>,
    mediaType: "Anime" | "Manga"
    isLoading?: boolean
}

export function GenresCompleted({rawData, mediaType, isLoading}: Props) {
    const { user } = useContext(AppContext);
    const { range } = useContext(AniDashContext);

    const chartConfig = {
        desktop: {
            label: "Count",
            color: user.theme,
        },
    } satisfies ChartConfig

    const data = monthToDate();

    function monthToDate() {
        const entries = rawData.find(l => l.name === "Completed")?.entries || [];
        const finishedThisMonth = entries.filter(x => x.completedAt.year === range.year && x.completedAt.month === (range.month + 1));

        const groupedByDay:{genre: string, count: number}[] = [];
        finishedThisMonth.forEach(x => {
            x.media.genres.forEach((item) => {
                if (!groupedByDay.find(d => d.genre === item)) {
                    groupedByDay.push({genre: item, count: 0});
                }
                const genreEntry = groupedByDay.find(d => d.genre === item);
                if (genreEntry) {
                    genreEntry.count++;
                }
            })
        })
        return groupedByDay;
    }

    return (
        <Card className="h-full w-full flex flex-col">
            <CardHeader className="drag-handle cursor-move select-none">
                <CardTitle>{`${mediaType} Genre Distribution`}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 w-full">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="text-sm text-muted-foreground">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <ChartContainer config={chartConfig} className="block h-full w-full">
                        <BarChart
                            accessibilityLayer
                            data={data}
                                                    margin={{
                            top: 20,
                            bottom: 30,
                            left: 12,
                            right: 12,
                        }}
                        >
                                                    <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="genre"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            interval={0}
                            tickFormatter={(value) => value.slice(0, 3)}
                            label={{ value: "Genre", position: 'insideBottom', offset: -10 }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            label={{ value: "Titles Completed", angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="count" fill={user.theme} radius={8}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}