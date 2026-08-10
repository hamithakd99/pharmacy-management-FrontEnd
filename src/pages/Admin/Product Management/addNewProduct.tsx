import {
    Box,
    Button,
    Flex,
    GridItem,
    Heading,
    Input,
    NativeSelect,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";

import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


// ================================
// CATEGORY TYPE
// ================================

type Category = {
    id: number;
    name: string;
};


// ================================
// PRODUCT FORM TYPE
// ================================

type ProductForm = {
    name: string;
    brand: string;
    categoryId: string;
    description: string;
    dosageForm: string;
    strengthValue: string;
    strengthUnit: string;
    packSize: string;
};


// ================================
// INITIAL PRODUCT STATE
// ================================

const initialProductState: ProductForm = {
    name: "",
    brand: "",
    categoryId: "",
    description: "",
    dosageForm: "",
    strengthValue: "",
    strengthUnit: "",
    packSize: "",
};


export default function AddProduct() {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    if (!token) {
        toast.error("You are not logged in. Please log in to continue.");
        window.location.href = "/login";
    }


    // ================================
    // STATES
    // ================================

    const [product, setProduct] =
        useState<ProductForm>(initialProductState);


    const [categories, setCategories] =
        useState<Category[]>([]);


    const [categoriesLoading, setCategoriesLoading] =
        useState(false);


    const [saving, setSaving] =
        useState(false);



    // ================================
    // FETCH ALL CATEGORIES
    // ================================

    function getAllCategories() {

        setCategoriesLoading(true);

        axios
            .get(
                import.meta.env.VITE_BACKEND_URL +
                "/category/all"
            )

            .then((response) => {

                setCategories(response.data);

                console.log(
                    "Categories:",
                    response.data
                );

            })

            .catch((error) => {

                console.log(
                    "Failed to fetch categories:",
                    error
                );

                toast.error(
                    "Failed to load categories"
                );

            })

            .finally(() => {

                setCategoriesLoading(false);

            });

    }



    // ================================
    // LOAD CATEGORIES ON PAGE LOAD
    // ================================

    useEffect(() => {

        getAllCategories();

    }, []);



    // ================================
    // HANDLE INPUT CHANGE
    // ================================

    function handleChange(
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) {

        const {
            name,
            value
        } = e.target;


        setProduct((prev) => ({

            ...prev,

            [name]: value

        }));

    }



    // ================================
    // RESET FORM
    // ================================

    // function handleDiscard() {

    //     setProduct(
    //         initialProductState
    //     );

    // }



    // ================================
    // CREATE PRODUCT
    // ================================

    async function handleSubmit() {


        // ============================
        // VALIDATION
        // ============================


        if (
            product.name.trim() === ""
        ) {

            toast.error(
                "Product name is required"
            );

            return;

        }


        if (
            product.categoryId === ""
        ) {

            toast.error(
                "Please select a category"
            );

            return;

        }


        if (
            product.dosageForm === ""
        ) {

            toast.error(
                "Please select a dosage form"
            );

            return;

        }


        if (
            product.strengthValue === ""
        ) {

            toast.error(
                "Please enter product strength"
            );

            return;

        }


        if (
            product.strengthUnit === ""
        ) {

            toast.error(
                "Please select a strength unit"
            );

            return;

        }



        // ============================
        // CREATE REQUEST
        // ============================


        setSaving(true);

        await axios.post(

            import.meta.env.VITE_BACKEND_URL +
            "/product/create",

            {

                // Product ID is NOT sent.
                // Backend generates productId.

                name:
                    product.name.trim(),


                brand:
                    product.brand.trim() !== ""
                        ? product.brand.trim()
                        : null,


                categoryId:
                    Number(
                        product.categoryId
                    ),


                description:
                    product.description.trim() !== ""
                        ? product.description.trim()
                        : null,


                dosageForm:
                    product.dosageForm,


                strengthValue:
                    Number(
                        product.strengthValue
                    ),


                strengthUnit:
                    product.strengthUnit,


                packSize:
                    product.packSize !== ""
                        ? Number(
                            product.packSize
                        )
                        : null

            },
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }

        ).then((response) => {


            console.log(
                "Created Product:",
                response.data
            );


            toast.success(
                "Product created successfully"
            );
            navigate("/admin/products");



            // Clear form
            setProduct(
                initialProductState
            );


        }).catch((error: any) => {


            console.log(
                "Create Product Error:",
                error
            );


            console.log(
                "Backend Error:",
                error.response?.data
            );


            toast.error(

                error.response?.data?.error
                ||
                error.response?.data?.message
                ||
                "Failed to create product"

            );

        }).finally(() => {

            setSaving(false);

        });

    }



    // ================================
    // UI
    // ================================

    return (

        <Box

            bg="white"

            border="1px solid"

            borderColor="gray.200"

            rounded="xl"

            p={{
                base: "4",
                md: "6"
            }}

            boxShadow="sm"

        >


            {/* ======================== */}
            {/* HEADER */}
            {/* ======================== */}


            <Flex

                justifyContent=
                "space-between"

                alignItems={{
                    base: "start",
                    md: "center"
                }}

                direction={{
                    base: "column",
                    md: "row"
                }}

                gap="4"

                mb="8"

            >


                <Box>


                    <Heading

                        size="lg"

                        color="gray.800"

                    >

                        Add New Product

                    </Heading>


                    <Text

                        color="gray.500"

                        fontSize="sm"

                        mt="1"

                    >

                        Add a new product to the pharmacy inventory.
                        Product ID will be generated automatically.

                    </Text>


                </Box>



                <Flex
                    gap="3"
                >


                    <Button

                        variant="outline"

                        onClick={() =>

                            navigate("/admin/products")

                        }

                        disabled={
                            saving
                        }

                    >

                        Cancel

                    </Button>



                    <Button

                        colorPalette="teal"

                        onClick={
                            handleSubmit
                        }

                        loading={
                            saving
                        }

                    >

                        Save Product

                    </Button>


                </Flex>


            </Flex>



            {/* ======================== */}
            {/* BASIC INFORMATION */}
            {/* ======================== */}


            <Box
                mb="8"
            >


                <Box
                    mb="4"
                >


                    <Text

                        fontSize="md"

                        fontWeight=
                        "semibold"

                        color="gray.800"

                    >

                        Basic Information

                    </Text>


                    <Text

                        fontSize="sm"

                        color="gray.500"

                    >

                        Enter the basic details of the product

                    </Text>


                </Box>



                <SimpleGrid

                    columns={{
                        base: 1,
                        md: 2
                    }}

                    gap="5"

                >



                    {/* PRODUCT NAME */}


                    <GridItem>


                        <Text

                            fontSize="sm"

                            fontWeight=
                            "medium"

                            mb="2"

                        >

                            Product Name

                            <Text

                                as="span"

                                color="red.500"

                                ml="1"

                            >

                                *

                            </Text>

                        </Text>


                        <Input

                            name="name"

                            placeholder=
                            "e.g. Panadol"

                            value={
                                product.name
                            }

                            onChange={
                                handleChange
                            }

                        />


                    </GridItem>



                    {/* BRAND */}


                    <GridItem>


                        <Text

                            fontSize="sm"

                            fontWeight=
                            "medium"

                            mb="2"

                        >

                            Brand

                        </Text>


                        <Input

                            name="brand"

                            placeholder=
                            "e.g. GSK"

                            value={
                                product.brand
                            }

                            onChange={
                                handleChange
                            }

                        />


                    </GridItem>



                    {/* CATEGORY */}


                    <GridItem>
                        <Text
                            fontSize="sm"
                            fontWeight="medium"
                            mb="2"
                        >
                            Category

                            <Text
                                as="span"
                                color="red.500"
                                ml="1"
                            >
                                *
                            </Text>
                        </Text>

                        <NativeSelect.Root
                            disabled={categoriesLoading}
                        >
                            <NativeSelect.Field
                                name="categoryId"
                                value={product.categoryId}
                                onChange={handleChange}
                            >
                                <option value="">
                                    {categoriesLoading
                                        ? "Loading categories..."
                                        : "Select Category"}
                                </option>

                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </NativeSelect.Field>

                            <NativeSelect.Indicator />
                        </NativeSelect.Root>

                        {!categoriesLoading &&
                            categories.length === 0 && (
                                <Text
                                    fontSize="xs"
                                    color="orange.600"
                                    mt="2"
                                >
                                    No categories available. Create a category before adding a product.
                                </Text>
                            )}
                    </GridItem>



                    {/* PACK SIZE */}


                    <GridItem>


                        <Text

                            fontSize="sm"

                            fontWeight=
                            "medium"

                            mb="2"

                        >

                            Pack Size

                        </Text>


                        <Input

                            name="packSize"

                            type="number"

                            min="1"

                            placeholder=
                            "e.g. 20"

                            value={
                                product.packSize
                            }

                            onChange={
                                handleChange
                            }

                        />


                        <Text

                            fontSize="xs"

                            color="gray.500"

                            mt="1"

                        >

                            Number of units in one pack

                        </Text>


                    </GridItem>


                </SimpleGrid>


            </Box>



            {/* ======================== */}
            {/* DIVIDER */}
            {/* ======================== */}


            <Box

                borderTop=
                "1px solid"

                borderColor=
                "gray.200"

                mb="8"

            />



            {/* ======================== */}
            {/* MEDICINE INFORMATION */}
            {/* ======================== */}


            <Box>


                <Box
                    mb="4"
                >


                    <Text

                        fontSize="md"

                        fontWeight=
                        "semibold"

                        color="gray.800"

                    >

                        Medicine Information

                    </Text>


                    <Text

                        fontSize="sm"

                        color="gray.500"

                    >

                        Enter dosage form and strength information

                    </Text>


                </Box>



                <SimpleGrid

                    columns={{
                        base: 1,
                        md: 3
                    }}

                    gap="5"

                >



                    {/* DOSAGE FORM */}


                    <GridItem>


                        <Text

                            fontSize="sm"

                            fontWeight=
                            "medium"

                            mb="2"

                        >

                            Dosage Form

                            <Text

                                as="span"

                                color="red.500"

                                ml="1"

                            >

                                *

                            </Text>

                        </Text>



                        <NativeSelect.Root>


                            <NativeSelect.Field

                                name=
                                "dosageForm"

                                value={
                                    product.dosageForm
                                }

                                onChange={
                                    handleChange
                                }

                            >


                                <option
                                    value=""
                                >

                                    Select Dosage Form

                                </option>


                                <option
                                    value="TABLET"
                                >

                                    Tablet

                                </option>


                                <option
                                    value="CAPSULE"
                                >

                                    Capsule

                                </option>


                                <option
                                    value="SYRUP"
                                >

                                    Syrup

                                </option>


                                <option
                                    value="INJECTION"
                                >

                                    Injection

                                </option>


                                <option
                                    value="CREAM"
                                >

                                    Cream

                                </option>


                                <option
                                    value="OINTMENT"
                                >

                                    Ointment

                                </option>


                                <option
                                    value="DROPS"
                                >

                                    Drops

                                </option>


                            </NativeSelect.Field>


                            <NativeSelect.Indicator />


                        </NativeSelect.Root>


                    </GridItem>



                    {/* STRENGTH VALUE */}


                    <GridItem>


                        <Text

                            fontSize="sm"

                            fontWeight=
                            "medium"

                            mb="2"

                        >

                            Strength

                            <Text

                                as="span"

                                color="red.500"

                                ml="1"

                            >

                                *

                            </Text>

                        </Text>


                        <Input

                            name=
                            "strengthValue"

                            type="number"

                            min="0"

                            step="any"

                            placeholder=
                            "e.g. 500"

                            value={
                                product.strengthValue
                            }

                            onChange={
                                handleChange
                            }

                        />


                    </GridItem>



                    {/* STRENGTH UNIT */}


                    <GridItem>


                        <Text

                            fontSize="sm"

                            fontWeight=
                            "medium"

                            mb="2"

                        >

                            Strength Unit

                            <Text

                                as="span"

                                color="red.500"

                                ml="1"

                            >

                                *

                            </Text>

                        </Text>



                        <NativeSelect.Root>


                            <NativeSelect.Field

                                name=
                                "strengthUnit"

                                value={
                                    product.strengthUnit
                                }

                                onChange={
                                    handleChange
                                }

                            >


                                <option
                                    value=""
                                >

                                    Select Unit

                                </option>


                                <option
                                    value="MG"
                                >

                                    mg

                                </option>


                                <option
                                    value="ML"
                                >

                                    ml

                                </option>


                                <option
                                    value="G"
                                >

                                    g

                                </option>


                            </NativeSelect.Field>


                            <NativeSelect.Indicator />


                        </NativeSelect.Root>


                    </GridItem>


                </SimpleGrid>


            </Box>


        </Box>

    );

}