import {
    Badge,
    Box,
    Button,
    Field,
    Flex,
    Input,
    SimpleGrid,
    Table,
    Text,
} from "@chakra-ui/react";
import type { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { FiCalendar, FiPackage, FiTrash2 } from "react-icons/fi";

export type GRNItem = {
    purchaseOrderItemId: number;
    productId: number;
    productCode: string;
    productName: string;
    brand: string;
    orderedQuantity: number;
    alreadyReceived: number;
    remainingQuantity: number;
    receivedQuantity: number;
    buyingPrice: number;
    sellingPrice: number;
    retailPrice?: number | string | null;
    expiryDate: string;
    manufacturingDate: string;
};

type GRNItemsTableProps = {
    items: GRNItem[];
    setItems: Dispatch<SetStateAction<GRNItem[]>>;
};

const currencyInputProps = {
    type: "number" as const,
    min: 0,
    step: "0.01",
};

export default function GRNItemsTable({
    items,
    setItems,
}: GRNItemsTableProps) {
    const updateItem = (
        index: number,
        field: keyof GRNItem,
        value: string | number
    ) => {
        setItems((currentItems) =>
            currentItems.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: value } : item
            )
        );
    };

    const updateReceivedQuantity = (index: number, rawValue: string) => {
        const item = items[index];
        const value = Number(rawValue);

        if (value > item.remainingQuantity) {
            toast.error(
                `Maximum remaining quantity is ${item.remainingQuantity}`
            );
            updateItem(index, "receivedQuantity", item.remainingQuantity);
            return;
        }

        updateItem(
            index,
            "receivedQuantity",
            Number.isFinite(value) ? Math.max(value, 0) : 0
        );
    };

    const removeItem = (index: number) => {
        setItems((currentItems) =>
            currentItems.filter((_, itemIndex) => itemIndex !== index)
        );
    };

    const renderProduct = (item: GRNItem) => (
        <Flex align="flex-start" gap={3} minW="220px">
            <Flex
                w="34px"
                h="34px"
                flexShrink={0}
                align="center"
                justify="center"
                borderRadius="md"
                bg="blue.50"
                color="blue.600"
            >
                <FiPackage />
            </Flex>
            <Box minW={0}>
                <Text
                    fontSize="sm"
                    fontWeight="700"
                    color="gray.800"
                    lineHeight="1.3"
                >
                    {item.productName}
                </Text>
                <Text fontSize="xs" color="blue.600" mt={1}>
                    {item.productCode}
                    {item.brand ? ` · ${item.brand}` : ""}
                </Text>
            </Box>
        </Flex>
    );

    const renderQuantity = (item: GRNItem, index: number) => (
        <Box minW="145px">
            <Flex gap={2} mb={2} wrap="wrap">
                <Badge colorPalette="gray" variant="subtle">
                    Ordered {item.orderedQuantity}
                </Badge>
                {item.alreadyReceived > 0 && (
                    <Badge colorPalette="orange" variant="subtle">
                        Received {item.alreadyReceived}
                    </Badge>
                )}
            </Flex>
            <Field.Root>
                <Field.Label fontSize="xs" color="gray.500" mb={1}>
                    Receiving now
                </Field.Label>
                <Input
                    {...currencyInputProps}
                    size="sm"
                    value={item.receivedQuantity}
                    max={item.remainingQuantity}
                    onChange={(event) =>
                        updateReceivedQuantity(index, event.target.value)
                    }
                />
            </Field.Root>
            <Text fontSize="xs" color="blue.600" mt={1}>
                {item.remainingQuantity} remaining
            </Text>
        </Box>
    );

    const renderPriceField = (
        label: string,
        value: number | string | null | undefined,
        field: keyof GRNItem,
        index: number,
        placeholder: string
    ) => (
        <Field.Root minW="130px">
            <Field.Label fontSize="xs" color="gray.500" mb={1}>
                {label}
            </Field.Label>
            <Input
                {...currencyInputProps}
                size="sm"
                placeholder={placeholder}
                value={value ?? ""}
                onChange={(event) =>
                    updateItem(
                        index,
                        field,
                        event.target.value === ""
                            ? field === "retailPrice"
                                ? ""
                                : 0
                            : field === "retailPrice"
                                ? event.target.value
                                : Number(event.target.value)
                    )
                }
            />
        </Field.Root>
    );

    const renderDateField = (
        label: string,
        value: string,
        field: "manufacturingDate" | "expiryDate",
        index: number,
        required = false
    ) => (
        <Field.Root minW="145px" required={required}>
            <Field.Label fontSize="xs" color="gray.500" mb={1}>
                <Flex align="center" gap={1}>
                    <FiCalendar />
                    {label}
                </Flex>
            </Field.Label>
            <Input
                type="date"
                size="sm"
                value={value}
                onChange={(event) =>
                    updateItem(index, field, event.target.value)
                }
            />
        </Field.Root>
    );

    return (
        <Box width="100%">
            <Box
                display={{ base: "block", xl: "none" }}
                spaceY={3}
            >
                {items.map((item, index) => (
                    <Box
                        key={item.purchaseOrderItemId}
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        p={4}
                        bg="white"
                    >
                        <Flex justify="space-between" gap={3} align="flex-start">
                            {renderProduct(item)}
                            <Button
                                size="xs"
                                variant="ghost"
                                colorPalette="red"
                                onClick={() => removeItem(index)}
                                aria-label={`Remove ${item.productName}`}
                            >
                                <FiTrash2 />
                            </Button>
                        </Flex>

                        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3} mt={4}>
                            {renderQuantity(item, index)}
                            {renderPriceField(
                                "Buying price",
                                item.buyingPrice,
                                "buyingPrice",
                                index,
                                "0.00"
                            )}
                            {renderPriceField(
                                "Wholesale price",
                                item.sellingPrice,
                                "sellingPrice",
                                index,
                                "0.00"
                            )}
                            {renderPriceField(
                                "Retail price",
                                item.retailPrice,
                                "retailPrice",
                                index,
                                "Optional"
                            )}
                            {renderDateField(
                                "Manufactured",
                                item.manufacturingDate,
                                "manufacturingDate",
                                index
                            )}
                            {renderDateField(
                                "Expiry date",
                                item.expiryDate,
                                "expiryDate",
                                index,
                                true
                            )}
                        </SimpleGrid>
                    </Box>
                ))}
            </Box>

            <Box
                display={{ base: "none", xl: "block" }}
                overflowX="auto"
                pb={2}
            >
                <Table.Root
                    variant="outline"
                    size="sm"
                    minW="1180px"
                    borderRadius="lg"
                    overflow="hidden"
                >
                    <Table.Header>
                        <Table.Row bg="gray.50">
                            <Table.ColumnHeader minW="250px">
                                Product
                            </Table.ColumnHeader>
                            <Table.ColumnHeader minW="155px">
                                Quantity
                            </Table.ColumnHeader>
                            <Table.ColumnHeader colSpan={3}>
                                Pricing
                            </Table.ColumnHeader>
                            <Table.ColumnHeader colSpan={2}>
                                Batch dates
                            </Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center">
                                Action
                            </Table.ColumnHeader>
                        </Table.Row>
                        <Table.Row bg="gray.50">
                            <Table.ColumnHeader />
                            <Table.ColumnHeader />
                            <Table.ColumnHeader>Buying</Table.ColumnHeader>
                            <Table.ColumnHeader>Wholesale</Table.ColumnHeader>
                            <Table.ColumnHeader>Retail</Table.ColumnHeader>
                            <Table.ColumnHeader>Manufactured</Table.ColumnHeader>
                            <Table.ColumnHeader>Expiry</Table.ColumnHeader>
                            <Table.ColumnHeader />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {items.map((item, index) => (
                            <Table.Row
                                key={item.purchaseOrderItemId}
                                _hover={{ bg: "blue.50" }}
                                transition="background-color 0.2s"
                            >
                                <Table.Cell>{renderProduct(item)}</Table.Cell>
                                <Table.Cell>{renderQuantity(item, index)}</Table.Cell>
                                <Table.Cell>
                                    {renderPriceField(
                                        "Buying price",
                                        item.buyingPrice,
                                        "buyingPrice",
                                        index,
                                        "0.00"
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {renderPriceField(
                                        "Wholesale price",
                                        item.sellingPrice,
                                        "sellingPrice",
                                        index,
                                        "0.00"
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {renderPriceField(
                                        "Retail price",
                                        item.retailPrice,
                                        "retailPrice",
                                        index,
                                        "Optional"
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {renderDateField(
                                        "Manufactured",
                                        item.manufacturingDate,
                                        "manufacturingDate",
                                        index
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {renderDateField(
                                        "Expiry date",
                                        item.expiryDate,
                                        "expiryDate",
                                        index,
                                        true
                                    )}
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        colorPalette="red"
                                        onClick={() => removeItem(index)}
                                        aria-label={`Remove ${item.productName}`}
                                    >
                                        <FiTrash2 />
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>
        </Box>
    );
}
