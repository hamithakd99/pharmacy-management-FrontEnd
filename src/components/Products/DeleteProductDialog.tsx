import {
    Button,
    CloseButton,
    Dialog,
    Portal,
    Text,
    VStack
} from "@chakra-ui/react";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

type Product = {

    id: number;

    productId: string;

    name: string;

}

type DeleteProductDialogProps = {

    open: boolean;

    onClose: () => void;

    product: Product | null;

    onDeleted: () => void;

}

export default function DeleteProductDialog({

    open,

    onClose,

    product,

    onDeleted

}: DeleteProductDialogProps) {

    const [isDeleting, setIsDeleting] = useState(false);

    async function deleteProduct() {

        if (!product) return;

        try {

            setIsDeleting(true);

            await axios.delete(

                import.meta.env.VITE_BACKEND_URL +

                "/product/delete/" +

                product.id,

                {

                    headers: {

                        Authorization:

                            "Bearer " +

                            localStorage.getItem("token")

                    }

                }

            );

            toast.success(

                `${product.name} deleted successfully`

            );

            onDeleted();

            onClose();

        }

        catch (error: any) {

            toast.error(

                error.response?.data?.error ||

                "Failed to delete product"

            );

        }

        finally {

            setIsDeleting(false);

        }

    }

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

                    <Dialog.Content maxW="450px">

                        <Dialog.CloseTrigger asChild>

                            <CloseButton />

                        </Dialog.CloseTrigger>

                        <Dialog.Header>

                            <Dialog.Title color="red.500">

                                Delete Product

                            </Dialog.Title>

                        </Dialog.Header>

                        <Dialog.Body>

                            <VStack
                                align="start"
                                gap={4}
                            >

                                <Text>

                                    Are you sure you want to permanently delete this product?

                                </Text>

                                <VStack
                                    align="start"
                                    w="100%"
                                    p={3}
                                    borderWidth="1px"
                                    borderRadius="md"
                                >

                                    <Text
                                        fontWeight="bold"
                                    >

                                        {product?.name}

                                    </Text>

                                    <Text
                                        fontSize="sm"
                                        color="gray.600"
                                    >

                                        Product ID : {product?.productId}

                                    </Text>

                                </VStack>

                                <Text
                                    color="red.500"
                                    fontSize="sm"
                                >

                                    This action cannot be undone.

                                </Text>

                            </VStack>

                        </Dialog.Body>

                        <Dialog.Footer>

                            <Button

                                variant="outline"

                                onClick={onClose}

                                disabled={isDeleting}

                            >

                                Cancel

                            </Button>

                            <Button

                                colorPalette="red"

                                loading={isDeleting}

                                loadingText="Deleting..."

                                onClick={deleteProduct}

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