import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useContext, useEffect, useState} from "react";
import {months} from "@/lib/chartUtils.ts";
import {AniDashContext} from "@/AniDashContext.ts";

export function TitlesCompleted({rawData, mediaType}) {
    const [data, setData] = useState([]);
    const [range, setRange] = useState("year");

    const { user } = useContext(AniDashContext);

    useEffect(() => {
        if (rawData.length === 0) return;

        getData(rawData);
    }, [range, rawData]);

    const chartConfig = {
        count: {
            label: "Count",
            color: user.theme,
        },
    } satisfies ChartConfig

    function getData(data) {
        const entries = data.find(l => l.name === "Completed").entries;

        if (range === "month") {
            monthToDate(entries);
        } else if (range === "year") {
            yearToDate(entries);
        }
    }

    function monthToDate(entries) {
        const today = new Date();
        const finishedThisMonth = entries.filter(x => x.completedAt.year === today.getFullYear() && x.completedAt.month === (today.getMonth() + 1));

        let groupedByDay = [];
        for (let i = 1; i <= today.getDate(); i++) { // Note: new Date(today.getFullYear(), today.getMonth(), 0).getDate() would get the total number of days in the month
            groupedByDay.push({day: i, count: 0});
        }
        finishedThisMonth.forEach(x => {
            groupedByDay.find(d => d.day === x.completedAt.day).count++;
        })
        setData(groupedByDay);
    }

    function yearToDate(entries) {
        const today = new Date();
        const finishedThisYear = entries.filter(x => x.completedAt.year === today.getFullYear());

        let groupedByMonth = [];
        for (let i = 0; i <= today.getMonth(); i++) {
            groupedByMonth.push({month: months[i], count: 0});
        }
        finishedThisYear.forEach(x => {
            groupedByMonth.find(d => d.month === months[x.completedAt.month - 1]).count++;
        })
        setData(groupedByMonth);
    }

    return (
        <Card className="w-1/4">
            <CardHeader>
                <CardTitle>{`${mediaType} Completed`}</CardTitle>
                <CardDescription>
                    <Select defaultValue="year" onValueChange={(val) => setRange(val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="month">Month To Date</SelectItem>
                            <SelectItem value="year">Year To Date</SelectItem>
                        </SelectContent>
                    </Select>
                </CardDescription>
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
                            dataKey={range === "month" ? "day" : "month"}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval={0}
                            tickFormatter={(value) => range === "year" ? value.slice(0, 3) : value}
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