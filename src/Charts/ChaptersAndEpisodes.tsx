import {CartesianGrid, Line, LineChart, XAxis} from "recharts"
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
import {useContext, useEffect, useState} from "react";
import {AniDashContext} from "@/AniDashContext.ts";

export function ChaptersAndEpisodes({mediaType}) {
    const [rawData, setRawData] = useState([]);
    const [chartData, setChartData] = useState([]);

    let {user} = useContext(AniDashContext);

    useEffect(() => {
        getNextPage(1);
    }, []);

    const chartConfig = {
        count: {
            label: "Count",
            color: user.theme,
        },
    } satisfies ChartConfig

    async function getNextPage(pageNumber: number) {
        const today = new Date();
        const greaterThan = new Date(today.getFullYear(), today.getMonth(), 1);

        let query = `
            query {
                Page (page: ${pageNumber}, perPage: 200) {
                    pageInfo {
                        currentPage,
                        perPage,
                        hasNextPage
                    }
                    activities(userId: ${user.id}, type: ${mediaType === 'Anime' ? 'ANIME_LIST' : 'MANGA_LIST'}, createdAt_greater: ${greaterThan.getTime() / 1000}) {
                        ... on ListActivity {
                            createdAt
                            media {
                                title {
                                    english
                                }
                            },
                            progress,
                            status
                        }
                    }
                }
            }
        `

        const url = 'https://graphql.anilist.co',
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                })
            };

        await fetch(url, options)
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then((data) => {
                setRawData([...rawData, ...data.data.Page.activities]);

                if (data.data.Page.pageInfo.hasNextPage) {
                    setTimeout(() => getNextPage(pageNumber++), 1000);
                } else {
                    getData([...chartData, ...data.data.Page.activities]);
                }
            })
            .catch(console.log);
    }

    function getData(data) {
        monthToDate(data);
    }

    function monthToDate(entries) {
        const today = new Date();

        const groupedByDay = [];
        for (let i = 1; i <= today.getDate(); i++) { // Note: new Date(today.getFullYear(), today.getMonth(), 0).getDate() would get the total number of days in the month
            groupedByDay.push({day: i, count: 0});
        }
        entries.forEach(x => {
            groupedByDay.find(d => d.day === new Date(x.createdAt * 1000).getDate()).count += getCount(x);
        })
        setChartData(groupedByDay);
    }

    // function yearToDate(entries) {
    //     const today = new Date();
    //
    //     const groupedByMonth = [];
    //     for (let i = 0; i <= today.getMonth(); i++) {
    //         groupedByMonth.push({month: months[i], count: 0});
    //     }
    //     entries.forEach(x => {
    //         groupedByMonth.find(d => d.month === new Date(x.createdAt * 1000).getMonth()).count += getCount(x);
    //     })
    //     setChartData(groupedByMonth);
    // }

    function getCount(entry) {
        if (entry.status === 'completed') {
            return 1;
        } else if (entry.status === 'dropped') {
            return 0;
        } else {
            const progressParts = entry.progress.split(' - ');
            if (progressParts.length > 1) {
                return progressParts[1] - progressParts[0];
            } else {
                return 1;
            }
        }
    }

    return (
        <Card className="w-1/4">
            <CardHeader>
                <CardTitle>{mediaType === 'Anime' ? `Episodes Watched` : `Chapters Read`}</CardTitle>
                <CardDescription>
                    Month To Date
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false}/>
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
                            content={<ChartTooltipContent hideLabel/>}
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
                <h2 className="text-md">{`Total ${mediaType === 'Anime' ? 'episodes' : 'chapters'}:`}</h2>
                <h1 className="text-2xl">{chartData.reduce((acc, x) => acc + x.count, 0)}</h1>
            </CardFooter>
        </Card>
    )
}