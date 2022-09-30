import { Link } from 'react-router-dom'
import { HistoryData, Sock } from '../types'

type Props = {
    setTargetItemDelete?: (a: Sock) => void
    setModel?: (a: string) => void
    setQuantity?: (a: string) => void
    setSize?: (a: string) => void
    setManufacturing?: (a: string) => void
    setLocation?: (a: string) => void
    setOfficer?: (a: string) => void
    setHiddenId?: (a: string) => void
    setName?: (a: string) => void
    setOfficerIdArmy?: (a: string) => void
    setEmail?: (a: string) => void
    setPhone?: (a: string) => void
    setLat?: (a: string) => void
    setLon?: (a: string) => void
    setBaseName?: (a: string) => void
    setNearCity?: (a: string) => void
    setOfficerInputs?: (a: {
        hiddenId: string,
        name: string,
        officerIdArmy: string,
        email: string,
        phone: string,
    }) => void
    setSockInputs?: (a: {
        hiddenId: string,
        model: string,
        quantity: string,
        size: string,
        manufacturing: string,
        location: string,
        officer: string,
    }) => void
    setLocationInputs?: (a: {
        hiddenId: string,
        lat: string,
        lon: string,
        baseName: string,
        nearCity: string,
    }) => void
    sockData?: Sock[]
    historyData?: HistoryData[]
    page: string
}

const TableBody = (props: Props): JSX.Element => {
    if (props.sockData) {
        const dataArr: Sock[] = props.sockData!
        for (let data of dataArr) {
            if (data.officer_id === null) {
                data.name = "Non"
                data.phone_number = "Non"
                data.army_identity_number = "Non"
                data.email = "Non"
            }

            if (data.location_id === null) {
                data.lat = "Non"
                data.lon = "Non"
                data.nearest_city = "Non"
                data.base_name = "Non"
            }
        }

        if (props.page === "Home") {
            return (
                <tbody id="tbody" className="content">
                    {props.sockData!.map((data: Sock) =>
                        <tr key={data.sock_id} className="table-row">
                            <td>{data.model}</td>
                            <td>{data.quantity}</td>
                            <td>{data.size}</td>
                            <td>{data.manufacturing_year}</td>
                            <td>{data.lat}</td>
                            <td>{data.lon}</td>
                            <td>{data.base_name}</td>
                            <td>{data.nearest_city}</td>
                            <td>{data.name}</td>
                            <td>{data.army_identity_number}</td>
                            <td>{data.email}</td>
                            <td>{data.phone_number}</td>
                            <td><button><Link to={`/${data.sock_id}`}>History</Link></button></td>
                        </tr>
                    )}
                </tbody>
            )
        } else if (props.page === "Socks") {

            const setForSockUpdate = (data: Sock) => {
                props.setSockInputs!({
                    hiddenId: data.sock_id.toString(),
                    model: data.model,
                    quantity: data.quantity.toString(),
                    size: data.size.toString(),
                    manufacturing: data.manufacturing_year.toString(),
                    location: data.base_name,
                    officer: data.name,
                })
            }

            return (
                <tbody id="tbody" className="content">
                    {props.sockData!.map((data: Sock) =>
                        <tr key={data.sock_id} className="table-row">
                            <td>{data.model}</td>
                            <td>{data.quantity}</td>
                            <td>{data.size}</td>
                            <td>{data.manufacturing_year}</td>
                            <td>{data.base_name}</td>
                            <td>{data.name}</td>
                            <td><button onClick={() => props.setTargetItemDelete!(data)}>Delete</button></td>
                            <td><button onClick={() => setForSockUpdate(data)}>Update</button></td>
                        </tr>
                    )}
                </tbody>
            )
        } else if (props.page === "Locations") {

            const setForLocationUpdate = (data: Sock) => {
                props.setLocationInputs!({
                    hiddenId: data.location_id.toString(),
                    lat: data.lat,
                    lon: data.lon,
                    baseName: data.base_name,
                    nearCity: data.nearest_city,
                })
            }

            return (
                <tbody id="tbody" className="content">
                    {props.sockData!.map((data: Sock) =>
                        <tr key={data.location_id} className="table-row">
                            <td>{data.lat}</td>
                            <td>{data.lon}</td>
                            <td>{data.base_name}</td>
                            <td>{data.nearest_city}</td>
                            <td><button onClick={() => props.setTargetItemDelete!(data)}>Delete</button></td>
                            <td><button onClick={() => setForLocationUpdate(data)}>Update</button></td>
                        </tr>
                    )}
                </tbody>
            )
        } else if (props.page === "Officers") {

            const setForOfficerUpdate = (data: Sock) => {
                props.setOfficerInputs!({
                    hiddenId: data.officer_id.toString(),
                    name: data.name,
                    officerIdArmy: data.army_identity_number.toString(),
                    email: data.email,
                    phone: data.phone_number,
                })
            }

            return (
                <tbody id="tbody" className="content">
                    {props.sockData!.map((data: Sock) =>
                        <tr key={data.officer_id} className="table-row">
                            <td>{data.name}</td>
                            <td>{data.army_identity_number}</td>
                            <td>{data.email}</td>
                            <td>{data.phone_number}</td>
                            <td><button onClick={() => props.setTargetItemDelete!(data)}>Delete</button></td>
                            <td><button onClick={() => setForOfficerUpdate(data)}>Update</button></td>
                        </tr>
                    )}
                </tbody>
            )
        }
    } else if (props.historyData && props.page === "History") {
        return (
            <tbody id="tbody" className="content">
                {props.historyData!.map((history: HistoryData) =>
                    <tr key={history.location_history_id} className="table-row">
                        <td>{history.arrival_date.toString().slice(0, 10)}</td>
                        <td>{history.departure_date.toString().slice(0, 10)}</td>
                        <td>{history.base_name}</td>
                        <td>{history.sock_id}</td>
                    </tr>
                )}
            </tbody>
        )
    }
    return (
        <div>No Data</div>
    )
}

export default TableBody
