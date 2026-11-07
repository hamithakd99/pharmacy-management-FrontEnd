import {
    Box,
    Button,
    Field,
    Flex,
    Heading,
    Input,
    NativeSelect,
    Table,
    Text,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "@/api/axios";


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
    id?: number;

    productId: number;

    productCode: string;

    productName: string;

    brand: string;

    quantity: number;
};


export default function EditPO() {

    const { id } = useParams<{
        id: string;
    }>();

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


    const [orderNumber, setOrderNumber] =
        useState("");


    const [status, setStatus] =
        useState("PENDING");


    const [selectedProductId, setSelectedProductId] =
        useState("");


    const [quantity, setQuantity] =
        useState("");


    const [items, setItems] =
        useState<POItem[]>([]);


    const [loading, setLoading] =
        useState(false);


    const [saving, setSaving] =
        useState(false);


    /*
    =====================================================
    LOAD INITIAL DATA
    =====================================================
    */

    useEffect(() => {

        if (!id) {
            return;
        }

        loadData();

    }, [id]);


    /*
    =====================================================
    LOAD SUPPLIERS + PRODUCTS + PO
    =====================================================
    */


    async function loadData() {
        try {
            setLoading(true);

            const [
                supplierResponse,
                productResponse,
                poResponse,
            ] = await Promise.all([
                api.get("/external/suppliers"),
                api.get("/product/all"),
                api.get("/po/purchase-orders/" + id),
            ]);

            // Load supplier list
            const supplierResponseData = supplierResponse.data;

            const supplierList = Array.isArray(supplierResponseData)
                ? supplierResponseData
                : Array.isArray(supplierResponseData?.data)
                    ? supplierResponseData.data
                    : [];

            const po = poResponse.data?.data ?? poResponse.data;

            // Make sure the PO's existing supplier is available in the dropdown.
            const existingSupplier = po.supplier;

            const completeSupplierList =
                existingSupplier &&
                    !supplierList.some(
                        (supplier: Supplier) =>
                            Number(supplier.id) === Number(po.supplierId)
                    )
                    ? [...supplierList, existingSupplier]
                    : supplierList;

            setSuppliers(completeSupplierList);

            // Set existing PO details
            setOrderNumber(po.orderNumber);
            setSupplierId(String(po.supplierId));
            setStatus(po.status);

            // Load products
            const productResponseData = productResponse.data;

            const productList = Array.isArray(productResponseData)
                ? productResponseData
                : Array.isArray(productResponseData?.data)
                    ? productResponseData.data
                    : Array.isArray(productResponseData?.products)
                        ? productResponseData.products
                        : [];

            setProducts(productList);

            // Load existing PO items
            setItems(
                (po.items ?? []).map((item: any) => ({
                    id: item.id,
                    productId: item.productId,
                    productCode: item.product?.productId ?? "-",
                    productName: item.product?.name ?? "-",
                    brand: item.product?.brand ?? "-",
                    quantity: item.quantity,
                }))
            );
        } catch (error: any) {
            console.error("Failed to load purchase order:", error);

            toast.error(
                error.response?.data?.error ??
                "Failed to load purchase order"
            );
        } finally {
            setLoading(false);
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


        if (
            !quantity ||
            Number(quantity) <= 0
        ) {

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
        DUPLICATE CHECK
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


        const newItem: POItem = {

            productId:
                selectedProduct.id,

            productCode:
                selectedProduct.productId,

            productName:
                selectedProduct.name,

            brand:
                selectedProduct.brand ??
                "-",

            quantity:
                Number(quantity),

        };


        setItems((currentItems) => [

            ...currentItems,

            newItem,

        ]);


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

            currentItems.map(
                (item) =>

                    item.productId ===
                        productId

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
    UPDATE PURCHASE ORDER
    =====================================================
    */

    async function updatePurchaseOrder() {

        if (!id) {

            toast.error(
                "Purchase order ID not found"
            );

            return;

        }


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

            setSaving(true);


            const response =
                await api.put("/po/update/purchase-orders/" + id,

                    {

                        supplierId:
                            Number(supplierId),

                        status:
                            status,

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
                "Purchase order updated successfully"
            );


            navigate(
                "/admin/po/"
            );

        }

        catch (error: any) {

            console.error(error);


            toast.error(

                error.response?.data?.error ??

                "Failed to update purchase order"

            );

        }

        finally {

            setSaving(false);

        }

    }


    /*
    =====================================================
    LOADING
    =====================================================
    */

    if (loading) {

        return (

            <Box
                textAlign="center"
                py={20}
            >

                <Text>
                    Loading purchase order...
                </Text>

            </Box>

        );

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
                p={{ base: 3, sm: 4 }}
                rounded="md"
                textAlign="center"
                fontWeight="bold"
                fontSize={{ base: "md", sm: "lg" }}
                mb={{ base: 4, md: 6 }}
            >

                Edit Purchase Order

            </Box>


            {/* PO INFORMATION */}

            <Box
                bg="white"
                borderWidth="1px"
                rounded="lg"
                p={{ base: 3, sm: 4, md: 6 }}
                mb={{ base: 4, md: 6 }}
            >

                <Heading
                    size="md"
                    mb={{ base: 3, md: 5 }}
                    fontSize={{ base: "md", sm: "lg" }}
                >

                    Purchase Order Information

                </Heading>


                <Flex
                    gap={{ base: 3, md: 6 }}
                    wrap="wrap"
                >

                    {/* PO NUMBER */}

                    <Box
                        flex="1"
                        minW={{ base: "100%", md: "250px" }}
                    >

                        <Field.Root>

                            <Field.Label>
                                PO Number
                            </Field.Label>

                            <Input

                                value={
                                    orderNumber
                                }

                                readOnly

                                bg="gray.100"

                            />

                        </Field.Root>

                    </Box>


                    {/* SUPPLIER */}

                    <Box
                        flex="1"
                        minW={{ base: "100%", md: "250px" }}
                    >

                        <Field.Root>

                            <Field.Label>
                                Supplier
                            </Field.Label>


                            <NativeSelect.Root>

                                <NativeSelect.Field
                                    value={supplierId}
                                    onChange={(e) => setSupplierId(e.target.value)}
                                >
                                    <option value="">Select Supplier</option>

                                    {suppliers.map((supplier) => (
                                        <option
                                            key={supplier.id}
                                            value={String(supplier.id)}
                                        >
                                            {supplier.firstName} {supplier.lastName}
                                        </option>
                                    ))}
                                </NativeSelect.Field>


                                <NativeSelect.Indicator />

                            </NativeSelect.Root>

                        </Field.Root>

                    </Box>


                    {/* STATUS */}

                    <Box
                        flex="1"
                        minW={{ base: "100%", md: "250px" }}
                    >

                        <Field.Root>

                            <Field.Label>
                                Status
                            </Field.Label>


                            <NativeSelect.Root>

                                <NativeSelect.Field

                                    value={
                                        status
                                    }

                                    onChange={(e) =>
                                        setStatus(
                                            e.target.value
                                        )
                                    }

                                >

                                    <option value="PENDING">
                                        Pending
                                    </option>

                                </NativeSelect.Field>


                                <NativeSelect.Indicator />

                            </NativeSelect.Root>

                        </Field.Root>

                    </Box>

                </Flex>

            </Box>


            {/* ADD NEW PRODUCT */}

            <Box
                bg="white"
                borderWidth="1px"
                rounded="lg"
                p={{ base: 3, sm: 4, md: 6 }}
                mb={{ base: 4, md: 6 }}
            >

                <Heading
                    size="md"
                    mb={{ base: 3, md: 5 }}
                    fontSize={{ base: "md", sm: "lg" }}
                >

                    Add Product

                </Heading>


                <Flex
                    gap={{ base: 3, md: 4 }}
                    align={{ base: "stretch", md: "end" }}
                    wrap="wrap"
                >

                    <Box
                        flex="1"
                        minW={{ base: "100%", md: "300px" }}
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
                        width={{ base: "100%", md: "180px" }}
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
                        width={{ base: "100%", md: "auto" }}
                        colorPalette="blue"

                        onClick={
                            addProduct
                        }

                    >

                        Add Product

                    </Button>

                </Flex>

            </Box>


            {/* ITEMS */}

            <Box
                bg="white"
                borderWidth="1px"
                rounded="lg"
                p={{ base: 3, sm: 4, md: 6 }}
            >

                <Heading
                    size="md"
                    mb={{ base: 3, md: 5 }}
                    fontSize={{ base: "md", sm: "lg" }}
                >

                    Ordered Products

                </Heading>


                {items.length === 0 ? (

                    <Box
                        textAlign="center"
                        py={10}
                    >

                        <Text
                            color="gray.500"
                        >

                            No products added.

                        </Text>

                    </Box>

                ) : (

                    <Box
                        overflowX="auto"
                    >

                        <Table.Root
                            variant="outline"
                            minW="700px"
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
                                    (
                                        item,
                                        index
                                    ) => (

                                        <Table.Row
                                            key={
                                                item.productId
                                            }
                                        >

                                            <Table.Cell>
                                                {
                                                    index + 1
                                                }
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


            {/* FOOTER */}

            <Flex
                justify="end"
                gap={{ base: 2, sm: 3 }}
                direction={{ base: "column-reverse", sm: "row" }}
                align={{ base: "stretch", sm: "center" }}
                mt={6}
            >

                <Button
                    width={{ base: "100%", sm: "auto" }}

                    variant="outline"

                    onClick={() =>
                        navigate(
                            "/admin/po"
                        )
                    }

                    disabled={saving}

                >

                    Cancel

                </Button>


                <Button

                    colorPalette="blue"
                    width={{ base: "100%", sm: "auto" }}

                    onClick={
                        updatePurchaseOrder
                    }

                    loading={saving}

                >

                    Update Purchase Order

                </Button>

            </Flex>

        </Box>

    );

}