import {
    Box,
    Button,
    Field,
    Flex,
    Heading,
    Input,
    NativeSelect,
    Text,
    VStack,
} from "@chakra-ui/react";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GRNItemsTable from "@/components/GRN/GRNItemsTable";
import type { GRNItem } from "@/components/GRN/GRNItemsTable";
import toast from "react-hot-toast";

type PurchaseOrder = {

    id: number;

    orderNumber: string;

    supplierId: number;

    status: string;

    supplier: {

        id: number;

        firstName: string;

        lastName: string;

    };

};

export default function CreateGRN() {

    const navigate = useNavigate();

    const [purchaseOrders, setPurchaseOrders] =
        useState<PurchaseOrder[]>([]);

    const [selectedPOId, setSelectedPOId] =
        useState("");

    const [supplierName, setSupplierName] =
        useState("");

    const [paymentStatus, setPaymentStatus] =
        useState("PENDING");

    const [receivedDate, setReceivedDate] =
        useState(
            new Date().toISOString().split("T")[0]
        );

    const [invoiceDiscount, setInvoiceDiscount] =
        useState(0);

    const [items, setItems] = useState<GRNItem[]>([]);

    const [supplierId, setSupplierId] =
        useState<number>();


    useEffect(() => {

        getPendingPurchaseOrders();

    }, []);

    async function getPendingPurchaseOrders() {

        try {

            const response = await axios.get(

                import.meta.env.VITE_BACKEND_URL +

                "/po/all-purchase-orders"

            );

            setPurchaseOrders(response.data);

        }

        catch (error) {

            console.log(error);
            toast.error(
                "Failed to load purchase orders"
            );

        }

    }

    async function loadPurchaseOrder(id: string) {

        if (id === "") {

            return;

        }

        try {

            const response = await axios.get(

                import.meta.env.VITE_BACKEND_URL +

                "/po/all-purchase-orders" +

                id

            );

            const po = response.data;

            setSupplierName(

                po.supplier.firstName +

                " " +

                po.supplier.lastName

            );

            setItems(

                po.items.map((item: any) => ({

                    purchaseOrderItemId: item.id,

                    productId: item.productId,

                    productCode: item.product.productId,

                    productName: item.product.name,

                    orderedQuantity: item.quantity,

                    alreadyReceived: item.alreadyReceived ?? 0,

                    remainingQuantity:

                        item.quantity -

                        (item.alreadyReceived ?? 0),

                    receivedQuantity:

                        item.quantity -

                        (item.alreadyReceived ?? 0),

                    buyingPrice: 0,

                    sellingPrice: 0,

                    expiryDate: "",

                    manufacturingDate: "",

                }))

            );

            setSupplierId(
                po.supplierId
            );

            setSupplierName(
                po.supplier.firstName +
                " " +
                po.supplier.lastName
            );


            setSupplierId(
                po.supplierId
            );

            // Product table

            <GRNItemsTable

                items={items}

                setItems={setItems}

            />
            // next lesson

        }

        catch (error) {

            console.log(error);

        }

    }

    async function createGRN() {

        if (!selectedPOId) {

            toast.error(
                "Please select a Purchase Order"
            );

            return;

        }

        if (items.length === 0) {

            toast.error(
                "No products found in this Purchase Order"
            );

            return;

        }

        try {

            const response = await axios.post(

                import.meta.env.VITE_BACKEND_URL +
                "/stock-batch/create",

                {
                    purchaseOrderId:
                        Number(selectedPOId),
                    
                        supplierId,

                    receivedDate,

                    paymentStatus,

                    invoiceDiscountAmount:
                        invoiceDiscount,

                    items: items.map((item) => ({

                        productId:
                            item.productId,

                        receivedQuantity:
                            item.receivedQuantity,

                        buyingPrice:
                            item.buyingPrice,

                        sellingPrice:
                            item.sellingPrice,

                        expiryDate:
                            item.expiryDate,

                        manufacturingDate:
                            item.manufacturingDate ||
                            null,

                        purchaseOrderItemId:
                            item.purchaseOrderItemId,

                    })),

                }

            );

            console.log(response.data);

            toast.success(
                "GRN created successfully"
            );

            navigate("/admin/grn");

        } catch (error: any) {

            console.error(error);

            toast.error(

                error.response?.data?.message ??
                "Failed to create GRN"

            );

        }

    }

    return (

        <>

            <Box
                bg="blue.500"
                color="white"
                p={4}
                rounded="md"
                textAlign="center"
                fontWeight="bold"
                mb={5}
            >

                Create Goods Received Note

            </Box>

            <Flex
                gap={10}
                align="start"
                wrap="wrap"
            >

                <Box
                    flex={1}
                    minW="350px"
                >

                    <VStack
                        align="stretch"
                        gap={5}
                    >

                        <Field.Root>

                            <Field.Label>

                                Purchase Order

                            </Field.Label>

                            <NativeSelect.Root>

                                <NativeSelect.Field

                                    value={selectedPOId}

                                    onChange={(e) => {

                                        setSelectedPOId(

                                            e.target.value

                                        );

                                        loadPurchaseOrder(

                                            e.target.value

                                        );

                                    }}

                                >

                                    <option value="">

                                        Select Purchase Order

                                    </option>

                                    {

                                        purchaseOrders.map(

                                            (po) => (

                                                <option

                                                    key={po.id}

                                                    value={po.id}

                                                >

                                                    {

                                                        po.orderNumber

                                                    }

                                                </option>

                                            )

                                        )

                                    }

                                </NativeSelect.Field>

                                <NativeSelect.Indicator />

                            </NativeSelect.Root>

                        </Field.Root>

                        <Field.Root>

                            <Field.Label>

                                Supplier

                            </Field.Label>

                            <Input

                                value={supplierName}

                                readOnly

                            />

                        </Field.Root>

                        <Field.Root>

                            <Field.Label>

                                Received Date

                            </Field.Label>

                            <Input

                                type="date"

                                value={receivedDate}

                                onChange={(e) =>

                                    setReceivedDate(

                                        e.target.value

                                    )

                                }

                            />

                        </Field.Root>

                        <Field.Root>

                            <Field.Label>

                                Payment Status

                            </Field.Label>

                            <NativeSelect.Root>

                                <NativeSelect.Field

                                    value={paymentStatus}

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

                        <Field.Root>

                            <Field.Label>

                                Invoice Discount

                            </Field.Label>

                            <Input

                                type="number"

                                value={invoiceDiscount}

                                onChange={(e) =>

                                    setInvoiceDiscount(

                                        Number(

                                            e.target.value

                                        )

                                    )

                                }

                            />

                        </Field.Root>

                    </VStack>

                </Box>

                <Box
                    flex={2}
                    minW="600px"
                >

                    <Heading
                        size="md"
                        mb={4}
                    >

                        Products

                    </Heading>

                    <Box

                        borderWidth="1px"

                        rounded="md"

                        p={8}

                        textAlign="center"

                    >

                        <Text>

                            <Heading
                                size="md"
                                mb={4}
                            >
                                Products
                            </Heading>

                            <GRNItemsTable
                                items={items}
                                setItems={setItems}
                            />

                        </Text>

                    </Box>

                </Box>

            </Flex>

            <Flex
                justify="end"
                mt={8}
                gap={3}
            >

                <Button
                    variant="outline"
                    onClick={() =>

                        navigate("/admin/grn")

                    }
                >

                    Cancel

                </Button>

                <Button
                    colorPalette="blue"
                    onClick={createGRN}
                >

                    Create GRN

                </Button>

            </Flex>

        </>

    );

}