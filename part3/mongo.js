const mongoose = require('mongoose')
require('dotenv').config();

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1);
}

const url = process.env.MONGODB_URI;
    

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('Phonebook:');
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close();
    })
} else if (process.argv.length === 5) {
    const person = new Person({
        name: name,
        number: number,
    })
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log('Usage: node script.js <password> [name] [number]');
    process.exit(1);
}

