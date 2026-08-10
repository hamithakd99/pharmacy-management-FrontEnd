import {
    Box,
    Button,
    Field,
    Flex,
    Heading,
    Input,
    NativeSelect,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

            const response = await axios.get(

                import.meta.env.VITE_BACKEND_URL +

                "/stock-batch/" +

                batchNumber

            );

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

            await axios.put(

                import.meta.env.VITE_BACKEND_URL +

                "/stock-batch/" +

                batchNumber,

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
                p={6}
            >

                <Heading
                    size="md"
                    mb={5}
                >

                    GRN Items

                </Heading>

                <Box
                    overflowX="auto"
                >

                    <table
                        style={{
                            width: "100%",
                            borderCollapse:
                                "collapse",
                        }}
                    >

                        <thead>

                            <tr>

                                <th
                                    style={{
                                        textAlign:
                                            "left",
                                        padding:
                                            "12px",
                                    }}
                                >
                                    Product
                                </th>

                                <th
                                    style={{
                                        textAlign:
                                            "left",
                                        padding:
                                            "12px",
                                    }}
                                >
                                    Received Qty
                                </th>

                                <th
                                    style={{
                                        textAlign:
                                            "left",
                                        padding:
                                            "12px",
                                    }}
                                >
                                    Buying Price
                                </th>

                                <th
                                    style={{
                                        textAlign:
                                            "left",
                                        padding:
                                            "12px",
                                    }}
                                >
                                    Selling Price
                                </th>

                                <th
                                    style={{
                                        textAlign:
                                            "left",
                                        padding:
                                            "12px",
                                    }}
                                >
                                    Expiry Date
                                </th>

                                <th
                                    style={{
                                        textAlign:
                                            "left",
                                        padding:
                                            "12px",
                                    }}
                                >
                                    Manufacturing Date
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                items.map(
                                    (item, index) => (

                                        <tr
                                            key={
                                                item.id ??
                                                index
                                            }
                                        >

                                            <td
                                                style={{
                                                    padding:
                                                        "12px",
                                                }}
                                            >

                                                <VStack
                                                    align="start"
                                                >

                                                    <Text
                                                        fontWeight="bold"
                                                    >

                                                        {
                                                            item.productName
                                                        }

                                                    </Text>

                                                    <Text
                                                        fontSize="sm"
                                                        color="gray.500"
                                                    >

                                                        {item.productCode}

                                                    </Text>

                                                </VStack>

                                            </td>


                                            <td
                                                style={{
                                                    padding:
                                                        "12px",
                                                }}
                                            >

                                                <Input

                                                    type="number"

                                                    min={0}

                                                    value={
                                                        item.receivedQuantity
                                                    }

                                                    onChange={(e) =>

                                                        updateItem(

                                                            index,

                                                            "receivedQuantity",

                                                            Number(
                                                                e.target.value
                                                            )

                                                        )

                                                    }

                                                    width="120px"

                                                />

                                            </td>


                                            <td
                                                style={{
                                                    padding:
                                                        "12px",
                                                }}
                                            >

                                                <Input

                                                    type="number"

                                                    min={0}

                                                    value={
                                                        item.buyingPrice
                                                    }

                                                    onChange={(e) =>

                                                        updateItem(

                                                            index,

                                                            "buyingPrice",

                                                            Number(
                                                                e.target.value
                                                            )

                                                        )

                                                    }

                                                    width="140px"

                                                />

                                            </td>


                                            <td
                                                style={{
                                                    padding:
                                                        "12px",
                                                }}
                                            >

                                                <Input

                                                    type="number"

                                                    min={0}

                                                    value={
                                                        item.sellingPrice
                                                    }

                                                    onChange={(e) =>

                                                        updateItem(

                                                            index,

                                                            "sellingPrice",

                                                            Number(
                                                                e.target.value
                                                            )

                                                        )

                                                    }

                                                    width="140px"

                                                />

                                            </td>


                                            <td
                                                style={{
                                                    padding:
                                                        "12px",
                                                }}
                                            >

                                                <Input

                                                    type="date"

                                                    value={
                                                        item.expiryDate
                                                    }

                                                    onChange={(e) =>

                                                        updateItem(

                                                            index,

                                                            "expiryDate",

                                                            e.target.value

                                                        )

                                                    }

                                                />

                                            </td>


                                            <td
                                                style={{
                                                    padding:
                                                        "12px",
                                                }}
                                            >

                                                <Input

                                                    type="date"

                                                    value={
                                                        item.manufacturingDate
                                                    }

                                                    onChange={(e) =>

                                                        updateItem(

                                                            index,

                                                            "manufacturingDate",

                                                            e.target.value

                                                        )

                                                    }

                                                />

                                            </td>

                                        </tr>

                                    )

                                )

                            }

                        </tbody>

                    </table>

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