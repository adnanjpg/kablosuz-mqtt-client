import React, { useEffect, useState } from "react";
import mqtt, { type MqttClient } from "mqtt";

const MQTTClient: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Disconnected");
  const [channelInfo, setChannelInfo] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [client, setClient] = useState<MqttClient | null>(null);

  useEffect(() => {
    const connectToBroker = () => {
      const cli = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_BROKER_URL!, {
        username: process.env.NEXT_PUBLIC_MQTT_USERNAME!,
        password: process.env.NEXT_PUBLIC_MQTT_PASSWORD!,
      });

      cli.on("connect", () => {
        console.log("Connected to MQTT broker");
        setConnectionStatus("Connected");
        const topic = "your-own-topic"; // Replace with your desired topic/channel
        cli.subscribe(topic);
        setChannelInfo(`Subscribed to ${topic}`);
        setError(""); // Reset error on successful connection
      });

      cli.on("message", (topic, message) => {
        const incomingMessage = `Received message on topic ${topic}: ${message.toString()}`;
        console.log(incomingMessage);
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      });

      cli.on("error", (err) => {
        setError(`MQTT client error: ${err.message}`);
      });

      setClient(cli);
    };

    connectToBroker();

    return () => {
      client?.end();
      setConnectionStatus("Disconnected");
      setChannelInfo("");
      setMessages([]);
      setError("");
    };
  }, []);

  const sendMessage = (topic: string, payload: string) => {
    if (client && client.connected) {
      client.publish(topic, payload);
    } else {
      setError("MQTT client is not connected.");
      console.error("MQTT client is not connected.");
    }
  };

  return (
    <div>
      <h1>MQTT Client</h1>
      <p className="rounded-md border-2 border-gray-500 p-2">
        Connection Status: {connectionStatus}
      </p>
      <p className="rounded-md border-2 border-gray-500 p-2">
        Channel Info: {channelInfo}
      </p>
      {/* box using tailwind */}
      <div className="rounded-md border-2 border-gray-500 p-2">
        <h2>Incoming Messages</h2>
        <ul>
          {messages.length > 0
            ? messages.map((message, index) => <li key={index}>{message}</li>)
            : "No messages yet"}
        </ul>
      </div>
      {error && (
        <div>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}

      <button
        className="rounded-md border-2 border-gray-500 p-2"
        onClick={() => sendMessage("your-own-topic", "Your message here")}
      >
        Send Message
      </button>
    </div>
  );
};

export default MQTTClient;
