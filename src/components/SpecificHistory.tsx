import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { HistoryData, Sock } from '../types';

type Props = {}

const SpecificHistory = (props: Props) => {
    let { id } = useParams()
    const [sockId] = useState<string>(id!)

    const [data, setData] = useState<HistoryData[]>([])
    const [fullData, setFullData] = useState<HistoryData[]>([])
    const [counter, setCounter] = useState<number>(0)

    useEffect(() => {
        const getData = async () => {
            let socks: Sock[] = (await axios.get('https://nuclearsocksls.herokuapp.com/socks/get-full')).data.result
            for (const sock of socks) {
                if (sock.sock_id === Number(sockId)) {
                    let params = new URLSearchParams({ sock_id: `${sockId}` })
                    let url = `https://nuclearsocksls.herokuapp.com/history/get-specific?${params}`
                    let historyData: HistoryData[] = (await axios.get(url)).data.result

                    if (historyData.length === 0){
                        alert("No History!")
                    }

                    for (const history of historyData) {
                        history.base_name = sock.base_name
                    }
                    setFullData(historyData)
                }
            }
        }
        getData()
    }, [sockId])

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
                            <th>Arrival date</th>
                            <th>Departure date</th>
                            <th>Location base name</th>
                            <th>Sock ID Year</th>
                        </tr>
                    </thead>
                    <tbody id="tbody" className="content">
                        {data.map((data: HistoryData) =>
                            <tr key={data.location_history_id} className="table-row">
                                <td>{data.arrival_date.toString().slice(0, 10)}</td>
                                <td>{data.departure_date.toString().slice(0, 10)}</td>
                                <td>{data.base_name}</td>
                                <td>{data.sock_id}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </>
    )

}

export default SpecificHistory