import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import { BlockchainContext } from "./contexts/blockchain-context";
import { ClientAppRoot } from "./screens/client/client-app-root/client-app-root";

import { ClientInitScreen } from "./screens/client/client-init-screen/client-init-screen";
import { ClientScanAccount } from "./screens/client/client-scan-account/client-scan-account";
import { ClientCreatePin } from "./screens/client/client-create-pin/client-create-pin";
import { ClientEnterPin } from "./screens/client/client-enter-pin/client-enter-pin";
import { ClientHome } from "./screens/client/client-home/client-home";
import { ClientScanPayment } from "./screens/client/client-scan-payment/client-scan-payment";
import { ClientPaymentDetails } from "./screens/client/client-payment-details/client-payment-details";
import { ClientPaymentReceipt } from "./screens/client/client-payment-receipt/client-payment-receipt";
import { ClientRegisterAccount } from "./screens/client/client-register-account/client-register-account";

import { StoreAppRoot } from "./screens/store/store-app-root/store-app-root";

import "./styles/App.css";
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-toastify/dist/ReactToastify.css';

import TransactionContextProvider from "./contexts/transaction-context";
import { ClientUserProfile } from "./screens/client/client-user-profile/client-user-profile";
import { StoreInitScreen } from "./screens/store/store-init-screen/store-init-screen";
import { StoreScanApi } from "./screens/store/store-scan-api/store-scan-api";
import { StoreLoginScreen } from "./screens/store/store-login-screen/store-login-screen";
import { StoreHomeScreen } from "./screens/store/store-home-screen/store-home-screen";
import { StoreUserProfile } from "./screens/store/store-user-profile/store-user-profile";
import UserContextProvider from "./contexts/user-context";
import QRContextProvider from "./contexts/qr-context";
import LockContextProvider from "./contexts/lock-context";
import StoreContextProvider from "./contexts/store-context";

export const App = () => {
    const context = useContext(BlockchainContext);

    return (
        <div className="app">
          <ToastContainer position="top-center" theme="dark"/>
          <UserContextProvider>
            <LockContextProvider>
              <QRContextProvider>
                <TransactionContextProvider>
                  <StoreContextProvider>
                    <Routes>
                      <Route path="/client" element={<ClientAppRoot />}>
                          <Route path="init" element={<ClientInitScreen />} />
                          <Route
                              path="scan-account"
                              element={<ClientScanAccount />}
                          />
                          <Route path="create-pin" element={<ClientCreatePin />} />
                          <Route path="enter-pin" element={<ClientEnterPin />} />
                          <Route path="home" element={<ClientHome />} />
                          <Route
                              path="scan-payment"
                              element={<ClientScanPayment />}
                          />
                          <Route
                              path="payment-details"
                              element={<ClientPaymentDetails />}
                          />
                          <Route
                              path="payment-receipt/:paymentId"
                              element={<ClientPaymentReceipt />}
                          />
                          <Route
                              path="register-account"
                              element={<ClientRegisterAccount />}
                          />
                          <Route
                            path="user-profile"
                            element={<ClientUserProfile/>}
                          />
                      </Route>

                      <Route path="/store" element={<StoreAppRoot />}>
                          <Route path="init" element={<StoreInitScreen/>}/>
                          <Route path="scan-api" element={<StoreScanApi/>}/>
                          <Route path="login" element={<StoreLoginScreen/>}/>
                          <Route path="home" element={<StoreHomeScreen/>}/>
                          <Route path="user-profile" element={<StoreUserProfile/>}/>
                      </Route>
                      <Route path="*" element={<Navigate to="/client/init" />} />
                    </Routes>
                  </StoreContextProvider>
                </TransactionContextProvider>
              </QRContextProvider>
            </LockContextProvider>
          </UserContextProvider>
        </div>
    );
};

export default App;
