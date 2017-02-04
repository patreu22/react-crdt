export default function reducer(state={
	value: false,
	timestamp: new Date()
}, action){

	switch(action.type){
		case "SET_REGISTER": {
			return {...state, value: action.valuePayload, timestamp: action.timestampPayload}
		}
		case "FETCH_REGISTER": {
			return {...state}
		}
		default:{
			return null
		}

	}
}