const PersonForm = ({ newName,newNumber, addPerson, handleAddPerson, handleAddNumber, errorMessage }) => {
    return (
        <form onSubmit={addPerson}>
            <div>
                name: <input value={newName} onChange={handleAddPerson} />
            </div>
            <div>
                number: <input value={newNumber} onChange={handleAddNumber} />
            </div>
            <div>
                <button type="submit" onClick={errorMessage}>add</button>
            </div>
        </form>
    )
}

export default PersonForm;