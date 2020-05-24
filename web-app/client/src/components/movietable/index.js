import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table'
import Modal from 'react-responsive-modal';
import Rating from 'react-rating';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-table/react-table.css'

const MovieTable = (props) => {

    const { state, dispatch } = React.useContext(props.store);
    console.log('state in home page', state);
    const [open, setOpen] = useState(false);
    const [id, setid] = useState(-1);
    const [loading, setLoading] = useState(true);

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
    }, []
    )


    const fetchDataAction = async () => {
        let url = 'http://10.0.15.27:8001/movie/' + state.user.user_id;
        console.log('in fetch data ction',url);
        fetch(url,{
            method: 'GET',
        })
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

    console.log("movie", state.movie);

    return (
        <div style={{ display: "flex", backgroundColor: "#cede", flexDirection: "column", justifyContent: "center", alignContent: "center" }}>
            <div style={{ height: 600, backgroundColor: "#cefe", display: "flex", justifyContent: "center", borderWidth: 1, borderColor: "black", marginLeft: 100, marginRight: 100 }}>
                <ReactTable
                    style={{ padding: 10, width: 1000, marginTop: 20, marginBottom: 20, textAlign: "center", backgroundColor: "#ceee" }}
                    data={state.movie}
                    columns={columns}
                    loading={loading}
                />
            </div>
            <div>
                <Modal open={open} onClose={() => { setOpen(false) }} center styles={{ width: 100 }} closeIconSize={20} >
                    <div style={{ width: 200, height: 60, display: "flex", justifyContent: "center", marginTop: 30 }}>
                        <Rating fractions={8} onClick={(value) => { updateRating(value); setOpen(false) }}></Rating>
                    </div>
                </Modal>
            </div>
        </div >
    );
}

export default MovieTable;