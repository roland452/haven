import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    neighborhood: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
)

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    story: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['medical', 'housing', 'food', 'utilities', 'education', 'other'],
      required: true,
    },
    congregation: {
      type: String,
      enum: ['mosque', 'church'],
      required: true,
    },
    institutionName: {
      type: String,
      required: true,
      trim: true,
    },
    amountNeeded: {
      type: Number,
      required: true,
      min: 1,
    },
    amountRaised: {
      type: Number,
      default: 0,
      min: 0,
    },
    contact: {
      type: contactSchema,
      required: true,
    },
    contactRequests: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ['donor', 'institution'],
    },
    // users who have already had the full phone number revealed to them
    revealedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
  },
  { timestamps: true }
)

const Post = mongoose.model('Post', postSchema)

export default Post
