import axios from "axios"

export function fetchRegister(){
	return function(dispatch){
		axios.get("localhost:3000/api")
		.then((response) =>{
			dispatch({type: "FETCH_REGISTER_FULFILLED", payload: response.data})
		})
		.catch((err) =>{
			console.log("Error: "+ err)
		})
	}

}