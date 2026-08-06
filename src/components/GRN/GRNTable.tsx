import type { StockBatch } from "@/types/stockBatch";
import {
    Badge,
    Button,
    HStack,
} from "@chakra-ui/react";

import { Table } from "@chakra-ui/react/table";


type Props = {

    stockBatches: StockBatch[];

    onView: (batch: StockBatch) => void;

};

export default function GRNTable({

    stockBatches,

    onView,

}: Props) {

    return (

        <Table.Root
            variant="outline"
            colorPalette="blue"
            mt={5}
        >

            <Table.Header>

                <Table.Row>

                    <Table.ColumnHeader>

                        Batch Number

                    </Table.ColumnHeader>

                    <Table.ColumnHeader>

                        Invoice

                    </Table.ColumnHeader>

                    <Table.ColumnHeader>

                        Purchase Order

                    </Table.ColumnHeader>

                    <Table.ColumnHeader>

                        Supplier

                    </Table.ColumnHeader>

                    <Table.ColumnHeader>

                        Received Date

                    </Table.ColumnHeader>

                    <Table.ColumnHeader>

                        Items

                    </Table.ColumnHeader>

                    <Table.ColumnHeader>

                        Payment

                    </Table.ColumnHeader>

                    <Table.ColumnHeader>

                        Actions

                    </Table.ColumnHeader>

                </Table.Row>

            </Table.Header>

            <Table.Body>

                {

                    stockBatches.map((batch) => (

                        <Table.Row
                            key={batch.id}
                        >

                            <Table.Cell>

                                {batch.batchNumber}

                            </Table.Cell>

                            <Table.Cell>

                                {batch.invoiceNumber}

                            </Table.Cell>

                            <Table.Cell>

                                {

                                    batch.purchaseOrder
                                    ?.orderNumber

                                    ??

                                    "-"

                                }

                            </Table.Cell>

                            <Table.Cell>

                                {

                                    batch.supplier.firstName

                                }

                                {" "}

                                {

                                    batch.supplier.lastName

                                }

                            </Table.Cell>

                            <Table.Cell>

                                {

                                    new Date(

                                        batch.receivedDate

                                    ).toLocaleDateString()

                                }

                            </Table.Cell>

                            <Table.Cell>

                                {

                                    batch.items.length

                                }

                            </Table.Cell>

                            <Table.Cell>

                                <Badge

                                    colorPalette={

                                        batch.paymentStatus ===
                                        "PAID"

                                        ?

                                        "green"

                                        :

                                        "orange"

                                    }

                                >

                                    {

                                        batch.paymentStatus

                                    }

                                </Badge>

                            </Table.Cell>

                            <Table.Cell>

                                <HStack>

                                    <Button

                                        size="sm"

                                        colorPalette="blue"

                                        onClick={() =>

                                            onView(batch)

                                        }

                                    >

                                        View

                                    </Button>

                                </HStack>

                            </Table.Cell>

                        </Table.Row>

                    ))

                }

            </Table.Body>

        </Table.Root>

    );

}