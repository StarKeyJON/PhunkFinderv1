import React from 'react'

const PhunkPics = (id) => {
    
    const offsetSize = 400
    const myid = id
    const punkTL = myid / 100
    const punkT = parseInt(punkTL.toString().split('.')[0])

    // this bugFx is a soft way to test decimal place. 
    // there are better ways to do this. this way is to make readable
    const bugFx = parseFloat('.'+punkTL.toString().split('.')[1]) > .1 ? 1 : 0

    // re assignment isn't needed, it's done for illustrative purposes
    const punkLTemp = parseInt(punkTL.toString().split('.')[1])

    // conditional can happen entirely inline
    // this method is for illustrative purposes only
    const punkL = bugFx && punkLTemp.toString().length < 2 ? punkLTemp*10 : punkLTemp

    return (
      <div>
        <div style={{
            width: `${offsetSize}px`,
            height: `${offsetSize}px`,
            position: `relative`,
            overflow: 'hidden',
            background: '#638496'
          }}>
          <img style={{
                  position: `absolute`,
                  width: `${offsetSize*100}px`,
                  imageRendering: 'pixelated',
                  top: `-${punkT*offsetSize}px`,
                  left: `-${punkL*offsetSize}px`
               }}           src="https://github.com/cryptopunksnotdead/programming-cryptopunks/blob/master/i/phunks.png?raw=true" />
{/* 
phunk: https://github.com/cryptopunksnotdead/programming-cryptopunks/blob/master/i/phunks.png?raw=true
punk: https://raw.githubusercontent.com/larvalabs/cryptopunks/master/punks.png
*/}
        </div>
        <small>located at {punkT} x {punkL}</small>
       
      </div>
    );
  }

export default PhunkPics;
