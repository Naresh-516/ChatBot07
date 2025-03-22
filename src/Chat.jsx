import React, { useContext, useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from 'react-markdown';
import { ThemeContext } from './App';
import send from './assets/send.svg'
import './App.css'
function Chat() {
    const [input, setInput] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const { dark, setDark } = useContext(ThemeContext);
    const [loading, setLoading] = useState(false);
    const API_Key=import.meta.env.VITE_GEMINI_API_KEY;
    

    const handleSubmit = async () => {
        if (input.trim()) {
            try {
                const genAI = new GoogleGenerativeAI(API_Key);
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                setLoading(true); // Set loading to true when request starts
                const result = await model.generateContent(input);
                const res = await result.response.text();

                if (res) {
                    setLoading(false); // Set loading to false once response is received
                    setChatHistory([...chatHistory, { question: input, answer: res }]);
                    setInput(""); // Clear input field after sending
                }
            } catch (err) {
                console.error("Error fetching AI response:", err);
                setLoading(false); // Ensure loading is stopped on error
            }
        }
    };

    return (
        <div id="chat" className="flex flex-col flex-grow h-screen p-5 bg-gray-100 w-full">
            <div className={`p-4 flex justify-between items-center ${dark ? "bg-black text-white" : "bg-gray-200 text-black"}`}>
                <h1 className="text-xl font-semibold text-center flex-1">ChatBot</h1>
                <button
                    onClick={() => setDark(!dark)}
                    className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
                >
                    {dark ? "☀️" : "🌙"}
                </button>
            </div>

            <div className={`flex-grow overflow-y-auto ${dark?" bg-gray-950":"bg-gray-50"}`}>
                {chatHistory.length > 0 ? chatHistory.map((msg, index) => (
                    <div key={index}>
                        <div className="p-3 rounded-lg my-2 flex justify-start">
                            <div className={`${dark ? "bg-blue-500 text-white" : "bg-blue-200 text-black"} p-3 rounded-lg shadow-lg max-w-xs gap-5 ml-0`}>
                                {msg.question}
                            </div>
                        </div>
                        <div className="p-3 rounded-lg my-2 flex justify-end">
                            <div id={msg.question} className={`max-w-lg p-3 rounded-lg gap-5 ${dark ? "bg-gray-500 text-white" : "bg-gray-300 text-black"}`}>
                                <Markdown>{msg.answer}</Markdown>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="justify-center align-center flex text-4xl font-bold text-blue-600">Hello,Welcome to ChatBot</div>
                )}
            </div>
            {/* Show loader when loading */}
            {loading && (
                <div className="flex justify-center items-center p-3">
                    <div className="loader"></div> {/* Customize loader class as per your design */}
                </div>
            )}

            <div className={`flex justify-center items-center p-3 gap-6 ${dark ? "bg-black text-white" : "bg-gray-200 text-black"}`}>
            <input
  className="bg-white text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
  type="text"
  placeholder="Message ChatBot..."
  value={input}
  onChange={(e) => setInput(e.target.value)}
/>

               <button
  onClick={handleSubmit}
  disabled={input.length === 0}
  className={`bg-blue-400 rounded ${input.length > 0 ? "cursor-pointer" : "cursor-not-allowed"} p-2`}>
<img src={send} alt='Send'></img>
</button>
<button  className={`bg-blue-400 rounded ${chatHistory.length > 0 ? "cursor-pointer" : "cursor-not-allowed"} p-2`} onClick={()=>setChatHistory([])}>Clear</button>
            </div>
        </div>
    );
}

export default Chat;
