import {
    Badge,
    Box,
    Button,
    CloseButton,
    Dialog,
    Flex,
    Heading,
    HStack,
    Input,
    Portal,
    Spinner,
    Table,
    Text,
    VStack
} from "@chakra-ui/react";

import axios from "axios";

import {
    useEffect,
    useState
} from "react";

import toast from "react-hot-toast";

import {
    MdAdd,
    MdCategory,
    MdDelete,
    MdEdit,
    MdInventory2,
    MdRefresh,
    MdSearch,
    MdVisibility
} from "react-icons/md";


// ================================
// TYPES
// ================================

type Product = {

    id: number;

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

};


type Category = {

    id: number;

    name: string;

    _count?: {

        products: number;

    };

};


type CategoryWithProducts = {

    id: number;

    name: string;

    products: Product[];

};


export default function CategoryManagement() {


    // ================================
    // STATES
    // ================================


    const [
        categories,
        setCategories
    ] = useState<Category[]>([]);


    const [
        categoryName,
        setCategoryName
    ] = useState("");


    const [
        editCategoryName,
        setEditCategoryName
    ] = useState("");


    const [
        selectedCategory,
        setSelectedCategory
    ] = useState<Category | null>(null);


    const [
        selectedCategoryDetails,
        setSelectedCategoryDetails
    ] = useState<CategoryWithProducts | null>(null);


    const [
        searchText,
        setSearchText
    ] = useState("");


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        productsLoading,
        setProductsLoading
    ] = useState(false);


    const [
        createDialogOpen,
        setCreateDialogOpen
    ] = useState(false);


    const [
        editDialogOpen,
        setEditDialogOpen
    ] = useState(false);


    const [
        deleteDialogOpen,
        setDeleteDialogOpen
    ] = useState(false);


    const [
        productsDialogOpen,
        setProductsDialogOpen
    ] = useState(false);



    // ================================
    // GET ALL CATEGORIES
    // ================================


    function getAllCategories() {

        setLoading(true);


        axios
            .get(

                import.meta.env.VITE_BACKEND_URL
                + "/category/all"

            )

            .then((response) => {

                setCategories(
                    response.data
                );


                console.log(
                    "Categories:",
                    response.data
                );

            })

            .catch((error) => {

                console.log(
                    "Fetch Category Error:",
                    error
                );


                toast.error(

                    error.response?.data?.error
                    ||
                    "Failed to fetch categories"

                );

            })

            .finally(() => {

                setLoading(false);

            });

    }



    // ================================
    // PAGE LOAD
    // ================================


    useEffect(() => {

        getAllCategories();

    }, []);



    // ================================
    // CREATE CATEGORY
    // ================================

    const token = localStorage.getItem("token");

    async function createCategory() {


        if (
            categoryName.trim() === ""
        ) {

            toast.error(
                "Please enter a category name"
            );

            return;

        }


        try {


            const response =
                await axios.post(

                    import.meta.env.VITE_BACKEND_URL
                    + "/category/create",

                    {

                        name:
                            categoryName.trim()

                    },
                    {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }

                );


            console.log(
                "Created Category:",
                response.data
            );


            toast.success(
                "Category created successfully"
            );


            setCategoryName("");


            setCreateDialogOpen(false);


            // Get fresh data
            getAllCategories();


        } catch (error: any) {


            console.log(
                "Create Category Error:",
                error.response?.data
            );


            toast.error(

                error.response?.data?.error
                ||
                "Failed to create category"

            );

        }

    }



    // ================================
    // OPEN EDIT DIALOG
    // ================================


    function openEditDialog(
        category: Category
    ) {


        setSelectedCategory(
            category
        );


        setEditCategoryName(
            category.name
        );


        setEditDialogOpen(
            true
        );

    }



    // ================================
    // UPDATE CATEGORY
    // ================================


    async function updateCategory() {


        if (!selectedCategory) {

            return;

        }


        if (
            editCategoryName.trim() === ""
        ) {

            toast.error(
                "Category name cannot be empty"
            );

            return;

        }


        try {


            const response =
                await axios.put(

                    import.meta.env.VITE_BACKEND_URL
                    + "/category/update/"
                    + selectedCategory.id,

                    {

                        name:
                            editCategoryName.trim()

                    },
                    {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }

                );


            console.log(
                "Updated Category:",
                response.data
            );


            toast.success(
                "Category updated successfully"
            );


            setEditDialogOpen(false);


            setSelectedCategory(null);


            setEditCategoryName("");


            // Get fresh categories
            getAllCategories();


        } catch (error: any) {


            console.log(
                "Update Error:",
                error.response?.data
            );


            toast.error(

                error.response?.data?.error
                ||
                "Failed to update category"

            );

        }

    }



    // ================================
    // OPEN DELETE DIALOG
    // ================================


    function openDeleteDialog(
        category: Category
    ) {


        setSelectedCategory(
            category
        );


        setDeleteDialogOpen(
            true
        );

    }



    // ================================
    // DELETE CATEGORY
    // ================================


    async function deleteCategory() {


        if (!selectedCategory) {

            return;

        }


        try {


            const response =
                await axios.delete(

                    import.meta.env.VITE_BACKEND_URL
                    + "/category/delete/"
                    + selectedCategory.id,
                    {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    }

                );


            console.log(
                "Delete Response:",
                response.data
            );


            toast.success(
                "Category deleted successfully"
            );


            setDeleteDialogOpen(false);


            setSelectedCategory(null);


            // Get fresh categories
            getAllCategories();


        } catch (error: any) {


            console.log(
                "Delete Error:",
                error.response?.data
            );


            toast.error(

                error.response?.data?.error
                ||
                "Failed to delete category"

            );

        }

    }



    // ================================
    // VIEW CATEGORY PRODUCTS
    // ================================


    async function viewCategoryProducts(
        category: Category
    ) {


        try {


            setSelectedCategory(
                category
            );


            setProductsDialogOpen(
                true
            );


            setProductsLoading(
                true
            );


            setSelectedCategoryDetails(
                null
            );


            const response =
                await axios.get(

                    import.meta.env.VITE_BACKEND_URL
                    + "/category/one/"
                    + category.id

                );


            console.log(
                "Category Products:",
                response.data
            );


            setSelectedCategoryDetails(
                response.data
            );


        } catch (error: any) {


            console.log(
                "Product Fetch Error:",
                error.response?.data
            );


            toast.error(

                error.response?.data?.error
                ||
                "Failed to fetch category products"

            );


        } finally {


            setProductsLoading(
                false
            );

        }

    }



    // ================================
    // SEARCH
    // ================================


    const filteredCategories =
        categories.filter(

            (category) =>

                category.name

                    .toLowerCase()

                    .includes(

                        searchText
                            .toLowerCase()

                    )

        );



    // ================================
    // UI
    // ================================


    return (

        <Box

            w="100%"

            minH="100vh"

            bg="gray.50"

            p={{
                base: "4",
                md: "6"
            }}

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

                mb="6"

            >


                <HStack gap="3">


                    <Flex

                        w="48px"

                        h="48px"

                        bg="teal.50"

                        color="teal.600"

                        rounded="xl"

                        justifyContent=
                        "center"

                        alignItems=
                        "center"

                        fontSize="2xl"

                    >

                        <MdCategory />

                    </Flex>


                    <Box>


                        <Heading

                            size="xl"

                            color="gray.800"

                        >

                            Category Management

                        </Heading>


                        <Text

                            color="gray.500"

                            fontSize="sm"

                            mt="1"

                        >

                            Manage pharmacy product categories

                        </Text>


                    </Box>


                </HStack>



                {/* ======================== */}
                {/* CREATE CATEGORY */}
                {/* ======================== */}


                <Dialog.Root

                    open={
                        createDialogOpen
                    }

                    onOpenChange={(e) =>

                        setCreateDialogOpen(
                            e.open
                        )

                    }

                >


                    <Dialog.Trigger
                        asChild
                    >


                        <Button

                            colorPalette=
                            "teal"

                        >

                            <MdAdd />

                            Add Category

                        </Button>


                    </Dialog.Trigger>



                    <Portal>


                        <Dialog.Backdrop />


                        <Dialog.Positioner>


                            <Dialog.Content

                                maxW="500px"

                                rounded="xl"

                            >


                                <Dialog.CloseTrigger
                                    asChild
                                >

                                    <CloseButton />

                                </Dialog.CloseTrigger>



                                <Dialog.Header>


                                    <Dialog.Title>

                                        Add New Category

                                    </Dialog.Title>


                                </Dialog.Header>



                                <Dialog.Body>


                                    <Text

                                        fontSize="sm"

                                        fontWeight=
                                        "medium"

                                        mb="2"

                                    >

                                        Category Name

                                    </Text>


                                    <Input

                                        placeholder=
                                        "e.g. Pain Relief"

                                        value={
                                            categoryName
                                        }

                                        onChange={(e) =>

                                            setCategoryName(
                                                e.target.value
                                            )

                                        }

                                        onKeyDown={(e) => {

                                            if (
                                                e.key ===
                                                "Enter"
                                            ) {

                                                createCategory();

                                            }

                                        }}

                                    />


                                </Dialog.Body>



                                <Dialog.Footer>


                                    <Button

                                        variant=
                                        "outline"

                                        onClick={() =>

                                            setCreateDialogOpen(
                                                false
                                            )

                                        }

                                    >

                                        Cancel

                                    </Button>


                                    <Button

                                        colorPalette=
                                        "teal"

                                        onClick={
                                            createCategory
                                        }

                                    >

                                        Create Category

                                    </Button>


                                </Dialog.Footer>


                            </Dialog.Content>


                        </Dialog.Positioner>


                    </Portal>


                </Dialog.Root>


            </Flex>



            {/* ======================== */}
            {/* SUMMARY */}
            {/* ======================== */}


            <Box

                bg="white"

                border="1px solid"

                borderColor=
                "gray.200"

                rounded="xl"

                p="5"

                mb="6"

                maxW="280px"

                boxShadow="sm"

            >


                <HStack

                    justifyContent=
                    "space-between"

                >


                    <Box>


                        <Text

                            color="gray.500"

                            fontSize="sm"

                        >

                            Total Categories

                        </Text>


                        <Text

                            fontSize="3xl"

                            fontWeight="bold"

                            color="gray.800"

                        >

                            {categories.length}

                        </Text>


                    </Box>


                    <Flex

                        w="50px"

                        h="50px"

                        bg="teal.50"

                        color="teal.600"

                        rounded="xl"

                        justifyContent=
                        "center"

                        alignItems=
                        "center"

                        fontSize="2xl"

                    >

                        <MdCategory />

                    </Flex>


                </HStack>


            </Box>



            {/* ======================== */}
            {/* MAIN TABLE CARD */}
            {/* ======================== */}


            <Box

                bg="white"

                border="1px solid"

                borderColor=
                "gray.200"

                rounded="xl"

                boxShadow="sm"

                overflow="hidden"

            >


                {/* TOOLBAR */}


                <Flex

                    p="5"

                    justifyContent=
                    "space-between"

                    alignItems={{
                        base: "stretch",
                        md: "center"
                    }}

                    direction={{
                        base: "column",
                        md: "row"
                    }}

                    gap="4"

                    borderBottom=
                    "1px solid"

                    borderColor=
                    "gray.200"

                >


                    <Box

                        position=
                        "relative"

                        maxW="400px"

                        w="100%"

                    >


                        <Box

                            position=
                            "absolute"

                            left="3"

                            top="50%"

                            transform=
                            "translateY(-50%)"

                            color=
                            "gray.400"

                            zIndex="1"

                        >

                            <MdSearch />

                        </Box>


                        <Input

                            pl="10"

                            placeholder=
                            "Search categories..."

                            value={
                                searchText
                            }

                            onChange={(e) =>

                                setSearchText(
                                    e.target.value
                                )

                            }

                        />


                    </Box>



                    <Button

                        variant="outline"

                        onClick={
                            getAllCategories
                        }

                    >

                        <MdRefresh />

                        Refresh

                    </Button>


                </Flex>



                {/* LOADING */}


                {loading ? (


                    <Flex

                        minH="300px"

                        justifyContent=
                        "center"

                        alignItems=
                        "center"

                    >


                        <VStack>


                            <Spinner

                                size="lg"

                                color=
                                "teal.500"

                            />


                            <Text

                                color=
                                "gray.500"

                            >

                                Loading categories...

                            </Text>


                        </VStack>


                    </Flex>


                ) : (


                    <Box
                        overflowX="auto"
                    >


                        <Table.Root

                            variant="line"

                        >


                            <Table.Header>


                                <Table.Row
                                    bg="gray.50"
                                >


                                    <Table.ColumnHeader>

                                        ID

                                    </Table.ColumnHeader>


                                    <Table.ColumnHeader>

                                        Category

                                    </Table.ColumnHeader>


                                    <Table.ColumnHeader>

                                        Products

                                    </Table.ColumnHeader>


                                    <Table.ColumnHeader

                                        textAlign=
                                        "right"

                                    >

                                        Actions

                                    </Table.ColumnHeader>


                                </Table.Row>


                            </Table.Header>



                            <Table.Body>


                                {filteredCategories.map(

                                    (category) => (


                                        <Table.Row

                                            key={
                                                category.id
                                            }

                                            _hover={{
                                                bg:
                                                    "gray.50"
                                            }}

                                        >


                                            <Table.Cell>


                                                <Text

                                                    color=
                                                    "gray.500"

                                                >

                                                    #{category.id}

                                                </Text>


                                            </Table.Cell>



                                            <Table.Cell>


                                                <HStack
                                                    gap="3"
                                                >


                                                    <Flex

                                                        w="38px"

                                                        h="38px"

                                                        bg=
                                                        "teal.50"

                                                        color=
                                                        "teal.600"

                                                        rounded=
                                                        "lg"

                                                        justifyContent=
                                                        "center"

                                                        alignItems=
                                                        "center"

                                                    >

                                                        <MdCategory />

                                                    </Flex>


                                                    <Text

                                                        fontWeight=
                                                        "semibold"

                                                        color=
                                                        "gray.800"

                                                    >

                                                        {
                                                            category.name
                                                        }

                                                    </Text>


                                                </HStack>


                                            </Table.Cell>



                                            <Table.Cell>


                                                <Badge

                                                    colorPalette=
                                                    "blue"

                                                    variant=
                                                    "subtle"

                                                >

                                                    {
                                                        category
                                                            ._count
                                                            ?.products
                                                        ?? 0
                                                    }

                                                    {" "}
                                                    Products

                                                </Badge>


                                            </Table.Cell>



                                            <Table.Cell>


                                                <HStack

                                                    justifyContent=
                                                    "flex-end"

                                                    gap="2"

                                                >


                                                    <Button

                                                        size="sm"

                                                        variant=
                                                        "outline"

                                                        colorPalette=
                                                        "teal"

                                                        onClick={() =>

                                                            viewCategoryProducts(
                                                                category
                                                            )

                                                        }

                                                    >

                                                        <MdVisibility />

                                                        View Products

                                                    </Button>



                                                    <Button

                                                        size="sm"

                                                        variant=
                                                        "outline"

                                                        onClick={() =>

                                                            openEditDialog(
                                                                category
                                                            )

                                                        }

                                                    >

                                                        <MdEdit />

                                                        Edit

                                                    </Button>



                                                    <Button

                                                        size="sm"

                                                        variant=
                                                        "outline"

                                                        colorPalette=
                                                        "red"

                                                        onClick={() =>

                                                            openDeleteDialog(
                                                                category
                                                            )

                                                        }

                                                    >

                                                        <MdDelete />

                                                        Delete

                                                    </Button>


                                                </HStack>


                                            </Table.Cell>


                                        </Table.Row>


                                    )

                                )}


                            </Table.Body>


                        </Table.Root>


                    </Box>


                )}


            </Box>



            {/* ======================== */}
            {/* VIEW PRODUCTS DIALOG */}
            {/* ======================== */}


            <Dialog.Root

                open={
                    productsDialogOpen
                }

                onOpenChange={(e) =>

                    setProductsDialogOpen(
                        e.open
                    )

                }

            >


                <Portal>


                    <Dialog.Backdrop />


                    <Dialog.Positioner>


                        <Dialog.Content

                            w="95%"

                            maxW="1100px"

                            maxH="90vh"

                            rounded="xl"

                        >


                            <Dialog.CloseTrigger
                                asChild
                            >

                                <CloseButton />

                            </Dialog.CloseTrigger>



                            <Dialog.Header>


                                <Dialog.Title>


                                    <HStack>


                                        <MdInventory2 />


                                        <Text>

                                            {
                                                selectedCategory
                                                    ?.name
                                            }

                                            {" "}

                                            Products

                                        </Text>


                                    </HStack>


                                </Dialog.Title>


                            </Dialog.Header>



                            <Dialog.Body

                                overflowY="auto"

                            >


                                {productsLoading ? (


                                    <Flex

                                        minH="250px"

                                        justifyContent=
                                        "center"

                                        alignItems=
                                        "center"

                                    >


                                        <Spinner

                                            size="lg"

                                            color=
                                            "teal.500"

                                        />


                                    </Flex>


                                ) :


                                    selectedCategoryDetails
                                        ?.products
                                        .length === 0 ? (


                                        <Flex

                                            minH="250px"

                                            justifyContent=
                                            "center"

                                            alignItems=
                                            "center"

                                        >


                                            <VStack>


                                                <MdInventory2

                                                    size={40}

                                                />


                                                <Text

                                                    fontWeight=
                                                    "semibold"

                                                >

                                                    No Products Found

                                                </Text>


                                                <Text

                                                    color=
                                                    "gray.500"

                                                >

                                                    No products are assigned
                                                    to this category.

                                                </Text>


                                            </VStack>


                                        </Flex>


                                    ) : (


                                        <Box
                                            overflowX="auto"
                                        >


                                            <Table.Root>


                                                <Table.Header>


                                                    <Table.Row>


                                                        <Table.ColumnHeader>

                                                            Product ID

                                                        </Table.ColumnHeader>


                                                        <Table.ColumnHeader>

                                                            Product Name

                                                        </Table.ColumnHeader>


                                                        <Table.ColumnHeader>

                                                            Brand

                                                        </Table.ColumnHeader>


                                                        <Table.ColumnHeader>

                                                            Strength

                                                        </Table.ColumnHeader>


                                                        <Table.ColumnHeader>

                                                            Dosage Form

                                                        </Table.ColumnHeader>


                                                        <Table.ColumnHeader>

                                                            Status

                                                        </Table.ColumnHeader>


                                                    </Table.Row>


                                                </Table.Header>



                                                <Table.Body>


                                                    {
                                                        selectedCategoryDetails
                                                            ?.products
                                                            .map(

                                                                (product) => (


                                                                    <Table.Row

                                                                        key={
                                                                            product.id
                                                                        }

                                                                    >


                                                                        <Table.Cell>

                                                                            {
                                                                                product.productId
                                                                            }

                                                                        </Table.Cell>


                                                                        <Table.Cell>

                                                                            <Text

                                                                                fontWeight=
                                                                                "semibold"

                                                                            >

                                                                                {
                                                                                    product.name
                                                                                }

                                                                            </Text>

                                                                        </Table.Cell>


                                                                        <Table.Cell>

                                                                            {
                                                                                product.brand
                                                                                ||
                                                                                "-"
                                                                            }

                                                                        </Table.Cell>


                                                                        <Table.Cell>

                                                                            {
                                                                                product.strengthValue
                                                                                ??
                                                                                "-"
                                                                            }

                                                                            {" "}

                                                                            {
                                                                                product.strengthUnit
                                                                                ??
                                                                                ""
                                                                            }

                                                                        </Table.Cell>


                                                                        <Table.Cell>

                                                                            {
                                                                                product.dosageForm
                                                                                ??
                                                                                "-"
                                                                            }

                                                                        </Table.Cell>


                                                                        <Table.Cell>


                                                                            <Badge

                                                                                colorPalette={

                                                                                    product.isActive

                                                                                        ? "green"

                                                                                        : "red"

                                                                                }

                                                                            >

                                                                                {

                                                                                    product.isActive

                                                                                        ? "Active"

                                                                                        : "Inactive"

                                                                                }

                                                                            </Badge>


                                                                        </Table.Cell>


                                                                    </Table.Row>


                                                                )

                                                            )
                                                    }


                                                </Table.Body>


                                            </Table.Root>


                                        </Box>


                                    )

                                }


                            </Dialog.Body>


                            <Dialog.Footer>


                                <Button

                                    variant="outline"

                                    onClick={() =>

                                        setProductsDialogOpen(
                                            false
                                        )

                                    }

                                >

                                    Close

                                </Button>


                            </Dialog.Footer>


                        </Dialog.Content>


                    </Dialog.Positioner>


                </Portal>


            </Dialog.Root>



            {/* ======================== */}
            {/* EDIT DIALOG */}
            {/* ======================== */}


            <Dialog.Root

                open={
                    editDialogOpen
                }

                onOpenChange={(e) =>

                    setEditDialogOpen(
                        e.open
                    )

                }

            >


                <Portal>


                    <Dialog.Backdrop />


                    <Dialog.Positioner>


                        <Dialog.Content

                            maxW="500px"

                            rounded="xl"

                        >


                            <Dialog.CloseTrigger
                                asChild
                            >

                                <CloseButton />

                            </Dialog.CloseTrigger>



                            <Dialog.Header>


                                <Dialog.Title>

                                    Edit Category

                                </Dialog.Title>


                            </Dialog.Header>



                            <Dialog.Body>


                                <Text

                                    mb="2"

                                    fontWeight=
                                    "medium"

                                >

                                    Category Name

                                </Text>


                                <Input

                                    value={
                                        editCategoryName
                                    }

                                    onChange={(e) =>

                                        setEditCategoryName(
                                            e.target.value
                                        )

                                    }

                                />


                            </Dialog.Body>



                            <Dialog.Footer>


                                <Button

                                    variant="outline"

                                    onClick={() =>

                                        setEditDialogOpen(
                                            false
                                        )

                                    }

                                >

                                    Cancel

                                </Button>


                                <Button

                                    colorPalette=
                                    "teal"

                                    onClick={
                                        updateCategory
                                    }

                                >

                                    Save Changes

                                </Button>


                            </Dialog.Footer>


                        </Dialog.Content>


                    </Dialog.Positioner>


                </Portal>


            </Dialog.Root>



            {/* ======================== */}
            {/* DELETE DIALOG */}
            {/* ======================== */}


            <Dialog.Root

                open={
                    deleteDialogOpen
                }

                onOpenChange={(e) =>

                    setDeleteDialogOpen(
                        e.open
                    )

                }

            >


                <Portal>


                    <Dialog.Backdrop />


                    <Dialog.Positioner>


                        <Dialog.Content

                            maxW="500px"

                            rounded="xl"

                        >


                            <Dialog.CloseTrigger
                                asChild
                            >

                                <CloseButton />

                            </Dialog.CloseTrigger>



                            <Dialog.Header>


                                <Dialog.Title>

                                    Delete Category

                                </Dialog.Title>


                            </Dialog.Header>



                            <Dialog.Body>


                                <Text>


                                    Are you sure you want to delete{" "}


                                    <Text

                                        as="span"

                                        fontWeight=
                                        "bold"

                                    >

                                        {
                                            selectedCategory
                                                ?.name
                                        }

                                    </Text>


                                    ?


                                </Text>



                                {

                                    (
                                        selectedCategory
                                            ?._count
                                            ?.products
                                        ?? 0
                                    ) > 0

                                    &&


                                    <Box

                                        mt="4"

                                        p="3"

                                        bg="red.50"

                                        color="red.700"

                                        rounded="md"

                                    >


                                        This category contains{" "}


                                        <strong>

                                            {
                                                selectedCategory
                                                    ?._count
                                                    ?.products
                                            }

                                        </strong>


                                        {" "}product(s) and cannot
                                        be deleted until those products
                                        are moved to another category.


                                    </Box>

                                }


                            </Dialog.Body>



                            <Dialog.Footer>


                                <Button

                                    variant="outline"

                                    onClick={() =>

                                        setDeleteDialogOpen(
                                            false
                                        )

                                    }

                                >

                                    Cancel

                                </Button>


                                <Button

                                    colorPalette="red"

                                    disabled={

                                        (
                                            selectedCategory
                                                ?._count
                                                ?.products
                                            ?? 0

                                        ) > 0

                                    }

                                    onClick={
                                        deleteCategory
                                    }

                                >

                                    Delete Category

                                </Button>


                            </Dialog.Footer>


                        </Dialog.Content>


                    </Dialog.Positioner>


                </Portal>


            </Dialog.Root>


        </Box>

    );

}