const Filter = ({filter, onChange}) => {
	return (
		<>
			filter shown with 
			<input onChange={onChange} value={filter}/>
		</>
		
	)
}

export default Filter