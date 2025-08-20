import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataImport } from "@/pages/DataImport";
import { Database } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface PolicyUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PolicyUploadModal: React.FC<PolicyUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] min-w-[800px] max-h-[95vh] overflow-y-auto overflow-x-hidden flex flex-col">
        <DialogHeader className="hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <DialogTitle className="text-2xl font-bold tracking-normal">
                {t("uploading:data_import_wizard")}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-base" style={{ marginTop: "0px" }}>
            {t("uploading:data_import_wizard_description")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-w-0">
          <DataImport />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyUploadModal;
