import React from "react";
import { Card } from 'react-bootstrap';
import rarityData from '../../rarityData.json';
import './cargo.css';
import phunkRank from '../../../phunkRanks.json';
import Flippy, { FrontSide, BackSide } from 'react-flippy';

function RenderCargoData(props) {

    const data = props.data;

    function isTraitType(trait, value){
        for(var i = 1; i < rarityData.length; i++)
        {
          for(var j = 0; j < rarityData[i].pvs.length; j++) {
                if(Object.values(rarityData[i].pvs[j]).join('').includes(value)) {
                    return (rarityData[i].pvs[j][1])
                }
            }
          for(var k = 0; k < rarityData[i].pvs.length; k++) {
                if(Object.values(rarityData[i].pvs[k]).join('').includes(trait)) {
                    return (rarityData[i].pvs[k])
                }
            }
        }};

    return (
        <div className='col-md-6 col-lg-2 traits'>
            <Flippy
                flipOnHover={false} // default false
                flipOnClick={true} // default false
                flipDirection="horizontal" // horizontal or vertical
            // ref={(r) => this.flippy = r} // to use toggle method like this.flippy.toggle()
            // if you pass isFlipped prop component will be controlled component.
            // and other props, which will go to div
            >
                <FrontSide>
                        <Card.Img variant="top"
                            src={`https://img.rarible.com/prod/image/upload/prod-itemImages/0xf07468ead8cf26c752c676e43c814fee9c8cf402:${data.tokenId}/ec5aeae0`}
                            alt={data.metadata.name}
                            key={data.tokenId} />
                            {/* {render(data.tokenId)} */}

                        <Card.Body>
                            <Card.Title className='fs-5 text-responsive'>Phunk #{data.tokenId}</Card.Title>
                            <Card.Text>
                                Ξ {data.price / 1000000000000000000}
                            </Card.Text>

                        </Card.Body>
                        <Card.Footer>
                            <a className="glow text-muted" href={`https://notlarvalabs.com/market/view/phunk/${data.tokenId}`} >Get the Phunk!</a>
                        </Card.Footer>
                </FrontSide>

                <BackSide >
                    <Card.Title className='cardTitle'>Phunk #{data.tokenId}</Card.Title>
                    <h5 >Rank #  <div key={data.ids[0]} className='glow' style={{fontSize: '2bw', color: '#FF10F0'}}>
                        {data.rank}
                    </div></h5>

                    {/* {rarity()} */}
                    {data.metadata.attributes.map((data) => {
                        let trait = data.trait_type
                        let value = data.value
                        let traitIndex = isTraitType(trait, value)
                        return(
                        <div key={data.value} style={{ margin: '0 auto', marginTop: '10px', marginBottom: '5px'}}>
                            <h6 className="attributes">{value}</h6>
                                <h6 className='attributes glow'>
                                    1 of {traitIndex}
                                </h6>
                        </div>
                        )
                    })}

                </BackSide >
            </Flippy>
        </div>
    )
}

export default RenderCargoData;
