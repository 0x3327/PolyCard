import { createContext, useContext, useState } from "react";
import axios from "axios";
import { QRContext } from "./qr-context";

export const StoreContext = createContext();

const StoreContextProvider = ({ children }) => {
    const { generatePaymentCode: generateQR } = useContext(QRContext);
    const [services, setServices] = useState(null);
    const [jwt, setJWT] = useState(null);
    const [selectedService, setSelectedService] = useState(0);
    const [api, setApi] = useState(null);

    const login = async (api, username, password) => {
        try {
            const jwt = await axios.post(`${api}/login`, { username, password });
            console.log(jwt);
            setApi(api);
            setJWT(jwt.data.token);

            const res = await axios.get(`${api}/services`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt.data.token,
                }
            });
            setServices(res.data);
            return true;
        } catch (err) {
            return false;
        }
    }

    const generatePaymentCode = async (serviceId, price) => {
        try {
            const res = await axios.post(`${api}/prepare_purchase`, { serviceID: serviceId, price }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + jwt,
                }
            });
            console.log(res.data);
            const { purchaseID } = res.data;

            const code = await generateQR(api, purchaseID, serviceId, price);
            return code;
        } catch (err) {
            return null;
        }
    }

    return (
        <StoreContext.Provider value={{ login, services, selectedService, setSelectedService, generatePaymentCode }}>
            {children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;