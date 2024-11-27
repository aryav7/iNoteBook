const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();
const Note = require("../models/Note");
const { validationResult, body } = require('express-validator');

// ROUTE 1 : Get all the notes using : GET "/api/notes/fetchallnotes" . login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
}
});

// ROUTE 2 : Add new note using : POST "/api/notes/addnote" . login required
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a title").isLength({
      min: 3,
    }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
    const {title,description,tag} = req.body;
    // If there are errors , return Bad rquest and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note = new Note({
        title,description,tag,user: req.user.id
    });
    const savedNote = await note.save();
    res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");  
    }
  }
);

// ROUTE 3 : Updating an existing note using : PUT "/api/notes/updatenote" . login required
    router.put("/updatenote/:id",fetchUser,async (req, res) => {
      const {title,description,tag} = req.body;
      try {
        // Create a newNote Object
        const newNote ={};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id)
        if(!note){return res.status(404).send("Not Found")}

        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({note}) } 
        
        catch (error) {
          console.error(error.message);
          res.status(500).send("Internal server error");  
        }
})

// ROUTE 4 : Deleting an existing note using : DELETE "/api/notes/deletenote" . login required
    router.delete("/deletenote/:id",fetchUser,async (req, res) => {
      try {
        const {title,description,tag} = req.body;

        // Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id)
        if(!note){return res.status(404).send("Not Found")}

        // Allow deleteion only if user owns it
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({"Success":"NOTE has been deleted" , note:note})
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");  
      }
})
module.exports = router;
