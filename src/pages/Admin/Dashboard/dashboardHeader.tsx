import {
    Avatar,
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Input,
    InputGroup,
    Text,
    VStack,
} from "@chakra-ui/react";

import {
    MdAdd,
    MdNotificationsNone,
} from "react-icons/md";

import { LuSearch } from "react-icons/lu";

import { useEffect, useState } from "react";

export default function DashboardHeader() {

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {

        const interval = setInterval(() => {

            setCurrentTime(new Date());

        }, 1000);

        return () => clearInterval(interval);

    }, []);


    const date = currentTime.toLocaleDateString(
        "en-GB",
        {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );

    const time = currentTime.toLocaleTimeString(
        "en-GB",
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }
    );

    return (

        <Flex

            justify="space-between"

            align="center"

            gap="6"

            flexWrap="wrap"

        >

            {/* LEFT SIDE */}

            <HStack

                flex="1"

                minW="320px"

            >

                <InputGroup startElement={<LuSearch />}>

                    <Input

                        placeholder="Search products by name, barcode or Product ID..."

                        bg="white"

                        border="1px solid"

                        borderColor="gray.200"

                        _focus={{

                            borderColor: "teal.500",

                            boxShadow: "0 0 0 1px teal"

                        }}

                    />

                </InputGroup>

            </HStack>



            {/* RIGHT SIDE */}

            <HStack gap="4">

                <Button

                    colorPalette="teal"

                >

                    <MdAdd />

                    Create Bill

                </Button>


                <Box

                    bg="white"

                    px="4"

                    py="2"

                    rounded="lg"

                    border="1px solid"

                    borderColor="gray.200"

                >

                    <Text

                        fontSize="xs"

                        color="gray.500"

                    >

                        {date}

                    </Text>

                    <Text

                        fontWeight="bold"

                    >

                        {time}

                    </Text>

                </Box>


                <IconButton

                    aria-label="Notifications"

                    variant="outline"

                >

                    <MdNotificationsNone />

                </IconButton>


                <HStack

                    bg="white"

                    p="2"

                    rounded="xl"

                    border="1px solid"

                    borderColor="gray.200"

                >

                    <Avatar.Root>

                        <Avatar.Fallback>

                            HA

                        </Avatar.Fallback>

                    </Avatar.Root>

                    <VStack

                        align="start"

                        gap="0"

                    >

                        <Text

                            fontWeight="bold"

                            fontSize="sm"

                        >

                            Hamitha Apsara

                        </Text>

                        <Text

                            fontSize="xs"

                            color="gray.500"

                        >

                            Administrator

                        </Text>

                    </VStack>

                </HStack>

            </HStack>

        </Flex>

    );

}