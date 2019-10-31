const express = require('express');
const db = require('./data/db')

const server = express();
server.use(express.json());

server.listen(4000, () => {
    console.log('server is listening on port 4000')
})

server.post('/api/users', (req, res) => {
    const userInfo = req.body;

    if(!userInfo.name || !userInfo.bio){
        return res.status(400).json({message: `Field requires a name and bio. Please add the missing information`}).end()
    } 

    db.insert(userInfo)
        .then((user) => {
            return res.status(201).json({success: true, user})
        })
        .catch((err) => {
            return res.status(500).json({error: "There was an error while saving the user to the database", err})
        })
})

server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json({users})
        })
        .catch(err => {
            res.status(500).json({ error: "The users information could not be retrieved.", err })
        })
})

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id
    db.findById(id)
        .then(user => {
            if(user){
                res.status(200).json( {user})
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
            
        })
        .catch(err => {
            res.status(500).json({success: false, err})
        })
})

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id
    db.remove(id)
        .then(delUser => {
            if(delUser){
                res.status(204).end()
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
            
        })
        .catch(err => {
            res.status(500).json({ error: "The user could not be removed", err })
        })
})

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id
    const userInfo = req.body

    if(!userInfo.name || !userInfo.bio){
        return res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }
    db.update(id, userInfo)
        .then(user => {
            if(user){
                res.status(200).json(   {success: true, user})
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The user information could not be modified.", err })
        })
})