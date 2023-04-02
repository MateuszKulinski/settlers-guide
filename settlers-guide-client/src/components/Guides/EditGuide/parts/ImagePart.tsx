import { gql, useMutation } from "@apollo/client";
import React, { useState, FC } from "react";
import { Button } from "react-bootstrap";
import Dropzone, { DropzoneProps } from "react-dropzone";
import { _API_VERSION_, _SERVER_URL_ } from "../../../../assets/consts";
import axios from "axios";
import Image from "../../../../model/Image";

interface ImagePartProps {
    itemId: string;
    type: number;
    image: Image | undefined;
    onUpdatePhoto: () => void;
}

const JoinItemImage = gql`
    mutation JoinItemImage($type: Int!, $itemId: String!, $imgId: String!) {
        joinItemImage(type: $type, itemId: $itemId, imgId: $imgId)
    }
`;

const RemoveImage = gql`
    mutation RemoveImage($type: Int!, $itemId: String!, $imgId: String!) {
        removeImage(type: $type, itemId: $itemId, imgId: $imgId)
    }
`;

const ImagePart: FC<ImagePartProps> = ({
    itemId,
    type,
    image,
    onUpdatePhoto,
}) => {
    const [file, setFile] = useState<File>();
    const [message, setMessage] = useState<string>("");
    const [text, setText] = useState<string>("Przeciągnij lub wybierz zdjęcie");
    const [execJoinItemImage] = useMutation(JoinItemImage);
    const [execRemoveImage] = useMutation(RemoveImage);
    const [show, setShow] = useState<boolean>(false);

    const accept: DropzoneProps["accept"] = {
        "image/jpeg": [".jpeg"],
        "image/jpg": [".jpg"],
        "image/png": [".png"],
    };

    const handleDrop = (acceptedFiles: any) => {
        setFile(acceptedFiles[0]);

        if (acceptedFiles.length > 0) {
            const newText = acceptedFiles.map((file: any) => file.name);
            setText(newText.join(","));
        } else {
            setText("Przeciągnij lub wybierz zdjęcie");
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                `${_SERVER_URL_}/api/${_API_VERSION_}/upload-file/${type}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.data.data === "err")
                setMessage("Zapis zdjęcia nie powiódł się");
            else joinItemImage(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const removeImage = async () => {
        if (image && image.id)
            await execRemoveImage({
                variables: {
                    type,
                    itemId,
                    imgId: image.id,
                },
            });
        onUpdatePhoto();
    };

    const joinItemImage = async (imgId: string) => {
        const { data: joinItemImage } = await execJoinItemImage({
            variables: {
                type,
                itemId,
                imgId,
            },
        });

        if (
            joinItemImage.joinItemImage &&
            joinItemImage.joinItemImage === true
        ) {
            onUpdatePhoto();
        } else {
            await execRemoveImage({
                variables: {
                    type,
                    itemId,
                    imgId,
                },
            });
            setMessage("Zapis zdjęcia nie powiódł się");
        }
    };

    return (
        <div id="showHideContainer">
            <div className="showHideTitle">
                <div className="edit-label">Edytuj zdjęcie</div>
                <Button
                    variant="outline-light"
                    className="toggle-button"
                    onClick={() => {
                        setShow(!show);
                    }}
                >
                    {show ? "Ukryj" : "Pokaż"}
                </Button>
            </div>
            <div
                className={`dropZoneContainer hideContainer ${
                    show ? "show" : "hide"
                }`}
            >
                <div>{message}</div>
                <Dropzone maxFiles={1} onDrop={handleDrop} accept={accept}>
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>{text}</p>
                        </div>
                    )}
                </Dropzone>
                <Button variant="success" onClick={handleSubmit}>
                    {image?.id ? "Nadpisz zdjęcie" : "Dodaj zdjęcie"}
                </Button>
                <div className="imageContainer">
                    <img
                        src={`${_SERVER_URL_}/api/${_API_VERSION_}/img/${
                            type === 0 ? "Guide" : "GuideAttack"
                        }/${image?.id}`}
                        alt={`Zdjęcie przygody ${itemId}`}
                    />
                </div>
                {image?.id ? (
                    <Button variant="danger" onClick={removeImage}>
                        Usuń zdjęcie
                    </Button>
                ) : null}
            </div>
        </div>
    );
};

export default ImagePart;
