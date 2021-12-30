import React, {useState, useEffect} from "react";
import axios from "axios";
import logo from './phists.gif';
import phunk from './phunk9249.png';
import './Nav.css';

function NavBar() {
    let [ethPrice, setEthPrice] = useState([]);

    const fetchEthPrice = async () => {
        
        await axios
        .get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
        .then(response => {
            setEthPrice(response.data.USD)
        })
    }

    useEffect(() => {
        fetchEthPrice();
    }, [])
    
    return (
        <div>
            <div><img src={logo} height= '80%' width='80%' alt="Phunk Phister" /></div>
            <h1 style={{ margin: '10px', marginTop: '10px', marginBottom: '5px', fontSize: '40px' }}>
                Phunk Finder!
            </h1>
            {ethPrice === '' ? (<h5>...</h5>):(<h5 justification="text-right">The current price of Ξ is: {ethPrice}(usd)</h5>)}
            <h5>Tip Jar: PhunkyJON.eth<img className='footer_img' src={phunk} alt='PhunkyJON.eth' width="40" height="40"/></h5>
        </div>
        
    )
}

export default NavBar;
