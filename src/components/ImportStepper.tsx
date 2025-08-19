import { Check } from 'lucide-react';
import { ImportStep } from '@/types/import';
import { cn } from '@/lib/utils';

interface ImportStepperProps {
  steps: ImportStep[];
}

export const ImportStepper: React.FC<ImportStepperProps> = ({ steps }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                  step.completed
                    ? "bg-gradient-success border-success text-success-foreground shadow-medium"
                    : step.current
                    ? "bg-gradient-primary border-primary text-primary-foreground shadow-medium"
                    : "border-border bg-background text-muted-foreground"
                )}
              >
                {step.completed ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{step.id}</span>
                )}
              </div>
              <div className="mt-2 text-center max-w-20">
                <p
                  className={cn(
                    "text-xs font-medium",
                    step.completed || step.current
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 w-12 transition-all duration-300 sm:w-16 md:w-20",
                  step.completed
                    ? "bg-gradient-to-r from-success to-success"
                    : "bg-border"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};