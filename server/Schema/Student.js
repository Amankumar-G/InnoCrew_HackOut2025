import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define a sub-schema for learningPath
const learningPathSchema = new mongoose.Schema({
    subtopic_name: {
        type: String,
        required: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    goal_statement: {
        type: String,
        required: true,
    },
    key_deliverables: {
        type: [String],   // Array of strings
        required: true,
    },
    index  : {
        type: Number,  // Index field to maintain order
        required: true,
    }
}, { _id: false });  // no separate _id for each subtopic unless needed

// Main Student Schema
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true,
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    isDeaf: {
        type: Boolean,
        default: false
    },
    learningPath: [learningPathSchema],  // 👉 linked learning path
}, { timestamps: true });

// Hash password before save
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare input password with hashed password
studentSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Export Student model
const Student = mongoose.model('Student', studentSchema);  // Renamed correctly
export default Student;
