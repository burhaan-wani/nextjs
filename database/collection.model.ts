import mongoose, { models, Schema, Types } from "mongoose";

export interface ICollection {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    question: Types.ObjectId;
}

const collectionSchema = new Schema<ICollection>(
    {
        author: { type: Schema.Types.ObjectId, ref: "User", required: true },
        question: {
            type: Schema.Types.ObjectId,
            ref: "Question",
            required: true,
        },
    },
    { timestamps: true },
);

const Collection =
    models?.Collection ||
    mongoose.model<ICollection>("Collection", collectionSchema);

export default Collection;
