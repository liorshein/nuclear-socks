export interface Sock {
    army_identity_number: number | string;
    base_name: string;
    email: string;
    lat: string;
    location_id: number;
    lon: string;
    manufacturing_year: number;
    model: string;
    name: string;
    nearest_city: string;
    officer_id: number;
    phone_number: string;
    quantity: number;
    size: number;
    sock_id: number;
}

export interface Officer {
    army_identity_number: number | string;
    email: string;
    name: string;
    officer_id: number;
    phone_number: string;
}

export interface HistoryData {
    location_history_id: number,
    arrival_date: Date | string,
    departure_date: Date | string,
    location_id: number,
    base_name: string,
    sock_id: number,
}

export interface LocationData {
    location_id: number,
    lat: string,
    lon: string,
    base_name: string,
    nearest_city: string;
}