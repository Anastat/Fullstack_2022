const Filter = ({filter, onChange}) => {
	return (
		<>
			find countries
			<input onChange={onChange} value={filter}/>
		</>
		
	)
}

export default Filter