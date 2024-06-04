import React from "react"
import { Button } from "@/components/ui/button"

export default function Bands() {
  return (
    <section className="bg-gray-100 dark:bg-gray-950 py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Track Your Animal Friends</h2>
            <p className="max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
              Discover the latest radio collar technology to monitor the location and well-being of your favorite
              animals.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
              <img src="/placeholder.svg" alt="Deer Collar" className="w-full h-64 object-cover" />
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-semibold">Deer Collar</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">$99.99</p>
                <div className="flex items-center space-x-2">
                  <span>Size:</span>
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                </div>
                <button className="">Buy</button>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
              <img src="/placeholder.svg" alt="Rabbit Collar" className="w-full h-64 object-cover" />
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-semibold">Rabbit Collar</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">$79.99</p>
                <div className="flex items-center space-x-2">
                  <span>Size:</span>
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                </div>
                <Button variant="outline" className="w-full">
                  Buy Now
                </Button>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
              <img src="/placeholder.svg" alt="Bird Tracker" className="w-full h-64 object-cover" />
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-semibold">Bird Tracker</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">$129.99</p>
                <div className="flex items-center space-x-2">
                  <span>Size:</span>
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                </div>
                <Button variant="outline" className="w-full">
                  Buy Now
                </Button>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
              <img src="/placeholder.svg" alt="Raccoon Collar" className="w-full h-64 object-cover" />
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-semibold">Raccoon Collar</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">$89.99</p>
                <div className="flex items-center space-x-2">
                  <span>Size:</span>
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                </div>
                <Button variant="outline" className="w-full">
                  Buy Now
                </Button>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
              <img src="/placeholder.svg" alt="Fox Tracker" className="w-full h-64 object-cover" />
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-semibold">Fox Tracker</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">$119.99</p>
                <div className="flex items-center space-x-2">
                  <span>Size:</span>
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                </div>
                <Button variant="outline" className="w-full">
                  Buy Now
                </Button>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
              <img src="/placeholder.svg" alt="Squirrel Collar" className="w-full h-64 object-cover" />
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-semibold">Squirrel Collar</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">$69.99</p>
                <div className="flex items-center space-x-2">
                  <span>Size:</span>
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                </div>
                <Button variant="outline" className="w-full">
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}