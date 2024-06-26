import './AllNotesPage.css';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import * as notesAPI from '../../utilities/notes-api'

export default function AllNotesPage ({ user }) {
    const [text, setText] = useState({text: ''});
    const [allNotes, setAllNotes] = useState([]);

    async function getAllNotes() {
        try {
            const notes = await notesAPI.getAllNotes();
            setAllNotes(notes);
        } catch (error) {
            console.error('Error fetching dreams:', error);
        }
    }

    useEffect(() => {
        getAllNotes();
    }, []);

    async function handleAddNote (evt) {
        evt.preventDefault();
        const addNote = await notesAPI.addNote(text)
        setAllNotes([...allNotes, addNote]);
        setText({text: ''});
    }

    const handleChange = (evt) => {
        setText({[evt.target.name]: evt.target.value});
    }
    
    async function handleDeleteNote (noteId) {
        try {
            await notesAPI.deleteNote(noteId);
            setAllNotes(allNotes.filter(note => note._id !== noteId));
        } catch (err) {
            console.error('Error deleting note:', err)
        }
    }

    return (
        <>
            <div className='form-container'>
                <form onSubmit={handleAddNote}>
                    <input type="text" name="text" value={text.text} onChange={handleChange} />
                    <button className='button btn-sm' type="submit">Add Note</button>
                </form>
            </div>
            <hr />         
            <h1>{user.name}'s Dreams</h1>
            {allNotes.length ?
                <ul>
                    {allNotes.map(note => (
                        <li key={note._id}>{note.createdAt}: {note.text} 
                        <button><Link to={`/${note._id}`}>Details</Link></button>
                        <button onClick={() => handleDeleteNote(note._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
                :
                <p>No notes available.</p>
            }
        </>

    )
}