import { cn } from "@/lib/utils";
import { LucideFileCheck, LucideFileText } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

interface MetricCardProps {
  documentTitle: string;
  link: string;
  className?: string;
}

const DocumentCard: React.FC<MetricCardProps> = ({
  documentTitle,
  link,
  className = "",
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 border rounded-md",
        className
      )}
    >
      <div className="flex items-center">
        <LucideFileText className="h-5 w-5 mr-2 text-primary" />
        {documentTitle}
      </div>
      <Button variant="ghost" className="h-9 px-3" size="sm">
        <LucideFileCheck className="h-4 w-4 mr-1" />
        {t("common:view")}
      </Button>
    </div>
  );
};

export default DocumentCard;
