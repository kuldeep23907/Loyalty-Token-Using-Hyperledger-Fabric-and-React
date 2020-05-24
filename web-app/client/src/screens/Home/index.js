import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table'
import Modal from 'react-responsive-modal';
import Rating from 'react-rating';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-table/react-table.css'

const Movie = (props) => {

  const { state, dispatch } = React.useContext(props.store);
  console.log('state in home page', state);
  const [open, setOpen] = useState(false);
  const [openForm, setopenForm] = useState(false);
  const [id, setid] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [movie_name, setMovieName] = useState();
  const [rating, setRating] = useState();
  const [hit, setHit] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const [openRegister, setopenRegister] = useState(false);
  const [openLogin, setopenLogin] = useState(false);

  const columns = [{
    Header: 'Movie Name',
    accessor: 'movie_name'
  }, {
    Header: 'Rating',
    accessor: 'rating',
    Cell: props => <span className='number'>{props.value}</span>
  }, {
    Header: 'Verdict',
    accessor: 'hit',
    Cell: props => <span className='number'>{props.value === 1 ? 'Hit' : 'Flop'}</span>
  }, {
    accessor: 'id',
    Header: <span>Options</span>,
    Cell: props => <div><button onClick={() => { setOpen(true); setid(props.value) }}>Rate</button> <button onClick={() => updateVerdict(props.value)}> Update</button> <button onClick={() => deleteMovie(props.value)}>Delete</button> </div>
  }]

  useEffect(() => {
    fetchDataAction();
    callback()
  }, []
  )


  const fetchDataAction = async () => {
    fetch('http://10.0.15.27:8001/movie')
      .then(results => {
        return results.json();
      }).then(data => {
        setLoading(false);
        return dispatch({
          type: 'FETCH_DATA',
          payload: data
        })
      })
  }


  const addNewMovie = () => {
    console.log("add new movie");
    let url = 'http://10.0.15.27:8001/movie';
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'movie_name': movie_name,
        'rating': rating,
        'hit': hit
      })
    }).then(results => {
      return results.json();
    }).then(data => {
      let temp = [...state.movie];
      let values = { "movie_name": movie_name, "rating": rating, "hit": hit };
      console.log(values);
      temp.push(values);
      return dispatch({
        type: 'ADD_MOVIE',
        payload: temp
      })
    }
    )
  }
  const deleteMovie = (id) => {
    let url = 'http://10.0.15.27:8001/movie/' + id;
    fetch(url, {
      method: 'DELETE',
    }).then(results => {
      return results.json();
    }).then(data => {
      let temp = [...state.movie];
      let index = temp.findIndex(obj => obj.id === id);
      temp.splice(index, 1);
      return dispatch({
        type: 'REMOVE_DATA',
        payload: temp
      })
    }
    )
  }

  const updateRating = (rating) => {
    let url = 'http://10.0.15.27:8001/movie/' + id;
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'rating': rating
      })
    }).then(results => {
      return results.json();
    }).then(data => {
      let temp = [...state.movie];
      let index = temp.findIndex(obj => obj.id === id);
      temp[index].rating = parseFloat(rating);
      return dispatch({
        type: 'UPDATE_RATING',
        payload: temp
      })
    }
    )
  }

  const updateVerdict = (id) => {
    let index = state.movie.findIndex(obj => obj.id === id);
    let url = 'http://10.0.15.27:8001/movie/' + id;
    fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'hit': state.movie[index].hit === 1 ? 0 : 1
      })
    }).then(results => {
      return results.json();
    }).then(data => {
      let temp = [...state.movie];
      let index = temp.findIndex(obj => obj.id === id);
      temp[index].hit = parseInt(state.movie[index].hit === 1 ? 0 : 1);
      return dispatch({
        type: 'UPDATE_VERDICT',
        payload: temp
      })
    }
    )
  }

  const callback = () => {
    fetch('http://test.local.geekydev.com/callback', {
      method: 'GET'
    }).then(results => {
      return results.json();
    }).then(data => {
      console.log('msg', data);
    })
  }

  const register = () => {
    fetch('http://test.local.geekydev.com/api/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'email': email,
        'username': username,
        'password': password
      })
    }).then(results => {
      return results.json();
    }).then(data => {
      console.log('msg', data);
      data.status === 'success' ? alert(data.user.username + "successfully registered.") : alert("user not registered");
    })
  }

  const login = () => {
    fetch('http://test.local.geekydev.com/api/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'email': email,
        'password': password
      })
    }).then(results => {
      return results.json();
    }).then(data => {
      console.log('msg', data);
      if (data.status === "success") localStorage.setItem('token', data.Token);
    })
  }

  console.log("movie", state.movie);

  return (
    <div style={{ display: "flex", backgroundColor: "#cede", flexDirection: "column", justifyContent: "center", alignContent: "center" }}>
      <div style={{ height: 100, backgroundColor: "", textAlign: "center", marginLeft: 100, marginRight: 100 }}>
        <h2>Moview Reviews</h2>
      </div>
      <div style={{ height: 600, backgroundColor: "#cefe", display: "flex", justifyContent: "center", borderWidth: 1, borderColor: "black", marginLeft: 100, marginRight: 100 }}>
        <ReactTable
          style={{ padding: 10, width: 1000, marginTop: 20, marginBottom: 20, textAlign: "center", backgroundColor: "#ceee" }}
          data={state.movie}
          columns={columns}
          loading={loading}
        />
      </div>
      <div style={{ margin: "auto" }}>
        <button onClick={() => { setopenForm(true) }}> Add new movie</button>
        <button onClick={() => { setopenRegister(true) }}> User Register</button>
        <button onClick={() => { setopenLogin(true) }}> User Login</button>
      </div>
      <div  >
        <Modal open={open} onClose={() => { setOpen(false) }} center styles={{ width: 100 }} closeIconSize={20} >
          <div style={{ width: 200, height: 60, display: "flex", justifyContent: "center", marginTop: 30 }}>
            <Rating fractions={8} onClick={(value) => { updateRating(value); setOpen(false) }}></Rating>
          </div>
        </Modal>
        <Modal open={openForm} onClose={() => { setopenForm(false) }}>
          <Form onSubmit={(event) => { addNewMovie(); event.preventDefault(); setopenForm(false); }} >
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
                <option value="1" > Hit </option>
                <option value="0"> Flop </option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
             </Button>
          </Form>
        </Modal>

        <Modal open={openRegister} onClose={() => { setopenRegister(false) }}>
          <Form onSubmit={(event) => { register(); event.preventDefault(); setopenRegister(false); }} >
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" placeholder="Enter email " onChange={(event) => { setEmail(event.target.value) }} />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter Username" onChange={(event) => { setUsername(event.target.value) }} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter Password" onChange={(event) => { setPassword(event.target.value) }} />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
             </Button>
          </Form>
        </Modal>


        <Modal open={openLogin} onClose={() => { setopenLogin(false) }}>
          <Form onSubmit={(event) => { login(); event.preventDefault(); setopenLogin(false); }} >
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" placeholder="Enter email " onChange={(event) => { setEmail(event.target.value) }} />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Enter Password" onChange={(event) => { setPassword(event.target.value) }} />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
             </Button>
          </Form>
        </Modal>



      </div>
      <div style={{ height: 100, backgroundColor: "#cede", textAlign: "center", marginLeft: 100, marginRight: 100 }}>
        <h5>Moview Reviews @ 2019 </h5>
      </div>
    </div >
  );
}

export default Movie;