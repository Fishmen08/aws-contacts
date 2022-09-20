import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
// import { API, graphqlOperation } from 'aws-amplify';
import { createContacts } from "../graphql/mutations";



export default function AddContact() {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const id = uuidv4();
            // await API.graphql(graphqlOperation(createContacts, {input: {id: id, name: name, phoneNumber: phoneNumber, email: email}}));
            setSuccess('New contact has been added');
            setName('');
            setPhoneNumber('');
            setEmail('');
        } catch (error) {
            console.log(error);
            setError('Something went wrong, please try again');
        }
    }


    return (
        <form onSubmit={handleSubmit}>
            <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
            <input type='text' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type='submit'>Add contact</button>
        </form>
    )
}