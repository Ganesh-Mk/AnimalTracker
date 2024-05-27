import React from "react";
import mainimg from '../images/mainimg.png'
import Navbar from "../Components/Navbar";
import Middlesection from "../Components/Middlesection";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-full">
      <section className="w-full py-20 bg-[#f0f8ff] dark:bg-[#1f2937]">
        <div className="container h-auto px-4 md:px-6 flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-[#0077b6]">
            Track Your Animals Easily with Our Maps
          </h1>
          <p className="mt-4 max-w-3xl text-[#6b7280] dark:text-[#9ca3af]">
            Our cutting-edge animal tracking technology allows you to monitor
            the movements and behaviors of wild, marine, domestic, and avian
            species in real-time. Leverage our interactive maps to gain valuable
            insights and support conservation efforts.
          </p>
          <img
            alt="Hero Image"
            className="mt-8 rounded-xl shadow-lg w-[60vw]"
            src={mainimg}
            style={{
              aspectRatio: "800/400",
              objectFit: "cover",
            }}
          />
        </div>
      </section>
        <section>
          <Middlesection/>
        </section>
      <section className="w-full py-8 md:py-12 bg-[#f0f8ff] dark:bg-[#1f2937]">
        <div className="container h-auto px-4 md:px-6 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-[#0077b6]">
            Unlock the Power of Animal Tracking
          </h2>
          <p className="mt-4 max-w-3xl text-[#6b7280] dark:text-[#9ca3af]">
            Our intuitive maps and real-time tracking capabilities empower you
            to make informed decisions and take action to protect the animals
            you care about. Explore our solutions and start your journey towards
            more effective animal conservation.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/manage">
            <p
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#0077b6] px-6 py-2 text-sm font-medium text-[#f0f8ff] shadow transition-colors hover:bg-[#005b8f] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0077b6] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#f0f8ff] dark:text-[#0077b6] dark:hover:bg-[#d1e9ff] dark:focus-visible:ring-[#d1e9ff]"
              href="#"
            >
              Get Started
            </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
