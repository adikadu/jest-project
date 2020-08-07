const mongoose = require('mongoose');
const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 12
    },
    created_data: {
        type: Date,
        default: Date.now
    }
});

// To avoid extra 's' in collection name
mongoose.pluralize(null);

const studentModel = mongoose.model('student_test', studentSchema);
module.exports = studentModel;