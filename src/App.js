import React, { useEffect, useState } from 'react';
import './App.css';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import { API, graphqlOperation } from 'aws-amplify';
import { createContacts, deleteContacts, updateContacts } from './graphql/mutations';
import { v4 as uuidv4 } from 'uuid';
import { listContacts } from './graphql/queries';
import AllContacts from './components/AllContacts';
import Papa from 'papaparse';
import { withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsmobile);

function App({signOut}) {
  const [allContacts, setAllContacts] = useState([]);
  const [sortedContacts, setSortedContacts] = useState([]);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [sort, setSort] = useState('');

  // Function for creating a new contact and adding it to the data base then resetting the input fields
  const createNewContact = async (e) => {
    e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const id = uuidv4();
            await API.graphql(graphqlOperation(createContacts, {input: {id: id, name: name, phoneNumber: phoneNumber, email: email}}));
            setSuccess('New contact has been added');
            setName('');
            setPhoneNumber('');
            setEmail('');
            fetchAllContacts();
        } catch (error) {
            console.log(error);
            setError('Something went wrong, please try again');
        }
  }

  // Clears all the input fields quickly
  const clearHandler = (e) => {
    e.preventDefault();
      setName('');
      setPhoneNumber('');
      setEmail('');
      setSuccess('');
  }

  //Function for editing the contact info, this is passed as props to the all contacts component which it calls to update contacts
  const editContactInfo = async (id, newName, newPhone, newEmail) => {
    try {
      await API.graphql(graphqlOperation(updateContacts, {input: {id: id, name: newName, phoneNumber: newPhone, email: newEmail}}));
    } catch (error) {
      console.log(error)
    }
  }

  // Function used to fetch all contacts from the database - which is called on each render with useEffect and is also called upon each change of the contacts
  const fetchAllContacts = async () => {
    try {
      const getAllContacts = await API.graphql(graphqlOperation(listContacts));
      const allContactsList = getAllContacts.data.listContacts.items;
      const sort = allContactsList.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
      setAllContacts(sort);
      setSortedContacts(sort);
      console.log(allContactsList);

    } catch (error) {
      console.log(error)
    }
  }

  //Function searching through the contacts for a certain contact
  const sortContacts = (e) => {
    e.preventDefault();
    try{
      const search = allContacts.filter(contact => contact.name.toLowerCase().includes(sort.toLowerCase()));
      setSortedContacts(search);
      console.log(search)
    } catch (error) {
      console.log(error);
    }
  }

  //Function for deleting contacts from the database, this is passed as props to the allContacts component to call
  const deleteContact = async (id) => {
    try {
      await API.graphql(graphqlOperation(deleteContacts, {input: {id: id}}));
      fetchAllContacts();
    } catch (error) {
      console.log(error)
    }
  }

  // Function that is used to convert CSV file data to usable values. This is currently only set-up to take single exported contacts from gmail
  const setFile = (e, file) => {
    e.preventDefault();
    const parseFile = (file) => {
      Papa.parse(file, {
        header: true,
        complete: results => {
          const data = results.data;
          if (data[0]['First Name']) {
            setName(data[0]['First Name'] + ' ' + data[0]['Last Name'])
            setPhoneNumber(data[0]['Mobile Phone'])
            setEmail(data[0]['E-mail Address']);
          } else if (data[0]['Name']) {
            setName(data[0]['Name'])
            setPhoneNumber(data[0]['Phone 1 - Value'])
            setEmail(data[0]['E-mail 1 - Value'])
          }
        }
      })
    }
    parseFile(file);
  }

  //Makes sure that all the contacts are fetched on each render
  useEffect(() => {
    fetchAllContacts();
  }, [])

  return (
    <div className="App">
      <header className='AppHeader'>
        <h1>Contact List</h1>
        <button onClick={signOut}>Sign Out</button>
      </header>
      <form className='addContactForm' onSubmit={createNewContact}>
        <input type='text' value={name} required placeholder='Name' onChange={(e) => setName(e.target.value)} />
        <input type='text' value={phoneNumber} placeholder='Phone Number' onChange={(e) => setPhoneNumber(e.target.value)} />
        <input type='text' value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
        <button type='submit'>Add contact</button>
        <button onClick={clearHandler}>Clear</button>
        <fieldset>
          <label htmlFor='fileInput'>Import contact from .CSV file</label>
          <input type='file' name='fileInput' accept='.csv' onChange={(e) => setFile(e, e.target.files[0])} />
        </fieldset>
        {success && <p>{success}</p>}
        {error && <p>{error}</p>}
      </form>
      <form className='searchForm' onSubmit={sortContacts}>
          <h3>Search</h3>
          <input value={sort} onChange={(e) => setSort(e.target.value)} />
          <button type='submit'>Search</button>
      </form>
      <div className='contactsListContainer'>
        {sortedContacts.map(contact => {return (
          
            <AllContacts editContactInfo={editContactInfo} deleteContact={deleteContact} contact={contact} />
          
        )})}
      </div>
    </div>
  );
}

export default withAuthenticator(App);
