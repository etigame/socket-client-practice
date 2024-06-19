import { NavLink } from 'react-router-dom'

export default function Login({setNickName}) {

   

  return (
    <section className="login">
      <h1>WhatsApp</h1>
      <h3>Ready to chat?</h3>
      <input
        type="text"
        name="nickName"
        id="nickName"
        onInput={(e) => setNickName(e.target.value)}
      />
      <NavLink to="/chat">Get In</NavLink>
    </section>
  )
}
