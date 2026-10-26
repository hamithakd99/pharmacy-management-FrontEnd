import {
    Badge,
    Box,
    Button,
    Field,
    Flex,
    Heading,
    Input,
    NativeSelect,
    SimpleGrid,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/api/axios";
import { FiCalendar, FiPackage } from "react-icons/fi";

type GRNFormProps = {

    mode: "create" | "edit";

    batchNumber?: string;

};

type GRNItem = {

    id?: number;

    productId: number;

    productCode: string;

    productName: string;

    receivedQuantity: number;

    buyingPrice: number;

    sellingPrice: number;

    retailPrice?: number | string | null;

    expiryDate: string;

    manufacturingDate: string;

};

export default function GRNForm({

    mode,

    batchNumber,

}: GRNFormProps) {

    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [supplierName, setSupplierName] =
        useState("");

    const [invoiceNumber, setInvoiceNumber] =
        useState("");

    const [receivedDate, setReceivedDate] =
        useState("");

    const [paymentStatus, setPaymentStatus] =
        useState("PENDING");

    const [invoiceDiscount, setInvoiceDiscount] =
        useState(0);

    const [items, setItems] =
        useState<GRNItem[]>([]);


    /*
    =========================================================
    LOAD EXISTING GRN
    =========================================================
    */

    useEffect(() => {

        if (mode !== "edit" || !batchNumber) {

            return;

        }

        getGRN();

    }, [mode, batchNumber]);


    async function getGRN() {

        try {

            setLoading(true);

            const response = await api.get("/stock-batch/" + batchNumber);

            const batch = response.data.data;


            setSupplierName(

                batch.supplier

                    ? batch.supplier.firstName +

                    " " +

                    batch.supplier.lastName

                    : "-"

            );

            setInvoiceNumber(
                batch.invoiceNumber
            );

            setReceivedDate(

                new Date(batch.receivedDate)

                    .toISOString()

                    .split("T")[0]

            );

            setPaymentStatus(
                batch.paymentStatus
            );

            setInvoiceDiscount(
                batch.invoiceDiscountAmount
            );

            setItems(

                batch.items.map((item: any) => ({

                    id: item.id,

                    productId:
                        item.productId,

                    productCode: item.product?.productId ?? "-",

                    productName:

                        item.product?.name ??

                        "-",

                    receivedQuantity:

                        item.receivedQuantity,

                    buyingPrice:

                        item.buyingPrice,

                    sellingPrice:

                        item.sellingPrice,

                    retailPrice: item.retailPrice ?? "",

                    expiryDate:

                        item.expiryDate

                            ? new Date(
                                item.expiryDate
                            )
                                .toISOString()
                                .split("T")[0]

                            : "",

                    manufacturingDate:

                        item.manufacturingDate

                            ? new Date(
                                item.manufacturingDate
                            )
                                .toISOString()
                                .split("T")[0]

                            : "",

                }))

            );

        }

        catch (error) {

            console.error(error);

            toast.error(
                "Failed to load GRN"
            );

        }

        finally {

            setLoading(false);

        }

    }


    /*
    =========================================================
    UPDATE ITEM
    =========================================================
    */

    function updateItem(

        index: number,

        field: keyof GRNItem,

        value: string | number

    ) {

        setItems((currentItems) => {

            const updated = [...currentItems];

            updated[index] = {

                ...updated[index],

                [field]: value,

            };

            return updated;

        });

    }


    /*
    =========================================================
    VALIDATION
    =========================================================
    */

    function validateForm() {

        if (!invoiceNumber.trim()) {

            toast.error(
                "Invoice number is required"
            );

            return false;

        }

        if (items.length === 0) {

            toast.error(
                "No GRN items found"
            );

            return false;

        }

        for (const item of items) {

            if (item.receivedQuantity <= 0) {

                toast.error(

                    `Invalid quantity for ${item.productName}`

                );

                return false;

            }

            if (item.buyingPrice < 0) {

                toast.error(

                    `Invalid buying price for ${item.productName}`

                );

                return false;

            }

            if (item.sellingPrice < 0) {

                toast.error(

                    `Invalid selling price for ${item.productName}`

                );

                return false;

            }

            if (!item.expiryDate) {

                toast.error(

                    `Expiry date is required for ${item.productName}`

                );

                return false;

            }

        }

        return true;

    }


    /*
    =========================================================
    UPDATE GRN
    =========================================================
    */

    async function updateGRN() {

        if (!batchNumber) {

            return;

        }

        if (!validateForm()) {

            return;

        }

        try {

            setSaving(true);

            await api.put("/stock-batch/" + batchNumber,

                {

                    paymentStatus,

                    invoiceDiscountAmount:
                        invoiceDiscount,

                    items: items.map((item) => ({

                        id: item.id,

                        receivedQuantity:
                            item.receivedQuantity,

                        buyingPrice:
                            item.buyingPrice,

                        sellingPrice:
                            item.sellingPrice,

                        retailPrice: item.retailPrice ?? "",

                        expiryDate:
                            item.expiryDate,

                        manufacturingDate:
                            item.manufacturingDate || null,

                    })),

                },

                {

                    headers: {

                        Authorization:

                            "Bearer " +

                            localStorage.getItem(
                                "token"
                            ),

                    },

                }

            );

            toast.success(

                "GRN updated successfully"

            );

            navigate("/admin/grn");

        }

        catch (error: any) {

            console.error(error);

            toast.error(

                error.response?.data?.message ??

                "Failed to update GRN"

            );

        }

        finally {

            setSaving(false);

        }

    }


    /*
    =========================================================
    LOADING
    =========================================================
    */

    if (loading) {

        return (

            <Flex
                justify="center"
                align="center"
                minH="300px"
            >

                <Spinner size="xl" />

            </Flex>

        );

    }


    return (

        <Box>

            {/* HEADER */}

            <Box
                bg="blue.500"
                color="white"
                p={4}
                rounded="md"
                textAlign="center"
                fontWeight="bold"
                mb={6}
            >

                {mode === "edit"

                    ? "Edit Goods Received Note"

                    : "Create Goods Received Note"

                }

            </Box>


            {/* BASIC INFORMATION */}

            <Box
                bg="white"
                borderWidth="1px"
                rounded="lg"
                p={6}
                mb={6}
            >

                <Heading
                    size="md"
                    mb={5}
                >

                    GRN Information

                </Heading>

                <Flex
                    gap={6}
                    wrap="wrap"
                >

                    <Box
                        flex="1"
                        minW="250px"
                    >

                        <Field.Root>

                            <Field.Label>

                                Supplier

                            </Field.Label>

                            <Input

                                value={
                                    supplierName
                                }

                                readOnly

                                bg="gray.100"

                            />

                        </Field.Root>

                    </Box>


                    <Box
                        flex="1"
                        minW="250px"
                    >

                        <Field.Root>

                            <Field.Label>

                                Invoice Number

                            </Field.Label>

                            <Input

                                value={
                                    invoiceNumber
                                }

                                readOnly

                                bg="gray.100"

                            />

                        </Field.Root>

                    </Box>


                    <Box
                        flex="1"
                        minW="250px"
                    >

                        <Field.Root>

                            <Field.Label>

                                Received Date

                            </Field.Label>

                            <Input

                                type="date"

                                value={
                                    receivedDate
                                }

                                readOnly

                                bg="gray.100"

                            />

                        </Field.Root>

                    </Box>


                    <Box
                        flex="1"
                        minW="250px"
                    >

                        <Field.Root>

                            <Field.Label>

                                Payment Status

                            </Field.Label>

                            <NativeSelect.Root>

                                <NativeSelect.Field

                                    value={
                                        paymentStatus
                                    }

                                    onChange={(e) =>

                                        setPaymentStatus(
                                            e.target.value
                                        )

                                    }

                                >

                                    <option value="PENDING">

                                        Pending

                                    </option>

                                    <option value="PAID">

                                        Paid

                                    </option>

                                </NativeSelect.Field>

                                <NativeSelect.Indicator />

                            </NativeSelect.Root>

                        </Field.Root>

                    </Box>


                    <Box
                        flex="1"
                        minW="250px"
                    >

                        <Field.Root>

                            <Field.Label>

                                Invoice Discount

                            </Field.Label>

                            <Input

                                type="number"

                                min={0}

                                value={
                                    invoiceDiscount
                                }

                                onChange={(e) =>

                                    setInvoiceDiscount(

                                        Number(
                                            e.target.value
                                        )

                                    )

                                }

                            />

                        </Field.Root>

                    </Box>

                </Flex>

            </Box>


            {/* ITEMS */}

            <Box
                bg="white"
                borderWidth="1px"
                rounded="lg"
                overflow="hidden"
            >

                <Flex
                    px={{ base: 4, md: 5 }}
                    py={4}
                    bg="gray.50"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    align="center"
                    gap={3}
                >
                    <Flex
                        w="36px"
                        h="36px"
                        align="center"
                        justify="center"
                        borderRadius="lg"
                        bg="blue.50"
                        color="blue.600"
                    >
                        <FiPackage />
                    </Flex>
                    <Box>
                        <Heading size="sm" color="gray.800">
                            GRN Items
                        </Heading>
                        <Text fontSize="xs" color="gray.500" mt={1}>
                            Review quantities, prices, and batch dates
                        </Text>
                    </Box>
                    <Badge
                        ml="auto"
                        colorPalette="blue"
                        variant="subtle"
                        borderRadius="full"
                        px={3}
                    >
                        {items.length} {items.length === 1 ? "item" : "items"}
                    </Badge>
                </Flex>

                <Box p={{ base: 3, md: 4 }}>
                    <Box
                        display={{ base: "none", xl: "grid" }}
                        gridTemplateColumns="minmax(220px, 1.6fr) 120px repeat(3, minmax(125px, 1fr)) repeat(2, minmax(145px, 1fr))"
                        gap={3}
                        px={3}
                        py={2}
                        bg="gray.50"
                        borderRadius="md"
                        color="gray.500"
                        fontSize="xs"
                        fontWeight="700"
                        textTransform="uppercase"
                        letterSpacing="wide"
                    >
                        <Text>Product</Text>
                        <Text>Received</Text>
                        <Text>Buying price</Text>
                        <Text>Wholesale</Text>
                        <Text>Retail</Text>
                        <Text>Expiry date</Text>
                        <Text>Manufactured</Text>
                    </Box>

                    <Box spaceY={3} mt={{ base: 0, xl: 3 }}>
                        {items.map((item, index) => (
                            <Box
                                key={item.id ?? index}
                                border="1px solid"
                                borderColor="gray.200"
                                borderRadius="lg"
                                p={{ base: 3, md: 4 }}
                                _hover={{ borderColor: "blue.200", bg: "blue.50" }}
                                transition="all 0.2s"
                            >
                                <SimpleGrid
                                    columns={{ base: 1, sm: 2, xl: 7 }}
                                    gap={{ base: 3, xl: 4 }}
                                    alignItems="end"
                                >
                                    <Flex
                                        align="flex-start"
                                        gap={3}
                                        minW={0}
                                    >
                                        <Flex
                                            w="32px"
                                            h="32px"
                                            flexShrink={0}
                                            align="center"
                                            justify="center"
                                            borderRadius="md"
                                            bg="white"
                                            color="blue.600"
                                            border="1px solid"
                                            borderColor="blue.100"
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
                                            <Text
                                                fontSize="xs"
                                                color="blue.600"
                                                mt={1}
                                            >
                                                {item.productCode}
                                            </Text>
                                        </Box>
                                    </Flex>

                                    <Field.Root>
                                        <Field.Label fontSize="xs" color="gray.500">
                                            Received quantity
                                        </Field.Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            size="sm"
                                            value={item.receivedQuantity}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    "receivedQuantity",
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </Field.Root>

                                    {[
                                        {
                                            label: "Buying price",
                                            field: "buyingPrice" as const,
                                            value: item.buyingPrice,
                                        },
                                        {
                                            label: "Wholesale price",
                                            field: "sellingPrice" as const,
                                            value: item.sellingPrice,
                                        },
                                        {
                                            label: "Retail price",
                                            field: "retailPrice" as const,
                                            value: item.retailPrice ?? "",
                                        },
                                    ].map((price) => (
                                        <Field.Root key={price.field}>
                                            <Field.Label fontSize="xs" color="gray.500">
                                                {price.label}
                                            </Field.Label>
                                            <Input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                size="sm"
                                                placeholder={
                                                    price.field === "retailPrice"
                                                        ? "Optional"
                                                        : "0.00"
                                                }
                                                value={price.value}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        price.field,
                                                        price.field === "retailPrice"
                                                            ? e.target.value
                                                            : Number(e.target.value)
                                                    )
                                                }
                                            />
                                        </Field.Root>
                                    ))}

                                    {[
                                        {
                                            label: "Expiry date",
                                            field: "expiryDate" as const,
                                            value: item.expiryDate,
                                        },
                                        {
                                            label: "Manufactured",
                                            field: "manufacturingDate" as const,
                                            value: item.manufacturingDate,
                                        },
                                    ].map((date) => (
                                        <Field.Root key={date.field}>
                                            <Field.Label fontSize="xs" color="gray.500">
                                                <Flex align="center" gap={1}>
                                                    <FiCalendar />
                                                    {date.label}
                                                </Flex>
                                            </Field.Label>
                                            <Input
                                                type="date"
                                                size="sm"
                                                value={date.value}
                                                onChange={(e) =>
                                                    updateItem(
                                                        index,
                                                        date.field,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </Field.Root>
                                    ))}
                                </SimpleGrid>

                                <Flex
                                    mt={3}
                                    pt={2}
                                    borderTop="1px solid"
                                    borderColor="gray.100"
                                    justify="space-between"
                                    align="center"
                                >
                                    <Text fontSize="xs" color="gray.500">
                                        Product ID: {item.productCode}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                        Required batch date details
                                    </Text>
                                </Flex>
                            </Box>
                        ))}
                    </Box>
                </Box>

            </Box>


            {/* BUTTONS */}

            <Flex
                justify="end"
                gap={3}
                mt={6}
            >

                <Button

                    variant="outline"

                    onClick={() =>
                        navigate("/admin/grn")
                    }

                    disabled={saving}

                >

                    Cancel

                </Button>


                <Button

                    colorPalette="blue"

                    onClick={

                        mode === "edit"

                            ? updateGRN

                            : undefined

                    }

                    loading={saving}

                >

                    {mode === "edit"

                        ? "Update GRN"

                        : "Create GRN"

                    }

                </Button>

            </Flex>

        </Box>

    );

}