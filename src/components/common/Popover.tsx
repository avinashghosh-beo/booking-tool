import * as React from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useMergeRefs,
  Placement,
  FloatingPortal,
  FloatingFocusManager,
  useId,
  arrow,
  FloatingArrow,
} from "@floating-ui/react";

interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
  modal?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  showArrow?: boolean;
}

export function usePopover({
  initialOpen = false,
  placement = "bottom",
  modal,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  showArrow = true,
}: PopoverOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const arrowRef = React.useRef(null);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(12),
      flip({
        crossAxis: placement.includes("-"),
        fallbackAxisSideDirection: "end",
        padding: 5,
      }),
      shift({ padding: 5 }),
      arrow({ element: arrowRef }),
    ],
  });

  const { context } = data;
  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePress: (event) => {
      const target = event.target as Node;
      return (
        !context.refs.floating.current?.contains(target) &&
        !context.refs.reference.current?.contains(target)
      );
    },
    escapeKey: true,
    outsidePressEvent: "mousedown",
  });
  const role = useRole(context);
  const interactions = useInteractions([click, dismiss, role]);

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      modal,
      arrowRef,
      showArrow,
    }),
    [open, setOpen, interactions, data, modal, showArrow]
  );
}

const PopoverContext = React.createContext<ReturnType<
  typeof usePopover
> | null>(null);

export const usePopoverContext = () => {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("Popover components must be wrapped in <Popover />");
  }
  return context;
};

export function Popover({
  children,
  modal = false,
  ...options
}: {
  children: React.ReactNode;
} & PopoverOptions) {
  const popover = usePopover({ modal, ...options });
  return (
    <PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>
  );
}

interface PopoverTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  PopoverTriggerProps
>(function PopoverTrigger(
  { children, asChild = false, className = "", ...props },
  propRef
) {
  const context = usePopoverContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        className: `${className} ${children.props.className || ""}`,
        "data-state": context.open ? "open" : "closed",
      })
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      className={`inline-flex items-center justify-center ${className}`}
      data-state={context.open ? "open" : "closed"}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  showArrow?: boolean;
}

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(function PopoverContent(
  { className = "", style, showArrow, ...props },
  propRef
) {
  const {
    context: floatingContext,
    arrowRef,
    ...context
  } = usePopoverContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!floatingContext.open) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={floatingContext} modal={context.modal}>
        <div
          ref={ref}
          style={{ ...context.floatingStyles, ...style }}
          className={`z-50 min-w-[8rem] overflow-visible rounded-md border border-gray-200 bg-white p-1 shadow-md animate-in fade-in-0 zoom-in-95 ${className}`}
          {...context.getFloatingProps(props)}
          onClick={(e) => {
            e.stopPropagation();
            props.onClick?.(e);
          }}
        >
          {props.children}
          {showArrow && (
            <FloatingArrow
              ref={arrowRef}
              context={floatingContext}
              className="fill-white stroke-gray-200"
              tipRadius={1}
              height={8}
              width={12}
            />
          )}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
});

export const PopoverClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(function PopoverClose({ className = "", ...props }, ref) {
  const { setOpen } = usePopoverContext();
  return (
    <button
      ref={ref}
      type="button"
      className={`absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none ${className}`}
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        setOpen(false);
      }}
    />
  );
});
