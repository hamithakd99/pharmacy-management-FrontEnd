
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

import type { PurchaseOrder } from "./POTable";

type DeletePODialogProps = {
    open: boolean;
    onClose: () => void;
    purchaseOrder: PurchaseOrder | null;
    onDeleted: () => void;
};

export default function DeletePODialog({
    open,
    onClose,
    purchaseOrder,
    onDeleted,
}: DeletePODialogProps) {
    const [loading, setLoading] = useState(false);

    async function handleCancelPO() {
        if (!purchaseOrder || loading) return;

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/po/purchase-orders/${purchaseOrder.id}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Purchase order cancelled successfully");

            onClose();
            onDeleted();
        } catch (error: unknown) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.error ??
                    "Failed to cancel purchase order"
                );
            } else {
                toast.error("Failed to cancel purchase order");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(details) => {
                if (!details.open && !loading) {
                    onClose();
                }
            }}
        >
            <Portal>
                <Dialog.Backdrop />

                <Dialog.Positioner>
                    <Dialog.Content maxW="450px">
                        <Dialog.Header>
                            <Dialog.Title color="red.500">
                                Cancel Purchase Order
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <VStack align="start" gap={4}>
                                <Text>
                                    Are you sure you want to cancel
                                    this purchase order?
                                </Text>

                                {purchaseOrder && (
                                    <Text fontWeight="bold" fontSize="lg">
                                        {purchaseOrder.orderNumber}
                                    </Text>
                                )}

                                <Text fontSize="sm" color="gray.600">
                                    The purchase order and its items will
                                    remain in the system. Its status will
                                    change to CANCELLED.
                                </Text>

                                <Text fontSize="sm" color="red.500">
                                    Only pending purchase orders without
                                    linked GRNs can be cancelled.
                                </Text>
                            </VStack>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Keep PO
                            </Button>

                            <Button
                                colorPalette="red"
                                onClick={handleCancelPO}
                                loading={loading}
                            >
                                Cancel PO
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
