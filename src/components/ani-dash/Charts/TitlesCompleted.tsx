import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
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
}

export function TitlesCompleted({rawData, mediaType}: Props) {
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
            groupedByDay.find(d => d.day === x.completedAt.day).count++;
        })
        return groupedByDay;
    }

    return (
        <Card className="w-1/4">
            <CardHeader>
                <CardTitle>{`${mediaType} Completed`}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={"day"}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval={0}
                            tickFormatter={(value) => value}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="count"
                            type="natural"
                            stroke="var(--color-count)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <h2 className="text-md">Total titles:</h2>
                <h1 className="text-2xl">{data.reduce((acc, x) => acc + x.count, 0)}</h1>
            </CardFooter>
        </Card>
    )
}