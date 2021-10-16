import React, { Component } from 'react';
import getSearchResults from './actions/getSearchResults';
import subscribeRestaurant from './actions/subscribeRestaurant';
import unsubscribeRestaurant from './actions/unsubscribeRestaurant';
import getSubscriptions from './actions/getSubscriptions';
import getLocationData from './actions/getLocationData';
import Restaurant from './containers/restaurant';
import LoginPage from './components/login-page';
import SearchTab from './components/search-tab';
import SubscriptionsTab from './components/subscriptions-tab';

import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

const isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
const location = {
    lat: localStorage.getItem('lat') || '32.083758287943695',
    lon: localStorage.getItem('lon') || '34.79441564530134',
    details: localStorage.getItem('address-details') || '',
}
function beep() {
    const snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
}

function getLocation(){
    if (navigator.geolocation)
    {

        navigator.geolocation.getCurrentPosition(async (position)=>{
            const changed = (`${location.lat}` !== `${position.coords.latitude}` || `${location.lon}` !== `${position.coords.longitude}`);
            location.lat=position.coords.latitude;
            location.lon=position.coords.longitude;
            localStorage.setItem('lat', location.lat);
            localStorage.setItem('lon', location.lon);
            if (changed) {
                const addressDetails = await getLocationData(location.lat, location.lon);
                location.details = addressDetails;
                this.setState({ myAddress: addressDetails });
            }else{
                this.setState({ myAddress: location.details });
            }
        },(err)=>{
            console.log('calling getCurrentPosition got error:', err)
        });
    }
    else{
        console.log('no navigator.geolocation')
    }
}

class App extends Component {

    constructor() {
        super();
        setTimeout(async ()=>{
            const authData = localStorage.getItem('authData');
            if (authData){
                const {provider, token } = JSON.parse(authData);
                if (provider && token) {
                    const { subscriptions, userContext } = await getSubscriptions(provider, token);
                    console.log('after getSubscriptions')
                    this.setState({ subscriptions, email: userContext.email });
                    this.onLoggedIn();
                }
            }
        },400)
        this.state = {
            email: null,
            results:[],
            subscriptions:[],
            tabKey:'search',
            searchWasClicked: false,
            thinking: false,
            myAddress: '',
        };
    }
    onLoggedIn = () =>{
        getLocation.bind(this)();
    }

    subscribe = async(name, restaurantId) => {
        const setState = this.setState.bind(this);
        setState({ thinking:true });
        const {provider, token } = JSON.parse(localStorage.getItem('authData'));
        setImmediate(async ()=>{
            const subscriptions = await subscribeRestaurant(name, restaurantId, location, provider, token);
            setState({ thinking:false, subscriptions, tabKey: 'subscriptions' });
        })
    }

    unsubscribe = async(name, restaurantId) => {
        const setState = this.setState.bind(this);
        setState({ thinking:true });
        const {provider, token } = JSON.parse(localStorage.getItem('authData'));
        setImmediate(async ()=>{
            if (confirm("להסיר את הרישום?")){
                const subscriptions = await unsubscribeRestaurant(name, restaurantId, location, provider, token);
                setState({ thinking:false, subscriptions, tabKey: 'subscriptions' });
            }else{
                setState({ thinking:false });
            }
        })
    }

    search = async(searchTerm) => {
        if (!searchTerm || searchTerm.length ===0){
            return;
        }
        const setState = this.setState.bind(this);
        setState({ thinking:true });
        setImmediate(async ()=>{
            localStorage.setItem('searchRestaurantValue', searchTerm);
            const results = await getSearchResults(searchTerm, location);
            setState({ results, searchWasClicked:true, thinking:false });
        })
    }

    getRestaurantDiv = (title,shortDescription, image, overlay,restaurantId, address, isOpen, searchPage, subscriber, email)=>{
        return <Restaurant
            title={title}
            shortDescription={shortDescription}
            image={image}
            overlay={overlay}
            restaurantId={restaurantId}
            address={address}
            isOpen={isOpen}
            searchPage={searchPage}
            subscriber={subscriber}
            email={email}
            subscribe={this.subscribe.bind(this)}
            unsubscribe={this.unsubscribe.bind(this)}
        />
    }
    onKeyChange = (tabKey)=>{
        this.setState({tabKey });
    };

    onDisconnect = () =>{
        localStorage.removeItem('email');this.setState({ email: null});
    }

    render() {
        const loggedIn = Boolean(this.state.email);
        if (!loggedIn){
            return <LoginPage setState={this.setState.bind(this)} onLoggedIn={this.onLoggedIn.bind(this)}/>
        }
        console.log('app render, subscriptions:', this.state.subscriptions)
        return (
            <div>
                <div id="login-data">
                    <div>{this.state.email}</div>
                    <div> <span id="log-out-button" onClick={this.onDisconnect}>התנתקות</span></div>
                </div>
                <div id="main-header">
                   <u>תוסף לוולט</u>
                </div>
                <div id="secondary-header">
הירשמו לקבל התראה כשמסעדה נפתחת למשלוחים
                </div>
                <Tabs defaultActiveKey="search" id="uncontrolled-tab-example" style={{fontSize: isMobile ? "0.8em" : "1em"}} activeKey={this.state.tabKey} onSelect={this.onKeyChange} variant="pills">
                    <Tab eventKey="search" title="חיפוש מסעדות" >
                        <SearchTab search={this.search.bind(this)}
                                   myAddress={this.state.myAddress}
                                   onLoggedIn={this.onLoggedIn.bind(this)}
                                   searchWasClicked={this.state.searchWasClicked}
                                   results={this.state.results}
                                   getRestaurantDiv={this.getRestaurantDiv.bind(this)}/>

                    </Tab>
                    <Tab eventKey="subscriptions" title="רישומים" >
                       <SubscriptionsTab subscriptions={this.state.subscriptions}
                                         getRestaurantDiv={this.getRestaurantDiv.bind(this)}/>
                    </Tab>
                </Tabs>
                {this.state.thinking ? <div className="sivivator"> <img id="sivivator-gif" src='loading.gif'/></div>: <div></div>}
            </div>);
    }
}

export default App;

