'use strict'

const express = require('express');
const router = express.Router();

const Post = require('./PostsModel');
const PostCtrl = require('./postsController');

const auth = require('../auth/authMiddleware');

router.get('/searcher', (req, res) => {

    let q = '' + req.query.query + '';
    console.log(q);

    Post.find({ $text: { $search: q } })
        .exec((err, posts) => {
            if(err) { return res.status(500).send(err) }
            return res.send(posts);
        })
});

//Get all posts
router.get('/', PostCtrl.getAllPosts);

//Get posts by id
router.get('/:id', PostCtrl.getPostsById);

//Get posts by slug
router.get('/slug/:slug', PostCtrl.getPostsBySlug);

//Get posts by state
router.get('/state/:state', PostCtrl.getPostsByState);

//Get posts by category
router.get('/category/:category', PostCtrl.getPostsByCategory);

//Get post comments
router.get('/:id/comments', PostCtrl.getCommentsByPostId);

//Create Post
router.post('/', auth.isAuth, PostCtrl.createPost);

//Delete an Post
router.delete('/:id', auth.isAuth, PostCtrl.deletePost);

//Update Post
router.put('/:id', auth.isAuth, PostCtrl.updatePost);

module.exports = router;