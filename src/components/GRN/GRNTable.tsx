
import type { StockBatch } from "@/types/stockBatch";
import {
    Badge,
    Button,
    HStack,
    Table,
    Text,
} from "@chakra-ui/react";

type Props = {
    stockBatches: StockBatch[];
    onView: (batch: StockBatch) => void;
    onEdit: (batch: StockBatch) => void;
    onPrint: (batch: StockBatch) => void;
};

export default function GRNTable({
    stockBatches,
    onView,
    onEdit,
    onPrint,
}: Props) {
    return (
        <Table.ScrollArea
            borderWidth="1px"
            borderColor="gray.200"
            rounded="lg"
            mt={5}
            width="100%"
        >
            <Table.Root
                variant="outline"
                colorPalette="blue"
                size="sm"
                minW="900px"
                tableLayout="auto"
            >
                <Table.Header>
                    <Table.Row bg="gray.50">
                        <Table.ColumnHeader
                            px={4}
                            py={3}
                            fontSize="sm"
                            fontWeight="semibold"
                            whiteSpace="nowrap"
                        >
                            Batch Number
                        </Table.ColumnHeader>

                        <Table.ColumnHeader
                            px={4}
                            py={3}
                            fontSize="sm"
                            fontWeight="semibold"
                            whiteSpace="nowrap"
                        >
                            Purchase Order
                        </Table.ColumnHeader>

                        <Table.ColumnHeader
                            px={4}
                            py={3}
                            fontSize="sm"
                            fontWeight="semibold"
                            whiteSpace="nowrap"
                        >
                            Supplier
                        </Table.ColumnHeader>

                        <Table.ColumnHeader
                            px={4}
                            py={3}
                            fontSize="sm"
                            fontWeight="semibold"
                            whiteSpace="nowrap"
                        >
                            Received Date
                        </Table.ColumnHeader>

                        <Table.ColumnHeader
                            px={4}
                            py={3}
                            textAlign="center"
                            fontSize="sm"
                            fontWeight="semibold"
                        >
                            Items
                        </Table.ColumnHeader>

                        <Table.ColumnHeader
                            px={4}
                            py={3}
                            fontSize="sm"
                            fontWeight="semibold"
                        >
                            Payment
                        </Table.ColumnHeader>

                        <Table.ColumnHeader
                            px={4}
                            py={3}
                            fontSize="sm"
                            fontWeight="semibold"
                            textAlign="center"
                        >
                            Actions
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {stockBatches.length === 0 ? (
                        <Table.Row>
                            <Table.Cell
                                colSpan={7}
                                py={10}
                                textAlign="center"
                            >
                                <Text
                                    color="gray.500"
                                    fontSize="sm"
                                >
                                    No GRNs found
                                </Text>
                            </Table.Cell>
                        </Table.Row>
                    ) : (
                        stockBatches.map((batch) => (
                            <Table.Row
                                key={batch.id}
                                _hover={{ bg: "blue.50" }}
                                transition="background 0.15s"
                            >
                                <Table.Cell px={4} py={3}>
                                    <Text
                                        fontSize="sm"
                                        fontWeight="bold"
                                        color="blue.700"
                                        whiteSpace="nowrap"
                                    >
                                        {batch.batchNumber}
                                    </Text>
                                </Table.Cell>

                                <Table.Cell px={4} py={3}>
                                    <Text
                                        fontSize="sm"
                                        whiteSpace="nowrap"
                                    >
                                        {batch.purchaseOrder?.orderNumber ?? "-"}
                                    </Text>
                                </Table.Cell>

                                <Table.Cell px={4} py={3}>
                                    <Text
                                        fontSize="sm"
                                        whiteSpace="nowrap"
                                    >
                                        {batch.supplier
                                            ? `${batch.supplier.firstName} ${batch.supplier.lastName}`
                                            : "N/A"}
                                    </Text>
                                </Table.Cell>

                                <Table.Cell px={4} py={3}>
                                    <Text
                                        fontSize="sm"
                                        color="gray.700"
                                        whiteSpace="nowrap"
                                    >
                                        {new Date(
                                            batch.receivedDate
                                        ).toLocaleDateString("en-GB")}
                                    </Text>
                                </Table.Cell>

                                <Table.Cell
                                    px={4}
                                    py={3}
                                    textAlign="center"
                                >
                                    <Text fontSize="sm">
                                        {batch.items.length}
                                    </Text>
                                </Table.Cell>

                                <Table.Cell px={4} py={3}>
                                    <Badge
                                        colorPalette={
                                            batch.paymentStatus === "PAID"
                                                ? "green"
                                                : batch.paymentStatus === "PENDING"
                                                    ? "orange"
                                                    : "blue"
                                        }
                                        variant="subtle"
                                        px={2}
                                        py={1}
                                        rounded="md"
                                        fontSize="xs"
                                        whiteSpace="nowrap"
                                    >
                                        {batch.paymentStatus}
                                    </Badge>
                                </Table.Cell>

                                <Table.Cell px={4} py={3}>
                                    <HStack
                                        justify="center"
                                        gap={2}
                                        flexWrap="nowrap"
                                    >
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            colorPalette="blue"
                                            minW="62px"
                                            onClick={() => onView(batch)}
                                        >
                                            View
                                        </Button>

                                        <Button
                                            size="sm"
                                            colorPalette="teal"
                                            minW="62px"
                                            onClick={() => onEdit(batch)}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            size="sm"
                                            colorPalette="gray"
                                            minW="62px"
                                            onClick={() => onPrint(batch)}
                                        >
                                            Print
                                        </Button>
                                    </HStack>
                                </Table.Cell>
                            </Table.Row>
                        ))
                    )}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
}
