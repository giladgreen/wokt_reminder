import React from 'react'
import { useAlert } from 'react-alert'

const ShowAlert = (props) => {
    const alert = useAlert();
    const {message} = props;
    setTimeout(()=>{
            alert.error(message);
            console.log('alert attributes', Object.keys(alert))
    },1);
    return (
        <div/>
    )
}

export default ShowAlert;
