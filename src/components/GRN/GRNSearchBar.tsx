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

            align="center"

            mt={5}

            mb={5}

            gap={4}

            flexWrap="wrap"

        >

            <HStack gap={4}>

                <InputGroup

                    startElement={<LuSearch />}

                >

                    <Input

                        width="350px"

                        placeholder="Search Batch / Invoice / Supplier..."

                        value={search}

                        onChange={(e) =>

                            setSearch(e.target.value)

                        }

                    />

                </InputGroup>

                <NativeSelect.Root width="220px">

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