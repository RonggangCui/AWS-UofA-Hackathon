import React, { useEffect, useState } from "react";

function GetCurrentAddress(){
    const [add,setAdd] = useState('')
    // `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(pos=>{
            const {latitude,longitude} = pos.coords;
            console.log(latitude,longitude)
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
            fetch(url).then(res=>res.json()).then(data=>setAdd(data.address))
        })
    },[])
    console.log(add.road)
    return(
        <>
            <p>Address:- {add.historic}, {add.house_number}, {add.road}, {add.neighbourhood}
                , {add.suburb}, {add.city}, {add.postcode}, {add.country}</p>
        </>
    )
}

export default GetCurrentAddress;