// src/services/signalRService.js

import * as signalR from '@microsoft/signalr';
import { toast } from 'react-toastify';

class SignalRService {
  constructor() {
    this.connection = null;
    this.listeners = {};
  }

  // Initialize the SignalR connection
  async startConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://asp-dotnet-projects.onrender.com/trackingHub') // Replace with your actual hub URL
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Register handlers
    this.connection.on('ReceiveGroupLocation', this.handleReceiveGroupLocation.bind(this));
    this.connection.on('ReceiveGroupNotification', this.handleReceiveGroupNotification.bind(this));

    // Handle connection lifecycle events
    this.connection.onreconnecting(() => {
      toast.info('Reconnecting to the server...');
    });

    this.connection.onreconnected(() => {
      toast.success('Reconnected to the server.');
    });

    this.connection.onclose(() => {
      toast.error('Disconnected from the server.');
    });

    try {
      await this.connection.start();
      console.log('Connected to SignalR Hub');
      toast.success('Connected to the server.');
    } catch (err) {
      console.error('Connection failed: ', err);
      toast.error('Failed to connect to the server.');
    }
  }

  // Handle incoming group location data
  handleReceiveGroupLocation(deviceId, latitude, longitude) {
    if (this.listeners['ReceiveGroupLocation']) {
      this.listeners['ReceiveGroupLocation'](deviceId, latitude, longitude);
    }
  }

  // Handle incoming group notifications
  handleReceiveGroupNotification(message) {
    if (this.listeners['ReceiveGroupNotification']) {
      this.listeners['ReceiveGroupNotification'](message);
    }
    toast.info(message);
  }

  // Join a specific group
  async joinGroup(groupName) {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke('JoinGroup', groupName);
        console.log(`Joined group: ${groupName}`);
        toast.success(`Joined group: ${groupName}`);
      } catch (err) {
        console.error('Error joining group:', err);
        toast.error('Failed to join the group.');
      }
    } else {
      toast.warn('Not connected to the server.');
    }
  }

  // Leave a specific group
  async leaveGroup(groupName) {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke('LeaveGroup', groupName);
        console.log(`Left group: ${groupName}`);
        toast.info(`Left group: ${groupName}`);
      } catch (err) {
        console.error('Error leaving group:', err);
        toast.error('Failed to leave the group.');
      }
    } else {
      toast.warn('Not connected to the server.');
    }
  }

  // Send location to a specific group
  async sendGroupLocation(groupName, deviceId, latitude, longitude) {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke('SendGroupLocation', groupName, deviceId, latitude, longitude);
        console.log(`Location sent to group ${groupName}:`, deviceId, latitude, longitude);
      } catch (err) {
        console.error('Error sending group location:', err);
        toast.error('Failed to send location to the group.');
      }
    } else {
      toast.warn('Not connected to the server.');
    }
  }

  // Register event listeners
  on(methodName, callback) {
    this.listeners[methodName] = callback;
  }

  // Remove event listeners
  off(methodName) {
    delete this.listeners[methodName];
  }
}

const signalRService = new SignalRService();
export default signalRService;
