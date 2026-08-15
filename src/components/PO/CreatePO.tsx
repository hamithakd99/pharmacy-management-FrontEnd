import {
    Box,
    Button,
    Field,
    Flex,
    Heading,
    Input,
    NativeSelect,
    Table,
    Text
} from "@chakra-ui/react";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


type Supplier = {
    id: number;
    firstName: string;
    lastName: string;
};


type Product = {
    id: number;
    productId: string;
    name: string;
    brand?: string | null;
};


type POItem = {
    productId: number;
    productCode: string;
    productName: string;
    brand: string;
    quantity: number;
};


export default function CreatePO() {

    const navigate = useNavigate();


    /*
    =====================================================
    STATE
    =====================================================
    */

    const [suppliers, setSuppliers] =
        useState<Supplier[]>([]);

    const [products, setProducts] =
        useState<Product[]>([]);


    const [supplierId, setSupplierId] =
        useState("");


    const [selectedProductId, setSelectedProductId] =
        useState("");


    const [quantity, setQuantity] =
        useState("");


    const [items, setItems] =
        useState<POItem[]>([]);


    const [loading, setLoading] =
        useState(false);


    /*
    =====================================================
    LOAD SUPPLIERS + PRODUCTS
    =====================================================
    */

    useEffect(() => {

        getSuppliers();

        getProducts();

    }, []);


    /*
    =====================================================
    GET SUPPLIERS
    =====================================================
    */

    async function getSuppliers() {

        try {

            const response = await axios.get(

                import.meta.env.VITE_BACKEND_URL +
                "/external/all-external-users"

            );

            setSuppliers(
                response.data
            );

        }

        catch (error) {

            console.error(error);

            toast.error(
                "Failed to load suppliers"
            );

        }

    }


    /*
    =====================================================
    GET PRODUCTS
    =====================================================
    */

    async function getProducts() {

        try {

            const response = await axios.get(

                import.meta.env.VITE_BACKEND_URL +
                "/product/all"

            );

            setProducts(
                response.data
            );

        }

        catch (error) {

            console.error(error);

            toast.error(
                "Failed to load products"
            );

        }

    }


    /*
    =====================================================
    ADD PRODUCT
    =====================================================
    */

    function addProduct() {

        if (!selectedProductId) {

            toast.error(
                "Please select a product"
            );

            return;

        }


        if (!quantity || Number(quantity) <= 0) {

            toast.error(
                "Please enter a valid quantity"
            );

            return;

        }


        const selectedProduct =
            products.find(

                (product) =>
                    product.id ===
                    Number(selectedProductId)

            );


        if (!selectedProduct) {

            toast.error(
                "Product not found"
            );

            return;

        }


        /*
        ---------------------------------------------
        CHECK DUPLICATE PRODUCT
        ---------------------------------------------
        */

        const alreadyExists =
            items.some(

                (item) =>
                    item.productId ===
                    selectedProduct.id

            );


        if (alreadyExists) {

            toast.error(
                "This product is already added"
            );

            return;

        }


        /*
        ---------------------------------------------
        ADD ITEM
        ---------------------------------------------
        */

        const newItem: POItem = {

            productId:
                selectedProduct.id,

            productCode:
                selectedProduct.productId,

            productName:
                selectedProduct.name,

            brand:
                selectedProduct.brand ?? "-",

            quantity:
                Number(quantity),

        };


        setItems((currentItems) => [

            ...currentItems,

            newItem,

        ]);


        /*
        Clear selection
        */

        setSelectedProductId("");

        setQuantity("");

    }


    /*
    =====================================================
    UPDATE QUANTITY
    =====================================================
    */

    function updateQuantity(

        productId: number,

        value: string

    ) {

        const newQuantity =
            Number(value);


        setItems((currentItems) =>

            currentItems.map((item) =>

                item.productId === productId

                    ? {

                        ...item,

                        quantity:
                            newQuantity,

                    }

                    : item

            )

        );

    }


    /*
    =====================================================
    REMOVE PRODUCT
    =====================================================
    */

    function removeProduct(
        productId: number
    ) {

        setItems((currentItems) =>

            currentItems.filter(

                (item) =>
                    item.productId !==
                    productId

            )

        );

    }


    /*
    =====================================================
    CREATE PURCHASE ORDER
    =====================================================
    */

    async function createPurchaseOrder() {

        if (!supplierId) {

            toast.error(
                "Please select a supplier"
            );

            return;

        }


        if (items.length === 0) {

            toast.error(
                "Please add at least one product"
            );

            return;

        }


        const invalidItem =
            items.find(

                (item) =>
                    item.quantity <= 0

            );


        if (invalidItem) {

            toast.error(

                `Invalid quantity for ${invalidItem.productName}`

            );

            return;

        }


        try {

            setLoading(true);


            const response =
                await axios.post(

                    import.meta.env.VITE_BACKEND_URL +
                    "/po/create",

                    {

                        supplierId:
                            Number(supplierId),

                        status:
                            "PENDING",

                        items:
                            items.map(
                                (item) => ({

                                    productId:
                                        item.productId,

                                    quantity:
                                        item.quantity,

                                })
                            ),

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


            console.log(
                response.data
            );


            toast.success(
                "Purchase order created successfully"
            );


            navigate(
                "/admin/po/"
            );


        }

        catch (error: any) {

            console.error(error);


            toast.error(

                error.response?.data?.error ??

                "Failed to create purchase order"

            );

        }

        finally {

            setLoading(false);

        }

    }


    /*
    =====================================================
    UI
    =====================================================
    */

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

                Create Purchase Order

            </Box>


            {/* PO INFORMATION */}

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

                    Purchase Order Information

                </Heading>


                <Field.Root>

                    <Field.Label>
                        Supplier
                    </Field.Label>


                    <NativeSelect.Root>

                        <NativeSelect.Field

                            value={
                                supplierId
                            }

                            onChange={(e) =>
                                setSupplierId(
                                    e.target.value
                                )
                            }

                        >

                            <option value="">
                                Select Supplier
                            </option>


                            {suppliers.map(
                                (supplier) => (

                                    <option
                                        key={
                                            supplier.id
                                        }
                                        value={
                                            supplier.id
                                        }
                                    >

                                        {
                                            supplier.firstName
                                        }{" "}

                                        {
                                            supplier.lastName
                                        }

                                    </option>

                                )
                            )}

                        </NativeSelect.Field>


                        <NativeSelect.Indicator />

                    </NativeSelect.Root>

                </Field.Root>

            </Box>


            {/* ADD PRODUCT */}

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

                    Add Products

                </Heading>


                <Flex
                    gap={4}
                    align="end"
                    wrap="wrap"
                >

                    <Box
                        flex="1"
                        minW="300px"
                    >

                        <Field.Root>

                            <Field.Label>
                                Product
                            </Field.Label>


                            <NativeSelect.Root>

                                <NativeSelect.Field

                                    value={
                                        selectedProductId
                                    }

                                    onChange={(e) =>
                                        setSelectedProductId(
                                            e.target.value
                                        )
                                    }

                                >

                                    <option value="">
                                        Select Product
                                    </option>


                                    {products.map(
                                        (product) => (

                                            <option
                                                key={
                                                    product.id
                                                }
                                                value={
                                                    product.id
                                                }
                                            >

                                                {
                                                    product.productId
                                                }

                                                {" - "}

                                                {
                                                    product.name
                                                }

                                            </option>

                                        )
                                    )}

                                </NativeSelect.Field>


                                <NativeSelect.Indicator />

                            </NativeSelect.Root>

                        </Field.Root>

                    </Box>


                    <Box
                        width="180px"
                    >

                        <Field.Root>

                            <Field.Label>
                                Quantity
                            </Field.Label>


                            <Input

                                type="number"

                                min={1}

                                value={
                                    quantity
                                }

                                onChange={(e) =>
                                    setQuantity(
                                        e.target.value
                                    )
                                }

                                placeholder="Quantity"

                            />

                        </Field.Root>

                    </Box>


                    <Button
                        colorPalette="blue"
                        onClick={addProduct}
                    >

                        Add Product

                    </Button>

                </Flex>

            </Box>


            {/* PRODUCT TABLE */}

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

                    Products

                </Heading>


                {items.length === 0 ? (

                    <Box
                        py={10}
                        textAlign="center"
                    >

                        <Text
                            color="gray.500"
                        >

                            No products added yet.

                        </Text>

                    </Box>

                ) : (

                    <Box
                        overflowX="auto"
                    >

                        <Table.Root
                            variant="outline"
                        >

                            <Table.Header>

                                <Table.Row>

                                    <Table.ColumnHeader>
                                        #
                                    </Table.ColumnHeader>

                                    <Table.ColumnHeader>
                                        Product ID
                                    </Table.ColumnHeader>

                                    <Table.ColumnHeader>
                                        Product
                                    </Table.ColumnHeader>

                                    <Table.ColumnHeader>
                                        Brand
                                    </Table.ColumnHeader>

                                    <Table.ColumnHeader>
                                        Quantity
                                    </Table.ColumnHeader>

                                    <Table.ColumnHeader>
                                        Action
                                    </Table.ColumnHeader>

                                </Table.Row>

                            </Table.Header>


                            <Table.Body>

                                {items.map(
                                    (item, index) => (

                                        <Table.Row
                                            key={
                                                item.productId
                                            }
                                        >

                                            <Table.Cell>
                                                {index + 1}
                                            </Table.Cell>


                                            <Table.Cell
                                                fontWeight="medium"
                                            >

                                                {
                                                    item.productCode
                                                }

                                            </Table.Cell>


                                            <Table.Cell>

                                                {
                                                    item.productName
                                                }

                                            </Table.Cell>


                                            <Table.Cell>

                                                {
                                                    item.brand
                                                }

                                            </Table.Cell>


                                            <Table.Cell>

                                                <Input

                                                    type="number"

                                                    min={1}

                                                    width="120px"

                                                    value={
                                                        item.quantity
                                                    }

                                                    onChange={(e) =>

                                                        updateQuantity(

                                                            item.productId,

                                                            e.target.value

                                                        )

                                                    }

                                                />

                                            </Table.Cell>


                                            <Table.Cell>

                                                <Button

                                                    size="sm"

                                                    colorPalette="red"

                                                    variant="outline"

                                                    onClick={() =>
                                                        removeProduct(
                                                            item.productId
                                                        )
                                                    }

                                                >

                                                    Remove

                                                </Button>

                                            </Table.Cell>

                                        </Table.Row>

                                    )
                                )}

                            </Table.Body>

                        </Table.Root>

                    </Box>

                )}

            </Box>


            {/* FOOTER BUTTONS */}

            <Flex
                justify="end"
                gap={3}
                mt={6}
            >

                <Button

                    variant="outline"

                    onClick={() =>
                        navigate(
                            "/admin/po/all-purchase-orders"
                        )
                    }

                    disabled={loading}

                >

                    Cancel

                </Button>


                <Button

                    colorPalette="blue"

                    onClick={
                        createPurchaseOrder
                    }

                    loading={loading}

                >

                    Create Purchase Order

                </Button>

            </Flex>

        </Box>

    );

}