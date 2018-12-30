import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  Card, 
  Button, 
  CardTitle, 
  CardText, 
  Form, 
  FormGroup, 
  Label, 
  Input } from 'reactstrap';
import L from 'leaflet';
import './App.css';
import userLocationURL from './user-location.svg';
import spin from './Spin.svg';
import Joi from 'joi';

const schema = Joi.object().keys({
  name: Joi.string().min(1).max(100).required(),
  message: Joi.string().min(1).max(500).required(),
});
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1/messages' : 'producion-url-here';
var myIcon = L.icon({
  iconUrl: userLocationURL,
  iconSize: [50, 82],
  iconAnchor: [12.5, 40],
  popupAnchor: [-10, -90],
});
class App extends Component {
  state = {
    location: {
      lat: 29.7604,
      lng: -95.3698,
    },
    haveUsersLocation: false,
    zoom: 2,
    userMessage: {
      name: '',
      message: '',
    },
    sendingMessage: false,
    sentMessage: false
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position)=> {
      this.setState({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.latitude
        }, 
        haveUsersLocation: true,
        zoom: 13
      });
    }, () => {
      console.log('No location');
      fetch('https://ipapi.co/json')
        .then(res => res.json())
        .then(location => {
          this.setState({
            location: {
              lat: location.latitude,
              lng: location.latitude
            }, 
            haveUsersLocation: true,
            zoom: 13
          });
        });
    });
  }
  formIsValid = () => {
    const userMessage = {
      name: this.state.userMessage.name,
      message: this.state.userMessage.message,
    };
    const result = Joi.validate(userMessage, schema);
    return !result.error && this.state.haveUsersLocation ? true : false;
  }
  formSubmitted = (event) => {
    event.preventDefault();
    
    if(this.formIsValid()) {
      this.setState({
        sendingMessage: true,
      });
      fetch(API_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name: this.state.userMessage.name,
          message: this.state.userMessage.message,
          latitude: this.state.location.lat,
          longitude: this.state.location.lng,
        })
      }).then(res => res.json())
      .then(message => {
        console.log(message);
        setTimeout(() => {
          this.setState({
          sendingMessage: false,
          sentMessage: true
          });
        }, 5000);
      });
    }
  }
  valueChanged = (event) => {
    const {name, value} = event.target;
    this.setState((prevState)=> ({
      userMessage: {
        ...prevState.userMessage,
        [name]: value
      }
    }))
  }
  render() {
    const position = [this.state.location.lat, this.state.location.lng];
    return (
      <div className="map">
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {
            this.state.haveUsersLocation ?
            <Marker position={position} icon={myIcon}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker> : ''
          }
        </Map>
        <Card className="message-form" body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
          <CardTitle>Welcome to ChattingMap!</CardTitle>
          <CardText>Leave a message with your location.</CardText>
          {
            !this.state.sendingMessage && !this.state.sentMessage ? 
            <Form onSubmit={this.formSubmitted}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input onChange={this.valueChanged} type="text" name="name" id="name" placeholder="Enter your name"></Input>
              </FormGroup>
              <FormGroup>
                <Label for="message">Message</Label>
                <Input onChange={this.valueChanged} type="textarea" name="message" id="message" placeholder="Enter a message"></Input>
              </FormGroup>
              <Button type="submit"color="info" disabled={!this.formIsValid()}>Send</Button>
            </Form> :
            this.state.sendingMessage ?
            <img alt = "" src={spin}/> :
            <CardText>Thanks for submitting a message!</CardText>
          } 
        </Card>
      </div>
    );
  }
}

export default App;
