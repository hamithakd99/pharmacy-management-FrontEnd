import {
    HStack,
    Input,
    InputGroup,
    NativeSelect,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

type Props = {

    search: string;

    setSearch: (value: string) => void;

    paymentStatus: string;

    setPaymentStatus: (value: string) => void;

};

export default function GRNSearchBar({

    search,

    setSearch,

    paymentStatus,

    setPaymentStatus,

}: Props) {


    return (

        <HStack
            justify="space-between"
            align={{ base: "stretch", sm: "center" }}
            mt={{ base: 4, md: 5 }}
            mb={{ base: 4, md: 5 }}
            gap={{ base: 2, sm: 4 }}
            flexWrap="wrap"
        >

            <HStack
                gap={{ base: 2, sm: 4 }}
                width="100%"
                flexDirection={{ base: "column", sm: "row" }}
            >

                <InputGroup

                    startElement={<LuSearch />}

                >

                    <Input

                        width={{ base: "100%", sm: "350px" }}

                        placeholder="Search Batch / Invoice / Supplier..."

                        size={{ base: "sm", sm: "md" }}
                        value={search}

                        onChange={(e) =>

                            setSearch(e.target.value)

                        }

                    />

                </InputGroup>

                <NativeSelect.Root width={{ base: "100%", sm: "220px" }}>

                    <NativeSelect.Field
                        value={paymentStatus}
                        onChange={(e) =>
                            setPaymentStatus(e.target.value)
                        }
                    >

                        <option value="">
                            All Payment Status
                        </option>

                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="PAID">
                            Paid
                        </option>

                    </NativeSelect.Field>

                    <NativeSelect.Indicator />

                </NativeSelect.Root>

            </HStack>

        </HStack>

    );

}