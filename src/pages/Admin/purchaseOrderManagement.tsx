import {
    Box,
    Button,
    Flex,
    Input,
    InputGroup,
    Text,
} from "@chakra-ui/react";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LuPlus, LuSearch } from "react-icons/lu";
import type { PurchaseOrder } from "@/components/PO/POTable";
import POTable from "@/components/PO/POTable";
import POViewDialog from "@/components/PO/POViewDialog";



export default function PurchaseOrderManagement() {

    const navigate = useNavigate();


    /*
    =====================================================
    STATE
    =====================================================
    */

    const [purchaseOrders, setPurchaseOrders] =
        useState<PurchaseOrder[]>([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [selectedPO, setSelectedPO] =
        useState<PurchaseOrder | null>(null);

    const [viewDialogOpen, setViewDialogOpen] =
        useState(false);


    /*
    =====================================================
    LOAD PURCHASE ORDERS
    =====================================================
    */

    useEffect(() => {

        getPurchaseOrders();

    }, []);


    async function getPurchaseOrders() {

        try {

            setLoading(true);

            const response = await axios.get(

                import.meta.env.VITE_BACKEND_URL +
                "/po/all-purchase-orders",

            );

            setPurchaseOrders(
                response.data
            );

        }

        catch (error) {

            console.error(error);

            toast.error(
                "Failed to load purchase orders"
            );

        }

        finally {

            setLoading(false);

        }

    }


    /*
    =====================================================
    SEARCH
    =====================================================
    */

    const filteredPurchaseOrders =
        purchaseOrders.filter(
            (purchaseOrder) => {

                const keyword =
                    search
                        .toLowerCase()
                        .trim();


                if (!keyword) {
                    return true;
                }


                const poNumber =
                    purchaseOrder.orderNumber
                        .toLowerCase();


                const supplierName =
                    purchaseOrder.supplier

                        ? `${purchaseOrder.supplier.firstName} ${purchaseOrder.supplier.lastName}`
                            .toLowerCase()

                        : "";


                return (

                    poNumber.includes(keyword) ||

                    supplierName.includes(keyword)

                );

            }
        );


    /*
    =====================================================
    VIEW
    =====================================================
    */

    function handleView(
        purchaseOrder: PurchaseOrder
    ) {

        setSelectedPO(
            purchaseOrder
        );

        setViewDialogOpen(true);

    }


    /*
    =====================================================
    EDIT
    =====================================================
    */

    function handleEdit(
        purchaseOrder: PurchaseOrder
    ) {

        navigate(

            `/admin/po/purchase-orders/${purchaseOrder.id}`

        );

    }


    /*
    =====================================================
    DELETE
    =====================================================
    */

    async function handleDelete(
        purchaseOrder: PurchaseOrder
    ) {

        const confirmed =
            window.confirm(

                `Are you sure you want to delete ${purchaseOrder.orderNumber}?`

            );


        if (!confirmed) {
            return;
        }


        try {

            await axios.delete(

                import.meta.env.VITE_BACKEND_URL +

                "/po/purchase-orders/" +

                purchaseOrder.id,

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
                "Purchase order deleted successfully"
            );


            /*
            Refresh table
            */

            getPurchaseOrders();

        }

        catch (error: any) {

            console.error(error);


            toast.error(

                error.response?.data?.error ??

                "Failed to delete purchase order"

            );

        }

    }


    /*
    =====================================================
    UI
    =====================================================
    */

    return (

        <Box>

            {/* PAGE HEADER */}

            <Box
                bg="blue.500"
                color="white"
                p={4}
                rounded="md"
                textAlign="center"
                fontWeight="bold"
                mb={6}
            >

                Purchase Order Management

            </Box>


            {/* SEARCH + CREATE */}

            <Flex
                justify="space-between"
                align="center"
                gap={4}
                mb={5}
                wrap="wrap"
            >

                {/* SEARCH */}

                <InputGroup
                    startElement={<LuSearch />}
                    maxW="450px"
                >

                    <Input

                        placeholder="Search by PO number or supplier..."

                        value={
                            search
                        }

                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }

                    />

                </InputGroup>


                {/* CREATE */}

                <Button

                    colorPalette="blue"

                    onClick={() =>
                        navigate(
                            "/admin/po/create"
                        )
                    }

                >

                    <LuPlus />

                    Create Purchase Order

                </Button>

            </Flex>


            {/* RESULTS COUNT */}

            <Text
                mb={3}
                color="gray.600"
                fontSize="sm"
            >

                Showing{" "}

                <strong>
                    {
                        filteredPurchaseOrders.length
                    }
                </strong>{" "}

                of{" "}

                <strong>
                    {
                        purchaseOrders.length
                    }
                </strong>{" "}

                purchase orders

            </Text>


            {/* TABLE */}

            {loading ? (

                <Box
                    textAlign="center"
                    py={10}
                >

                    <Text>
                        Loading purchase orders...
                    </Text>

                </Box>

            ) : (

                <POTable

                    purchaseOrders={
                        filteredPurchaseOrders
                    }

                    onView={
                        handleView
                    }

                    onEdit={
                        handleEdit
                    }

                    onDelete={
                        handleDelete
                    }

                />

            )}


            {/* VIEW DIALOG */}

            <POViewDialog

                open={
                    viewDialogOpen
                }

                onClose={() => {

                    setViewDialogOpen(
                        false
                    );

                    setSelectedPO(
                        null
                    );

                }}

                purchaseOrder={
                    selectedPO
                }

            />

        </Box>

    );

}