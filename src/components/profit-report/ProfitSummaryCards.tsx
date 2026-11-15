
import type { ProfitSummary } from "@/types/profit-report.types";
import {
    Box,
    Flex,
    Grid,
    HStack,
    Text,
} from "@chakra-ui/react";

import {
    FiTrendingUp,
    FiShoppingBag,
    FiPackage,
    FiGift,
    FiPercent,
} from "react-icons/fi";

interface ProfitSummaryCardsProps {
    summary: ProfitSummary;

    colors: {
        navy: string;
        green: string;
        mint: string;
        muted: string;
        border: string;
        red: string;
    };

    currency: (value: number) => string;
    numberFormat: (value: number) => string;
}

interface SummaryCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    negative?: boolean;
    colors: ProfitSummaryCardsProps["colors"];
}

const SummaryCard = ({
    title,
    value,
    subtitle,
    icon,
    color,
    bg,
    negative = false,
    colors,
}: SummaryCardProps) => {
    return (
        <Box
            bg="white"
            p={{ base: 3, md: 4 }}
            rounded="xl"
            border="1px solid"
            borderColor={colors.border}
            minW="0"
            boxShadow="0 2px 8px rgba(7,59,76,0.025)"
        >
            <Flex justify="space-between" align="center" gap={2}>
                <Box minW="0">
                    <Text
                        color={colors.muted}
                        fontSize="xs"
                        fontWeight="medium"
                    >
                        {title}
                    </Text>

                    <Text
                        fontSize={{ base: "lg", md: "xl" }}
                        fontWeight="bold"
                        color={negative ? colors.red : colors.navy}
                        mt={2}
                        wordBreak="break-word"
                    >
                        {value}
                    </Text>
                </Box>

                <Flex
                    w="42px"
                    h="42px"
                    flexShrink={0}
                    align="center"
                    justify="center"
                    rounded="xl"
                    bg={bg}
                    color={color}
                    fontSize="19px"
                >
                    {icon}
                </Flex>
            </Flex>

            <Text fontSize="xs" color={colors.muted} mt={3}>
                {subtitle}
            </Text>
        </Box>
    );
};

export default function ProfitSummaryCards({
    summary,
    colors,
    currency,
    numberFormat,
}: ProfitSummaryCardsProps) {
    const isProfitPositive = summary.totalNetProfit >= 0;

    const summaryCards: SummaryCardProps[] = [
        {
            title: "Total Sales",
            value: currency(summary.totalSales),
            subtitle: `${numberFormat(summary.totalOrders)} confirmed orders`,
            icon: <FiShoppingBag />,
            color: colors.navy,
            bg: "#EAF0F4",
            colors,
        },
        {
            title: "Buying Cost",
            value: currency(summary.totalBuyingCost),
            subtitle: "Including free issue stock cost",
            icon: <FiPackage />,
            color: "#D18A27",
            bg: "#FFF5E6",
            colors,
        },
        {
            title: "Total Discount",
            value: currency(summary.totalDiscount),
            subtitle: "Discount given to customers",
            icon: <FiPercent />,
            color: "#8B65C7",
            bg: "#F3EEFC",
            colors,
        },
        {
            title: "Net Profit",
            value: currency(summary.totalNetProfit),
            subtitle: `${Number(
                summary.overallProfitMargin || 0
            ).toFixed(2)}% profit margin`,
            icon: <FiTrendingUp />,
            color: isProfitPositive ? colors.green : colors.red,
            bg: isProfitPositive ? colors.mint : "#FDECEC",
            negative: !isProfitPositive,
            colors,
        },
    ];

    const quantityOverview = [
        {
            label: "Paid Quantity",
            value: summary.totalPaidQuantity,
            icon: <FiPackage />,
            color: colors.navy,
        },
        {
            label: "Free Issue Quantity",
            value: summary.totalFreeIssueQuantity,
            icon: <FiGift />,
            color: colors.green,
        },
        {
            label: "Total Stock Sold / Issued",
            value:
                summary.totalPaidQuantity +
                summary.totalFreeIssueQuantity,
            icon: <FiShoppingBag />,
            color: "#D18A27",
        },
    ];

    return (
        <>
            {/* FINANCIAL SUMMARY CARDS */}

            <Grid
                templateColumns={{
                    base: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(4, minmax(0, 1fr))",
                }}
                gap={3}
            >
                {summaryCards.map((card) => (
                    <SummaryCard
                        key={card.title}
                        {...card}
                    />
                ))}
            </Grid>

            {/* QUANTITY OVERVIEW */}

            <Grid
                templateColumns={{
                    base: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                }}
                gap={3}
            >
                {quantityOverview.map((item) => (
                    <HStack
                        key={item.label}
                        bg="white"
                        p={3}
                        rounded="xl"
                        border="1px solid"
                        borderColor={colors.border}
                        gap={3}
                    >
                        <Box
                            color={item.color}
                            fontSize="20px"
                            flexShrink={0}
                        >
                            {item.icon}
                        </Box>

                        <Box minW="0">
                            <Text
                                fontSize="xs"
                                color={colors.muted}
                            >
                                {item.label}
                            </Text>

                            <Text
                                fontSize="lg"
                                fontWeight="bold"
                                color={colors.navy}
                            >
                                {numberFormat(item.value)}
                            </Text>
                        </Box>
                    </HStack>
                ))}
            </Grid>
        </>
    );
}
