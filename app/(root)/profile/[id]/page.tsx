import React from "react";

interface ProfileProps {
    params: Promise<{ id: string }>;
}

export const instant = false;
const Profile = async ({ params }: ProfileProps) => {
    const { id } = await params;
    return <div>Profile {id}</div>;
};

export default Profile;
