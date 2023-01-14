const LoginForm = (props) => {
  const {handleLogin, handleSetUsername, handleSetPassword, username, password} = props
  return (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            onChange={handleSetUsername}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={handleSetPassword}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
   
  )  
}

export default LoginForm