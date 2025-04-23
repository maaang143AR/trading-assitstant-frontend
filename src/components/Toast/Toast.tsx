import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";


const ReactToast = ({
  toastMessage,
}: {
  toastMessage: string;
}) => {
  useEffect(() => {
    toast.error(toastMessage, {
      style: {
        background: "red",
        color: "white",
        fontSize: "16px",
        fontWeight: 400,
      }
    }
  );
  }, [toastMessage]);

  return (
    <div>
      <Toaster
      
      />
    </div>
  );
};

export default ReactToast;