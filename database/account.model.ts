import mongoose, { Schema, Types, models } from "mongoose";

export interface IAccount {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    name: string;
    email: string;
    image?: string;
    password?: string;
    provider: string;
    providerAccountId: string;
}

const accountSchema = new Schema<IAccount>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        image: { type: String },
        email: { type: String, required: true },
        password: { type: String },
        provider: { type: String, required: true },
        providerAccountId: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

const Account =
    models?.account || mongoose.model<IAccount>("Account", accountSchema);

export default Account;
