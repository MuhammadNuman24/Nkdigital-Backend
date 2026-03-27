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
        console.error('Fetch Blogs Error:', error);
        res.status(500).json({
            message: 'Server Error fetching blogs',
            error: error.message
        });
    }
});

// @desc    Get blog by ID
// @route   GET /api/blogs/:id
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        console.error('Fetch Blog Error:', error);
        res.status(500).json({
            message: 'Server Error fetching blog',
            error: error.message
        });
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

// @desc    Update a blog
// @route   PUT /api/blogs/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (blog) {
            blog.title = req.body.title || blog.title;
            blog.imageUrl = req.body.imageUrl || blog.imageUrl;
            blog.category = req.body.category || blog.category;
            blog.affiliateUrl = req.body.affiliateUrl !== undefined ? req.body.affiliateUrl : blog.affiliateUrl;
            blog.author = req.body.author || blog.author;
            blog.type = req.body.type || blog.type;
            blog.description = req.body.description !== undefined ? req.body.description : blog.description;
            // Handle hashtags (it can be sent as an array or kept as is)
            blog.hashtags = req.body.hashtags || blog.hashtags;

            const updatedBlog = await blog.save();
            res.json(updatedBlog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
