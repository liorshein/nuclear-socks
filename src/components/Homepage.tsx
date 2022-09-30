import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import axios from 'axios'
import TableBody from './TableBody'
import {Sock} from '../types'

function Homepage() {
    const [data, setData] = useState<Sock[]>([])
    const [fullData, setFullData] = useState<Sock[]>([])
    const [counter, setCounter] = useState<number>(0)

    useEffect(() => {
        const getData = async () => {
            setFullData((await axios.get('https://nuclearsocksls.herokuapp.com/socks/get-full')).data.result)
        }
        getData()
    }, [])

    if (counter < fullData.length + 1) {
        new Promise(r => setTimeout(r, 300)).then(() => {
            setData(fullData.slice(0, counter))
            setCounter(counter + 1)
        })
    }

    return (
        <>
            <section className="table-container" id="table-container">
                <table className="table">
                    <thead className="headers" id="headers">
                        <tr>
                            <th rowSpan={2}>Model</th>
                            <th rowSpan={2}>Quantity</th>
                            <th rowSpan={2}>Size</th>
                            <th rowSpan={2}>Manufacturing Year</th>
                            <th colSpan={4}>Current Location</th>
                            <th colSpan={4}>Officer In Charge</th>
                            <th rowSpan={2} className={"btn-cell"}></th>
                        </tr>
                        <tr>
                            <th>Lat</th>
                            <th>Lon</th>
                            <th>Base Name</th>
                            <th>Nearest City</th>
                            <th>Name</th>
                            <th>Army Id</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                        </tr>
                    </thead>
                    <TableBody sockData={data} page={"Home"}/>
                </table>
            </section>
        </>
    )
}

export default Homepage