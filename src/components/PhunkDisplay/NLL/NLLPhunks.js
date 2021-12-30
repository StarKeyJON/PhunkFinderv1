import React, { useState, useEffect } from 'react';
import RenderNLL from './RenderNLL';
import Pagination from '../../Pagination/Pagination';
import './NLL.css';
import { RateLimit } from 'async-sema';
import axios from 'axios';
import logo from '../../flip.gif';
// import phunkRank from "../../../phunkRanks";
import phunkRank from '../../../pedro.json';

const abi = ([{ "inputs": [{ "internalType": "address", "name": "initialPhunksAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "phunkIndex", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "fromAddress", "type": "address" }], "name": "PhunkBidEntered", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "phunkIndex", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "fromAddress", "type": "address" }], "name": "PhunkBidWithdrawn", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "phunkIndex", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "fromAddress", "type": "address" }, { "indexed": true, "internalType": "address", "name": "toAddress", "type": "address" }], "name": "PhunkBought", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "phunkIndex", "type": "uint256" }], "name": "PhunkNoLongerForSale", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "phunkIndex", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "minValue", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "toAddress", "type": "address" }], "name": "PhunkOffered", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "phunkIndex", "type": "uint256" }, { "internalType": "uint256", "name": "minPrice", "type": "uint256" }], "name": "acceptBidForPhunk", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "phunkIndex", "type": "uint256" }], "name": "buyPhunk", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "phunkIndex", "type": "uint256" }], "name": "enterBidForPhunk", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "phunkIndex", "type": "uint256" }, { "internalType": "uint256", "name": "minSalePriceInWei", "type": "uint256" }], "name": "offerPhunkForSale", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "phunkIndex", "type": "uint256" }, { "internalType": "uint256", "name": "minSalePriceInWei", "type": "uint256" }, { "internalType": "address", "name": "toAddress", "type": "address" }], "name": "offerPhunkForSaleToAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "pendingWithdrawals", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "phunkBids", "outputs": [{ "internalType": "bool", "name": "hasBid", "type": "bool" }, { "internalType": "uint256", "name": "phunkIndex", "type": "uint256" }, { "internalType": "address", "name": "bidder", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "phunkIndex", "type": "uint256" }], "name": "phunkNoLongerForSale", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "phunksAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "phunksOfferedForSale", "outputs": [{ "internalType": "bool", "name": "isForSale", "type": "bool" }, { "internalType": "uint256", "name": "phunkIndex", "type": "uint256" }, { "internalType": "address", "name": "seller", "type": "address" }, { "internalType": "uint256", "name": "minValue", "type": "uint256" }, { "internalType": "address", "name": "onlySellTo", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newPhunksAddress", "type": "address" }], "name": "setPhunksContract", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "phunkIndex", "type": "uint256" }], "name": "withdrawBidForPhunk", "outputs": [], "stateMutability": "nonpayable", "type": "function" }])
var Web3 = require('web3')
var web3 = new Web3(INSERT INFURA WSS KEY HERE RE: https://infura.io)
var contractAddress = ('0xd6c037bE7FA60587e174db7A6710f7635d2971e7');
var NLLContract = new web3.eth.Contract(abi, contractAddress);


function NLLPhunks() {

    // Fetching Phunk data from the NLL contract
    let [nLLData, setNLLData] = useState([]);
    let [nLLMetaData, setNLLMetaData] = useState([]);
    let [searchQ, setSearchQ] = useState('');
    let [filteredResults, setFilteredResults] = useState([]);
    let [minusData, setMinus] = useState(1);
    //sort rank
    let [rankQ, setRankQ] = useState('high_low');
    //sort price
    let [priceQ, setPriceQ] = useState('high-to-low');
    //sort time listed
    let [timeQ, setTimeQ] = useState('high_low');
    //sort trait count
    let [traitQ, setTraitQ] = useState('');

    function removeDuplicates(array, key, k) {
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array.length; j++) {
                if (array[i] === array[j]) {
                    break;
                } else {
                    if (array[i] && array[j]) {
                        if (array[i][key][k] === array[j][key][k] && array[i].blockNumber > array[j].blockNumber) {
                            // console.log(array[i]);
                            setMinus(minusData++)
                            delete array[j];
                        }
                    }
                }
            }
        };
        return array;
    };

    const Fetching = async (nLLData) => {
        const lim = RateLimit(100)
        function delay(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        }
        nLLData.sort((a, b) => a.blockNumber - b.blockNumber)
        delay(2000).then(async () => {
            await nLLData.forEach(
                async function (id) {
                    const options = {
                        method: 'GET',
                        url: `https://ipfs.moralis.io:2053/ipfs/QmQcoXyYKokyBHzN3yxDYgPP25cmZkm5Gqp5bzZsTDF7cd/${parseInt(id.returnValues.phunkIndex)}`
                        // url: `https://api.nftx.xyz/asset/0xf07468ead8cf26c752c676e43c814fee9c8cf402/${parseInt(id.returnValues.phunkIndex)}`,
                    };

                    lim();
                    await axios
                        .request(options)
                        .then(function (response) {
                            Object.assign(id, response.data)
                            setNLLMetaData(nLLMetaData => [...nLLMetaData, id])
                        })
                        .catch(error => {
                            console.error(error);
                        });
                })
        })
        // console.log(nLLMetaData)
        nLLMetaData.sort(function (x, y) {
            return x.blockNumber - y.blockNumber;
        })
    }

    useEffect(() => {
        let metaData = [];
        const eventQuery = async () => {
            let options = {
                // filter: {
                //     value: ['1000', '1337']    //Only get events where transfer value was 1000 or 1337
                // },
                fromBlock: 'earliest',                  //Number || "earliest" || "pending" || "latest"
                toBlock: 'latest'
            };
            await NLLContract.getPastEvents('PhunkOffered', options)
                .then(response => {
//                     console.log(response)
                    response.forEach((order) => {
                        const data = order;
                        for (var i = 1; i < phunkRank.length; i++) {
                            if (phunkRank[i]["id"] === (data.returnValues.phunkIndex)) {
                                data.rank = phunkRank[i]['ranking'];
                            }
                        }
                        metaData.push(data)
                    }
                    );
                    (async () => {
                        let met = await removeDuplicates(metaData, 'returnValues', 'phunkIndex')

                        setNLLData(met);
                    })()


                })
                .catch(err => { throw err });
        };
        eventQuery();
    }, []);

    useEffect(() => {
        if (!!nLLData) {
            const get = async () => {
                await Fetching(nLLData);
            }
            get()
        }
    }, [nLLData])

    function handleSearch(event) {

        setSearchQ(String(event.target.value.toLowerCase()))

        if (searchQ.length > 0) {
            let filtered = nLLMetaData.filter((data) => {
                if (data.attributes) {
                    try {
                        if (data.attributes) {
                            return data.attributes.some((value) => {
                                return Object.values(value).join('').toLowerCase().includes(searchQ);
                            });
                        }
                    } catch {
                        return data.attributes.some((trait_type) => {
                            return Object.values(trait_type).join('').toLowerCase().includes(searchQ);
                        });
                    }
                } else {
                    setFilteredResults([])
                }
            })
            return setFilteredResults(filtered);

        } else {
            return setFilteredResults([]);
        }
    }

    function handleRankSort(event) {
        if (event.target.value === 'low_high') {

            nLLMetaData.sort(function (x, y) {
                return x.rank - y.rank;
            });

            setRankQ(event.target.value)
        } else {
            nLLMetaData.sort(function (x, y) {
                return y.rank - x.rank;
            });
            setRankQ(event.target.value)
        }
    }

    function handleFilterRankSort(event) {
        if (event.target.value === 'low_high') {

            filteredResults.sort(function (x, y) {
                return x.rank - y.rank;
            });

            setRankQ(event.target.value)
        } else {
            filteredResults.sort(function (x, y) {
                return y.rank - x.rank;
            });
            setRankQ(event.target.value)
        }
    }

    function handlePriceSort(event) {
        if (event.target.value === 'low-to-high') {
            nLLMetaData.sort(function (x, y) {
                return x.returnValues.minValue - y.returnValues.minValue;
            });
            setPriceQ(event.target.value)
        } else {
            nLLMetaData.sort(function (x, y) {
                return y.returnValues.minValue - x.returnValues.minValue;
            });
            setPriceQ(event.target.value)
        }
    }

    function handleFilterPriceSort(event) {
        if (event.target.value === 'low-to-high') {
            filteredResults.sort(function (x, y) {
                return x.returnValues.minValue - y.returnValues.minValue;
            });
            setPriceQ(event.target.value)
        } else {
            filteredResults.sort(function (x, y) {
                return y.returnValues.minValue - x.returnValues.minValue;
            });
            setPriceQ(event.target.value)
        }
    }

    function handleTimeSort(event) {
        if (event.target.value === 'low-to-high') {

            nLLMetaData.sort(function (x, y) {
                return x.blockNumber - y.blockNumber;
            });

            setTimeQ(event.target.value)
        } else {
            nLLMetaData.sort(function (x, y) {
                return y.blockNumber - x.blockNumber;
            });
            setTimeQ(event.target.value)
        }
    }

    function handleFilterTimeSort(event) {
        if (event.target.value === 'low-to-high') {

            filteredResults.sort(function (x, y) {
                return x.blockNumber - y.blockNumber;
            });

            setTimeQ(event.target.value)
        } else {
            filteredResults.sort(function (x, y) {
                return y.blockNumber - x.blockNumber;
            });
            setTimeQ(event.target.value)
        }
    };

    function handleFilterTraitSort(event) {
        if (event.target.value === '0') {
            let filter = filteredResults.filter(data => { return data.attributes.length === 0 }
            )
            setFilteredResults(filter)
        }
        if (event.target.value === '1') {
            let filter = filteredResults.filter(data => { return data.attributes.length === 1 }
            )
            setFilteredResults(filter)
        }
        if (event.target.value === '2') {
            let filter = filteredResults.filter(data => { return data.attributes.length === 2 }
            )
            setFilteredResults(filter)
        }
        if (event.target.value === '3') {
            let filter = filteredResults.filter(data => { return data.attributes.length === 3 }
            )
            setFilteredResults(filter)
        }
        if (event.target.value === '4') {
            let filter = filteredResults.filter(data => { return data.attributes.length === 4 }
            )
            setFilteredResults(filter)
        }
        if (event.target.value === '5') {
            let filter = filteredResults.filter(data => { return data.attributes.length === 5 }
            )
            setFilteredResults(filter)
        }
        if (event.target.value === '6') {
            let filter = filteredResults.filter(data => { return data.attributes.length === 6 }
            )
            setFilteredResults(filter)
        }
        if (event.target.value === '7') {
            let filter = filteredResults.filter(data => { return data.attributes.length === 7 }
            )
            setFilteredResults(filter)
        }
        if (event.target.value === 'off') {
            setFilteredResults([])
        }
        setTraitQ(event.target.value);
    }


    function handleTraitSort(event) {
        if (event.target.value === '0') {
            let filter = nLLMetaData.filter(data => { return data.attributes.length === 0 }
            ) 
            if (filter) {
                setFilteredResults(filter)
            }
            
        }
        if (event.target.value === '1') {
            let filter = nLLMetaData.filter(data => { return data.attributes.length === 1 }
            )
            if (filter) {
                setFilteredResults(filter)
            }
        }
        if (event.target.value === '2') {
            let filter = nLLMetaData.filter(data => { return data.attributes.length === 2 }
            )
            if (filter) {
                setFilteredResults(filter)
            }
        }
        if (event.target.value === '3') {
            let filter = nLLMetaData.filter(data => { return data.attributes.length === 3 }
            )
            if (filter) {
                setFilteredResults(filter)
            }
        }
        if (event.target.value === '4') {
            let filter = nLLMetaData.filter(data => { return data.attributes.length === 4 }
            )
            if (filter) {
                setFilteredResults(filter)
            }
        }
        if (event.target.value === '5') {
            let filter = nLLMetaData.filter(data => { return data.attributes.length === 5 }
            )
            if (filter) {
                setFilteredResults(filter)
            }
        }
        if (event.target.value === '6') {
            let filter = nLLMetaData.filter(data => { return data.attributes.length === 6 }
            )
            if (filter) {
                setFilteredResults(filter)
            }
        }
        if (event.target.value === '7') {
            let filter = nLLMetaData.filter(data => { return data.attributes.length === 7 }
            )
            if (filter) {
                setFilteredResults(filter)
            }
        }
        if (event.target.value === 'off') {
            setFilteredResults([])
        }
        setTraitQ(event.target.value);
    };

    function TraitLength(length) {
        let totalTraits = 0;
        nLLMetaData.forEach(data => {
            if (data.attributes.length === length) {
                totalTraits++
            }
        })
        if (totalTraits > 0) {
            return totalTraits
        }
        else {
            return 'None'
        }
    };

    function checkDataLength(filteredResults) {
        if ((filteredResults.length / 6) > 4) {
            return (4);
        } else {
            return (Math.ceil(filteredResults.length / 6));
        };
    }

    return (

        <div>

            {filteredResults.length > 0 ? (
                <>
                    <h1 style={{ margin: '0 auto', marginTop: '20px', marginBottom: '5px' }}>notLarvaLabs Phunks</h1>

                    <div style={{ margin: '0 auto', marginTop: '10px', marginBottom: '5px' }}>
                        <label>Search:</label>
                        <input type="search" onChange={(event) => handleSearch(event)} />
                        <text >{filteredResults.length} Phunks Available</text>
                    </div>
                    <div className="row" style={{ justifyContent: 'center' }}>
                        <div className="col-md-3 col-5">
                            <label>Rank:</label>
                            <select className="form-select" aria-label="Rank" value={rankQ} onChange={handleFilterRankSort}>
                                <option value="high_low">Least Rare Phirst</option>
                                <option value="low_high">Most Rare Phirst</option>
                            </select>
                        </div>
                        <div className="col-md-3 col-5">
                            <label>Price:</label>
                            <select className="form-select" aria-label="Price" value={priceQ} onChange={handleFilterPriceSort}>
                                <option value="high-to-low">Highest Price Phirst</option>
                                <option value="low-to-high">Lowest Price Phirst</option>
                            </select>
                        </div>
                        <div className="col-md-3 col-5">
                            <label>Time Listed:</label>
                            <select className="form-select" aria-label="Time" value={timeQ} onChange={handleFilterTimeSort}>
                                <option value="high-to-low">Most Recent Listing Phirst</option>
                                <option value="low-to-high">Oldest Listing Phirst</option>
                            </select>
                        </div>
                        <div className="col-md-3 col-5">
                            <label>Trait Count:</label>
                            <select className="form-select" aria-label="Trait" value={traitQ} onChange={handleFilterTraitSort}>
                                <option value="off">None</option>
                                <option value="0">0 Traits {TraitLength(0)} Available</option>
                                <option value="1">1 Trait {TraitLength(1)} Available</option>
                                <option value="2">2 Traits {TraitLength(2)} Available</option>
                                <option value="3">3 Traits {TraitLength(3)} Available</option>
                                <option value="4">4 Traits {TraitLength(4)} Available</option>
                                <option value="5">5 Traits {TraitLength(5)} Available</option>
                                <option value="6">6 Traits {TraitLength(6)} Available</option>
                                <option value="7">7 Traits {TraitLength(7)} Available</option>
                            </select>
                        </div>
                    </div>
                    <Pagination
                        data={filteredResults}
                        dataLength={filteredResults.length}
                        RenderComponent={RenderNLL}
                        pageLimit={checkDataLength(filteredResults)}
                        dataLimit={6}
                    />
                </>

            ) : nLLMetaData.length === (nLLData.length - minusData) ? (
                <>
                    <h1 style={{ margin: '0 auto', marginTop: '20px', marginBottom: '5px' }}>notLarvaLabs Phunks</h1>
                    <div className="App">
                        <div style={{ margin: '0 auto', marginTop: '10px', marginBottom: '5px' }}>
                            <label>Search:</label>
                            <input type="search" onChange={(event) => handleSearch(event)} />

                        </div>
                        <p>
                            {nLLMetaData.length} Phunks Available</p>
                    </div>
                    <div className="row" style={{ justifyContent: 'center' }}>
                        <div className="col-md-3 col-5">
                            <label>Rank:</label>
                            <select className="form-select" aria-label="Rank" value={rankQ} onChange={handleRankSort}>
                                <option value="high_low">Least Rare Phirst</option>
                                <option value="low_high">Most Rare Phirst</option>
                            </select>
                        </div>
                        <div className="col-md-3 col-5">
                            <label>Price:</label>
                            <select className="form-select" aria-label="Price" value={priceQ} onChange={handlePriceSort}>
                                <option value="high-to-low">Highest Price Phirst</option>
                                <option value="low-to-high">Lowest Price Phirst</option>
                            </select>
                        </div>
                        <div className="col-md-3 col-5">
                            <label>Time Listed:</label>
                            <select className="form-select" aria-label="Time" value={timeQ} onChange={handleTimeSort}>
                                <option value="low-to-high">Oldest Listing Phirst</option>
                                <option value="high-to-low">Most Recent Listing Phirst</option>
                            </select>
                        </div>
                        <div className="col-md-3 col-5">
                            <label>Trait Count:</label>
                            <select className="form-select" aria-label="Trait" value={traitQ} onChange={handleTraitSort}>
                                <option value="off">None</option>
                                <option value="0">0 Traits {TraitLength(0)} Available</option>
                                <option value="1">1 Trait {TraitLength(1)} Available</option>
                                <option value="2">2 Traits {TraitLength(2)} Available</option>
                                <option value="3">3 Traits {TraitLength(3)} Available</option>
                                <option value="4">4 Traits {TraitLength(4)} Available</option>
                                <option value="5">5 Traits {TraitLength(5)} Available</option>
                                <option value="6">6 Traits {TraitLength(6)} Available</option>
                                <option value="7">7 Traits {TraitLength(7)} Available</option>
                            </select>
                        </div>
                    </div>
                    <Pagination
                        data={nLLMetaData}
                        dataLength={nLLData.length}
                        RenderComponent={RenderNLL}
                        pageLimit={4}
                        dataLimit={6}
                    />

                </>
            ) : (
                <div>
                    <h4>Loading Not Larva Labs Phunks...</h4>
                    <img className='inver' src={logo} alt="Loading Cargo Phunks..." />
                </div>
            )}
        </div>

    )
};

export default NLLPhunks;
