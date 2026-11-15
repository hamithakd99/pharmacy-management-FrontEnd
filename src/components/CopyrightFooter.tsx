
import { Flex, Text } from "@chakra-ui/react";

const COLORS = {
    navy: "#073B4C",
    muted: "#64748B",
};

export default function CopyrightFooter() {
    return (
        <Flex
            flexShrink={0}
            minH="42px"
            px={{ base: "3", sm: "4", lg: "6" }}
            py="2"
            bg="white"
            borderTop="1px solid"
            borderColor="gray.200"
            align="center"
            justify="center"
        >
            <Text
                fontSize="xs"
                color={COLORS.muted}
                textAlign="center"
                lineHeight="1.8"
            >
                © {new Date().getFullYear()} Pharmacy Management.
                {" "}All rights reserved.
                {" "}
                <Text
                    as="span"
                    color={COLORS.navy}
                    fontWeight="semibold"
                >
                    Developed by Hamitha Apsara
                </Text>
            </Text>
        </Flex>
    );
}
