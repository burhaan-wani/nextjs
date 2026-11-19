import mongoose, { Schema, Types, models } from "mongoose";

export interface IUser {
    _id: Types.ObjectId;
    name: string;
    username: string;
    email: string;
    bio?: string;
    image: string;
    portfolio?: string;
    location?: string;
    reputation?: number;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        bio: { type: String },
        image: { type: String, required: true },
        portfolio: { type: String },
        location: { type: String },
        reputation: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    },
);

const User = models?.user || mongoose.model<IUser>("User", userSchema);

export default User;
