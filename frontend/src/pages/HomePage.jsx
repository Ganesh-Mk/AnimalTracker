import React from "react";
import mainimg from '../images/mainimg.png'
import Navbar from "../Components/Navbar";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-full">
      <Navbar/>
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
      <section className="w-full py-4 md:py-6 h-">
        <div className="container px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 h-auto">
          <div className="flex flex-col items-center text-center">
            <svg
              className="h-12 w-12 text-[#6b7280] dark:text-[#2b2b2b]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <h3 className="mt-2 text-xl font-semibold text-[#0077b6]">
              Protect Wild Animals
            </h3>
            <p className="mt-1 text-[#6b7280] dark:text-[#2b2b2b]">
              Leverage our cutting-edge technology to monitor and protect
              endangered species in their natural habitats. Our interactive maps
              provide real-time insights into animal movements, allowing you to
              take immediate action to safeguard vulnerable populations.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <svg
              className="h-12 w-12 text-[#6b7280] dark:text-[#2b2b2b]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <h3 className="mt-2 text-xl font-semibold text-[#0077b6]">
              Track Marine Animals
            </h3>
            <p className="mt-1 text-[#6b7280] dark:text-[#2b2b2b]">
              Gain insights into the movements and behaviors of marine life to
              support conservation efforts. Our maps integrate seamlessly with
              underwater tracking devices, allowing you to monitor the migration
              patterns and habitat usage of aquatic species.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <svg
              className="h-12 w-12 text-[#6b7280] dark:text-[#2b2b2b]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <h3 className="mt-2 text-xl font-semibold text-[#0077b6]">
              Monitor Domestic Animals
            </h3>
            <p className="mt-1 text-[#6b7280] dark:text-[#2b2b2b]">
              Ensure the safety and well-being of your pets with our reliable
              tracking solutions. Our interactive maps allow you to locate your
              furry friends in real-time, providing peace of mind and helping
              you keep your loved ones safe.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <svg
              className="h-12 w-12 text-[#6b7280] dark:text-[#2b2b2b]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <h3 className="mt-2 text-xl font-semibold text-[#0077b6]">
              Protect Birds
            </h3>
            <p className="mt-1 text-[#6b7280] dark:text-[#2b2b2b]">
              Gain insights into bird migration patterns and support
              conservation efforts for avian species. Our maps integrate with
              advanced tracking devices, allowing you to monitor the movements
              and behaviors of birds across their habitats and migratory routes.
            </p>
          </div>
        </div>
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
            <a
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#0077b6] px-6 py-2 text-sm font-medium text-[#f0f8ff] shadow transition-colors hover:bg-[#005b8f] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0077b6] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#f0f8ff] dark:text-[#0077b6] dark:hover:bg-[#d1e9ff] dark:focus-visible:ring-[#d1e9ff]"
              href="#"
            >
              Get Started
            </a>
            <a
              className="inline-flex h-10 items-center justify-center rounded-md border border-[#d1e9ff] border-[#d1e9ff] bg-[#f0f8ff] px-6 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-[#d1e9ff] hover:text-[#0077b6] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0077b6] disabled:pointer-events-none disabled:opacity-50 dark:border-[#334155] dark:border-[#334155] dark:bg-[#1f2937] dark:hover:bg-[#334155] dark:hover:text-[#f0f8ff] dark:focus-visible:ring-[#d1e9ff]"
              href="#"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
