import path from "path";
import fs from "fs";
import { Image } from "../models/Image";
import { Guide } from "../models/Guide";
import { GuideAttack } from "../models/GuideAttack";
import { Not } from "typeorm";

export const createPath = (imageId: string, pathFolder: string) => {
    const pathArray = imageId.split("").map(String);
    pathArray.unshift(pathFolder);
    const dirPath = path.join(__dirname, "../img", ...pathArray);
    return dirPath;
};

export const addGuideImage = async (
    type: number,
    file: any
): Promise<{ data: string; name: string }> => {
    const pathFolder = type === 0 ? "Guide" : "Attack";

    let image: Image | null;
    image = await Image.create({ fileName: file.originalname }).save();

    const dirPath = createPath(image.id, pathFolder);

    const newFilePath = path.join(dirPath, file.originalname);

    try {
        await fs.promises.mkdir(dirPath, { recursive: true });
        await fs.promises.writeFile(newFilePath, file.buffer);
        return { data: image.id, name: file.originalname };
    } catch (err) {
        console.error(err);
        return { data: "err", name: file.originalname };
    }
};

export const removeImage = async (
    type: number,
    itemId: string,
    imgId: string,
    userId: string
): Promise<boolean> => {
    const image = await Image.findOne({
        where: {
            id: imgId,
        },
    });

    return removeFile(type, image);
};

export const joinItemImage = async (
    type: number,
    itemId: string,
    imgId: string,
    userId: string
): Promise<boolean> => {
    const image = await Image.findOne({
        where: {
            id: imgId,
        },
    });

    if (!image) return false;

    let queryBuilder;

    if (type == 0) {
        queryBuilder = Guide.createQueryBuilder("guide")
            .leftJoin("guide.user", "user")
            .where("guide.id = :guideId", { guideId: itemId })
            .andWhere("user.id = :userId", { userId });
    } else {
        queryBuilder = GuideAttack.createQueryBuilder("guideAttack")
            .leftJoin("guideAttack.guide", "guide")
            .leftJoin("guide.user", "user")
            .where("guideAttack.id = :guideAttackId", { guideAttackId: itemId })
            .andWhere("user.id = :userId", { userId });
    }
    const item = await queryBuilder.getOne();
    if (!item) return false;

    const oldImage = await checkImages(item, image);
    if (oldImage) {
        await removeFile(type, oldImage);
    }

    if (!(item instanceof Guide) && !(item instanceof GuideAttack))
        return false;

    if (item instanceof Guide) {
        image.guide = item;
    } else {
        image.guideAttack = item;
    }

    await image.save();
    return true;
};

const checkImages = async (
    item: Guide | GuideAttack,
    image: Image
): Promise<Image | null> => {
    let oldImage: Image | null = null;
    if (item instanceof Guide) {
        oldImage = await Image.findOne({
            where: {
                id: Not(image.id),
                guide: {
                    id: item.id,
                },
            },
        });
    } else {
        oldImage = await Image.findOne({
            where: {
                id: Not(image.id),
                guideAttack: {
                    id: item.id,
                },
            },
        });
    }
    if (!oldImage) return null;
    return oldImage;
};

const removeFile = async (type: number, image: Image | null) => {
    if (!image) return false;
    const pathFolder = type === 0 ? "Guide" : "Attack";

    const dirPath = createPath(image.id, pathFolder);
    const newFilePath = path.join(dirPath, image.fileName);
    try {
        image.remove();
        fs.unlink(newFilePath, (error) => {
            if (error) {
                throw error;
            }
            return true;
        });
    } catch (error) {
        console.log(error);
        throw error;
    }
    return false;
};

export const createImagePath = async (
    type: string,
    id: string,
    dirname: string = __dirname
) => {
    if ((type === "Guide" || type === "GuideAttack") && !isNaN(Number(id))) {
        const imagePath = createPath(id, type);
        const image = await Image.findOne({
            where: {
                id: id,
            },
        });
        if (image?.fileName) return path.join(imagePath, image?.fileName);
    }
    const imagePath = path.join(dirname, "/img/", `${type}`, `${id}.png`);
    return imagePath;
};
