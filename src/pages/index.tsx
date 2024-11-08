import { useState } from "react";
import localFont from "next/font/local";
import DataSelector from "../components/DataSelector";
import GenderChart from "../components/GenderChart";
import AgeChart from "../components/AgeChart";
import ScheduleVisualization from "../components/ScheduleVisualization";
import {
  processData,
  Person,
  processScheduleData,
} from "../utils/dataProcessing";

import gemmaData from "../data/gemma_collated_responses.json";
import llamaData from "../data/llama3_8b_collated_responses.json";
import qwenData from "../data/qwen_collated_responses.json";
import ScrollableList from "@/components/ScrollableList";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});


export default function Home() {
  const [selectedData, setSelectedData] = useState("gemma");
  const data = selectedData === "gemma" 
    ? gemmaData 
    : selectedData === "llama" 
      ? llamaData
      : qwenData;
  const { genderData, ageData, nameData, locationData, jobData } = processData(
    data as Person[]
  );
  const scheduleData = processScheduleData(data as Person[]);

  return (
    <div
      className={`${geistSans.variable} font-[family-name:var(--font-geist-sans)] p-8`}
    >
      <DataSelector
        selectedData={selectedData}
        setSelectedData={setSelectedData}
      />
        <h1 className="text-3xl font-bold mt-16 mb-4">&quot;Imagine a person...&quot;</h1>
      <div className="mb-4 text-base">
        <p className="text-lg mb-8">
          What happens when you ask LLMs to imagine a person and 
          a random day in their life, 100 times over?
        </p>
        <p className="max-w-[65ch]">I asked small versions of Llama3.1, Gemma2 & Qwen2.5 to imagine a person, a hundred times over, using the same prompt. The prompt asks for basic details, such as name, age and location, and then asks the AI for a random day in that person&apos;s life.</p>
        <details className="my-2 mt-4 mb-4">

          <summary className="underline cursor-pointer">
            Click here to view the original prompt
          </summary>
          <pre className="text-white bg-slate-900 rounded-md py-3 px-4 mt-2">
            Imagine a person with the following details:
            <br />
            <br />
            Name
            <br />
            Gender
            <br />
            Age
            <br />
            Location (Country)
            <br />
            Brief backstory (1-2 sentences)
            <br />
            <br />
            Describe a random day from their life using this format:
            <br />
            <br />
            Time: [HH:MM]
            <br />
            Activity: [Brief description]
            <br />
            <br />
            Start with when they wake and end with when they go to sleep.
            Include as many time entries as possible, be very specific.
            <br />
            Example output:
            <br />
            <br />
            Name: [Name]
            <br />
            Gender: [Gender]
            <br />
            Age: [Age]
            <br />
            Location: [Country] <br />
            Backstory: [Brief backstory]
            <br />
            Day: <br />
            <br />
            Time: [HH:MM]
            <br />
            Activity: [Activity description]
            <br />
            (Repeat this format for each time entry)
          </pre>
        </details>
        <p className="max-w-[65ch]">
          I processed the responses of the LLM with Claude Haiku to turn the result
          into JSON, which is then visualised on this webpage. You can switch between models using the dropdown in the top right of the screen.
        </p>
        <p className="text-xl font-bold mt-8 mb-2">Caveats</p>
        <p  className="max-w-[65ch]">
          This is just for fun. These language models are running on my local
          machine, using quantized versions of the original models (llama3.1 8b
          Q4_0, gemma2 2b Q4_0, qwen2.5 7b Q4_K_M). I&apos;ve set the temperature of my requests to 1.0.
          Using the unquantized model, experimenting with temperature values or simply changing the prompt would hopefully provide more varied, creative responses.
        </p>
      </div>
      <h2 className="text-2xl font-bold mb-2 mt-8">Age & Gender</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 mt-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Gender Distribution</h3>
          <GenderChart data={genderData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Age Distribution</h3>
          <AgeChart data={ageData} />
        </div>
      </div>
      <div className="my-4 max-w-[65ch]">
      <ul className="list-disc pl-6 space-y-2">
        <li className="text-gray-800">
          Small LLMs seem to believe that only people between
          the ages of 25-35 exist.
        </li>
        <li className="text-gray-800">
          Llama3 only managed to imagine one human who was male - Akira Saito, a 32
          year old Japanese freelance graphic designer.
        </li>
        <li className="text-gray-800">
          No model was able to imagine a world outside the gender binary, at
          least in these first 100 responses.
        </li>
      </ul>
      </div>
      <h2 className="text-2xl font-bold mb-2 mt-8">Names, Locations, Jobs</h2>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollableList data={nameData} title="Name Distribution" />
          <ScrollableList data={locationData} title="Location Distribution" />
          <ScrollableList data={jobData} title="Job Distribution" />
          <ul className="list-disc pl-6 space-y-2">
          <li className="text-gray-800">
              I did a quick search and it turns out <a className="text-blue-600 hover:text-blue-800 underline" href="https://www.amazon.co.uk/stores/author/B0DFCPV6Z1?ingress=0&visitId=7dabcc37-e285-4d35-ba19-e81d65764888">Anya Petrova has an Amazon bookseller&apos;s page</a> with a lot of short stories and Stable Diffiusion inspired cover art. This may be a fully automated business setup.
            </li>
            <li className="text-gray-800">
              The US models don&apos;t imagine anyone living in China, while Qwen 2.5 couldn&apos;t imagine anyone living anywhere else.
            </li>
            <li className="text-gray-800">
              Llama imagines a third of the workforce as freelance graphic designers, while Qwen imagines that it&apos;s at least 80% software engineering. 
            </li>
          </ul>
          </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Random day visualizer</h2>
        <p>
          Each row represents a person&apos;s schedule for a random day in their
          life.
        </p>
        <p className="mb-4">
          You can click on a row to view the all the information for that person in an overview window, shown beneath the graph.
        </p>
        <ScheduleVisualization
          scheduleData={scheduleData}
          fullData={data as Person[]}
        />
      </div>
      <h2 className="text-2xl font-bold mb-2 mt-8">Similar work & next steps</h2>
      <p className="max-w-[65ch]">I stumbled upon a similar experiement investigating ChatGPT bias - <a className="text-blue-600 hover:text-blue-800 underline" href="https://github.com/timetospare/gpt-bias">timetospare / gpt-bias</a>. I&apos;m afraid I&apos;m otherwise not clued into the latest research in this space. I otherwise love the ability of using data visualisation to get a quick glance into the character of different models, within the context of a prompt - it would be awesome to see how much different prompts can create better, more diverse outputs.</p>
      <p className="max-w-[65ch] mt-4">
        It would be good to have a benchmark to track the diversity of LLM responses and then compare how well SOTA models perform. Diversity in output responses does not necessarily mean the model is more creative, but it may be a useful indicator of bias.
      </p>
      <h2 className="text-2xl font-bold mb-2 mt-8">Source code</h2>
      <p className="max-w-[65ch]">All the source code for this project <a className="text-blue-600 hover:text-blue-800 underline" href="https://github.com/jhancock532/imaginary-people/">can be found on GitHub</a>, including the original AI responses and how Haiku processed them.</p>

      <p className="mt-4">Thank you for visiting! A mini project by <a className="text-blue-600 hover:text-blue-800 underline" href="https://github.com/jhancock532">James Hancock</a>.</p>
    </div>
  );
}
