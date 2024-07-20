import {Link} from "react-router-dom"
import { Spotlight } from "./ui/Spotlight"
import { Button } from "./ui/moving-border";
import { BackgroundBeams } from "./ui/background-beams";
import { BackgroundGradient } from "./ui/background-gradient"
import {technologyUsed} from "../helper/helper"

function HomeNotLogin() {
  return (
    <>
    <div
    className="h-auto md:h-[40rem] w-full rounded-md flex flex-col items-center justify-center relative overflow-hidden mx-auto py-10 md:py-0"
    >
        <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="blue"
      />
        <div className="p-4 relative z-10 w-full text-center" >
            <h1
            className="mt-20 md:mt-0 text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b pb-5 from-gray-950 to-gray-500 dark:from-neutral-50 dark:to-neutral-400"
            >Share Your Learning Experiences</h1>
            <p
            className="mt-4 font-normal text-base text-gray-800 dark:text-neutral-400 max-w-lg mx-auto"
            >Discover our innovative social media platform, where sharing your learnings and experiences takes center stage. Connect with a community eager to exchange knowledge, gain insights, and grow together. Whether you're mastering a new skill or sharing life lessons, our platform empowers you to inspire and be inspired. Join us and make every experience count!</p>
            <div className="mt-4">
                <Link to={"/signup"}>
                    <Button
                    borderRadius="1.75rem"
                    className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800"
                    >
                    Join Us Now
                    </Button>
                </Link>
            </div>
        </div>
        <BackgroundBeams />
        </div>

        
        <div className="py-12 bg-gray-200 dark:bg-gray-900">
        <div>
            <div className="text-center">
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-700 dark:text-white sm:text-4xl">
                Technology Used
                </p>
            </div>
        </div>
        <div className="mt-10 mx-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                {technologyUsed.map((course)=> (
                    <div key={course.id} className="flex justify-center">
                        <BackgroundGradient
                        className="flex flex-col rounded-[22px] bg-white dark:bg-zinc-900 overflow-hidden h-full max-w-sm">
                            <img
                            src={course.image}
                            alt="Course img"
                            height="300"
                            width="400"
                            className="object-contain"
                            />
                            <div className="px-4 sm:px-6 flex flex-col items-center text-center flex-grow">
                                <p className="text-lg sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">{course.title}</p>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 flex-grow">{course.description}</p>
                                <a href={course.slug} target="_blank"
                                className="px-4 py-2 my-4 bg-gray-700 rounded-lg dark:bg-white text-white dark:text-black border-neutral-600 border-2" >
                                Learn More
                                </a>
                            </div>
                        </BackgroundGradient>
                    </div>
                ))}
            </div>
        </div>
    </div>
    </>
  )
}

export default HomeNotLogin;