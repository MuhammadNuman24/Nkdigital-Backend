const mongoose = require('mongoose');

const blogSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        imageUrl: {
            type: String,
            required: [true, 'Please add an image URL'],
        },
        category: {
            type: String,
            required: [true, 'Please select a category'],
            enum: ['Fashion', 'Beauty', 'Pet', 'Jewelry', 'Home Decor'],
        },
        affiliateUrl: {
            type: String,
            default: '',
        },
        author: {
            type: String,
            default: 'Admin',
        },
        type: {
            type: String,
            required: [true, 'Please select a type'],
            enum: ['blog', 'product'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Blog', blogSchema);
