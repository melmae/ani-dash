import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
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
}

export function GenresCompleted({rawData, mediaType}: Props) {
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
                groupedByDay.find(d => d.genre === item).count++;
            })
        })
        return groupedByDay;
    }

    return (
        <Card className="w-1/3">
            <CardHeader>
                <CardTitle>{`${mediaType} Genre Distribution`}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            top: 20,
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
            </CardContent>
        </Card>
    )
}