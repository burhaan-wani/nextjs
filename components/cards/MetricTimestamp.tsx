"use client";

import { getTimestamp } from "@/lib/formatDate";
import { useEffect, useState } from "react";

interface MetricTimestampProps {
    createdAt: Date | string;
}

const MetricTimestamp = ({ createdAt }: MetricTimestampProps) => {
    // Prevents SSR hydration mismatch by rendering after mount on the client
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <span className="text-muted-foreground">loading...</span>;
    }

    return <span>asked {getTimestamp(createdAt)}</span>;
};

export default MetricTimestamp;
