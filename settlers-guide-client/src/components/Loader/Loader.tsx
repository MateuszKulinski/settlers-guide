import React from "react";
import ReactLoading from "react-loading";
import { _LOADER_COLOR_, _LOADER_TYPE_ } from "../../assets/consts";

const Loader = () => (
    <div className="loaderContainer">
        <ReactLoading
            type={_LOADER_TYPE_}
            color={_LOADER_COLOR_}
            height={80}
            width={80}
        />
    </div>
);

export default Loader;
