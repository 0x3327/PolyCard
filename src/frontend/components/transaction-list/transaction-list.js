import bytes32 from "bytes32";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TransactionContext } from "../../contexts/transaction-context";

export const TransactionList = () => {
    const { transactions } = useContext(TransactionContext);
    const [visibleNum, setVisibleNum] = useState(4); 

    const navigate = useNavigate();

    return (
        <div className="transaction-list">
            <div className="transaction-list-header">
                <span>Transactions</span>
                {/* <span>Filters</span> */}
            </div>

            {
                transactions == null || transactions.length == 0 ?
                    <p className="no-transactions-message">No transactions found</p>
                :
                    <div className="transaction-list-items">
                    { transactions.sort((a, b) => b.date.localeCompare(a.date)).slice(0,visibleNum).map((t, index) => (
                        <div 
                            key={`transaction-${index}`}
                            className={`transaction ${t.isDeposit ? 'deposit' : ''}`} 
                            onClick={() => navigate(`/client/payment-receipt/${t.id}`)}
                        >
                            <div className="transaction-caption">
                                <span className="transaction-date">
                                    { t.date }
                                </span>
                                <span className="tranaction-receiver">
                                    { t.isDeposit ? 'Deposit' : bytes32({ input: t.receiver}) }
                                </span>
                            </div>
                            <div className="transaction-amount">
                                <span className="amount">{t.isDeposit ? '+' : '-'}{t.amount}</span>
                                <span className="currency">{t.currency}</span>
                            </div>
                        </div>
                    ))}
                </div>
            }
            { transactions.length > visibleNum && 
                <p className="load-more" onClick={() => setVisibleNum(visibleNum + 10)}>Load more</p> 
            }
        </div>
    );
};
