/**TYG*/
import { Github, Rocket } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center py-5">
        <Link className="flex items-center justify-center" href="#">
          <MicIcon className="h-6 w-6" />
          <span className="ml-2">useVoice.AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" target="_blank" href="https://github.com/amulyaparmar/usephone.ai-TYG/">
            Repo
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4"  target="_blank" href="https://amulya.co">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4"  target="_blank" href="mailto:parmar.amulya@gmail.com">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">


     
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[500px_1fr] lg:gap-12 xl:grid-cols-[550px_1fr]">
              <img
                alt="Dialer and Recorder"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                height="310"
                src="https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/2aba7535-1916-4401-0a3f-5e38cfd48c00/big"
                width="550"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-[#5c6ac4] px-3 py-1 text-sm text-gray-50 dark:bg-[#5c6ac4]">
                    Dialer and Recorder
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Create real AI roleplays for your leasing team</h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Leverage our built-in dialer and smart audio recorder to simplify your call management process.
                    Record, transcribe, and analyze calls with ease.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[#5c6ac4] px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-[#5c6ac4]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5c6ac4] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#5c6ac4] dark:text-gray-50 dark:hover:bg-[#5c6ac4]/90 dark:focus-visible:ring-[#5c6ac4]"
                    href="/train"
                  >
                    Try AI Roleplays
                  </Link>
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md border border-[#5c6ac4] bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-[#5c6ac4] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5c6ac4] disabled:pointer-events-none disabled:opacity-50 dark:border-[#5c6ac4] dark:bg-gray-950 dark:hover:bg-[#5c6ac4]/90 dark:hover:text-gray-50 dark:focus-visible:ring-[#5c6ac4]"
                    href="/train"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-[#5c6ac4] px-3 py-1 text-sm text-gray-50 dark:bg-[#5c6ac4]">
                    Voice AI Trainer
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Customize Your Training Curriculum
                  </h2>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Plug in your own training curriculum and leverage our voice AI to provide personalized feedback and
                    coaching to your frontline teams.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md bg-[#5c6ac4] px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-[#5c6ac4]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5c6ac4] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#5c6ac4] dark:text-gray-50 dark:hover:bg-[#5c6ac4]/90 dark:focus-visible:ring-[#5c6ac4]"
                    href="/train"
                  >
                    Try Voice AI Trainer
                  </Link>
                  <Link
                    className="inline-flex h-10 items-center justify-center rounded-md border border-[#5c6ac4] bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-[#5c6ac4] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5c6ac4] disabled:pointer-events-none disabled:opacity-50 dark:border-[#5c6ac4] dark:bg-gray-950 dark:hover:bg-[#5c6ac4]/90 dark:hover:text-gray-50 dark:focus-visible:ring-[#5c6ac4]"
                    href="/train"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <img
                alt="Voice AI Trainer"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="310"
                src="https://imagedelivery.net/d3WSibrZmE8m_HEZW60OcQ/60a113ae-63d7-4bfc-6aef-bb844f57e300/big"
                width="550"
              />
            </div>
          </div>
        </section>
   

        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  What are you waiting for to Elevate Your Frontline Operations?
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Unlock the power of voice AI to streamline call management, improve customer experience, and empower
                  your frontline teams.
                </p>
              </div>
              <div className="space-x-4">
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md bg-[#5c6ac4] px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-[#5c6ac4]/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5c6ac4] disabled:pointer-events-none disabled:opacity-50 dark:bg-[#5c6ac4] dark:text-gray-50 dark:hover:bg-[#5c6ac4]/90 dark:focus-visible:ring-[#5c6ac4]"
                  href="/train"
                >
                  <Rocket />
                  Get Started
                </Link>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md border border-[#5c6ac4] bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-[#5c6ac4] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5c6ac4] disabled:pointer-events-none disabled:opacity-50 dark:border-[#5c6ac4] dark:bg-gray-950 dark:hover:bg-[#5c6ac4]/90 dark:hover:text-gray-50 dark:focus-visible:ring-[#5c6ac4]"
                  href="https://github.com/amulyaparmar/usephone.ai-TYG/"
                >
                  <Github /> Clone the repo
                </Link>
              </div>
            </div>
          </div>
        </section>
   
      </main>
    </div>
  )
}

function MicIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  )
}

function CheckIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    )
  }