import {
    Badge,
    Box,
    Button,
    CloseButton,
    Dialog,
    HStack,
    Portal,
    SimpleGrid,
    Spinner,
    Table,
    Text,
    VStack
} from "@chakra-ui/react";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type ProductViewDialogProps = {

    open: boolean;

    onClose: () => void;

    productId?: number;

}

interface Supplier {

    firstName: string;

    lastName: string;

}

interface StockBatch {

    batchNumber: string;

    invoiceNumber: string;

    paymentStatus: string;

    receivedDate: string;

    supplier: Supplier;

}

interface StockBatchItem {

    id: number;

    receivedQuantity: number;

    buyingPrice: number;

    sellingPrice: number;

    expiryDate: string;

    manufacturingDate: string | null;

    stockBatch: StockBatch;

}

interface Product {

    productId: string;

    name: string;

    brand: string | null;

    description: string | null;

    strengthValue: number | null;

    strengthUnit: string | null;

    dosageForm: string | null;

    packSize: number | null;

    reorderLevel: number;

    isActive: boolean;

    category?: {

        name: string;

    };

    stockBatchItems: StockBatchItem[];

}

export default function ProductViewDialog({

    open,

    onClose,

    productId

}: ProductViewDialogProps) {
    const [product, setProduct] =
        useState<Product | null>(null);

    const [loading, setLoading] =
        useState(false);

    async function getProductDetails() {

        if (!productId) return;

        try {

            setLoading(true);

            const response = await axios.get(

                import.meta.env.VITE_BACKEND_URL +

                "/product/view/" +

                productId,

                {

                    headers: {

                        Authorization:

                            "Bearer " +

                            localStorage.getItem("token")

                    }

                }

            );

            setProduct(response.data);

        }

        catch (error) {

            toast.error(

                "Failed to load product"

            );

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        if (open && productId) {

            getProductDetails();

        }

    }, [open, productId]);

    const currentStock =

        product?.stockBatchItems.reduce(

            (total, item) =>

                total +

                item.receivedQuantity,

            0

        ) ?? 0;

    return (

        <Dialog.Root

            open={open}

            onOpenChange={(e) => {

                if (!e.open) {

                    onClose();

                }

            }}

        >

            <Portal>

                <Dialog.Backdrop />

                <Dialog.Positioner>

                    <Dialog.Content

                        maxW="1200px"

                    >

                        <Dialog.CloseTrigger asChild>

                            <CloseButton />

                        </Dialog.CloseTrigger>

                        <Dialog.Header>

                            <Dialog.Title>

                                Product Details

                            </Dialog.Title>

                        </Dialog.Header>

                        <Dialog.Body>

                            {

                                loading ?

                                    <VStack py={20}>

                                        <Spinner size="xl" />

                                        <Text>

                                            Loading Product...

                                        </Text>

                                    </VStack>

                                    :

                                    null

                            }
                            {!loading && product && (
                                <VStack align="stretch" gap={6}>

                                    <Box
                                        borderWidth="1px"
                                        borderRadius="lg"
                                        p={5}
                                        bg="white"
                                    >

                                        <Text
                                            fontSize="xl"
                                            fontWeight="bold"
                                            mb={5}
                                        >
                                            Product Information
                                        </Text>

                                        <SimpleGrid columns={{ base: 1, md: 2 }} gap={5}>

                                            <Box>
                                                <Text color="gray.500" fontSize="sm">
                                                    Product ID
                                                </Text>

                                                <Text fontWeight="bold">
                                                    {product.productId}
                                                </Text>
                                            </Box>

                                            <Box>
                                                <Text color="gray.500" fontSize="sm">
                                                    Product Name
                                                </Text>

                                                <Text fontWeight="bold">
                                                    {product.name}
                                                </Text>
                                            </Box>

                                            <Box>
                                                <Text color="gray.500" fontSize="sm">
                                                    Brand
                                                </Text>

                                                <Text>
                                                    {product.brand ?? "-"}
                                                </Text>
                                            </Box>

                                            <Box>
                                                <Text color="gray.500" fontSize="sm">
                                                    Category
                                                </Text>

                                                <Text>
                                                    {product.category?.name ?? "-"}
                                                </Text>
                                            </Box>

                                            <Box>
                                                <Text color="gray.500" fontSize="sm">
                                                    Dosage Form
                                                </Text>

                                                <Text>
                                                    {product.dosageForm ?? "-"}
                                                </Text>
                                            </Box>

                                            <Box>
                                                <Text color="gray.500" fontSize="sm">
                                                    Strength
                                                </Text>

                                                <Text>
                                                    {product.strengthValue ?? "-"} {product.strengthUnit ?? ""}
                                                </Text>
                                            </Box>

                                            <Box>
                                                <Text color="gray.500" fontSize="sm">
                                                    Pack Size
                                                </Text>

                                                <Text>
                                                    {product.packSize ?? "-"}
                                                </Text>
                                            </Box>

                                            <Box>
                                                <Text color="gray.500" fontSize="sm">
                                                    Status
                                                </Text>

                                                <Badge
                                                    colorPalette={
                                                        product.isActive ? "green" : "red"
                                                    }
                                                >
                                                    {product.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </Box>

                                        </SimpleGrid>

                                        <Box mt={5}>

                                            <Text color="gray.500" fontSize="sm">
                                                Description
                                            </Text>

                                            <Text mt={1}>
                                                {product.description || "No description available"}
                                            </Text>

                                        </Box>

                                    </Box>

                                </VStack>
                            )}
                            <Box
                                borderWidth="1px"
                                borderRadius="lg"
                                p={5}
                                bg="white"
                            >

                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    mb={5}
                                >
                                    Inventory Summary
                                </Text>

                                <SimpleGrid
                                    columns={{ base: 2, md: 4 }}
                                    gap={5}
                                >

                                    <Box>

                                        <Text
                                            color="gray.500"
                                            fontSize="sm"
                                        >
                                            Current Stock
                                        </Text>

                                        <Text
                                            fontWeight="bold"
                                            fontSize="2xl"
                                        >
                                            {currentStock}
                                        </Text>

                                    </Box>

                                    <Box>

                                        <Text
                                            color="gray.500"
                                            fontSize="sm"
                                        >
                                            Reorder Level
                                        </Text>

                                        <Text
                                            fontWeight="bold"
                                            fontSize="2xl"
                                        >
                                            {product?.reorderLevel}
                                        </Text>

                                    </Box>

                                    <Box>

                                        <Text
                                            color="gray.500"
                                            fontSize="sm"
                                        >
                                            Total Batches
                                        </Text>

                                        <Text
                                            fontWeight="bold"
                                            fontSize="2xl"
                                        >
                                            {product?.stockBatchItems.length}
                                        </Text>

                                    </Box>

                                    <Box>

                                        <Text
                                            color="gray.500"
                                            fontSize="sm"
                                        >
                                            Latest Buy Price
                                        </Text>

                                        <Text
                                            fontWeight="bold"
                                            fontSize="2xl"
                                        >
                                            Rs.{" "}
                                            {product?.stockBatchItems?.length
                                                ? product.stockBatchItems[
                                                    product.stockBatchItems.length - 1
                                                ].buyingPrice.toFixed(2)
                                                : "0.00"}
                                        </Text>

                                    </Box>

                                </SimpleGrid>

                            </Box>
                            <Box
                                borderWidth="1px"
                                borderRadius="lg"
                                p={5}
                                bg="white"
                            >

                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                    mb={5}
                                >
                                    Stock Batch History
                                </Text>

                                <Table.Root
                                    variant="outline"
                                    size="sm"
                                >

                                    <Table.Header>

                                        <Table.Row>

                                            <Table.ColumnHeader>
                                                Batch
                                            </Table.ColumnHeader>

                                            <Table.ColumnHeader>
                                                Supplier
                                            </Table.ColumnHeader>

                                            <Table.ColumnHeader>
                                                Invoice
                                            </Table.ColumnHeader>

                                            <Table.ColumnHeader textAlign="end">
                                                Qty
                                            </Table.ColumnHeader>

                                            <Table.ColumnHeader textAlign="end">
                                                Buy
                                            </Table.ColumnHeader>

                                            <Table.ColumnHeader textAlign="end">
                                                Sell
                                            </Table.ColumnHeader>

                                            <Table.ColumnHeader>
                                                Received
                                            </Table.ColumnHeader>

                                            <Table.ColumnHeader>
                                                MFD
                                            </Table.ColumnHeader>

                                            <Table.ColumnHeader>
                                                Expiry
                                            </Table.ColumnHeader>

                                            <Table.ColumnHeader>
                                                Payment
                                            </Table.ColumnHeader>

                                        </Table.Row>

                                    </Table.Header>

                                    <Table.Body>

                                        {
                                            product?.stockBatchItems.map((item) => (

                                                <Table.Row key={item.id}>

                                                    <Table.Cell>

                                                        {item.stockBatch.batchNumber}

                                                    </Table.Cell>

                                                    <Table.Cell>

                                                        {
                                                            item.stockBatch.supplier.firstName
                                                        }

                                                        {" "}

                                                        {
                                                            item.stockBatch.supplier.lastName
                                                        }

                                                    </Table.Cell>

                                                    <Table.Cell>

                                                        {
                                                            item.stockBatch.invoiceNumber
                                                        }

                                                    </Table.Cell>

                                                    <Table.Cell textAlign="end">

                                                        {
                                                            item.receivedQuantity
                                                        }

                                                    </Table.Cell>

                                                    <Table.Cell textAlign="end">

                                                        Rs. {

                                                            item.buyingPrice.toFixed(2)

                                                        }

                                                    </Table.Cell>

                                                    <Table.Cell textAlign="end">

                                                        Rs. {

                                                            item.sellingPrice.toFixed(2)

                                                        }

                                                    </Table.Cell>

                                                    <Table.Cell>

                                                        {

                                                            new Date(
                                                                item.stockBatch.receivedDate
                                                            ).toLocaleDateString()

                                                        }

                                                    </Table.Cell>

                                                    <Table.Cell>

                                                        {
                                                            item.manufacturingDate
                                                                ?

                                                                new Date(
                                                                    item.manufacturingDate
                                                                ).toLocaleDateString()

                                                                :

                                                                "-"

                                                        }

                                                    </Table.Cell>

                                                    <Table.Cell>

                                                        {

                                                            new Date(
                                                                item.expiryDate
                                                            ).toLocaleDateString()

                                                        }

                                                    </Table.Cell>

                                                    <Table.Cell>

                                                        <Badge

                                                            colorPalette={

                                                                item.stockBatch.paymentStatus === "PAID"

                                                                    ?

                                                                    "green"

                                                                    :

                                                                    item.stockBatch.paymentStatus === "PENDING"

                                                                        ?

                                                                        "orange"

                                                                        :

                                                                        "red"

                                                            }

                                                        >

                                                            {

                                                                item.stockBatch.paymentStatus

                                                            }

                                                        </Badge>

                                                    </Table.Cell>

                                                </Table.Row>

                                            ))
                                        }

                                    </Table.Body>

                                </Table.Root>

                            </Box>


                        </Dialog.Body>
                        <Dialog.Footer>

                            <Button

                                onClick={onClose}

                            >

                                Close

                            </Button>

                        </Dialog.Footer>

                    </Dialog.Content>

                </Dialog.Positioner>


            </Portal>

        </Dialog.Root>



    );
}