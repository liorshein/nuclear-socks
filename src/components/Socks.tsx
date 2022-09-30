import { useEffect, useState } from 'react'
import axios from 'axios'
import TableBody from './TableBody'
import { Sock } from '../types'

const Socks = () => {
    const [data, setData] = useState<Sock[]>([])
    const [fullData, setFullData] = useState<Sock[]>([])
    const [counter, setCounter] = useState<number>(0)
    const [targetItemDelete, setTargetItemDelete] = useState<Sock>()
    const [locations, setLocations] = useState<Sock[]>([])
    const [officers, setOfficers] = useState<Sock[]>([])
    const [inputs, setInputs] = useState({
        hiddenId: '',
        model: '',
        quantity: '',
        size: '',
        manufacturing: '',
        location: '',
        officer: '',
    })

    const handleChange = (event: { target: { name: string; value: string } }) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value })
    }

    useEffect(() => {
        const getData = async () => {
            setFullData((await axios.get('https://nuclearsocksls.herokuapp.com/socks/get-full')).data.result)
            setLocations((await axios.get('https://nuclearsocksls.herokuapp.com/locations/get-all')).data.result)
            setOfficers((await axios.get('https://nuclearsocksls.herokuapp.com/officers/get-all')).data.result)
        }
        getData()
    }, [])

    if (counter < fullData.length + 1) {
        new Promise(r => setTimeout(r, 300)).then(() => {
            setData(fullData.slice(0, counter))
            setCounter(counter + 1)
        })
    }

    const addItem = async () => {
        let locationId
        let officerId

        for (const locationItem of locations) {
            if (locationItem.base_name === inputs.location) {
                locationId = locationItem.location_id.toString()
            }
        }

        for (const officerItem of officers) {
            if (officerItem.name === inputs.officer) {
                officerId = officerItem.officer_id.toString()
            }
        }

        if (inputs.model !== '' && inputs.quantity !== '' && inputs.size !== '' && inputs.manufacturing !== '' && locationId !== '' && officerId !== '') {

            let newItem: any = {
                model: inputs.model,
                quantity: inputs.quantity,
                size: inputs.size,
                manufacturing_year: inputs.manufacturing,
                location_id: locationId,
                officer_id: officerId
            };

            const response = await axios.post('https://nuclearsocksls.herokuapp.com/socks/add', newItem)
            newItem.sock_id = response.data.sock_id
            newItem.name = inputs.officer
            newItem.base_name = inputs.location

            setFullData([...fullData, newItem])

            setInputs({
                hiddenId: '',
                model: '',
                quantity: '',
                size: '',
                manufacturing: '',
                location: '',
                officer: '',
            })

        } else {
            alert("Invalid sock! Please fill all fields!")
        }
    }

    if (targetItemDelete !== undefined) {
        if (fullData.includes(targetItemDelete)) {
            let params = new URLSearchParams({ sock_id: `${targetItemDelete.sock_id}` })
            let url = `https://nuclearsocksls.herokuapp.com/socks/remove?${params}`
            axios.delete(url)
            setCounter(0)
            let dataWithoutRemoved = fullData.filter(item => item !== targetItemDelete)
            setFullData(dataWithoutRemoved)
            setTargetItemDelete(undefined)
        }
    }

    const updateItem = async () => {
        for (const sock of fullData) {
            if (sock.sock_id === Number(inputs.hiddenId)) {

                let locationId
                let officerId

                for (const locationItem of locations) {
                    if (locationItem.base_name === inputs.location) {
                        locationId = locationItem.location_id.toString()
                    }
                }

                for (const officerItem of officers) {
                    if (officerItem.name === inputs.officer) {
                        officerId = officerItem.officer_id.toString()
                    }
                }

                if (inputs.model !== '' && inputs.quantity !== '' && inputs.size !== '' && inputs.manufacturing !== '' && locationId !== '' && officerId !== '') {


                    let params = new URLSearchParams({ sock_id: `${sock.sock_id}` })
                    let url = `https://nuclearsocksls.herokuapp.com/socks/update?${params}`

                    let updatedItem: any = {
                        model: inputs.model,
                        quantity: inputs.quantity,
                        size: inputs.size,
                        manufacturing_year: inputs.manufacturing,
                        location_id: locationId,
                        officer_id: officerId
                    };

                    try {
                        await axios.put(url, updatedItem);
                        updatedItem.sock_id = sock.sock_id
                        updatedItem.name = inputs.officer
                        updatedItem.base_name = inputs.location

                        let dataWithoutRemoved = fullData.filter(item => item !== sock)
                        setCounter(0)
                        setFullData([...dataWithoutRemoved, updatedItem].sort((a: Sock, b: Sock) => a.sock_id - b.sock_id))

                        setInputs({
                            hiddenId: '',
                            model: '',
                            quantity: '',
                            size: '',
                            manufacturing: '',
                            location: '',
                            officer: '',
                        })
                    } catch (e) {
                        console.log(e)
                    }
                } else {
                    alert("Invalid sock! Please fill all fields!")
                }
            }
        }
    }

    return (
        <>
            <section className="inputs">
                <input type="text" className="hidden-id" id="hidden-id"
                    name='hiddenId' value={inputs.hiddenId} onChange={handleChange} />
                <input type="text" id="sock-model"
                    placeholder="Sock Model" spellCheck="false"
                    name='model' value={inputs.model} onChange={handleChange} />
                <input type="text" id="sock-quantity"
                    placeholder="Sock Quantity" spellCheck="false"
                    name='quantity' value={inputs.quantity} onChange={handleChange} />
                <input type="email" id="sock-size"
                    placeholder="Sock Size" spellCheck="false"
                    name='size' value={inputs.size} onChange={handleChange} />
                <input type="text" id="sock-manufacturing-year"
                    placeholder="Sock Manufacturing Year" spellCheck="false"
                    name='manufacturing' value={inputs.manufacturing} onChange={handleChange} />
                <select name="location" id="location-base-name" value={inputs.location} onChange={handleChange}>
                    <option>Select Location</option>
                    {locations.map((location) => {
                        return <option key={location.location_id} value={location.base_name}>{location.base_name}</option>;
                    })}
                </select>
                <select name="officer" id="officer-name" value={inputs.officer} onChange={handleChange}>
                    <option>Select Officer</option>
                    {officers.map((officer) => {
                        return <option key={officer.officer_id} value={officer.name}>{officer.name}</option>;
                    })}
                </select>
                <button id="add-btn" className="add-btn" onClick={addItem}>Assign new "sock"</button>
                <button id="update-btn" className="update-btn" onClick={updateItem}>Confirm "sock" update</button>
            </section>
            <section className="table-container">
                <table className="table">
                    <thead className="headers">
                        <tr>
                            <th>Model</th>
                            <th>Quantity</th>
                            <th>Size</th>
                            <th>Manufacturing Year</th>
                            <th>Current Location Name</th>
                            <th>Officer Name</th>
                            <th colSpan={2} className={"btn-cell"}></th>
                        </tr>
                    </thead>
                    <TableBody sockData={data} page={"Socks"} setTargetItemDelete={setTargetItemDelete}
                        setSockInputs={setInputs} />
                </table>
            </section>
        </>
    )
}

export default Socks