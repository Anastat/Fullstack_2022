
const PersonForm = (props) => {
  const {addName, handleNameChange, handleNumberChange, newName, newNumber} = props
    return (
      <>
        <h2>Add a new</h2>
        <form onSubmit={addName}>
          <div>
            name: <input value={newName} onChange={handleNameChange}/>
          </div>
          <div>
            number: <input value={newNumber} onChange={handleNumberChange}/>
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
      </>
    )
}

export default PersonForm