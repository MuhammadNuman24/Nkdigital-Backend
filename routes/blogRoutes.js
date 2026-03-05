const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all blogs
// @route   GET /api/blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a blog
// @route   POST /api/blogs
router.post('/', protect, async (req, res) => {
    try {
        const { title, imageUrl, category, affiliateUrl, author, type, description, hashtags } = req.body;
        const blog = new Blog({
            title,
            imageUrl,
            category,
            affiliateUrl,
            author,
            type,
            description,
            hashtags,
        });
        const createdBlog = await blog.save();
        res.status(201).json(createdBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            await blog.deleteOne();
            res.json({ message: 'Blog removed' });
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
