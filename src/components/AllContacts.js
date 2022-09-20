import React, { useEffect, useState } from "react";

export default function AllContacts({contact, editContactInfo, deleteContact}) {
    const [name, setName] = useState(contact.name);
    const [phone, setPhone] = useState(contact.phoneNumber);
    const [email, setEmail] = useState(contact.email);
    const [edit, setEdit] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const editHandler = (e) => {
        e.preventDefault();
        if (edit) {
            setEdit(false);
            setName(contact.name);
            setPhone(contact.phoneNumber);
            setEmail(contact.email);
            setError('');
            setSuccess('');
        } else {
            setEdit(true);
        }
    }

    const updateHandler = (e) => {
        e.preventDefault();
        try {
            if (contact.name === name && contact.phoneNumber === phone && contact.email === email) {
                setError('Contact details are not changed')
                return;
            }
            editContactInfo(contact.id, name, phone, email);
            setEdit(false);
            setSuccess('Contact details updated')
        } catch (error) {
            console.log(error)
        }
    }

    const deleteHandler = (e) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete ' + contact.name + "?" ) === true) {
            deleteContact(contact.id);
            setError('');
            setSuccess('');
        }
    }

    useEffect(() => {
        setName(contact.name);
        setPhone(contact.phoneNumber);
        setEmail(contact.email);
        setError('');
        setSuccess('');
    }, [contact])

    return (
        <div>
            <input disabled={!edit} value={name} onChange={(e) => setName(e.target.value)}/>
            <input disabled={!edit} value={phone} onChange={(e) => setPhone(e.target.value)}/>
            <input disabled={!edit} value={email} onChange={(e) => setEmail(e.target.value)}/>
            <button onClick={editHandler}>{edit ? 'Cancel' : 'Edit'}</button>
            <button disabled={!edit} onClick={updateHandler} >Update</button>
            <button onClick={deleteHandler}>Delete</button>
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
        </div>
    )
}