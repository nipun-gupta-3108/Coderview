import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

/**
 * ResizableSplit — per docs/DESIGN_SYSTEM.md §13. Thin wrapper around
 * react-resizable-panels that bakes in the gradient handle styling
 * currently copy-pasted in ProblemPage.jsx / SessionPage.jsx (3x today).
 * Exposes Panel passthrough + a pre-styled ResizableHandle so page-level
 * code composes exactly as it does today, just without repeating the
 * handle className each time.
 *
 * Keyboard resize relies on react-resizable-panels' built-in handle
 * keyboard support (arrow keys resize a focused handle) — this wrapper
 * only adds the visible focus-visible ring required by
 * docs/DESIGN_SYSTEM.md §22.5, it doesn't reimplement resize logic.
 */
const GRADIENTS = {
  horizontal:
    "bg-[linear-gradient(180deg,rgba(20,83,45,0.16),rgba(14,165,233,0.5),rgba(245,158,11,0.18))]",
  vertical:
    "bg-[linear-gradient(90deg,rgba(20,83,45,0.16),rgba(14,165,233,0.5),rgba(245,158,11,0.18))]",
};

function ResizableSplit({
  direction = "horizontal",
  className = "",
  children,
  ...rest
}) {
  return (
    <PanelGroup direction={direction} className={className} {...rest}>
      {children}
    </PanelGroup>
  );
}

function ResizableHandle({ direction = "horizontal", className = "" }) {
  const isHorizontal = direction === "horizontal";
  const sizingClass = isHorizontal
    ? "mx-2 w-1 cursor-col-resize data-[resize-handle-state=hover]:w-1.5 data-[resize-handle-state=drag]:w-1.5"
    : "my-2 h-1 cursor-row-resize data-[resize-handle-state=hover]:h-1.5 data-[resize-handle-state=drag]:h-1.5";

  return (
    <PanelResizeHandle
      className={`${sizingClass} ${GRADIENTS[direction]} rounded-full transition-all duration-150 ease-out motion-reduce:transition-none data-[resize-handle-state=hover]:opacity-90 data-[resize-handle-state=drag]:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${className}`.trim()}
    />
  );
}

ResizableSplit.Panel = Panel;
ResizableSplit.Handle = ResizableHandle;

export default ResizableSplit;
export { Panel, ResizableHandle };
