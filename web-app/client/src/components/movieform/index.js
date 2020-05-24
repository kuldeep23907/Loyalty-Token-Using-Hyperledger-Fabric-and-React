import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-table/react-table.css'


const MovieForm = (props) => {

    const { state, dispatch } = React.useContext(props.store);
    console.log('state in home page', state);
    const [movie_name, setMovieName] = useState();
    const [rating, setRating] = useState();
    const [hit, setHit] = useState();



    const addNewMovie = () => {
        console.log("add new movie", movie_name, rating, hit);
        let values = { "movie_name": movie_name, "rating": rating, "hit": hit };
        let url = 'http://10.0.15.27:8001/movie';
        let user_id = state.user.user_id;
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'movie_name': movie_name,
                'rating': rating,
                'hit': hit,
                'user_id' : state.user.user_id
            })
        }).then(results => {
            return results.json();
        }).then(data => {
            let temp = [...state.movie];
            console.log(values);
            temp.push(values);
            alert('New Movie has been added.');
            return dispatch({
                type: 'ADD_MOVIE',
                payload: temp
            })

        }
        )
    }


    console.log("movie", state.movie);

    return (
        <div style={{ display: "flex", backgroundColor: "white", flexDirection: "column", justifyContent: "center", alignContent: "center" , padding:20 }}>
            <div style={{backgroundColor:"#cede"}} >
                <Form onSubmit={(event) => { addNewMovie(); event.preventDefault() }} style={{padding:20}} >
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Movie Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter movie name" onChange={(event) => { setMovieName(event.target.value) }} />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control type="text" placeholder="Enter the rating here" onChange={(event) => { setRating(event.target.value) }} />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Select verdict</Form.Label>
                        <Form.Control as="select" onChange={(event) => { setHit(event.target.value) }} >
                            <option value="-1" selected> Select </option>
                            <option value="1" > Hit </option>
                            <option value="0"> Flop </option>
                        </Form.Control>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
             </Button>
                </Form>
            </div>
        </div>

    );
}

export default MovieForm;