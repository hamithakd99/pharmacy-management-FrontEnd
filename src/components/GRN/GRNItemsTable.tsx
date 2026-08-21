import {
    Box,
    Button,
    Input,
    Table,
    Text,
} from "@chakra-ui/react";

import type { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";


export type GRNItem = {

    purchaseOrderItemId: number;

    productId: number;

    productCode: string;

    productName: string;

    brand: string;

    orderedQuantity: number;

    alreadyReceived: number;

    remainingQuantity: number;

    receivedQuantity: number;

    buyingPrice: number;

    sellingPrice: number;

    expiryDate: string;

    manufacturingDate: string;

};


type GRNItemsTableProps = {

    items: GRNItem[];

    setItems:
    Dispatch<
        SetStateAction<GRNItem[]>
    >;

};


export default function GRNItemsTable({

    items,

    setItems,

}: GRNItemsTableProps) {


    /*
    =====================================================
    UPDATE ITEM
    =====================================================
    */

    function updateItem(
        index: number,
        field: keyof GRNItem,
        value: string | number
    ) {

        setItems((currentItems) => {

            const updatedItems = [
                ...currentItems
            ];


            updatedItems[index] = {

                ...updatedItems[index],

                [field]: value,

            };


            return updatedItems;

        });

    }


    /*
    =====================================================
    REMOVE ITEM
    =====================================================
    */

    function removeItem(
        index: number
    ) {

        setItems((currentItems) =>

            currentItems.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )

        );

    }


    return (

        <Box
            width="100%"
        >

            {/* 
            =================================================
            HORIZONTAL SCROLL
            =================================================
            */}

            <Box
                overflowX="auto"
                width="100%"
                pb={2}
            >

                <Table.Root
                    variant="outline"
                    size="sm"
                    minW="1250px"
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <Table.Header>

                        <Table.Row>

                            <Table.ColumnHeader
                                minW="220px"
                            >
                                Item Name
                            </Table.ColumnHeader>


                            <Table.ColumnHeader
                                minW="120px"
                            >
                                Requested Quantity
                                <br />

                                <Box
                                    as="span"
                                    fontSize="xs"
                                    fontWeight="normal"
                                    color="gray.500"
                                >
                                    (from PO)
                                </Box>

                            </Table.ColumnHeader>


                            <Table.ColumnHeader
                                minW="150px"
                            >
                                Brand Name
                            </Table.ColumnHeader>


                            <Table.ColumnHeader
                                minW="150px"
                            >
                                Received Quantity
                            </Table.ColumnHeader>


                            <Table.ColumnHeader
                                minW="150px"
                            >
                                Unit Buying Price
                                <br />

                                <Box
                                    as="span"
                                    fontSize="xs"
                                    fontWeight="normal"
                                    color="gray.500"
                                >
                                    (from Invoice)
                                </Box>
                            </Table.ColumnHeader>


                            <Table.ColumnHeader
                                minW="150px"
                            >
                                Unit Selling Price
                            </Table.ColumnHeader>


                            <Table.ColumnHeader
                                minW="180px"
                            >
                                Manufacturing Date
                                <br />

                                <Box
                                    as="span"
                                    fontSize="xs"
                                    fontWeight="normal"
                                    color="gray.500"
                                >
                                    (optional)
                                </Box>
                            </Table.ColumnHeader>


                            <Table.ColumnHeader
                                minW="160px"
                            >
                                Expiry Date
                            </Table.ColumnHeader>


                            <Table.ColumnHeader
                                minW="110px"
                                textAlign="center"
                            >
                                Action
                            </Table.ColumnHeader>

                        </Table.Row>

                    </Table.Header>


                    {/* =================================================
                        BODY
                    ================================================= */}

                    <Table.Body>

                        {items.map(
                            (item, index) => (

                                <Table.Row
                                    key={
                                        item.purchaseOrderItemId
                                    }
                                >

                                    {/* =================================================
                                        ITEM NAME
                                    ================================================= */}

                                    <Table.Cell>

                                        <Box
                                            fontWeight="medium"
                                            minW="200px"
                                        >

                                            {item.productName}

                                        </Box>


                                        <Box
                                            fontSize="xs"
                                            color="gray.500"
                                            mt={1}
                                        >

                                            Product ID:{" "}

                                            {item.productCode}

                                        </Box>

                                    </Table.Cell>


                                    {/* =================================================
                                        REQUESTED QUANTITY
                                    ================================================= */}

                                    <Table.Cell>

                                        <Box
                                            fontWeight="medium"
                                        >

                                            {
                                                item.orderedQuantity
                                            }

                                        </Box>


                                        {item.alreadyReceived >
                                            0 && (

                                                <Box
                                                    fontSize="xs"
                                                    color="orange.500"
                                                >

                                                    Already received:{" "}

                                                    {
                                                        item.alreadyReceived
                                                    }

                                                </Box>

                                            )}

                                    </Table.Cell>


                                    {/* =================================================
                                        BRAND
                                    ================================================= */}

                                    <Table.Cell>

                                        <Box
                                            minW="120px"
                                        >

                                            {
                                                item.brand ||
                                                "-"
                                            }

                                        </Box>

                                    </Table.Cell>


                                    {/* =================================================
                                        RECEIVED QUANTITY
                                    ================================================= */}

                                    {/* <Table.Cell>

                                        <Input

                                            type="number"

                                            min={0}

                                            max={
                                                item.remainingQuantity
                                            }

                                            width="130px"

                                            value={
                                                item.receivedQuantity
                                            }

                                            onChange={(e) => {

                                                const value =
                                                    Math.max(

                                                        0,

                                                        Math.min(

                                                            Number(
                                                                e.target.value
                                                            ),

                                                            item.remainingQuantity

                                                        )

                                                    );


                                                updateItem(

                                                    index,

                                                    "receivedQuantity",

                                                    value

                                                );

                                            }}

                                        />


                                        <Box
                                            fontSize="xs"
                                            color="gray.500"
                                            mt={1}
                                        >

                                            Max:{" "}

                                            {
                                                item.remainingQuantity
                                            }

                                        </Box>

                                    </Table.Cell> */}
                                    <Table.Cell>

                                        <Box>

                                            {/* Already Received */}

                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                                mb={1}
                                            >
                                                Already Received:{" "}
                                                <Box
                                                    as="span"
                                                    fontWeight="bold"
                                                    color="orange.500"
                                                >
                                                    {item.alreadyReceived}
                                                </Box>
                                            </Text>


                                            {/* Remaining */}

                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                                mb={2}
                                            >
                                                Remaining:{" "}
                                                <Box
                                                    as="span"
                                                    fontWeight="bold"
                                                    color="blue.600"
                                                >
                                                    {item.remainingQuantity}
                                                </Box>
                                            </Text>


                                            {/* Received Input */}

                                            <Input
                                                type="number"
                                                min={0}
                                                max={item.remainingQuantity}
                                                width="130px"
                                                value={item.receivedQuantity}
                                                onChange={(e) => {

                                                    const value = Number(e.target.value);

                                                    if (value > item.remainingQuantity) {

                                                        toast.error(
                                                            `Maximum remaining quantity is ${item.remainingQuantity}`
                                                        );

                                                        updateItem(
                                                            index,
                                                            "receivedQuantity",
                                                            item.remainingQuantity
                                                        );

                                                        return;
                                                    }

                                                    updateItem(
                                                        index,
                                                        "receivedQuantity",
                                                        Math.max(value, 0)
                                                    );

                                                }}
                                            />

                                        </Box>

                                    </Table.Cell>


                                    {/* =================================================
                                        BUYING PRICE
                                    ================================================= */}

                                    <Table.Cell>

                                        <Input

                                            type="number"

                                            min={0}

                                            step="0.01"

                                            width="130px"

                                            placeholder="0.00"

                                            value={
                                                item.buyingPrice
                                            }

                                            onChange={(e) =>

                                                updateItem(

                                                    index,

                                                    "buyingPrice",

                                                    Number(
                                                        e.target.value
                                                    )

                                                )

                                            }

                                        />

                                    </Table.Cell>


                                    {/* =================================================
                                        SELLING PRICE
                                    ================================================= */}

                                    <Table.Cell>

                                        <Input

                                            type="number"

                                            min={0}

                                            step="0.01"

                                            width="130px"

                                            placeholder="0.00"

                                            value={
                                                item.sellingPrice
                                            }

                                            onChange={(e) =>

                                                updateItem(

                                                    index,

                                                    "sellingPrice",

                                                    Number(
                                                        e.target.value
                                                    )

                                                )

                                            }

                                        />

                                    </Table.Cell>


                                    {/* =================================================
                                        MANUFACTURING DATE
                                    ================================================= */}

                                    <Table.Cell>

                                        <Input

                                            type="date"

                                            width="160px"

                                            value={
                                                item.manufacturingDate
                                            }

                                            onChange={(e) =>

                                                updateItem(

                                                    index,

                                                    "manufacturingDate",

                                                    e.target.value

                                                )

                                            }

                                        />

                                    </Table.Cell>


                                    {/* =================================================
                                        EXPIRY DATE
                                    ================================================= */}

                                    <Table.Cell>

                                        <Input

                                            type="date"

                                            width="150px"

                                            value={
                                                item.expiryDate
                                            }

                                            onChange={(e) =>

                                                updateItem(

                                                    index,

                                                    "expiryDate",

                                                    e.target.value

                                                )

                                            }

                                        />

                                    </Table.Cell>


                                    {/* =================================================
                                        ACTION
                                    ================================================= */}

                                    <Table.Cell
                                        textAlign="center"
                                    >

                                        <Button

                                            size="sm"

                                            colorPalette="red"

                                            variant="outline"

                                            onClick={() =>
                                                removeItem(
                                                    index
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

        </Box>

    );

}