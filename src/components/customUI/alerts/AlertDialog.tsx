import React from 'react';
import {
  AlertDialog as AlertDialogPrimitive,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type AlertDialogVariant = 'default' | 'destructive' | 'warning';

export interface AlertDialogProps {
  /** Whether the alert dialog is open */
  isOpen: boolean;
  /** Callback when the alert dialog is closed */
  onClose: () => void;
  /** The title of the alert dialog */
  title: string;
  /** The description of the alert dialog */
  description: string;
  /** The variant of the alert dialog */
  variant?: AlertDialogVariant;
  /** The text for the confirm button */
  confirmText?: string;
  /** The text for the cancel button */
  cancelText?: string;
  /** Callback when the confirm button is clicked */
  onConfirm: () => void;
  /** Callback when the cancel button is clicked */
  onCancel?: () => void;
  /** Additional class names for the alert dialog content */
  className?: string;
  /** Whether to hide the cancel button */
  hideCancel?: boolean;
}

const variantButtonStyles: Record<AlertDialogVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  warning: 'bg-yellow-500 text-yellow-foreground hover:bg-yellow-500/90',
};

const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  variant = 'default',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  className,
  hideCancel = false,
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <AlertDialogPrimitive open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={cn("bg-background", className)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {!hideCancel && (
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={handleCancel}>{cancelText}</Button>
            </AlertDialogCancel>
          )}
          <AlertDialogAction asChild>
            <Button 
              className={cn(variantButtonStyles[variant])}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogPrimitive>
  );
};

// Example usage component
export const AlertDialogExample: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [variant, setVariant] = React.useState<AlertDialogVariant>('default');

  const handleConfirm = () => {
    console.log('Confirmed!');
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => {
            setVariant('default');
            setIsOpen(true);
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Show Default Alert
        </button>
        <button
          onClick={() => {
            setVariant('destructive');
            setIsOpen(true);
          }}
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md"
        >
          Show Destructive Alert
        </button>
        <button
          onClick={() => {
            setVariant('warning');
            setIsOpen(true);
          }}
          className="px-4 py-2 bg-yellow-500 text-yellow-foreground rounded-md"
        >
          Show Warning Alert
        </button>
      </div>

      <AlertDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Action Required`}
        description={
          variant === 'default'
            ? 'Are you sure you want to proceed with this action?'
            : variant === 'destructive'
            ? 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.'
            : 'Please review this action carefully before proceeding.'
        }
        variant={variant}
        confirmText={variant === 'default' ? 'Continue' : variant === 'destructive' ? 'Delete' : 'Proceed'}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default AlertDialog; 