"use client";

import { useSyncExternalStore } from "react";
import { getTimestamp } from "@/lib/formatDate";

interface MetricTimestampProps {
    createdAt: Date | string;
}

const emptySubscribe = () => () => {};

const MetricTimestamp = ({ createdAt }: MetricTimestampProps) => {
    const isClient = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );

    if (!isClient) {
        return <span className="text-[#64748B]">...</span>;
    }

    return <span>{getTimestamp(createdAt)}</span>;
};

export default MetricTimestamp;
