import { cn } from "@/lib/utils";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when the modal is closed */
  onClose: () => void;
  /** The title of the modal */
  title: string | React.ReactNode;
  /** The description of the modal */
  description?: string;
  /** Additional information to display in the header */
  additionalInfo?: React.ReactNode;

  header?: React.ReactNode;
  /** The main content of the modal */
  content: React.ReactNode;
  /** The footer content of the modal */
  footer?: React.ReactNode;
  /** The size of the modal */
  size?: ModalSize;
  /** Additional class names for the modal content */
  className?: string;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Whether to close the modal when clicking outside */
  closeOnOutsideClick?: boolean;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "sm:max-w-[425px]",
  md: "sm:max-w-[650px]",
  lg: "sm:max-w-[900px]",
  xl: "sm:max-w-[1200px]",
  full: "sm:max-w-[95vw]",
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title = "",
  description,
  additionalInfo,
  header,
  content,
  footer,
  size = "md",
  className,
  closeOnOutsideClick = true,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeOnOutsideClick ? onClose : undefined}
    >
      <DialogContent
        className={cn(
          sizeClasses[size],
          "max-h-[90vh] overflow-y-auto",
          className
        )}
      >
        <DialogHeader>
          {header ?? (
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {title}
                </DialogTitle>
                {description && (
                  <DialogDescription className="text-sm mt-1 text-muted-foreground">
                    {description}
                  </DialogDescription>
                )}
              </div>
              {additionalInfo}
            </div>
          )}
        </DialogHeader>

        <div className="w-full">{content}</div>

        {footer && (
          <DialogFooter className="flex justify-between items-center flex-wrap gap-2">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
