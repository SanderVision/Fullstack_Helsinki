import { useState, useEffect } from 'react';
import personService from './services/persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notifyMessage, setNotifyMessage] = useState(null);
  const [notifyType, setNotifyType] = useState('success')
 

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data);
      });
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotifyMessage(message)
    setNotifyType(type)
    setTimeout(() => {
      setNotifyMessage(null)
    }, 3000)
  }

  const addPerson = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(person => person.name === newName);

    if (existingPerson) {
      if (existingPerson.number === newNumber) {
        alert(`${newName} is already added to phonebook with this number`);
      } else {
        if (window.confirm(`${newName} is already added to phonebook, update the number?`)) {
          const updatedPerson = { ...existingPerson, number: newNumber };
          personService
            .update(existingPerson.id, updatedPerson)
            .then(response => {
              setPersons(persons.map(person =>
                person.id !== existingPerson.id ? person : response.data
              ));
              showNotification(`Updated ${newName}'s number`, 'success')
              setNewName('');
              setNewNumber('');
            })
            .catch(error => {
              showNotification(`The person '${newName}' was already deleted from the server`, 'error');
              setPersons(persons.filter(p => p.id !== existingPerson.id));
            });
        }
      }
      return;
    }

    const personObject = {
      name: newName,
      number: newNumber,
    };

    personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data));
        showNotification(`Added ${newName}`, 'success')
        setNewName('');
        setNewNumber('');
      });
  };

  const deletePerson = (id) => {
    const personToDelete = persons.find(person => person.id === id);
    if (personToDelete  && window.confirm("Are you sure you want to delete this entry?")) {
      personService
        .deleteEntry(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          showNotification(`Deleted ${personToDelete.name}`, 'success')
        })
        .catch(error => {
          showNotification('There was an error deleting the person', 'error');
          console.error('There was an error deleting the person:', error);
        });
    }
  };

  const handleAddPerson = (event) => {
    setNewName(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleAddNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notifyMessage} type={notifyType} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        addPerson={addPerson}
        handleAddPerson={handleAddPerson}
        handleAddNumber={handleAddNumber}
      />
      <h2>Numbers</h2>
      <Persons
        personsToShow={personsToShow}
        deletePerson={deletePerson}
      />
    </div>
  );
}

export default App;
