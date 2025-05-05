import { useState, forwardRef, useImperativeHandle } from "react";

const Toast = forwardRef((props, ref) => {
  const [toastMessage, setToastMessage] = useState("");

  useImperativeHandle(ref, () => ({
    showToast: (message) => {
      setToastMessage(message);
      setTimeout(() => setToastMessage(""), 3000);
    }
  }));

  return (
    <>
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow">
          {toastMessage}
        </div>
      )}
    </>
  );
});

export default Toast;


