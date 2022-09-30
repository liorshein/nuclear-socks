import { useEffect, useState } from 'react'
import axios from 'axios'
import TableBody from './TableBody'
import { Sock } from '../types'

const Officers = () => {
    const [data, setData] = useState<Sock[]>([])
    const [fullData, setFullData] = useState<Sock[]>([])
    const [counter, setCounter] = useState<number>(0)
    const [targetItemDelete, setTargetItemDelete] = useState<Sock>()
    const [inputs, setInputs] = useState({
        hiddenId: '',
        name: '',
        officerIdArmy: '',
        email: '',
        phone: '',
    })

    const handleChange = (event: { target: { name: string; value: string } }) => {
        setInputs({ ...inputs, [event.target.name]: event.target.value })
    }

    useEffect(() => {
        const getData = async () => {
            let officersData = (await axios.get('https://nuclearsocksls.herokuapp.com/officers/get-all')).data.result            
            setFullData(officersData)
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
        if (inputs.name !== '' && inputs.officerIdArmy !== '' && inputs.email !== '' && inputs.phone !== '') {

            let newItem: any = {
                name: inputs.name,
                army_identity_number: inputs.officerIdArmy,
                email: inputs.email,
                phone_number: inputs.phone
            };

            const response = await axios.post('https://nuclearsocksls.herokuapp.com/officers/add', newItem)
            newItem.officer_id = response.data.officer_id
            
            setFullData([...fullData, newItem])
        } else {
            alert("Invalid officer! Please fill all fields!")
        }
    }

    if (targetItemDelete !== undefined) {
        if (fullData.includes(targetItemDelete)) {
            let params = new URLSearchParams({ officer_id: `${targetItemDelete.officer_id}` })
            let url = `https://nuclearsocksls.herokuapp.com/officers/remove?${params}`
            axios.delete(url)
            setCounter(0)
            let dataWithoutRemoved = fullData.filter(item => item !== targetItemDelete)
            setFullData(dataWithoutRemoved)
            setTargetItemDelete(undefined)
        }
    }

    const updateItem = async () => {
        for (const officer of fullData) {
            if (officer.officer_id === Number(inputs.hiddenId)) {

                if (inputs.name !== '' && inputs.officerIdArmy !== '' && inputs.email !== '' && inputs.phone !== '') {

                    let params = new URLSearchParams({ officer_id: `${officer.officer_id}` })
                    let url = `https://nuclearsocksls.herokuapp.com/officers/update?${params}`

                    let updatedItem: any = {
                        name: inputs.name,
                        army_identity_number: inputs.officerIdArmy,
                        email: inputs.email,
                        phone_number: inputs.phone,
                    };

                    try {
                        await axios.put(url, updatedItem);
                        updatedItem.officer_id = officer.officer_id

                        let dataWithoutRemoved = fullData.filter(item => item !== officer)
                        setCounter(0)
                        setFullData([...dataWithoutRemoved, updatedItem].sort((a: Sock,b: Sock) => a.officer_id - b.officer_id))

                        setInputs({
                            hiddenId: '',
                            name: '',
                            officerIdArmy: '',
                            email: '',
                            phone: '',
                        })
                        
                    } catch (e) {
                        console.log(e)
                    }
                } else {
                    alert("Invalid officer! Please fill all fields!")
                }
            }
        }
    }

    return (
        <>
            <section className="inputs">
                <input type="text" className="hidden-id" id="hidden-id" 
                    value={inputs.hiddenId} onChange={handleChange}/>
                <input type="text" id="officer-name"
                    placeholder="Officer name" spellCheck="false"
                    value={inputs.name} onChange={handleChange} />
                <input type="text" id="officer-id-number"
                    placeholder="Officer id number" spellCheck="false"
                    value={inputs.officerIdArmy} onChange={handleChange} />
                <input type="email" id="officer-email"
                    placeholder="Officer email" spellCheck="false"
                    value={inputs.email} onChange={handleChange} />
                <input type="text" id="officer-phone-number"
                    placeholder="Officer phone number" spellCheck="false"
                    value={inputs.phone} onChange={handleChange} />
                <button id="add-btn" className="add-btn" onClick={addItem}>Assign new officer</button>
                <button id="update-btn" className="update-btn" onClick={updateItem}>Confirm officer update</button>
            </section>
            <section className="table-container">
                <table className="table">
                    <thead className="headers">
                        <tr>
                            <th>Name</th>
                            <th>id</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th colSpan={2} className={"btn-cell"}>Control Buttons</th>
                        </tr>
                    </thead>
                    <TableBody sockData={data} page={"Officers"} setTargetItemDelete={setTargetItemDelete}
                               setOfficerInputs={setInputs}/>
                </table>
            </section>
        </>
    )
}

export default Officers