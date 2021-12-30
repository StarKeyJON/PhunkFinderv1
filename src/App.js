// export NODE_OPTIONS=--openssl-legacy-provider 
import React from 'react';
import RariblePhunks from './components/PhunkDisplay/Rarible/RariblePhunks';
import NavBar from './components/NavBar';
import './App.css';
import NLLPhunks from './components/PhunkDisplay/NLL/NLLPhunks';
import NFTXPhunks from './components/PhunkDisplay/NFTX/NFTXPhunks';
import { Timeline } from 'react-twitter-widgets';
import Footer from './components/Footer';

function App() {

  return (
    
    <div className="App" font-face='Lato'>
      
      <div>
        <NavBar />
      </div>

      <div>
        <NLLPhunks /> 
      </div>

      <div>
        <RariblePhunks />
      </div>

      <div>
        <NFTXPhunks />
      </div>

      <Timeline
      className='App'
        dataSource={{
          sourceType: 'https://twitter.com/PhunkStats',
          screenName: 'PhunkStats'
        }}
        options={{
          height: '1600',
          outerWidth: '800'
        }}
      />
      <div>
        <Footer />
      </div>
      <a href="/dist/">Phelda (A proof of concept for me as I am learning. Credits for source in hud.)</a>
    </div>
  );
}

export default App;
