const express = require('express');
const router = express.router;

const bodyParser = require('bodyParser');
const jsonParser = bodyParser.json();

const {
    BlogPosts
} = require('./models');

function lorem() {
    return (
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod " +
        "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, " +
        "quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo " +
        "consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse " +
        "cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non " +
        "proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    );
}

BlogPosts.create('Start Here', lorem(), 'Bob Heart');
BlogPosts.create('23 Things about what comes Next', lorem(), 'Chris Hope');
BlogPosts.create('The Real One', lorem(), 'Caleb Gammon');

router.get("/", (reg, res) => {
    res.json(BlogPosts.get);
});

router.post("/", jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    return res.status(201).send(item);
});

router.delete("/:id", (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleting blog post with ID \`${req.params.ID}\``);
    res.status(204).end();
});

router.put("/:id", jsonParser(req, res) => {
    const requiredFields = ['title', 'content', 'author', 'publishDate'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            return res.status(400).send(message);
        }
    }
    if (req.params.id != req.body.id) {
        const message = `Request path id (${req.params.id}) and request body id `
        `(${req.body.id}) must match`);
    return res.status(400).send(message);
}
console.log(`Updating Blog post item \`${req.params.id}\``);
const updatedItem = BlogPosts.update({
    title: req.params.title,
    content: req.params.content,
    author: req.params.author,
    publishDate: req.params.publishDate
});
return res.status(204).end();
});

module.exports = router;
