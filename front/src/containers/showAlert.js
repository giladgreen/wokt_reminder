import React from 'react'
import { useAlert } from 'react-alert'

const ShowAlert = (props) => {
    const alert = useAlert();
    const {message, level = 'error'} = props;
    setTimeout(()=>{
            alert[level](message);
            console.log('alert attributes', Object.keys(alert))
    },1);
    return (
        <div/>
    )
}

export default ShowAlert;
