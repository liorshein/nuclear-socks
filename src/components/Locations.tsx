import { useEffect, useState } from 'react'
import axios from 'axios'
import TableBody from './TableBody'
import { Sock } from '../types'

const Locations = () => {
    const [data, setData] = useState<Sock[]>([])
    const [fullData, setFullData] = useState<Sock[]>([])
    const [counter, setCounter] = useState(0)
    const [targetItemDelete, setTargetItemDelete] = useState<Sock>()
    const [inputs, setInputs] = useState({
        hiddenId: '',
        lat: '',
        lon: '',
        baseName: '',
        nearCity: '',
    })

    const handleChange = (event: { target: { name: string; value: string } }) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value })
    }

    useEffect(() => {
        const getData = async () => {
            let locationData = (await axios.get('https://nuclearsocksls.herokuapp.com/locations/get-all')).data.result
            setFullData(locationData)
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
        if (inputs.lat !== '' && inputs.lon !== '' && inputs.baseName !== '' && inputs.nearCity !== '') {

            let newItem: any = {
                lat: inputs.lat,
                lon: inputs.lon,
                base_name: inputs.baseName,
                nearest_city: inputs.nearCity
            };

            const response = await axios.post('https://nuclearsocksls.herokuapp.com/locations/add', newItem)
            newItem.location_id = response.data.location_id

            setFullData([...fullData, newItem])
        } else {
            alert("Invalid location! Please fill all fields!")
        }
    }

    if (targetItemDelete !== undefined) {
        if (fullData.includes(targetItemDelete)) {
            let params = new URLSearchParams({ location_id: `${targetItemDelete.location_id}` })
            let url = `https://nuclearsocksls.herokuapp.com/locations/remove?${params}`
            axios.delete(url)
            setCounter(0)
            let dataWithoutRemoved = fullData.filter(item => item !== targetItemDelete)
            setFullData(dataWithoutRemoved)
            setTargetItemDelete(undefined)
        }
    }

    const updateItem = async () => {
        for (const location of fullData) {
            if (location.location_id === Number(inputs.hiddenId)) {

                if (inputs.lat !== '' && inputs.lon !== '' && inputs.baseName !== '' && inputs.nearCity !== '') {

                    let params = new URLSearchParams({ location_id: `${location.location_id}` })
                    let url = `https://nuclearsocksls.herokuapp.com/locations/update?${params}`

                    let updatedItem: any = {
                        lat: inputs.lat,
                        lon: inputs.lon,
                        base_name: inputs.baseName,
                        nearest_city: inputs.nearCity,
                    };

                    try {
                        await axios.put(url, updatedItem);
                        updatedItem.location_id = location.location_id

                        let dataWithoutRemoved = fullData.filter(item => item !== location)
                        setCounter(0)
                        setFullData([...dataWithoutRemoved, updatedItem].sort((a: Sock, b: Sock) => a.location_id - b.location_id))

                        setInputs({
                            hiddenId: '',
                            lat: '',
                            lon: '',
                            baseName: '',
                            nearCity: '',
                        })

                    } catch (e) {
                        console.log(e)
                    }
                } else {
                    alert("Invalid location! Please fill all fields!")
                }
            }
        }
    }

    return (
        <>
            <section className="inputs">
                <input type="text" className="hidden-id" id="hidden-id"
                    name='hiddenId' value={inputs.hiddenId} onChange={handleChange} />
                <input type="text" id="lat"
                    placeholder="Latitude" spellCheck="false"
                    name='lat' value={inputs.lat} onChange={handleChange} />
                <input type="text" id="lon"
                    placeholder="Longitude" spellCheck="false"
                    name='lon' value={inputs.lon} onChange={handleChange} />
                <input type="email" id="base-name"
                    placeholder="Base name" spellCheck="false"
                    name='baseName' value={inputs.baseName} onChange={handleChange} />
                <input type="text" id="nearest-city"
                    placeholder="Nearest city" spellCheck="false"
                    name='nearCity' value={inputs.nearCity} onChange={handleChange} />
                <button id="add-btn" className="add-btn" onClick={addItem}>Assign new location</button>
                <button id="update-btn" className="update-btn" onClick={updateItem}>Confirm location update</button>
            </section>
            <section className="table-container">
                <table className="table">
                    <thead className="headers">
                        <tr>
                            <th>Latitude</th>
                            <th>Longitude</th>
                            <th>Base</th>
                            <th>Nearest City</th>
                            <th colSpan={2} className={"btn-cell"}>Control Buttons</th>
                        </tr>
                    </thead>
                    <TableBody sockData={data} page={"Locations"} setTargetItemDelete={setTargetItemDelete}
                        setLocationInputs={setInputs} />
                </table>
            </section>
        </>
    )
}

export default Locations