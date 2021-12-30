import React, { useState, useEffect } from 'react';
import axios from "axios";
import RenderRarible from './RenderRarible';
import Pagination from '../../Pagination/Pagination';
import './rarible.css';
import logo from '../../flip.gif';
// import phunkRank from "../../../phunkRanks";
import phunkRank from '../../../pedro.json';

function RariblePhunks() {

    let [raribleData, setRaribleData] = useState([]);
    let [raribleMetaData, setRaribleMetaData] = useState([]);
    let [filteredResults, setFilteredResults] = useState([]);
    let [searchQ, setSearchQ] = useState('');

    //sort rank
    let [rankQ, setRankQ] = useState('high_low');

    //sort price
    let [priceQ, setPriceQ] = useState('high-to-low');

    //sort trait count
    let [traitQ, setTraitQ] = useState('');


    // Fetching the Rarible id list of items for sale
    const FecthRaribleIds = async () => {
        const raribleIdList = [];
        const promise = await axios.get('https://ethereum-api.rarible.org/v0.1/order/orders/sell/byCollectionAndByStatus?collection=0xf07468ead8cf26c752c676e43c814fee9c8cf402&size=1500');
        Promise.all([promise]).then(response => {
            console.log(response)
            response[0].data.orders.forEach((order) => {
                if (order.status === 'ACTIVE') {
                    
                    for (var i = 1; i < phunkRank.length; i++) {
                        if (phunkRank[i]["id"] === (order.make.assetType.tokenId)) {
                            order.rank = phunkRank[i]['ranking'];
                        }
                    }
                    raribleIdList.push(order);
                }
            });
            setRaribleData(raribleIdList);
        })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        FecthRaribleIds();
    }, []);

    // Fetching the Rarible Metadata with the item ids grabbed earlier
    useEffect(() => {
        if (!!raribleData) {

            const fetch = () => raribleData.forEach(async (data) => {

                let raribleId = data.make.assetType.tokenId;
                const options = {
                    method: 'GET',
                    url: `https://ethereum-api.rarible.org/v0.1/nft/items/0xf07468ead8cf26c752c676e43c814fee9c8cf402:${raribleId}/meta`,
                    headers: {
                        'content-type': 'application/json'
                    }
                };

                await axios
                    .request(options)
                    .then((response) => {
                        Object.assign(data, response.data);
                        setRaribleMetaData(raribleMetaData => [...raribleMetaData, data]);
                    }
                    )
                    .catch(error => {
                        console.error(error);
                    });
            });
            fetch();

        }
        return () => {
        }
    }, [raribleData]);

    function handleSearch(event) {
        setSearchQ(event.target.value.toLowerCase())

        if (searchQ.length > 0) {
            let filtered = raribleMetaData.filter((data) => {
                if (data.attributes) {
                    return data.attributes.some((value) => {
                        return Object.values(value).join('').toLowerCase().includes(searchQ);
                    });
                };
                return data;
            });
            return setFilteredResults(filtered);
        } else {
            return setFilteredResults([]);
        }
    }

    function checkDataLength(filteredResults) {
        if (Math.ceil(filteredResults.length / 6) > 4) {
            return 4;
        } else {
            return (Math.ceil(filteredResults.length / 6));
        }
    }

    function handleRankSort(event) {
        if (event.target.value === 'low_high') {

            raribleMetaData.sort(function (x, y) {
                return x.rank - y.rank;
            });

            setRankQ(event.target.value)
        } else {
            raribleMetaData.sort(function (x, y) {
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
            raribleMetaData.sort(function (x, y) {
                return x.makePrice - y.makePrice;
            });
            setPriceQ(event.target.value)
        } else {
            raribleMetaData.sort(function (x, y) {
                return y.makePrice - x.makePrice;
            });
            setPriceQ(event.target.value)
        }
    }

    function handleFilterPriceSort(event) {
        if (event.target.value === 'low-to-high') {
            filteredResults.sort(function (x, y) {
                return x.makePrice - y.makePrice;
            });
            setPriceQ(event.target.value)
        } else {
            filteredResults.sort(function (x, y) {
                return y.makePrice - x.makePrice;
            });
            setPriceQ(event.target.value)
        }
    }


    function handleFilterTraitSort(event) {
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
        if (event.target.value === '1') {
            let filter = raribleMetaData.filter(data => { return data.attributes.length === 1 }
            )
            setFilteredResults(filter)
        }
        if (event.target.value === '2') {
            let filter = raribleMetaData.filter(data => { return data.attributes.length === 2 }
            )
            setFilteredResults(filter)
        }
        if (event.target.value === '3') {
            let filter = raribleMetaData.filter(data => { return data.attributes.length === 3 }
            )
            setFilteredResults(filter)
        }
        if (event.target.value === '4') {
            let filter = raribleMetaData.filter(data => { return data.attributes.length === 4 }
            )
            setFilteredResults(filter)
        }
        if (event.target.value === '5') {
            let filter = raribleMetaData.filter(data => { return data.attributes.length === 5 }
            )
            setFilteredResults(filter)
        }
        if (event.target.value === '6') {
            let filter = raribleMetaData.filter(data => { return data.attributes.length === 6 }
            )
            setFilteredResults(filter)
        }
        if (event.target.value === '7') {
            let filter = raribleMetaData.filter(data => { return data.attributes.length === 7 }
            )
            setFilteredResults(filter)
        }
        if (event.target.value === 'off') {
            setFilteredResults([])
        }
        setTraitQ(event.target.value);
    };

    function TraitLength(length) {
        let totalTraits = 0;
        raribleMetaData.forEach(data => {
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

    return (

        <div>

            {filteredResults.length > 0 ? (
                <>
                    <h1 style={{ margin: '0 auto', marginTop: '20px', marginBottom: '5px' }}>Rarible Phunks</h1>
                    <div style={{ margin: '0 auto', marginTop: '10px', marginBottom: '5px' }}>
                        <label>Search:</label>
                        <input type="search" onChange={(event) => handleSearch(event)} />
                        <text>{filteredResults.length} Phunks Available</text>
                    </div>
                    <div style={{ margin: '0 auto', marginTop: '10px', marginBottom: '5px', overflow: 'hidden' }}>
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
                                <label>Trait Count:</label>
                                <select className="form-select" aria-label="Trait" value={traitQ} onChange={handleFilterTraitSort}>
                                    <option value="off">None</option>
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
                    </div>
                    <Pagination
                        data={filteredResults}
                        RenderComponent={RenderRarible}
                        pageLimit={checkDataLength(filteredResults)}
                        dataLimit={6}
                    />

                </>


            ) : raribleMetaData.length === raribleData.length ? (
                <>
                    <h1 style={{ margin: '0 auto', marginTop: '20px', marginBottom: '5px' }}>Rarible Phunks</h1>
                    <div style={{ margin: '0 auto', marginTop: '10px', marginBottom: '5px' }}>
                        <label>Search:</label>
                        <input type="search" onChange={(event) => handleSearch(event)} />
                        <text>{raribleMetaData.length} Phunks Available</text>
                    </div>
                    <div style={{ margin: '0 auto', marginTop: '10px', marginBottom: '5px', overflow: 'hidden' }}>
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
                                <label>Trait Count:</label>
                                <select className="form-select" aria-label="Trait" value={traitQ} onChange={handleTraitSort}>
                                    <option value="off">None</option>
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
                    </div>
                    <Pagination
                        data={raribleMetaData}
                        RenderComponent={RenderRarible}
                        pageLimit={4}
                        dataLimit={6}
                    />

                </>
            ) : (
                <div>
                    <h4>Loading Rarible Phunks...</h4>
                    <img className='inver' src={logo} alt="Loading Rarible Phunks..." />
                </div>

            )}
        </div>
    )
};

export default RariblePhunks;
