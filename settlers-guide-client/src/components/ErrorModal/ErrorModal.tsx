import React, { FC } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ErrorModalProps {
    errorMessage: string;
}

const ErrorModal: FC<ErrorModalProps> = ({ errorMessage }) => {
    toast.error(errorMessage, {
        position: toast.POSITION.TOP_CENTER,
    });

    return <ToastContainer />;
};

export default ErrorModal;
