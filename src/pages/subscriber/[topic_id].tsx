import React, { useEffect, useState } from "react";
import mqtt, { type MqttClient } from "mqtt";
import { useRouter } from "next/router";

const MQTTClient: React.FC = () => {
  const router = useRouter();
  const { topic_id } = router.query as { topic_id: string };
  const topicId = topic_id;

  if (!topicId) {
    return <p>Topic ID not found</p>;
  }

  const [messages, setMessages] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Disconnected");
  const [channelInfo, setChannelInfo] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [client, setClient] = useState<MqttClient | null>(null);

  useEffect(() => {
    if (client) {
      return;
    }

    const connectToBroker = () => {
      const cli = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_BROKER_URL!, {
        username: process.env.NEXT_PUBLIC_MQTT_USERNAME!,
        password: process.env.NEXT_PUBLIC_MQTT_PASSWORD!,
      });

      cli.on("connect", () => {
        console.log("Connected to MQTT broker");
        setConnectionStatus("Connected");

        cli.subscribe(topicId);
        setChannelInfo(`${topicId}`);
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

      return cli;
    };

    const cli = connectToBroker();

    setClient(cli);

    return () => {
      cli?.end();
      setConnectionStatus("Disconnected");
      setChannelInfo("");
      setMessages([]);
      setError("");
    };
  }, []);

  return (
    <div>
      <h1>MQTT Client subscriber</h1>
      <p className="rounded-md border-2 border-gray-500 p-2">
        Connection Status: <span className="font-bold">{connectionStatus}</span>
      </p>
      <p className="rounded-md border-2 border-gray-500 p-2">
        Channel Info: <span className="font-bold">{channelInfo}</span>
      </p>

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
    </div>
  );
};

export default MQTTClient;
