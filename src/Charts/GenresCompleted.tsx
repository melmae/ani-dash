import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {useContext, useEffect, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {AniDashContext} from "@/AniDashContext.ts";

export function GenresCompleted({rawData, mediaType}) {
    const [data, setData] = useState([]);
    const [range, setRange] = useState("year");

    const { user } = useContext(AniDashContext);

    useEffect(() => {
        if (rawData.length === 0) return;

        getData(rawData);
    }, [range, rawData]);

    const chartConfig = {
        desktop: {
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
        finishedThisMonth.forEach(x => {
            x.media.genres.forEach((item) => {
                if (!groupedByDay.find(d => d.genre === item)) {
                    groupedByDay.push({genre: item, count: 0});
                }
                groupedByDay.find(d => d.genre === item).count++;
            })
        })
        setData(groupedByDay);
    }

    function yearToDate(entries) {
        const today = new Date();
        const finishedThisYear = entries.filter(x => x.completedAt.year === today.getFullYear());

        let groupedByMonth = [];
        finishedThisYear.forEach(x => {
            x.media.genres.forEach((item) => {
                if (!groupedByMonth.find(d => d.genre === item)) {
                    groupedByMonth.push({genre: item, count: 0});
                }
                groupedByMonth.find(d => d.genre === item).count++;
            })
        })
        setData(groupedByMonth);
    }

    return (
        <Card className="w-1/3">
            <CardHeader>
                <CardTitle>{`${mediaType} Genre Distribution`}</CardTitle>
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