import {
    Input,
    Table,
} from "@chakra-ui/react";

export type GRNItem = {

    purchaseOrderItemId?: number;

    productId: number;

    productName: string;

    orderedQuantity: number;

    alreadyReceived: number;

    remainingQuantity: number;

    receivedQuantity: number;

    buyingPrice: number;

    sellingPrice: number;

    expiryDate: string;

    manufacturingDate?: string;

};

type Props = {

    items: GRNItem[];

    setItems: React.Dispatch<
        React.SetStateAction<GRNItem[]>
    >;

};

export default function GRNItemsTable({

    items,

    setItems,

}: Props) {

    function updateItem(

        index: number,

        field: keyof GRNItem,

        value: any

    ) {

        const updatedItems = [...items];

        updatedItems[index] = {

            ...updatedItems[index],

            [field]: value,

        };

        setItems(updatedItems);

    }

    return (

        <Table.Root
            variant="outline"
            colorPalette="blue"
        >

            <Table.Header>

                <Table.Row>

                    <Table.ColumnHeader>

                        Product

                    </Table.ColumnHeader>

                    <Table.ColumnHeader>

                        Ordered

                    </Table.ColumnHeader>

                    <Table.ColumnHeader>

                        Received

                    </Table.ColumnHeader>

                    <Table.ColumnHeader>

                        Remaining

                    </Table.ColumnHeader>

                    <Table.ColumnHeader>

                        Receive Now

                    </Table.ColumnHeader>

                    <Table.ColumnHeader>

                        Buying

                    </Table.ColumnHeader>

                    <Table.ColumnHeader>

                        Selling

                    </Table.ColumnHeader>

                    <Table.ColumnHeader>

                        Expiry

                    </Table.ColumnHeader>

                    <Table.ColumnHeader>

                        Manufacturing

                    </Table.ColumnHeader>

                </Table.Row>

            </Table.Header>

            <Table.Body>

                {

                    items.map((item, index) => (

                        <Table.Row key={index}>

                            <Table.Cell>

                                {item.productName}

                            </Table.Cell>

                            <Table.Cell>

                                {item.orderedQuantity}

                            </Table.Cell>

                            <Table.Cell>

                                {item.alreadyReceived}

                            </Table.Cell>

                            <Table.Cell>

                                {item.remainingQuantity}

                            </Table.Cell>

                            <Table.Cell>

                                <Input

                                    type="number"

                                    value={item.receivedQuantity}

                                    onChange={(e) =>

                                        updateItem(

                                            index,

                                            "receivedQuantity",

                                            Number(e.target.value)

                                        )

                                    }

                                    min={0}

                                    max={item.remainingQuantity}

                                />

                            </Table.Cell>

                            <Table.Cell>

                                <Input

                                    type="number"

                                    value={item.buyingPrice}

                                    onChange={(e) =>

                                        updateItem(

                                            index,

                                            "buyingPrice",

                                            Number(e.target.value)

                                        )

                                    }

                                />

                            </Table.Cell>

                            <Table.Cell>

                                <Input

                                    type="number"

                                    value={item.sellingPrice}

                                    onChange={(e) =>

                                        updateItem(

                                            index,

                                            "sellingPrice",

                                            Number(e.target.value)

                                        )

                                    }

                                />

                            </Table.Cell>

                            <Table.Cell>

                                <Input

                                    type="date"

                                    value={item.expiryDate}

                                    onChange={(e) =>

                                        updateItem(

                                            index,

                                            "expiryDate",

                                            e.target.value

                                        )

                                    }

                                />

                            </Table.Cell>

                            <Table.Cell>

                                <Input

                                    type="date"

                                    value={item.manufacturingDate ?? ""}

                                    onChange={(e) =>

                                        updateItem(

                                            index,

                                            "manufacturingDate",

                                            e.target.value

                                        )

                                    }

                                />

                            </Table.Cell>

                        </Table.Row>

                    ))

                }

            </Table.Body>

        </Table.Root>

    );

}