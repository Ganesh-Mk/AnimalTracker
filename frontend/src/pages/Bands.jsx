import React from "react"
import bird from '../images/bird.webp'
import deer from '../images/deer.webp'
import fox from '../images/fox.webp'
import rabit from '../images/rabit.webp'
import racoon from '../images/racoon.webp'
import squirrel from '../images/squirrel.webp'

export default function Bands() {
  return (
    <section className="bg-gray-100  dark:bg-gray-950 py-16 md:py-24 lg:py-32">
      <div className="container h-auto mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center text-center  space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Track Your Animal Friends</h2>
            <p className="max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
              Discover the latest radio collar technology to monitor the location and well-being of your favorite
              animals.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
              <img src={deer} alt="Deer Collar" className="w-full p-5 h-64 object-contain" />
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-semibold">Deer Collar</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">$99.99</p>
                <a href="https://www.dhgate.com/product/walkie-talkie-radtel-rt-890-noaa-weather/895198131.html?f=bm%7CGMC%7C%7Bifdyn:dyn%7D%7Bifpla:pla%7D%7Bifdbm:DBM%7D%7C%7Bcampaignid%7D%7C%7Badgroupid%7D%7C895198131%7C%7Btargetid%7D%7C103011002%7CUS%7Ckang04%7C%7Bdevice%7D%7C2%7C%7Bgclid%7D%7C&utm_source=%7Bifdyn:dyn%7D%7Bifpla:pla%7D%7Bifdbm:DBM%7D&utm_medium=GMC&utm_campaign=kang04&utm_term=895198131&abVersion=538" target="_blank"><button className="w-full h-[3vw] text-center">Buy</button></a>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
            <img src={rabit} alt="Deer Collar" className="w-full p-5 h-64 object-contain" />              <div className="p-6 space-y-3">
                <h3 className="text-xl font-semibold">Rabbit Collar</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">$79.99</p>
                <a target="_blank" href="https://www.uniqkart.in/products/smart-gps-tracker-gsm-pet-position-collar-ip67-protection-multiple-positioning-mode-geo-fence-sos-realtime-tracker-anti-lost-tracking-alarm?variant=46583271555381&currency=INR&utm_medium=product_sync&utm_source=google&utm_content=sag_organic&utm_campaign=sag_organic&srsltid=AfmBOorPS9sXhzAiGM4sW-Ue5hu9vbMYXHmWcUVSnLbxXIJeyjuVS7cJtMA&com_cvv=d30042528f072ba8a22b19c81250437cd47a2f30330f0ed03551c4efdaf3409e"><button className="w-full h-[3vw] text-center">Buy</button></a>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
            <img src={bird} alt="Deer Collar" className="w-full p-5 h-64 object-contain" />              <div className="p-6 space-y-3">
                <h3 className="text-xl font-semibold">Bird Tracker</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">$129.99</p>
                <a target="_blank" href="https://www.uniquebud.com/products/c68-high-quality-app-control-dog-cat-training-gps-tracker-pet-collar?currency=INR&variant=43705192218904&utm_source=google&utm_medium=cpc&utm_campaign=Google%20Shopping&stkn=401c28db011a&srsltid=AfmBOop2sr03EG6AYi9wd7nkrceDp3PePiRLiNU7kpDt54TOE4IuexXE9ow"><button className="w-full h-[3vw] text-center">Buy</button></a>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
            <img src={racoon} alt="Deer Collar" className="w-full h-64 object-contain" />              <div className="p-6 space-y-3">
                <h3 className="text-xl font-semibold">Raccoon Collar</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">$89.99</p>
                <a target="_blank" href="https://www.getuscart.com/petrainer-pet998drb2-dog-training-collar-with-remote-for-2-dogs-rechargeable-waterproof-dog-remote-collar-with-beep-vibration-and-static-electronic-dog-collar-1000-ft-range?srsltid=AfmBOoqo2XJ6tmin9_vJxmuLg5AYCcHxhAEBz0wE6GOGo4PY9orQ0xkeUlw"><button className="w-full h-[3vw] text-center border-[2px solid black]">Buy</button></a>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
            <img src={fox} alt="Deer Collar" className="w-full h-64 p-5 object-contain" />              <div className="p-6 space-y-3">
                <h3 className="text-xl font-semibold">Fox Tracker</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">$119.99</p>
                <a target="_blank" href="https://www.alibaba.com/pla/HUNTING-DOG-GPS-TRACKER-WATERPROOF-COLLAR_60500907529.html?mark=google_shopping&biz=pla&searchText=Navigation+GPS&product_id=60500907529&seo=1"><button className="w-full h-[3vw] text-center">Buy</button></a>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
            <img src={squirrel} alt="Deer Collar" className="w-full h-64 p-5 object-contain" />              <div className="p-6 space-y-3">
                <h3 className="text-xl font-semibold">Squirrel Collar</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">$69.99</p>
                <a target="_blank" href="https://www.ubuy.com.gr/en/product/2XZWGBOW-petsafe-big-dog-remote-training-collar-for-medium-and-large-dogs-over-40-lb-with-tone-and-static-cor?srsltid=AfmBOorFD5UQXAUkhnZ-zFxRGAeTqaTnnjfeAbkdCSGtmktZ31RVWyoYFnE"><button className="w-full h-[3vw] text-center">Buy</button></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}