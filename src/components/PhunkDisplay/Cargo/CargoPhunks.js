import React, { useState, useEffect } from 'react';
import RenderNLL from './RenderNLL';
import Pagination from '../../Pagination/Pagination';
import './NLL.css';
import { RateLimit } from 'async-sema';
import axios from 'axios';
import logo from '../../flip.gif';
import phunkRank from "../../../phunkRanks";

const abi = ([{"inputs":[{"internalType":"address","name":"initialPhunksAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"phunkIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":true,"internalType":"address","name":"fromAddress","type":"address"}],"name":"PhunkBidEntered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"phunkIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":true,"internalType":"address","name":"fromAddress","type":"address"}],"name":"PhunkBidWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"phunkIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":true,"internalType":"address","name":"fromAddress","type":"address"},{"indexed":true,"internalType":"address","name":"toAddress","type":"address"}],"name":"PhunkBought","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"phunkIndex","type":"uint256"}],"name":"PhunkNoLongerForSale","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"phunkIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"minValue","type":"uint256"},{"indexed":true,"internalType":"address","name":"toAddress","type":"address"}],"name":"PhunkOffered","type":"event"},{"inputs":[{"internalType":"uint256","name":"phunkIndex","type":"uint256"},{"internalType":"uint256","name":"minPrice","type":"uint256"}],"name":"acceptBidForPhunk","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"phunkIndex","type":"uint256"}],"name":"buyPhunk","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"phunkIndex","type":"uint256"}],"name":"enterBidForPhunk","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"phunkIndex","type":"uint256"},{"internalType":"uint256","name":"minSalePriceInWei","type":"uint256"}],"name":"offerPhunkForSale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"phunkIndex","type":"uint256"},{"internalType":"uint256","name":"minSalePriceInWei","type":"uint256"},{"internalType":"address","name":"toAddress","type":"address"}],"name":"offerPhunkForSaleToAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"pendingWithdrawals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"phunkBids","outputs":[{"internalType":"bool","name":"hasBid","type":"bool"},{"internalType":"uint256","name":"phunkIndex","type":"uint256"},{"internalType":"address","name":"bidder","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"phunkIndex","type":"uint256"}],"name":"phunkNoLongerForSale","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"phunksAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"phunksOfferedForSale","outputs":[{"internalType":"bool","name":"isForSale","type":"bool"},{"internalType":"uint256","name":"phunkIndex","type":"uint256"},{"internalType":"address","name":"seller","type":"address"},{"internalType":"uint256","name":"minValue","type":"uint256"},{"internalType":"address","name":"onlySellTo","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newPhunksAddress","type":"address"}],"name":"setPhunksContract","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"phunkIndex","type":"uint256"}],"name":"withdrawBidForPhunk","outputs":[],"stateMutability":"nonpayable","type":"function"}]);

var Web3 = require('web3')
var web3 = new Web3('wss://mainnet.infura.io/ws/v3/24397b55c0444066a21a3396eebc0434')
var contractAddress = '0x3a6aDb264C96258C70681DF32a80dA027baDAB5f'
var NLLContract = new web3.eth.Contract(abi, contractAddress)

function NLLPhunks() {

    // Fetching Phunk data from the NLL contract
    let [nLLData, setNLLData] = useState([]);
    let [nLLMetaData, setNLLMetaData] = useState([]);
    let [searchQ, setSearchQ] = useState('');
    let [filteredResults, setFilteredResults] = useState([]);
    let [isLoading, setIsLoading] = useState(true);


    
    

    useEffect(()=>{
        const eventQuery = async () => {
    let options = {
        // filter: {
        //     value: ['1000', '1337']    //Only get events where transfer value was 1000 or 1337
        // },
        fromBlock: 'earliest',                  //Number || "earliest" || "pending" || "latest"
        toBlock: 'latest'
    };
    await NLLContract.getPastEvents('PhunkOffered', options)
    .then(response=>{
        setNLLData(response)
    })
        .catch(err => {throw err});
    };
        eventQuery();  
    },[]);

    function removeDuplicates(array, key, k) {
        let lookup = new Set();
        array.sort((a,b)=>a.blockNumber>b.blockNumber)
            return (array.filter(obj => !lookup.has(obj[key][k]) && lookup.add(obj[key][k])));
    }

    useEffect(() => {
        if (!!nLLData) {
            let metaData = [];
            const lim = RateLimit(100)
            
            const fetch =() => nLLData.forEach(
                async (id) => {
                    const options = {
                        method: 'GET',
                        url: `https://api.nftx.xyz/asset/0xf07468ead8cf26c752c676e43c814fee9c8cf402/${parseInt(id.returnValues.phunkIndex)}`,
                    };
                    
                    lim();
                    await axios
                        .request(options)
                        .then((response) => {
                            const data = response.data;
                            if (data.id.length === 3) {
                                data.id = ('0' + data.id)

                            } else if (data.id === 2) {
                                data.id = ('00' + data.id)

                            } else if (data.id === 1) {
                                data.id = ('000' + data.id)
                            }
                            for(var i = 1; i < phunkRank.length; i++) {
                                if (phunkRank[i][" id"].slice(0,4) === (data.id)) {
                                    data.rank = phunkRank[i]['ranking']
                                }
                            };
                            Object.assign(id,data);
                            metaData.push(id)
                        })
                        .catch(error => {
                            console.error(error);
                        });
                })
                
            
            fetch();
            setNLLMetaData(metaData)
            // metaData.sort(function (x, y) {
            //     return x.returnValues[1] - y.returnValues[1];
            // })
            // removeDuplicates(metaData, 'returnValues','phunkIndex')
            
            setIsLoading(false)
            
            // console.log(metaData)

            
    }
    return()=>{
    }
    }, [nLLData]);


    function handleSearch (event){

        setSearchQ(event.target.value.toLowerCase())

        if (searchQ.length > 0) {
            let filtered = nLLMetaData[0].filter((data) => {
                if (data.traits) {
                    return data.traits.some((value) => {
                        return Object.values(value).join('').toLowerCase().includes(searchQ);
                    })
                } else {
                    return setFilteredResults([]);
                }
            })
            return setFilteredResults(filtered);
        } else {
            return setFilteredResults([]);
        }
    }
    
    

    function checkDataLength(filteredResults){
        if ( (filteredResults.length / 6 ) > 5) {
            return(5);
        } else {
            return( Math.ceil(filteredResults.length / 6) );
        }
    }

    console.log(nLLMetaData)
    if (!isLoading){
    return (
        
        <div >
            
            {filteredResults.length > 0 ? (
                <>  
                    <h1 style={{ margin: '0 auto', marginTop: '20px', marginBottom: '5px' }}>NLL Phunks</h1>
                    
                        <div style={{ margin: '0 auto', marginTop: '10px', marginBottom: '5px' }}>
                            <label>Search:</label>
                            <input type="search"  onChange={(event) => handleSearch(event)} />
                            <text >{filteredResults.length} Phunks Available</text>
                        </div>
                    <Pagination
                        data={filteredResults}
                        dataLength={filteredResults.length}
                        RenderComponent={RenderNLL}
                        pageLimit={checkDataLength(filteredResults)}
                        dataLimit={6}
                    />
                </>

            ) : nLLMetaData.length > 0 ? (
                <>
                    <h1 style={{ margin: '0 auto', marginTop: '20px', marginBottom: '5px' }}>NLL Phunks</h1>
                    <div className="App">
                        <div style={{ margin: '0 auto', marginTop: '10px', marginBottom: '5px' }}>
                            <label>Search:</label>
                            <input type="search" onChange={(event) => handleSearch(event)} />
                            
                        </div>
                        <p>
                            {nLLMetaData.length} Phunks Available</p>
                    </div>
                    <Pagination
                        data={nLLMetaData}
                        dataLength={nLLMetaData.length}
                        RenderComponent={RenderNLL}
                        pageLimit={5}
                        dataLimit={6}
                    />

                </>
            ) : (
                <div>
                    <h4>Loading Not Larva Labs Phunks...</h4>
                    <img className='inver' src={logo} alt="Loading Not Larva Labs Phunks..." />
                </div>
            )}
        </div>
            
    )} else {
        return (
            <div>
            <h4>Loading Not Larva Labs Phunks...</h4>
            <img className='inver' src={logo} alt="Loading Not Larva Labs Phunks..." />
        </div>
        )
    }
};

export default NLLPhunks;
