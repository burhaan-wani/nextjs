import qs from "query-string";

interface FormSearchUrlQueryProps {
    query: string;
    key: string;
    value: string;
}

interface DeleteSearchUrlQueryprops {
    query: string;
    keys: string[];
}

export const formSearchUrlQuery = ({
    query,
    key,
    value,
}: FormSearchUrlQueryProps) => {
    const queryString = qs.parse(query);
    queryString[key] = value;

    return qs.stringifyUrl({
        url: window.location.pathname,
        query: queryString,
    });
};

export const deleteSearchUrlQuery = ({
    query,
    keys,
}: DeleteSearchUrlQueryprops) => {
    const queryString = qs.parse(query);

    keys.forEach((key) => delete queryString[key]);

    return qs.stringifyUrl(
        {
            url: window.location.pathname,
            query: queryString,
        },
        { skipNull: true },
    );
};
