import React, { useEffect, useState } from "react";
import mqtt, { type MqttClient } from "mqtt";

const MQTTClient: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Disconnected");
  const [channelInfo, setChannelInfo] = useState<string>("");

  let client: MqttClient | null = null;

  useEffect(() => {
    const connectToBroker = () => {
      client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_BROKER_URL!, {
        username: process.env.NEXT_PUBLIC_MQTT_USERNAME!,
        password: process.env.NEXT_PUBLIC_MQTT_PASSWORD!,
      });

      client.on("connect", () => {
        console.log("Connected to MQTT broker");
        setConnectionStatus("Connected");
        const topic = "your-own-topic"; // Replace with your desired topic/channel
        client!.subscribe(topic);
        setChannelInfo(`Subscribed to ${topic}`);
      });

      client.on("message", (topic, message) => {
        const incomingMessage = `Received message on topic ${topic}: ${message.toString()}`;
        console.log(incomingMessage);
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      });
    };

    connectToBroker();

    return () => {
      client?.end();
      setConnectionStatus("Disconnected");
      setChannelInfo("");
      setMessages([]);
    };
  }, []);

  const sendMessage = (topic: string, payload: string) => {
    if (client && client.connected) {
      client.publish(topic, payload);
    } else {
      console.error("MQTT client is not connected.");
    }
  };

  return (
    <div>
      <h1>MQTT Client</h1>
      <p>Connection Status: {connectionStatus}</p>
      <p>Channel Info: {channelInfo}</p>
      <div>
        <h2>Incoming Messages</h2>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => sendMessage("your-own-topic", "Your message here")}
      >
        Send Message
      </button>
    </div>
  );
};

export default MQTTClient;
