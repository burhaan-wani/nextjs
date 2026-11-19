import mongoose, { models, Schema, Types } from "mongoose";

export interface IInteraction {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    actionId: Types.ObjectId;
    action: string;
    actionType: "question" | "answer";
}

const interactionSchema = new Schema<IInteraction>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        actionId: { type: Schema.Types.ObjectId, required: true },
        action: { type: String, required: true },
        actionType: {
            type: String,
            enum: ["question", "answer"],
            required: true,
        },
    },
    { timestamps: true },
);

const Interaction =
    models?.interaction ||
    mongoose.model<IInteraction>("Interaction", interactionSchema);

export default Interaction;
