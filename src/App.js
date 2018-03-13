import React, { Component } from 'react';
import './App.css';

let defaultStyle = {
  color: '#fff'
};

let fakeServerData = {
  user: {
    name: 'Josh',
    playlists: [
      {
        name: 'My Favorites',
        songs: [{name:'Beat It', duration: 1345},
          {name:'Thriller', duration: 1322},
          {name:'Dirty Diana', duration: 1445},
          {name:'Black or White', duration: 1885}]
      },
      {
        name: 'Discover Weekly',
        songs: [{name:'I Cannot Feel My Face', duration: 1500},
                {name:'Beyond the Sea', duration: 1280},
                {name:'Boy Problems', duration: 1325}]
      },
      {
        name: 'Gaming Playlist',
        songs: [{name:'Legend Has It', duration: 1322},
                {name:'I Am Legend', duration: 1285},
                {name:'Legendary Song Name', duration: 1265}]
      },
      {
        name: 'The LAST Playlist',
        songs: [{name:'Last Dance', duration: 1166},
                {name:'Last Week', duration: 1565},
                {name:'Last Laugh', duration: 1229}]
      }
    ]
  }
};

class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{...defaultStyle, width: '40%', display: 'inline-block'}}>
        <h2>{this.props.playlists.length} playlists</h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    } ,[])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return (
      <div style={{...defaultStyle, width: '40%', display: 'inline-block'}}>
        <h2>{Math.round(totalDuration/60)} hours</h2>
      </div>
    );
  }
}

class Filter extends Component {
  render () {
    return (
      <div style={{defaultStyle}}>
        <img alt='test'/>
        <input type='text'/>
      </div>
    );
  }
}

class Playlist extends Component {
  render () {
    return (
      <div style={{...defaultStyle, display: 'inline-block', width: "25%"}}>
        <img alt='test'/>
        <h3>Playlist Name</h3>
        <ul>
          <li>Song 1</li><li>Song 2</li><li>Song 3</li>
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = {serverData: {}}
  }
  componentDidMount() {
    setTimeout( () => {
      this.setState({serverData: fakeServerData});
    }, 1000);
  }
  render() {
    return (
      <div className="App">
        {this.state.serverData.user ?
          <div>
            <h1 style= {{...defaultStyle, 'fontSize': '54px'}}>
            {this.state.serverData.user.name}'s Playlists
            </h1>
          <PlaylistCounter playlists={this.state.serverData.user.playlists}/>
          <HoursCounter playlists={this.state.serverData.user.playlists}/>
          <Filter />
          <Playlist />
          <Playlist />
          <Playlist />
          <Playlist />
          </div> : <h1 style={defaultStyle}>Loading...</h1>
      }
      </div>
    );
  }
}

export default App;
