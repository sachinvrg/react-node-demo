const parseDate = (formatter) => {
    return (date) => {
        if (date instanceof Date) {
            return formatter(date);
        }
        return formatter(Date.parse(date));
    }
}

export const numberFormat = Intl.NumberFormat("en-IN").format;

export const currencyFormat = Intl.NumberFormat("en-IN", { style: 'currency', currency: 'INR' }).format;

export const dateTimeFormat = parseDate(Intl.DateTimeFormat("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour12: true, hour: 'numeric', minute: 'numeric', timeZone: 'Asia/Kolkata' }).format);

export const percetFormat = Intl.NumberFormat("en-IN", { style: 'unit', unit: 'percent' }).format;