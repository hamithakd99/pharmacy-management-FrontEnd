
import type { ProfitOrder } from "@/types/profit-report.types";
import {
    Badge,
    Box,
    Button,
    Flex,
    Grid,
    HStack,
    Text,
} from "@chakra-ui/react";

import { FiX } from "react-icons/fi";


interface ProfitOrderDetailsProps {
    order: ProfitOrder;
    colors: {
        navy: string;
        green: string;
        red: string;
        muted: string;
        border: string;
        background: string;
    };
    currency: (value: number) => string;
    onClose: () => void;
}

const SUMMARY_ITEMS = [
    { key: "sales", label: "Sales" },
    { key: "buyingCost", label: "Buying Cost" },
    { key: "discount", label: "Discount" },
    { key: "netProfit", label: "Net Profit" },
] as const;

const TABLE_HEADERS = [
    "Product",
    "Paid",
    "Free",
    "Buying Cost",
    "Sales",
    "Discount",
    "Net Profit",
];

const ProfitOrderDetails = ({
    order,
    colors,
    currency,
    onClose,
}: ProfitOrderDetailsProps) => {
    const summaryValues = {
        sales: order.totalAmount,
        buyingCost: order.totalBuyingCost,
        discount: order.discountAmount,
        netProfit: order.netProfit,
    };

    return (
        <Box
            position="fixed"
            inset="0"
            bg="blackAlpha.600"
            zIndex={2000}
            display="flex"
            alignItems={{ base: "flex-end", md: "center" }}
            justifyContent="center"
            p={{ base: 0, md: 4 }}
            onClick={onClose}
        >
            {/* MODAL CONTENT */}
            <Box
                bg="white"
                w="full"
                maxW="950px"
                maxH={{ base: "92dvh", md: "85vh" }}
                overflowY="auto"
                rounded={{ base: "xl", md: "2xl" }}
                p={{ base: 4, md: 6 }}
                onClick={(event) => event.stopPropagation()}
            >
                {/* HEADER */}
                <Flex
                    justify="space-between"
                    align="center"
                    mb={5}
                >
                    <Box>
                        <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color={colors.navy}
                        >
                            Order Profit Details
                        </Text>

                        <HStack mt={2} gap={2} flexWrap="wrap">
                            <Badge
                                colorPalette="teal"
                                variant="subtle"
                            >
                                Order ID: #{order.orderId}
                            </Badge>

                            <Text
                                fontSize="sm"
                                color={colors.muted}
                            >
                                {order.orderNumber}
                            </Text>
                        </HStack>
                    </Box>

                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onClose}
                        aria-label="Close order details"
                    >
                        <FiX />
                    </Button>
                </Flex>

                {/* ORDER SUMMARY */}
                <Grid
                    templateColumns={{
                        base: "repeat(2, 1fr)",
                        md: "repeat(4, 1fr)",
                    }}
                    gap={3}
                    mb={5}
                >
                    {SUMMARY_ITEMS.map((item) => {
                        const value = summaryValues[item.key];

                        const isNetProfit = item.key === "netProfit";

                        return (
                            <Box
                                key={item.key}
                                p={3}
                                bg={colors.background}
                                rounded="lg"
                                minW={0}
                            >
                                <Text
                                    fontSize="xs"
                                    color={colors.muted}
                                >
                                    {item.label}
                                </Text>

                                <Text
                                    fontWeight="bold"
                                    color={
                                        isNetProfit
                                            ? order.netProfit >= 0
                                                ? colors.green
                                                : colors.red
                                            : colors.navy
                                    }
                                    mt={1}
                                    fontSize="sm"
                                    wordBreak="break-word"
                                >
                                    {currency(value)}
                                </Text>
                            </Box>
                        );
                    })}
                </Grid>

                {/* PRODUCT BREAKDOWN */}
                <Text
                    fontWeight="semibold"
                    color={colors.navy}
                    mb={3}
                >
                    Product Breakdown
                </Text>

                <Box
                    overflowX="auto"
                    border="1px solid"
                    borderColor={colors.border}
                    rounded="lg"
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "750px",
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background: colors.background,
                                }}
                            >
                                {TABLE_HEADERS.map((heading) => (
                                    <th
                                        key={heading}
                                        style={{
                                            padding: "12px",
                                            textAlign:
                                                heading === "Product"
                                                    ? "left"
                                                    : "right",
                                            fontSize: "11px",
                                            color: colors.muted,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {order.items.map((item) => (
                                <tr
                                    key={item.orderItemId}
                                    style={{
                                        borderTop: `1px solid ${colors.border}`,
                                    }}
                                >
                                    {/* PRODUCT */}
                                    <td
                                        style={{
                                            padding: "12px",
                                            fontSize: "12px",
                                        }}
                                    >
                                        <strong>
                                            {item.productName}
                                        </strong>

                                        <div
                                            style={{
                                                color: colors.muted,
                                            }}
                                        >
                                            {item.productCode || "-"}
                                        </div>
                                    </td>

                                    {/* PAID QUANTITY */}
                                    <td
                                        style={{
                                            padding: "12px",
                                            textAlign: "right",
                                            fontSize: "12px",
                                        }}
                                    >
                                        {item.paidQuantity}
                                    </td>

                                    {/* FREE ISSUE */}
                                    <td
                                        style={{
                                            padding: "12px",
                                            textAlign: "right",
                                            fontSize: "12px",
                                            color: colors.green,
                                        }}
                                    >
                                        {item.freeIssueQuantity}
                                    </td>

                                    {/* BUYING COST */}
                                    <td
                                        style={{
                                            padding: "12px",
                                            textAlign: "right",
                                            fontSize: "12px",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {currency(item.buyingCost)}
                                    </td>

                                    {/* SALES */}
                                    <td
                                        style={{
                                            padding: "12px",
                                            textAlign: "right",
                                            fontSize: "12px",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {currency(item.sellingAmount)}
                                    </td>

                                    {/* DISCOUNT */}
                                    <td
                                        style={{
                                            padding: "12px",
                                            textAlign: "right",
                                            fontSize: "12px",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {currency(item.allocatedDiscount)}
                                    </td>

                                    {/* NET PROFIT */}
                                    <td
                                        style={{
                                            padding: "12px",
                                            textAlign: "right",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                            whiteSpace: "nowrap",
                                            color:
                                                item.netProfit >= 0
                                                    ? colors.green
                                                    : colors.red,
                                        }}
                                    >
                                        {currency(item.netProfit)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Box>

                {/* FOOTER */}
                <Flex
                    mt={4}
                    justify="space-between"
                    align="center"
                    flexWrap="wrap"
                    gap={3}
                >
                    <Text
                        fontSize="xs"
                        color={colors.muted}
                    >
                        Total quantity: {order.totalQuantity} units
                        {" "} | Free issue: {order.totalFreeIssueQuantity}
                    </Text>

                    <Button
                        bg={colors.navy}
                        color="white"
                        size="sm"
                        onClick={onClose}
                        _hover={{ bg: "#0A5065" }}
                    >
                        Close
                    </Button>
                </Flex>
            </Box>
        </Box>
    );
};

export default ProfitOrderDetails;
