import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import GRNSearchBar from "@/components/GRN/GRNSearchBar";
import GRNTable from "@/components/GRN/GRNTable";
import GRNViewDialog from "@/components/GRN/GRNViewDialog";
import GRNStatsCards from "@/components/GRN/GRNStatsCards";
import type { StockBatch } from "@/types/stockBatch";
import toast from "react-hot-toast";
import GRNPDF from "@/pdf/templates/GRNPDF";
import api from "@/api/axios";
import DocumentPreviewDialog from "@/components/Documents/DocumentPreviewDialog";



export default function GRNManagement() {

  const [stockBatches, setStockBatches] = useState<StockBatch[]>([]);
  const [search, setSearch] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedBatchNumber, setSelectedBatchNumber] = useState<string>();
  const [paymentStatus, setPaymentStatus] = useState("");
  const navigate = useNavigate();
  const [printBatch, setPrintBatch] = useState<any | null>(null);
  const [grnPreviewOpen, setGrnPreviewOpen] = useState(false);


  function getAllStockBatches() {

    api.get("/stock-batch/"

    ).then((response) => {

      console.log(response.data);
      setStockBatches(
        response.data.data
      );

    });

  }

  async function handlePrint(batch: StockBatch) {
    try {
      const response = await api.get(
        `/stock-batch/${batch.batchNumber}`
      );

      const fullBatch = response.data.data;

      if (!fullBatch) {
        toast.error("GRN details not found.");
        return;
      }

      setPrintBatch(fullBatch);
      setGrnPreviewOpen(true);
    } catch (error) {
      console.error("Failed to load GRN details:", error);
      toast.error("Failed to load GRN details.");
    }
  }


  useEffect(() => {

    getAllStockBatches();

  }, []);


  const filteredStockBatches =

    stockBatches.filter((batch) => {

      const keyword =
        search.toLowerCase();

      const matchesSearch =

        batch.batchNumber
          .toLowerCase()
          .includes(keyword)

        ||

        batch.invoiceNumber
          .toLowerCase()
          .includes(keyword)

        ||

        batch.supplier.firstName
          .toLowerCase()
          .includes(keyword)

        ||

        batch.supplier.lastName
          .toLowerCase()
          .includes(keyword);

      const matchesStatus =

        paymentStatus === ""

        ||

        batch.paymentStatus ===

        paymentStatus;

      return (

        matchesSearch &&

        matchesStatus

      );

    });

  return (

    <>

      <Box
        bg="blue.500"
        color="white"
        p={4}
        rounded="md"
        fontWeight="bold"
        textAlign="center"
      >

        Goods Received Notes

      </Box>

      <GRNStatsCards
        stockBatches={stockBatches}
      />

      <GRNSearchBar

        search={search}

        setSearch={setSearch}

        paymentStatus={paymentStatus}

        setPaymentStatus={setPaymentStatus}

      />

      <GRNTable
        stockBatches={filteredStockBatches}
        onView={(batch) => {
          setSelectedBatchNumber(batch.batchNumber);
          setViewDialogOpen(true);
        }}
        onEdit={(batch) => {
          navigate(
            `/admin/grn/edit/${batch.batchNumber}`
          );
        }}
        onPrint={handlePrint}
      />

      <GRNViewDialog

        open={viewDialogOpen}

        batchNumber={selectedBatchNumber}

        onClose={() => {

          setViewDialogOpen(false);

          setSelectedBatchNumber(undefined);

        }}

      />
      {printBatch && (
        <DocumentPreviewDialog
          open={grnPreviewOpen}
          onClose={() => {
            setGrnPreviewOpen(false);
            setPrintBatch(null);
          }}
          title="GRN Preview"
          fileName={`${printBatch.batchNumber}.pdf`}
          renderDocument={(settings) => (
            <GRNPDF
              stockBatch={printBatch}
              settings={settings}
            />
          )}
        />
      )}

    </>

  );

}