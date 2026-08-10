
import { useParams } from "react-router-dom";
import GRNForm from "./GRNForm";

export default function EditGRN() {

    const { batchNumber } = useParams<{
        batchNumber: string;
    }>();

    return (

        <GRNForm
            mode="edit"
            batchNumber={batchNumber}
        />

    );

}