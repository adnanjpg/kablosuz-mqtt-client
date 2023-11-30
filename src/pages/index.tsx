import { useState } from "react";

export default function Home() {
  const [topicId, setTopicId] = useState<string>("");

  return (
    <>
      <input
        className="m-2 rounded-md border-2 border-gray-500 p-2"
        type="text"
        placeholder="Enter topic ID"
        value={topicId}
        onChange={(e) => setTopicId(e.target.value)}
      />
      <button
        disabled={!topicId}
        className="m-2 rounded-md border-2 border-pink-500 bg-pink-500 p-2 text-white disabled:opacity-50"
        onClick={() => {
          if (topicId) {
            window.location.href = `/receiver/${topicId}`;
          }
        }}
      >
        Go to Receiver
      </button>
      <button
        disabled={!topicId}
        className="m-2 rounded-md border-2 border-blue-500 bg-blue-500 p-2 text-white disabled:opacity-50"
        onClick={() => {
          if (topicId) {
            window.location.href = `/sender/${topicId}`;
          }
        }}
      >
        Go to Sender
      </button>
    </>
  );
}
