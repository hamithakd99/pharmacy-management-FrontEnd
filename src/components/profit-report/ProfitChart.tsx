
import type { ProfitOrder } from "@/types/profit-report.types";
import { useMemo } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";


interface ProfitChartProps {
    orders: ProfitOrder[];
    colors: {
        navy: string;
        green: string;
        muted: string;
        border: string;
    };
    currency: (value: number) => string;
}

interface ChartItem {
    date: string;
    sales: number;
    profit: number;
}

const ProfitChart = ({
    orders,
    colors,
    currency,
}: ProfitChartProps) => {
    const chartData = useMemo<ChartItem[]>(() => {
        const grouped: Record<string, ChartItem> = {};

        orders.forEach((order) => {
            const date = new Date(order.createdAt).toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                }
            );

            if (!grouped[date]) {
                grouped[date] = {
                    date,
                    sales: 0,
                    profit: 0,
                };
            }

            grouped[date].sales += Number(order.totalAmount) || 0;
            grouped[date].profit += Number(order.netProfit) || 0;
        });

        return Object.values(grouped).reverse();
    }, [orders]);

    return (
        <div
            style={{
                background: "#FFFFFF",
                border: `1px solid ${colors.border}`,
                borderRadius: "14px",
                padding: "20px",
                width: "100%",
                minWidth: 0,
            }}
        >
            {/* Chart Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "20px",
                }}
            >
                <div>
                    <h3
                        style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#073B4C",
                            margin: 0,
                        }}
                    >
                        Sales & Profit Overview
                    </h3>

                    <p
                        style={{
                            fontSize: "12px",
                            color: colors.muted,
                            marginTop: "5px",
                            marginBottom: 0,
                        }}
                    >
                        Daily performance of the current report page
                    </p>
                </div>

                {/* Legend */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                        }}
                    >
                        <span
                            style={{
                                width: "9px",
                                height: "9px",
                                borderRadius: "50%",
                                background: colors.navy,
                            }}
                        />
                        <span style={{ fontSize: "12px", color: colors.muted }}>
                            Sales
                        </span>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                        }}
                    >
                        <span
                            style={{
                                width: "9px",
                                height: "9px",
                                borderRadius: "50%",
                                background: colors.green,
                            }}
                        />
                        <span style={{ fontSize: "12px", color: colors.muted }}>
                            Profit
                        </span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            {chartData.length > 0 ? (
                <div style={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id="salesGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor={colors.navy}
                                        stopOpacity={0.2}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={colors.navy}
                                        stopOpacity={0}
                                    />
                                </linearGradient>

                                <linearGradient
                                    id="profitGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor={colors.green}
                                        stopOpacity={0.2}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor={colors.green}
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke={colors.border}
                            />

                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fontSize: 11,
                                    fill: colors.muted,
                                }}
                                dy={8}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{
                                    fontSize: 11,
                                    fill: colors.muted,
                                }}
                                tickFormatter={(value: number) =>
                                    value >= 1000
                                        ? `${(value / 1000).toFixed(0)}k`
                                        : value.toString()
                                }
                                width={45}
                            />

                            <Tooltip
                                formatter={(value) =>
                                    currency(Number(value) || 0)
                                }
                                contentStyle={{
                                    borderRadius: "10px",
                                    border: `1px solid ${colors.border}`,
                                    fontSize: "12px",
                                }}
                            />

                            <Area
                                type="monotone"
                                dataKey="sales"
                                name="Sales"
                                stroke={colors.navy}
                                strokeWidth={2}
                                fill="url(#salesGradient)"
                                activeDot={{ r: 5 }}
                            />

                            <Area
                                type="monotone"
                                dataKey="profit"
                                name="Profit"
                                stroke={colors.green}
                                strokeWidth={2}
                                fill="url(#profitGradient)"
                                activeDot={{ r: 5 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div
                    style={{
                        height: "260px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: colors.muted,
                        fontSize: "13px",
                    }}
                >
                    No chart data available for this page.
                </div>
            )}
        </div>
    );
};

export default ProfitChart;
