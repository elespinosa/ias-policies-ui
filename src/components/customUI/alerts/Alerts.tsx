import AlertDialog from "./AlertDialog";


export const ErrorMessage = ({ message }: { message: string }) => {

  let open = true;

  return (
    <AlertDialog
      isOpen={open}
      onClose={() => {open = false}}
      title="Error"
      description={message}
      variant="destructive"
      onConfirm={() => {open = false}}
      hideCancel={true}
    />
  );
};
  
export const WarningMessage = ({ message }: { message: string }) => {

  let open = true;

 return (
   <AlertDialog
     isOpen={open}
     onClose={() => {open = false}}
     title="Warning"
     description={message}
     variant="warning"
     onConfirm={() => {open = false}}
     hideCancel={true}
   />
 );
};


export const InformationMessage = ({ message }: { message: string }) => {

  let open = true;

 return (
   <AlertDialog
     isOpen={open}
     onClose={() => {open = false}}
     title="Information"
     description={message}
     variant="default"
     onConfirm={() => {open = false}}
     hideCancel={true}
   />
 );
};

export const ConfirmMessage = ({ message, confirmAction, cancelAction }: { message: string, confirmAction: () => void, cancelAction: () => void }) => {

  let open = true;

  return (
    <AlertDialog
      isOpen={open}
      onClose={() => {open = false}}
      title="Confirm"
      description={message}
      variant="default"
      onConfirm={confirmAction}
      onCancel={cancelAction}
    />
  );
};


 
 