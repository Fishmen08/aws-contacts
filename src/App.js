import React, { useEffect, useState } from 'react';
import './App.css';
// import AddContact from './components/AddContact';
import Amplify from 'aws-amplify';
import awsmobile from './aws-exports';
import { API, graphqlOperation } from 'aws-amplify';
import { createContacts, deleteContacts, updateContacts } from './graphql/mutations';
import { v4 as uuidv4 } from 'uuid';
import { listContacts } from './graphql/queries';
import AllContacts from './components/AllContacts';
import Papa from 'papaparse';

Amplify.configure(awsmobile);

function App() {
  const [allContacts, setAllContacts] = useState([]);
  const [sortedContacts, setSortedContacts] = useState([]);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [sort, setSort] = useState('');

  const createNewContact = async (e) => {
    e.preventDefault();
        setError('');
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

  const clearHandler = (e) => {
    e.preventDefault();
      setName('');
      setPhoneNumber('');
      setEmail('');
  }

  const editContactInfo = async (id, newName, newPhone, newEmail) => {
    try {
      await API.graphql(graphqlOperation(updateContacts, {input: {id: id, name: newName, phoneNumber: newPhone, email: newEmail}}));
      // fetchAllContacts();
    } catch (error) {
      console.log(error)
    }
  }

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

  const deleteContact = async (id) => {
    try {
      await API.graphql(graphqlOperation(deleteContacts, {input: {id: id}}));
      fetchAllContacts();
    } catch (error) {
      console.log(error)
    }
  }

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

  useEffect(() => {
    fetchAllContacts();
  }, [])

  return (
    <div className="App">
      <header className='AppHeader'>
        <h1>Contact List</h1>
        <form onSubmit={sortContacts}>
          <input value={sort} onChange={(e) => setSort(e.target.value)} />
          <button type='submit'>Search</button>
        </form>
      </header>
      <form onSubmit={createNewContact}>
        <input type='text' value={name} required placeholder='Name' onChange={(e) => setName(e.target.value)} />
        <input type='text' value={phoneNumber} placeholder='Phone Number' onChange={(e) => setPhoneNumber(e.target.value)} />
        <input type='text' value={email} placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
        <button type='submit'>Add contact</button>
        <button onClick={clearHandler}>Clear</button>
        <fieldset>
          <label htmlFor='fileInput'>Import contact from .CSV file</label>
          <input type='file' name='fileInput' accept='.csv' onChange={(e) => setFile(e, e.target.files[0])} />
        </fieldset>
      </form>
      <div>
        {sortedContacts.map(contact => {return (
          <div>
            <AllContacts editContactInfo={editContactInfo} deleteContact={deleteContact} contact={contact} />
          </div>
        )})}
      </div>
    </div>
  );
}

export default App;
