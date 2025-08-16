import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts"
import {
    Card,
    CardContent,
    CardFooter,
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

export function TitlesCompleted({rawData, mediaType, isLoading}: Props) {
    const { user } = useContext(AppContext);
    const { range } = useContext(AniDashContext);

    const chartConfig = {
        count: {
            label: "Count",
            color: user.theme,
        },
    } satisfies ChartConfig

    const data = monthToDate();

    function monthToDate() {
        const entries = rawData.find(l => l.name === "Completed")?.entries || [];
        const finishedThisMonth = entries.filter(x => x.completedAt.year === range.year && x.completedAt.month === (range.month + 1));

        const groupedByDay:{day: number, count: number}[] = [];
        const today = new Date();
        const maxDays = today.getMonth() === range.month ? today.getDate() : new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        for (let i = 1; i <= maxDays; i++) {
            groupedByDay.push({day: i, count: 0});
        }
        finishedThisMonth.forEach(x => {
            const dayEntry = groupedByDay.find(d => d.day === x.completedAt.day);
            if (dayEntry) {
                dayEntry.count++;
            }
        })
        return groupedByDay;
    }

    return (
        <Card className="h-full w-full flex flex-col">
            <CardHeader className="drag-handle cursor-move select-none">
                <CardTitle>{`${mediaType} Completed`}</CardTitle>
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
                        <LineChart
                            accessibilityLayer
                            data={data}
                                                    margin={{
                            left: 0,
                            right: 12,
                            top: 20,
                            bottom: 30,
                        }}
                        >
                                                    <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={"day"}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval={0}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={0}
                            width={0}
                            hide={true}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="count"
                            type="monotone"
                            stroke="var(--color-count)"
                            strokeWidth={2}
                            dot={false}
                        />
                        </LineChart>
                    </ChartContainer>
                )}
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <h2 className="text-md">Total titles:</h2>
                <h1 className="text-2xl">{isLoading ? "..." : data.reduce((acc, x) => acc + x.count, 0)}</h1>
            </CardFooter>
        </Card>
    )
}