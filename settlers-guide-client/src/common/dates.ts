import { format } from "date-fns";
import { pl } from "date-fns/locale";

const formatDate = (date: any): string => {
    if (!date) return "";
    const formattedDate = format(new Date(date), "d MMMM yyyy", { locale: pl });
    return formattedDate;
};

export { formatDate };
