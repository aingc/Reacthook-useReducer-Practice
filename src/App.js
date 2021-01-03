import { useState, useReducer } from 'react'
import Todo from './Todo'
/*
//no other way to update state other than with the actions predefined
//great way to to make sure state only changes in ways you expect and not in some weird unexpected way
//CAN IMPLEMENT LIKE THIS, BUT ANOTHER CLEANER WAY IS BELOW
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      return state
  }
}*/

//this is a better to not worry about mispelling especially when we're using something like TypeScript
//a much safer way to have different action types instead of having strings everywhere. Any changes in ACTIONS will persist throughout entire application without breaking anything, which is important.
export const ACTIONS = {
  /*INCREMENT: 'increment',
  DECREMENT: 'decrement'*/
  ADD_TODO: 'add-todo',
  TOGGLE_TODO: 'toggle-todo',
  DELETE_TODO: 'delete-todo'
}

//the brilliant thing about reducer is not matter how many diff actions we want to support for our todos like edit, save, share, move, etc, all of that is inside this one reducer function
//then when we pass stuff down to our Todo component, we only need "dispatch={dispatch}" and that handles all of our different use cases, no longer do you need to pass in handleclick, handlecomplete, handleedit, etc....
//you just pass in dispatch and that is it, it cleans up your props, and in general makes the code you're working with much easier and cleaner
const reducer = (todos, action) => {
  /*switch (action.type) {
    case ACTIONS.INCREMENT:
      return { count: state.count + 1 }
    case ACTIONS.DECREMENT:
      return { count: state.count - 1 }
    default:
      return state
  }*/
  switch (action.type) {
    case ACTIONS.ADD_TODO:
      return [...todos, newTodo(action.payload.name)]; //this is name in dispatch which is from state.name which is in the rendered input element
    case ACTIONS.TOGGLE_TODO:
      return todos.map(todo => {
        if (todo.id === action.payload.id) {
          return { ...todo, complete: !todo.complete }
        }
        return todo
      });
    case ACTIONS.DELETE_TODO:
      return todos.filter(todo => todo.id !== action.payload.id);
    default:
      return todos;
  }
}

const newTodo = name => {
  return { id: Date.now(), name: name, complete: false }
}

export default function App() {
  /*const [count, setCount] = useState(0);
  //useState is not the only hook that can manage state in react, useReducer can also
  //useReducer gives a more concrete way to handle complex state, it gives you set actions that you can perform on your state, and its going to convert current state to a new version based on the action you send it

  const increment = () => {
    setCount(prevCount => prevCount + 1)
  };

  const decrement = () => {
    setCount(prevCount => prevCount - 1)
  };*/

  //useReducer takes 2 diff params
  //:reducer which is a function that we perform on our state to get new state and its also going to have an initial value
  //:initialstate
  //generally when you work with reducer you're going to work with an object instead of a flat 0
  const [todos, dispatch] = useReducer(reducer, []) //similar to const [count, setCount] = useState(0)
  //it would be count if the object was a flat 0 instead of an obj, but we name it state instead
  //dispatch function is what we call to update our state, essentially its going to call the reducer given certain params and its going to take the current state (where our app is currently at) and its going to take an action
  //action is what we pass into dispatch function, whenever we call dispatch with its goign to get set to action variable, and then current state is going to be in state var and then reducer is going to return new updated state

  const [name, setName] = useState('');
  // so dispatch > reducer > action, pass action back into dispatch to get set to action var > reducer returns new updated state
  /*const increment = () => {
    dispatch({ type: ACTIONS.INCREMENT });
  }

  const decrement = () => {
    dispatch({ type: ACTIONS.DECREMENT });
  }*/

  const handleSubmit = (e) => {
    e.preventDefault(); //prevents page from refreshing
    //what you're commonly going to do with reducers is that you pass in the type, which is what you want to do, and then pass in a payload and can be named anything, but this is a common convention. The payload is going to contain all
    //of the variable values we need to actually perform that action
    dispatch({ type: ACTIONS.ADD_TODO, payload: { name: name } });
    //type var is passed in which is what we're going to do, then pass in payload param, which is what the param is for the action we're performing
    setName('');
  }

  /*return (
    <>
      <button onClick={decrement}>-</button>
      <span>{state.count}</span>
      <button onClick={increment}>+</button>
    </>
  )*/

  console.log(todos);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
      </form>
      {
        todos.map(todo => {
          return <Todo key={todo.id} todo={todo} dispatch={dispatch} />
        })
      }
    </>
  );
}
