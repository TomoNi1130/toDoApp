import { useId, type ReactNode, type RefObject } from "react";

type Props = {
  dialogRef: RefObject<HTMLDialogElement | null>;
  title: string;
  children: ReactNode;
};

export default function Dialog({ dialogRef, title, children }: Props) {
  const titleId = useId();
  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} className="dialog">
      <div className="dialog-heading">
        <h2 id={titleId}>{title}</h2>
      </div>
      {children}
    </dialog>
  );
}
