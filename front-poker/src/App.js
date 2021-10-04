/* eslint-disable no-lone-blocks */
/* eslint-disable no-restricted-globals */
import React, { Component } from 'react';
import getSearchResults from './actions/getSearchResults';
import subscribeRestaurant from './actions/subscribeRestaurant';
import unsubscribeRestaurant from './actions/unsubscribeRestaurant';
import getSubscriptions from './actions/getSubscriptions';
import FacebookLogin from  'react-facebook-login/dist/facebook-login-render-props';
const GOOGLE_CLIENT_ID= '79744445247-r6hecpeic6csggbl5c40isiqfshf15l7.apps.googleusercontent.com';
const FACEBOOK_APP_ID= '4683699325055690';

import { GoogleLogin } from 'react-google-login';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

const isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
const location = {
    lat: localStorage.getItem('lat') || '32.083758287943695',
    lon: localStorage.getItem('lon') || '34.79441564530134',
}
function beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
}

function getLocation(){
    if (navigator.geolocation)
    {
        console.log('calling getCurrentPosition')
        navigator.geolocation.getCurrentPosition((position)=>{
            location.lat=position.coords.latitude;
            location.lon=position.coords.longitude;
             localStorage.setItem('lat', location.lat);
             localStorage.setItem('lon', location.lon);
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
        setTimeout(getLocation, 500);
        const searchRestaurantValue = localStorage.getItem('searchRestaurantValue') || '';
        setTimeout(async ()=>{
            const authData = localStorage.getItem('authData');
            if (authData){
                const {provider, token } = JSON.parse(authData);
                if (provider && token) {
                    const { subscriptions, userContext } = await getSubscriptions(provider, token)
                    this.setState({ subscriptions, email: userContext.email });
                }
            }
        },400)
        this.state = {
            email: null,
            searchRestaurantValue,
            results:[],
            subscriptions:[],
            tabKey:'search',
            searchWasClicked: false,
            thinking: false
        };
        //setInterval(this.checkForChanges,30000)
    }
    onSearchRestaurantValueChange = (event) => {
        this.setState({ searchRestaurantValue: event.target.value });
    }

    checkForChanges = async() => {
        const setState = this.setState.bind(this);
        if (!this.state.subscriptions) return;
        this.state.subscriptions.forEach(async (subscription)=>{
            const results = await getSearchResults(subscription.restaurantName, { lat: subscription.lat, lon: subscription.lon });
            const result = results.find(i => i.track_id === subscription.restaurantId);
            if (result && result.isOpen) {
                beep();
                setState({ tabKey: 'search' });
                alert(`${subscription.restaurantName} is now open`);
            } else{
                console.log('still close', subscription.restaurantName)
            }
        })
    }
    subscribe = async(name, restaurantId) => {
        const setState = this.setState.bind(this);
        setState({ thinking:true });
        const {provider, token } = JSON.parse(localStorage.getItem('authData'));

        setImmediate(async ()=>{
            console.log('about to subscribe for restaurant:', name, restaurantId)
            const subscriptions = await subscribeRestaurant(name, restaurantId, location, provider, token);
            console.log('subscriptions:', subscriptions);
            setState({ thinking:false, subscriptions, tabKey: 'subscriptions' });
        })
    }
    unsubscribe = async(name, restaurantId) => {
        const setState = this.setState.bind(this);
        setState({ thinking:true });
        const {provider, token } = JSON.parse(localStorage.getItem('authData'));

        setImmediate(async ()=>{
            if (confirm("Unsubscribe?")){
                console.log('about to unsubscribe for restaurant:', name, restaurantId);
                const subscriptions = await unsubscribeRestaurant(name, restaurantId, location, provider, token);
                console.log('subscriptions:', subscriptions);
                setState({ thinking:false, subscriptions, tabKey: 'subscriptions' });
            }else{
                setState({ thinking:false });
            }


        })
    }

    search = async() => {
        const setState = this.setState.bind(this);
        setState({ thinking:true });
        setImmediate(async ()=>{
            console.log('about to search for restaurant:', this.state.searchRestaurantValue)
            localStorage.setItem('searchRestaurantValue', this.state.searchRestaurantValue);
            const results = await getSearchResults(this.state.searchRestaurantValue, location);
            setState({ results, searchWasClicked:true, thinking:false });
        })
    }

    getRestaurantDiv = (title, image, overlay,restaurantId, address, isOpen, searchPage, email)=>{
        //console.log('getRestaurantDiv', title, image, overlay,restaurantId, address, isOpen, searchPage)
        const offline = !isOpen;

        return <div key={title} className={`col-xs-6 restaurant-result-div ${offline ?'offline':''} ${ isMobile ? 'mobile-width' : ''}`} onClick={()=> offline && searchPage ? this.subscribe(title, restaurantId) : !searchPage ? this.unsubscribe(title, restaurantId) : ()=>{}}>
            <div>{title}</div>
            <div> <img src={image}/></div>
            <div>{address}</div>
            {overlay && overlay.length ? <div className="overlay">{overlay}</div> : <span></span>}
            {offline && searchPage ? <div className="action-prompt">Click to Subscribe</div>: <span></span> }
            {!searchPage ? <div className="action-prompt">Click to Unsubscribe</div>: <span></span> }
            {!searchPage ? <div className="email-data">({email})</div>: <span></span> }
        </div>
    }
    onKeyChange = (tabKey)=>{
        this.setState({tabKey });
    };
    onLoginFailure = (error) => {
        console.error('App onFailure', error);
    };
    performLogin = async (provider, token) => {
        const setState = this.setState.bind(this);
        setState({ thinking:true });
        setImmediate(async ()=>{
            try{
                const {subscriptions, userContext} = await getSubscriptions(provider, token);
                this.setState({ subscriptions, email: userContext.email, thinking:false });
                const issueDate  = new Date();
                localStorage.setItem('authData', JSON.stringify({provider, token, issueDate }));
                localStorage.setItem('email', userContext.email);
            } catch(error) {
                localStorage.removeItem('authData');
                console.log('error', error)
                alert('failed to login');
                setState({ thinking:false });
            }

        })


    };

    googleResponse = (response) => {
        if (response.accessToken){
            this.performLogin('google', response.accessToken);
        }else{
            this.onLoginFailure('login failed')
        }

    };
    render() {
        console.log('render, state:', this.state)
        const loggedIn = Boolean(this.state.email);
        if (!loggedIn){
            const google = (<GoogleLogin
                clientId={GOOGLE_CLIENT_ID}
                onSuccess={this.googleResponse}
                onFailure={this.onLoginFailure}
                render={renderProps => (
                    <div className="login-button login-button-google" onClick={renderProps.onClick}> LOGIN WITH GOOGLE</div>
                )}
            />);
            //
            // const facebook = showFB ? (<FacebookLogin
            //     disableMobileRedirect={true}
            //     appId={FACEBOOK_APP_ID}
            //     autoLoad={false}
            //     fields="name,email,picture"
            //     callback={this.facebookResponse}
            //     render={renderProps => (
            //         <div id="fbButton" className="login-button login-button-fb" onClick={renderProps.onClick}> LOGIN WITH FACEBOOK</div>
            //     )}
            // />) :  <div className="login-button login-button-fb" onClick={()=>{ window.location = httpsUrl}}> LOGIN WITH FACEBOOK</div>;

            return <div id="login-page">
                <div id="login-page-header">
                    login page
                </div>
                <div id="login-body">
                    {google}
                </div>
            </div>
        }


        return (
            <div>
                <div id="login-data">
                    {this.state.email}<br/>
                    <span id="log-out-button" onClick={()=>{
                        localStorage.removeItem('email');
                        this.setState({ email: null});
                    }}>log out</span>
                </div>
                <div>
                    <h1><u>Wolt Helper</u></h1>
                </div>
                <Tabs defaultActiveKey="search" id="uncontrolled-tab-example" style={{fontSize: isMobile ? "0.8em" : "1em"}} activeKey={this.state.tabKey} onSelect={this.onKeyChange} variant="pills">
                    <Tab eventKey="search" title="search" >
                        <div>
                            <div id="search-restaurant-div">

                                <input type="text" id="search-restaurant-input" value={this.state.searchRestaurantValue} onChange={this.onSearchRestaurantValueChange} />
                                <button id="search-restaurant-button" onClick={this.search} disabled={this.state.searchRestaurantValue.length === 0}>search</button>
                            </div>
                            <div id="search-results">
                                { this.state.searchWasClicked ? <div>
                                    {this.state.results.length} restaurants found.
                                </div> : <div></div>}
                                <div className="row">
                                    {
                                        this.state.results.map((result) =>{
                                            const {title, image: {url: image}, overlay, track_id: restaurantId, venue: { address}, isOpen }= result;
                                            return this.getRestaurantDiv(title, image, overlay,restaurantId, address, isOpen, true);
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="subscriptions" title="subscriptions" >
                        <div>
                            <div>
                                {this.state.subscriptions.length} subscriptions
                            </div>
                            <div className="row">
                                {
                                    this.state.subscriptions.map(subscription =>{
                                        const { restaurantName: title, restaurantImage: image, restaurantId, restaurantAddress: address, email } = subscription;
                                         return this.getRestaurantDiv(title, image, null,restaurantId, address, false, false, email);
                                    })
                                }
                            </div>
                        </div>
                    </Tab>
                </Tabs>

                {this.state.thinking || true? <div className="sivivator"> <img id="sivivator-gif" src='loading.gif'/></div>: <div></div>}

            </div>);

    }
}

export default App;

