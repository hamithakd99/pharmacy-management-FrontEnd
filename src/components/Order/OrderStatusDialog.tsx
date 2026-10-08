import {
    Box,
    Button,
    Dialog,
    HStack,
    NativeSelect,
    Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheckCircle } from "react-icons/fi";

interface OrderStatusDialogProps {
    order: {
        id: number;
        orderNumber: string;
        status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    } | null;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const OrderStatusDialog = ({
    order,
    open,
    onClose,
    onSuccess,
}: OrderStatusDialogProps) => {
    const [status, setStatus] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (order) {
            setStatus(order.status);
        }
    }, [order]);

    const handleUpdateStatus = async () => {
        if (!order || !status) {
            return;
        }

        if (status === order.status) {
            toast("Please select a different status.");
            return;
        }

        try {
            setUpdating(true);

            const token = localStorage.getItem("token");

            await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/order/${order.id}/status`,
                {
                    status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                `${order.orderNumber} is now ${status}.`
            );

            onClose();
            onSuccess();
        } catch (error: any) {
            console.error("Update Order Status Error:", error);

            toast.error(
                error.response?.data?.message ??
                    "Something went wrong while updating the order status."
            );
        } finally {
            setUpdating(false);
        }
    };

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(details) => {
                if (!details.open) {
                    onClose();
                }
            }}
            size="sm"
        >
            <Dialog.Backdrop />

            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>
                            Update Order Status
                        </Dialog.Title>
                    </Dialog.Header>

                    <Dialog.Body>
                        {order && (
                            <Box>
                                <Box
                                    p={4}
                                    bg="gray.50"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    borderRadius="lg"
                                    mb={5}
                                >
                                    <Text
                                        fontSize="xs"
                                        color="gray.500"
                                        fontWeight="600"
                                    >
                                        ORDER NUMBER
                                    </Text>

                                    <Text
                                        mt={1}
                                        fontSize="md"
                                        fontWeight="700"
                                        color="gray.800"
                                    >
                                        {order.orderNumber}
                                    </Text>
                                </Box>

                                <Text
                                    mb={2}
                                    fontSize="sm"
                                    fontWeight="600"
                                    color="gray.700"
                                >
                                    Order Status
                                </Text>

                                <NativeSelect.Root>
                                    <NativeSelect.Field
                                        value={status}
                                        onChange={(event) =>
                                            setStatus(event.target.value)
                                        }
                                    >
                                        {order.status === "PENDING" && (
                                            <>
                                                <option value="PENDING">
                                                    Pending
                                                </option>

                                                <option value="CONFIRMED">
                                                    Confirmed
                                                </option>
                                            </>
                                        )}

                                        {order.status === "CONFIRMED" && (
                                            <>
                                                <option value="CONFIRMED">
                                                    Confirmed
                                                </option>

                                                <option value="COMPLETED">
                                                    Completed
                                                </option>
                                            </>
                                        )}
                                    </NativeSelect.Field>

                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>

                                <Box
                                    mt={4}
                                    p={3}
                                    bg="blue.50"
                                    border="1px solid"
                                    borderColor="blue.100"
                                    borderRadius="lg"
                                >
                                    <HStack
                                        align="flex-start"
                                        gap={3}
                                    >
                                        <Box
                                            color="blue.600"
                                            mt="2px"
                                        >
                                            <FiCheckCircle />
                                        </Box>

                                        <Text
                                            fontSize="xs"
                                            color="blue.700"
                                        >
                                            Confirming an order will process
                                            the stock allocation according to
                                            the backend order workflow.
                                        </Text>
                                    </HStack>
                                </Box>
                            </Box>
                        )}
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={updating}
                        >
                            Cancel
                        </Button>

                        <Button
                            colorPalette="blue"
                            onClick={handleUpdateStatus}
                            loading={updating}
                            loadingText="Updating..."
                        >
                            Update Status
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};

export default OrderStatusDialog;