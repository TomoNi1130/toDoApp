import { useId, type KeyboardEvent, type ReactNode, type RefObject } from "react";

type Props = {
  dialogRef: RefObject<HTMLDialogElement | null>;
  title: string;
  children: ReactNode;
};

export default function Dialog({ dialogRef, title, children }: Props) {
  const titleId = useId();

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Enter" || !event.ctrlKey || event.nativeEvent.isComposing || event.defaultPrevented) {
      return;
    }
    event.preventDefault();

    if (event.repeat) return;

    const form = event.currentTarget.querySelector("form");

    const submitButton = form?.querySelector<HTMLButtonElement>('button[type="submit"]');

    if (!form || !submitButton || submitButton.disabled) {
      return;
    }

    form.requestSubmit(submitButton);
  };

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId} className="dialog" onKeyDown={handleKeyDown}>
      <div className="dialog-heading">
        <h2 id={titleId}>{title}</h2>
      </div>
      {children}
    </dialog>
  );
}
