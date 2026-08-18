import {
    Button,
    Dialog,
    Portal,
    Text,
    VStack,
} from "@chakra-ui/react";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import type {
    PurchaseOrder,
} from "./POTable";


type DeletePODialogProps = {

    open: boolean;

    onClose: () => void;

    purchaseOrder:
        PurchaseOrder | null;

    onDeleted: () => void;

};


export default function DeletePODialog({

    open,

    onClose,

    purchaseOrder,

    onDeleted,

}: DeletePODialogProps) {


    const [loading, setLoading] =
        useState(false);


    async function handleDelete() {

        if (!purchaseOrder) {
            return;
        }


        try {

            setLoading(true);


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


            onClose();

            onDeleted();

        }

        catch (error: any) {

            console.error(error);


            toast.error(

                error.response?.data?.error ??

                "Failed to delete purchase order"

            );

        }

        finally {

            setLoading(false);

        }

    }


    return (

        <Dialog.Root

            open={open}

            onOpenChange={(details) => {

                if (!details.open) {

                    onClose();

                }

            }}

        >

            <Portal>

                <Dialog.Backdrop />

                <Dialog.Positioner>

                    <Dialog.Content
                        maxW="450px"
                    >

                        <Dialog.Header>

                            <Dialog.Title
                                color="red.500"
                            >

                                Delete Purchase Order

                            </Dialog.Title>

                        </Dialog.Header>


                        <Dialog.Body>

                            <VStack
                                align="start"
                                gap={4}
                            >

                                <Text>

                                    Are you sure you want
                                    to delete this purchase
                                    order?

                                </Text>


                                {purchaseOrder && (

                                    <Text
                                        fontWeight="bold"
                                        fontSize="lg"
                                    >

                                        {
                                            purchaseOrder.orderNumber
                                        }

                                    </Text>

                                )}


                                <Text
                                    fontSize="sm"
                                    color="red.500"
                                >

                                    This action cannot be
                                    undone.

                                </Text>

                            </VStack>

                        </Dialog.Body>


                        <Dialog.Footer>

                            <Button

                                variant="outline"

                                onClick={
                                    onClose
                                }

                                disabled={
                                    loading
                                }

                            >

                                Cancel

                            </Button>


                            <Button

                                colorPalette="red"

                                onClick={
                                    handleDelete
                                }

                                loading={
                                    loading
                                }

                            >

                                Delete

                            </Button>

                        </Dialog.Footer>


                    </Dialog.Content>

                </Dialog.Positioner>

            </Portal>

        </Dialog.Root>

    );

}