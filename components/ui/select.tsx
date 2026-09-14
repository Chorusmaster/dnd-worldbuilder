"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectContextValue = {
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SelectContext =
  createContext<SelectContextValue | null>(null);

function useSelect() {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error(
      "Select components must be used inside Select",
    );
  }

  return context;
}

type SelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  disabled?: boolean;
};

function Select({
  value,
  onValueChange,
  children,
  disabled = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: (newValue) => {
          onValueChange(newValue);
          setOpen(false);
        },
        open: disabled ? false : open,
        setOpen,
      }}
    >
      <div ref={ref} className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

type SelectTriggerProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

function SelectTrigger({
  children,
  className,
  disabled,
}: SelectTriggerProps) {
  const { open, setOpen } = useSelect();

  return (
    <button
      type="button"
      disabled={disabled}
      aria-expanded={open}
      className={cn(
        "flex h-8 w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "dark:bg-input/30 dark:hover:bg-input/50",
        className,
      )}
      onClick={() => setOpen(!open)}
    >
      {children}

      <ChevronDownIcon
        className={cn(
          "size-4 shrink-0 text-muted-foreground transition-transform",
          open && "rotate-180",
        )}
      />
    </button>
  );
}

type SelectValueProps = {
  placeholder?: string;
  className?: string;
  children?: ReactNode;
};

function SelectValue({
  placeholder = "Select...",
  className,
  children,
}: SelectValueProps) {
  return (
    <span
      className={cn(
        "flex flex-1 truncate text-left",
        !children && "text-muted-foreground",
        className,
      )}
    >
      {children || placeholder}
    </span>
  );
}

function SelectContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open } = useSelect();

  if (!open) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute top-full left-0 z-50 mt-1 max-h-65 w-full min-w-36 overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10",
        className,
      )}
    >
      {children}
    </div>
  );
}

type SelectItemProps = {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

function SelectItem({
  value,
  children,
  className,
  disabled = false,
}: SelectItemProps) {
  const {
    value: selectedValue,
    onValueChange,
  } = useSelect();

  const selected = selectedValue === value;

  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      onClick={() => onValueChange(value)}
    >
      <span className="flex flex-1 gap-2 whitespace-nowrap">
        {children}
      </span>

      {selected && (
        <span className="absolute right-2 flex size-4 items-center justify-center">
          <CheckIcon className="size-4" />
        </span>
      )}
    </button>
  );
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
};