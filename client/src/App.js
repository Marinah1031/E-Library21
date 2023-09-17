import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route } from 'react-router-dom';
  //importing necessary dependencies form the Apollo Client Library
import {
  ApolloClient, 
  InMemoryCache, 
  ApolloProvider, 
  createHttpLink,} from '@apollo/client';
  //importing the set Context function from Apollo Client to add authentication headers
import { setContext } from '@apollo/client/link/context';
//importing React components and pages
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

//creating an http link to connect to the GraphQL server
const httpLink = createHttpLink({
  uri: '/graphql', //the URI of the graphql server
});
// Construct request middleware that will attach the JWT token to every request as an `authorization` header

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  console.log(headers);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
const client = new ApolloClient ({
  cache:new InMemoryCache(),
  link: authLink.concat(httpLink),});


function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route 
            path='/' 
            element={<SearchBooks />} 
          />
          <Route 
            path='/saved' 
            element={<SavedBooks />} 
          />
          <Route 
            path='*'
            element={<h1 className='display-2'>Wrong page!</h1>}
          />
        </Routes>
      </>
    </Router>
    </ApolloProvider>
  );
}

export default App;
