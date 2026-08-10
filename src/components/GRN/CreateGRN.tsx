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


    useEffect(() => {

        getPendingPurchaseOrders();

    }, []);

    async function getPendingPurchaseOrders() {

        try {

            const response = await axios.get(

                import.meta.env.VITE_BACKEND_URL +

                "/purchase-order"

            );

            setPurchaseOrders(response.data);

        }

        catch (error) {

            console.log(error);

        }

    }

    async function loadPurchaseOrder(id: string) {

        if (id === "") {

            return;

        }

        try {

            const response = await axios.get(

                import.meta.env.VITE_BACKEND_URL +

                "/purchase-order/" +

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

                            Product Table

                            (Next Step)

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
                >

                    Create GRN

                </Button>

            </Flex>

        </>

    );

}