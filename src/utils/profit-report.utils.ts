
export const currency = (value: number) =>
    new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        maximumFractionDigits: 2,
    }).format(Number(value) || 0);

export const numberFormat = (value: number) =>
    new Intl.NumberFormat("en-US").format(
        Number(value) || 0
    );

export const dateFormat = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

export const formatDateInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};
