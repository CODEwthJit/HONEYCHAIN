import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-amber-600 text-white hover:bg-amber-700 active:bg-amber-800 shadow-amber-200/50",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-red-200/50",
        outline:
          "border border-stone-200 bg-white hover:bg-stone-50 hover:text-stone-900 text-stone-700",
        secondary:
          "bg-amber-100 text-amber-900 hover:bg-amber-200",
        ghost: "hover:bg-stone-100 hover:text-stone-900 shadow-none",
        link: "text-amber-600 underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

