import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

const SIGNUP = gql`
  mutation signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [login, { error: loginError }] = useMutation(LOGIN);
  const [signup, { error: signupError }] = useMutation(SIGNUP);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { data } = await login({ variables: { email, password } });
        console.log('Login token:', data.login.token);
        localStorage.setItem('id_token', data.login.token);
        console.log('Stored token in localStorage:', localStorage.getItem('id_token')); // Debug log
        window.location.assign('/my-shelf');
      } else {
        const { data } = await signup({ variables: { username, email, password } });
        console.log('Signup token:', data.signup.token);
        localStorage.setItem('id_token', data.signup.token);
        console.log('Stored token in localStorage:', localStorage.getItem('id_token')); // Debug log
        window.location.assign('/my-shelf');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        {(isLogin ? loginError : signupError) && (
          <p>Error: {(isLogin ? loginError : signupError).message}</p>
        )}
      </form>
      <p>
        {isLogin ? "Need an account?" : "Already have an account?"}{' '}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  );
};

export default Auth;