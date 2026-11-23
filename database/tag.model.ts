import mongoose, { Schema, Types } from "mongoose";

export interface ITag {
    _id: Types.ObjectId;
    name: string;
    questions: number;
}

const tagSchema = new Schema<ITag>(
    {
        name: { type: String, required: true, unique: true },
        questions: { type: Number, default: 0 },
    },
    { timestamps: true },
);

const Tag = mongoose.models?.Tag || mongoose.model<ITag>("Tag", tagSchema);

export default Tag;
