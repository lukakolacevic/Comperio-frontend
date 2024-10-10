import React from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

function ConfirmSelectionDialog({
  visible,
  message,
  header,
  icon,
  acceptClassName,
  rejectClassName,
  onConfirm,
  onCancel,
  toastMessage,
}) {
  return (
    <>
      <ConfirmDialog
        visible={visible}
        message={message}
        header={header}
        icon={icon}
        acceptClassName={acceptClassName}
        rejectClassName={rejectClassName}
        accept={onConfirm}
        reject={onCancel}
      />
      {/* Optionally include Toast if you need to show messages */}
      {/* <Toast ref={toast} /> */}
    </>
  );
}

export default ConfirmSelectionDialog;
