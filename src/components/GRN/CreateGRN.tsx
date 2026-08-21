import {
    Box,
    Button,
    Field,
    Flex,
    Heading,
    Input,
    NativeSelect,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import GRNItemsTable from "@/components/GRN/GRNItemsTable";
import type { GRNItem } from "@/components/GRN/GRNItemsTable";


type PurchaseOrder = {

    id: number;

    orderNumber: string;

    supplierId: number;

    status: string;

    createdAt: string;

    supplier: {

        id: number;

        firstName: string;

        lastName: string;

    };

};


export default function CreateGRN() {

    const navigate = useNavigate();


    // =====================================================
    // PURCHASE ORDERS
    // =====================================================

    const [purchaseOrders, setPurchaseOrders] =
        useState<PurchaseOrder[]>([]);


    const [selectedPOId, setSelectedPOId] =
        useState("");


    const [selectedPO, setSelectedPO] =
        useState<any>(null);


    const [loadingPO, setLoadingPO] =
        useState(false);

    const [searchParams] = useSearchParams();

    const purchaseOrderId = searchParams.get("purchaseOrderId");


    // =====================================================
    // SUPPLIER
    // =====================================================

    const [supplierId, setSupplierId] =
        useState<number | undefined>();


    const [supplierName, setSupplierName] =
        useState("");


    // =====================================================
    // DATES
    // =====================================================

    const [receivedDate, setReceivedDate] =
        useState(
            new Date()
                .toISOString()
                .split("T")[0]
        );


    // =====================================================
    // PAYMENT
    // =====================================================

    const [paymentStatus, setPaymentStatus] =
        useState("PENDING");


    const [invoiceDiscount, setInvoiceDiscount] =
        useState(0);


    // =====================================================
    // ITEMS
    // =====================================================

    const [items, setItems] =
        useState<GRNItem[]>([]);


    // =====================================================
    // CREATE LOADING
    // =====================================================

    const [creating, setCreating] =
        useState(false);


    // =====================================================
    // LOAD PENDING PURCHASE ORDERS
    // =====================================================

    useEffect(() => {

        getPendingPurchaseOrders();

    }, []);

    useEffect(() => {

        if (purchaseOrderId) {

            handlePOSelect(
                purchaseOrderId
            );

        }

    }, [purchaseOrderId]);


    async function getPendingPurchaseOrders() {

        try {

            const response =
                await axios.get(

                    import.meta.env.VITE_BACKEND_URL +
                    "/po/all"

                );


            const availablePOs =
                response.data.filter(
                    (po: PurchaseOrder) =>
                        po.status === "PENDING" ||
                        po.status === "PARTIALLY_RECEIVED"
                );

            setPurchaseOrders(
                availablePOs
            );

        }

        catch (error) {

            console.error(
                error
            );

            toast.error(
                "Failed to load purchase orders"
            );

        }

    }


    // =====================================================
    // LOAD SELECTED PURCHASE ORDER
    // =====================================================

    async function handlePOSelect(
        purchaseOrderId: string
    ) {

        /*
        Clear everything when
        no PO is selected.
        */

        if (!purchaseOrderId) {

            setSelectedPOId("");

            setSelectedPO(null);

            setSupplierId(undefined);

            setSupplierName("");

            setItems([]);

            return;

        }


        try {

            setLoadingPO(true);


            /*
            IMPORTANT:
            Save selected PO ID
            */

            setSelectedPOId(
                purchaseOrderId
            );


            const response =
                await axios.get(

                    import.meta.env.VITE_BACKEND_URL +
                    "/po/purchase-orders/" +
                    purchaseOrderId

                );


            const po =
                response.data;


            console.log(
                "SELECTED PO:",
                po
            );


            setSelectedPO(
                po
            );


            // =================================================
            // SUPPLIER
            // =================================================

            setSupplierId(
                po.supplierId
            );


            setSupplierName(

                po.supplier

                    ? `${po.supplier.firstName} ${po.supplier.lastName}`

                    : ""

            );


            // =================================================
            // PRODUCTS
            // =================================================

            const grnItems: GRNItem[] =

                (po.items ?? []).map(
                    (item: any) => {

                        const alreadyReceived =
                            item.alreadyReceived ?? 0;


                        const remainingQuantity =
                            Math.max(

                                item.quantity -
                                alreadyReceived,

                                0

                            );


                        return {

                            purchaseOrderItemId:
                                item.id,

                            productId:
                                item.productId,

                            productCode:
                                item.product?.productId ??
                                "",

                            productName:
                                item.product?.name ??
                                "",

                            brand:
                                item.product?.brand ??
                                "",

                            orderedQuantity:
                                item.quantity,

                            alreadyReceived:
                                alreadyReceived,

                            remainingQuantity:
                                remainingQuantity,

                            receivedQuantity:
                                remainingQuantity,

                            buyingPrice:
                                0,

                            sellingPrice:
                                0,

                            expiryDate:
                                "",

                            manufacturingDate:
                                "",

                        };

                    }

                );


            setItems(
                grnItems
            );

        }

        catch (error: any) {

            console.error(
                "Failed to load PO:",
                error
            );


            toast.error(

                error.response?.data?.error ??

                "Failed to load purchase order"

            );


            setSelectedPOId("");

            setSelectedPO(null);

            setItems([]);

        }

        finally {

            setLoadingPO(false);

        }

    }


    // =====================================================
    // TOTAL INVOICE AMOUNT
    // =====================================================

    const subtotal =
        useMemo(() => {

            return items.reduce(

                (total, item) => {

                    return total +

                        (
                            Number(
                                item.receivedQuantity
                            ) *

                            Number(
                                item.buyingPrice
                            )
                        );

                },

                0

            );

        }, [items]);


    const totalInvoiceAmount =
        Math.max(

            subtotal -
            Number(invoiceDiscount || 0),

            0

        );


    // =====================================================
    // CREATE GRN
    // =====================================================

    async function createGRN() {

        if (!selectedPOId) {

            toast.error(
                "Please select a Purchase Order"
            );

            return;

        }


        if (!supplierId) {

            toast.error(
                "Supplier information is missing"
            );

            return;

        }


        if (items.length === 0) {

            toast.error(
                "No products found in this Purchase Order"
            );

            return;

        }


        /*
        Validate items
        */

        for (const item of items) {

            if (
                Number(item.receivedQuantity) < 0
            ) {

                toast.error(

                    `Invalid received quantity for ${item.productName}`

                );

                return;

            }


            if (
                Number(item.receivedQuantity) >
                Number(item.remainingQuantity)
            ) {

                toast.error(

                    `Received quantity cannot exceed remaining quantity for ${item.productName}`

                );

                return;

            }


            if (
                Number(item.receivedQuantity) > 0 &&
                Number(item.buyingPrice) <= 0
            ) {

                toast.error(

                    `Please enter buying price for ${item.productName}`

                );

                return;

            }


            if (
                Number(item.receivedQuantity) > 0 &&
                Number(item.sellingPrice) <= 0
            ) {

                toast.error(

                    `Please enter selling price for ${item.productName}`

                );

                return;

            }


            if (
                Number(item.receivedQuantity) > 0 &&
                !item.expiryDate
            ) {

                toast.error(

                    `Please enter expiry date for ${item.productName}`

                );

                return;

            }

        }


        /*
        At least one item must be received
        */

        const hasReceivedItems =
            items.some(

                (item) =>
                    Number(
                        item.receivedQuantity
                    ) > 0

            );


        if (!hasReceivedItems) {

            toast.error(
                "Please enter at least one received quantity"
            );

            return;

        }


        try {

            setCreating(true);


            const response =
                await axios.post(

                    import.meta.env.VITE_BACKEND_URL +
                    "/stock-batch/create",

                    {

                        /*
                        Link GRN with PO
                        */

                        purchaseOrderId:
                            Number(selectedPOId),

                        supplierId:
                            supplierId,

                        receivedDate:
                            receivedDate,

                        paymentStatus:
                            paymentStatus,

                        invoiceDiscountAmount:
                            Number(
                                invoiceDiscount || 0
                            ),

                        items:

                            items

                                /*
                                Don't send zero
                                quantity items
                                */

                                .filter(
                                    (item) =>
                                        Number(
                                            item.receivedQuantity
                                        ) > 0
                                )

                                .map(
                                    (item) => ({

                                        productId:
                                            item.productId,

                                        receivedQuantity:
                                            Number(
                                                item.receivedQuantity
                                            ),

                                        buyingPrice:
                                            Number(
                                                item.buyingPrice
                                            ),

                                        sellingPrice:
                                            Number(
                                                item.sellingPrice
                                            ),

                                        expiryDate:
                                            item.expiryDate,

                                        manufacturingDate:
                                            item.manufacturingDate ||
                                            null,

                                        purchaseOrderItemId:
                                            item.purchaseOrderItemId,

                                    })
                                ),

                    }

                );


            console.log(
                response.data
            );


            toast.success(
                "GRN created successfully"
            );


            navigate(
                "/admin/grn"
            );

        }

        catch (error: any) {

            console.error(
                "Create GRN Error:",
                error
            );


            toast.error(

                error.response?.data?.message ??

                error.response?.data?.error ??

                "Failed to create GRN"

            );

        }

        finally {

            setCreating(false);

        }

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box>

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <Box
                bg="blue.500"
                color="white"
                p={4}
                rounded="md"
                textAlign="center"
                fontWeight="bold"
                mb={5}
            >

                Create Goods Received Note (GRN)

            </Box>


            {/* =================================================
                PO + SUPPLIER + DATE INFORMATION
            ================================================= */}

            <Box
                bg="white"
                borderWidth="1px"
                rounded="md"
                p={5}
                mb={5}
            >

                <SimpleGrid
                    columns={{
                        base: 1,
                        md: 2,
                        lg: 4,
                    }}
                    gap={4}
                >

                    {/* PO */}

                    <Field.Root>

                        <Field.Label>
                            Select PO ID
                        </Field.Label>


                        <NativeSelect.Root disabled={loadingPO}>

                            <NativeSelect.Field

                                value={
                                    selectedPOId
                                }

                                onChange={(e) =>
                                    handlePOSelect(
                                        e.target.value
                                    )
                                }

                            >

                                <option value="">
                                    Select Purchase Order
                                </option>


                                {purchaseOrders.map(
                                    (po) => (

                                        <option
                                            key={
                                                po.id
                                            }
                                            value={
                                                po.id
                                            }
                                        >

                                            {
                                                po.orderNumber
                                            }

                                        </option>

                                    )
                                )}

                            </NativeSelect.Field>


                            <NativeSelect.Indicator />

                        </NativeSelect.Root>

                    </Field.Root>


                    {/* SUPPLIER */}

                    <Field.Root>

                        <Field.Label>
                            Supplier Name
                        </Field.Label>


                        <Input

                            value={
                                supplierName
                            }

                            readOnly

                            bg="gray.100"

                            placeholder="Select PO first"

                        />

                    </Field.Root>


                    {/* PO DATE */}

                    <Field.Root>

                        <Field.Label>
                            PO Created Date
                        </Field.Label>


                        <Input

                            value={

                                selectedPO?.createdAt

                                    ? new Date(
                                        selectedPO.createdAt
                                    ).toLocaleDateString(
                                        "en-GB"
                                    )

                                    : ""

                            }

                            readOnly

                            bg="gray.100"

                            placeholder="Select PO first"

                        />

                    </Field.Root>


                    {/* GRN DATE */}

                    <Field.Root>

                        <Field.Label>
                            Receiving Date (GRN Date)
                        </Field.Label>


                        <Input

                            type="date"

                            value={
                                receivedDate
                            }

                            onChange={(e) =>
                                setReceivedDate(
                                    e.target.value
                                )
                            }

                        />

                    </Field.Root>

                </SimpleGrid>

            </Box>


            {/* =================================================
                ITEMS SECTION
            ================================================= */}

            <Box
                bg="white"
                borderWidth="1px"
                rounded="md"
                overflow="hidden"
                mb={5}
            >

                <Box
                    px={5}
                    py={4}
                    borderBottomWidth="1px"
                >

                    <Heading
                        size="md"
                    >

                        Items to Receive

                    </Heading>

                </Box>


                <Box
                    overflowX="auto"
                    p={4}
                >

                    {loadingPO ? (

                        <Box
                            py={10}
                            textAlign="center"
                        >

                            <Text
                                color="gray.500"
                            >

                                Loading purchase order
                                details...

                            </Text>

                        </Box>

                    ) : items.length === 0 ? (

                        <Box
                            py={10}
                            textAlign="center"
                        >

                            <Text
                                color="gray.500"
                            >

                                Select a Purchase Order
                                to load items.

                            </Text>

                        </Box>

                    ) : (

                        <GRNItemsTable

                            items={
                                items
                            }

                            setItems={
                                setItems
                            }

                        />

                    )}

                </Box>


                {/* =================================================
                    TOTAL
                ================================================= */}

                <Flex
                    justify="flex-end"
                    px={5}
                    pb={5}
                >

                    <Box
                        minW="320px"
                        textAlign="right"
                    >

                        <Text
                            fontSize="sm"
                            color="gray.500"
                        >

                            Subtotal:{" "}

                            Rs.{" "}

                            {subtotal.toLocaleString(
                                "en-LK",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )}

                        </Text>


                        <Text
                            fontSize="sm"
                            color="gray.500"
                        >

                            Invoice Discount:{" "}

                            Rs.{" "}

                            {Number(
                                invoiceDiscount || 0
                            ).toLocaleString(
                                "en-LK",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )}

                        </Text>


                        <Text
                            fontWeight="bold"
                            fontSize="lg"
                            mt={1}
                        >

                            Total Invoice Amount:{" "}

                            Rs.{" "}

                            {totalInvoiceAmount.toLocaleString(
                                "en-LK",
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }
                            )}

                        </Text>

                    </Box>

                </Flex>

            </Box>


            {/* =================================================
                BOTTOM CONTROLS
            ================================================= */}

            <Box
                bg="white"
                borderWidth="1px"
                rounded="md"
                p={5}
            >

                <SimpleGrid
                    columns={{
                        base: 1,
                        md: 2,
                        lg: 3,
                    }}
                    gap={5}
                    alignItems="end"
                >

                    {/* PAYMENT STATUS */}

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


                    {/* DISCOUNT */}

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

                                    Math.max(
                                        0,
                                        Number(
                                            e.target.value
                                        )
                                    )

                                )
                            }

                            placeholder="0.00"

                        />

                    </Field.Root>


                    {/* ACTIONS */}

                    <Flex
                        justify="flex-end"
                        gap={3}
                    >

                        <Button

                            variant="outline"

                            onClick={() =>
                                navigate(
                                    "/admin/grn"
                                )
                            }

                            disabled={
                                creating
                            }

                        >

                            Cancel

                        </Button>


                        <Button

                            colorPalette="blue"

                            onClick={
                                createGRN
                            }

                            loading={
                                creating
                            }

                        >

                            Create GRN

                        </Button>

                    </Flex>

                </SimpleGrid>

            </Box>

        </Box>

    );

}