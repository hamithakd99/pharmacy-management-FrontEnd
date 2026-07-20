import {
    Box,
    Button,
    Grid,
    Heading,
    Icon,
    Text,
    VStack,
} from "@chakra-ui/react";

import {
    MdAddShoppingCart,
    MdInventory,
    MdLocalShipping,
    MdPeople,
    MdReceiptLong,
    MdCategory,
} from "react-icons/md";

const actions = [

    {
        title: "Create Bill",
        icon: MdAddShoppingCart,
    },

    {
        title: "Add Product",
        icon: MdInventory,
    },

    {
        title: "Suppliers",
        icon: MdLocalShipping,
    },

    {
        title: "Customers",
        icon: MdPeople,
    },

    {
        title: "Bills",
        icon: MdReceiptLong,
    },

    {
        title: "Categories",
        icon: MdCategory,
    },

];

export default function QuickActions() {

    return (

        <Box

            bg="white"

            p="6"

            rounded="xl"

            border="1px solid"

            borderColor="gray.200"

            boxShadow="sm"

        >

            <Heading

                size="md"

                mb="5"

            >

                Quick Actions

            </Heading>


            <Grid

                templateColumns={{

                    base: "repeat(2,1fr)",

                    md: "repeat(3,1fr)",

                    lg: "repeat(6,1fr)",

                }}

                gap="4"

            >

                {

                    actions.map((action) => (

                        <Button

                            key={action.title}

                            h="100px"

                            variant="outline"

                            _hover={{

                                bg: "teal.50",

                                borderColor: "teal.500",

                            }}

                        >

                            <VStack>

                                <Icon

                                    as={action.icon}

                                    boxSize={7}

                                />

                                <Text

                                    fontSize="sm"

                                >

                                    {action.title}

                                </Text>

                            </VStack>

                        </Button>

                    ))

                }

            </Grid>

        </Box>

    );

}