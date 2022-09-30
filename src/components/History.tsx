import axios from 'axios';
import { useEffect, useState } from 'react';
import { Sock, HistoryData, LocationData } from '../types';
import TableBody from './TableBody'

const History = () => {
    const [data, setData] = useState<HistoryData[]>([])
    const [fullData, setFullData] = useState<HistoryData[]>([])
    const [counter, setCounter] = useState<number>(0)
    const [locations, setLocations] = useState<Sock[]>([])
    const [socks, setSocks] = useState<Sock[]>([])
    const [inputs, setInputs] = useState({
        arrivalDate: '',
        baseName: '',
        sockId: '',
    })

    const handleChange = (event: { target: { name: string; value: string } }) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value })
    }

    useEffect(() => {
        const getData = async () => {
            let data: HistoryData[] = (await axios.get('https://nuclearsocksls.herokuapp.com/history/get-all')).data.result
            for (const history of data) {
                let locationData: LocationData[] = (await axios.get('https://nuclearsocksls.herokuapp.com/locations/get-all')).data.result
                for (const location of locationData) {
                    if (location.location_id === history.location_id) {
                        history.base_name = location.base_name
                    }
                }
                setFullData(data)
            }
            setLocations((await axios.get('https://nuclearsocksls.herokuapp.com/locations/get-all')).data.result)
            setSocks((await axios.get('https://nuclearsocksls.herokuapp.com/socks/get-all')).data.result)
        }
        getData()
    }, []);

    if (counter < fullData.length + 1) {
        new Promise(r => setTimeout(r, 300)).then(() => {
            setData(fullData.slice(0, counter))
            setCounter(counter + 1)
        })
    }

    function DateInFuture(arrivalDate: Date) {
        return new Date(arrivalDate.getTime() + 1000000000)
    }

    const addItem = async () => {
        let locationId

        for (const locationItem of locations) {
            if (locationItem.base_name === inputs.baseName) {
                locationId = locationItem.location_id
            }
        }

        if (inputs.arrivalDate !== '' && inputs.baseName !== '' && inputs.sockId !== '') {

            let arrival = new Date(inputs.arrivalDate)
            let departure = DateInFuture(arrival)

            let newItem: any = {
                arrival_date: arrival,
                departure_date: departure,
                location_id: locationId,
                sock_id: inputs.sockId
            };

            const response = await axios.post('https://nuclearsocksls.herokuapp.com/history/add', newItem)
            newItem.location_history_id = response.data.location_history_id
            newItem.base_name = inputs.baseName

            setFullData([...fullData, newItem])
        } else {
            alert("Invalid location! Please fill all fields!")
        }
    }

    return (
        <>
            <section className="inputs">
                <label htmlFor="arrival-date">Arrival Date:</label>
                <input type="date" id="arrival-date"
                    spellCheck="false" className="date-input"
                    value={inputs.arrivalDate} onChange={handleChange} />
                <select name="location-base-name" id="location-base-name" value={inputs.baseName} onChange={handleChange}>
                    <option>Select Location</option>
                    {locations.map((location) => {
                        return <option key={location.location_id} value={location.base_name}>{location.base_name}</option>;
                    })}
                </select>
                <select name="sock-model" id="sock-model" value={inputs.sockId} onChange={handleChange}>
                    <option>Select "Sock" Model</option>
                    {socks.map((sock) => {
                        return <option key={sock.sock_id} value={sock.sock_id}>{sock.sock_id}</option>;
                    })}
                </select>
                <button id="add-btn" className="add-btn" onClick={addItem}>Assign new location history</button>
            </section>
            <section className="table-container">
                <table className="table">
                    <thead className="headers">
                        <tr>
                            <th>Arrival date</th>
                            <th>Departure date</th>
                            <th>Location base name</th>
                            <th>Sock ID</th>
                        </tr>
                    </thead>
                    <TableBody historyData={data} page={"History"} />
                </table>
            </section>
        </>
    )
}

export default History