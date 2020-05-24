import React from 'react'

export const Store = React.createContext();

const initialState = {
    movie: [],
    user:{}
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'FETCH_DATA':
            return {
                ...state,
                movie: action.payload
            };
        case 'ADD_MOVIE':
            return {
                ...state,
                movie: action.payload
            };
        case 'REMOVE_DATA':
            return {
                ...state,
                movie: action.payload
            };

        case 'UPDATE_RATING':
            return {
                ...state,
                movie: action.payload
            };

        case 'UPDATE_VERDICT':
            return {
                ...state,
                movie: action.payload
            };
        case 'UPDATE_USER':
            return {
                ...state,
                user:action.payload
            }    

        default:
            return state;
    }
}

export function StoreProvider(props) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}