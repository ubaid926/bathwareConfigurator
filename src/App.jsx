import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import {
  Undo2,
  Redo2,
  Bookmark,
  Share2,
  ArrowRight,
  Menu,
  X
} from 'lucide-react'
import StudioSelect from './pages/StudioSelect'
import FurnitureStudio from './pages/FurnitureStudio'
import { PlayCanvasProvider } from './context/PlayCanvasProvider'
import './App.css'

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [savedDesign, setSavedDesign] = useState(false)

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#FEFDFC] text-[#262626]">

      {/* Top navigation */}
      {/* Navbar */}
      <nav className="relative z-30 flex h-[52px] shrink-0 items-center justify-between border-b border-[#dedbd7] bg-[#FEFDFC] px-4 md:h-[55px] md:px-7">

        <div className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#20201E] md:text-[10px] md:tracking-[0.4em]">
          Allure Bathware
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 text-[#444] md:flex">
          <button aria-label="Undo">
            <Undo2 size={15} strokeWidth={1.4} />
          </button>

          <button aria-label="Redo">
            <Redo2 size={15} strokeWidth={1.4} />
          </button>

          <span className="h-4 w-px bg-[#d5d5d5]" />

          <button className="flex items-center gap-2 text-[11px]">
            <Bookmark size={15} strokeWidth={1.4} />
            Save
          </button>

          <span className="h-4 w-px bg-[#d5d5d5]" />

          <button className="flex items-center gap-2 text-[11px]">
            <Share2 size={15} strokeWidth={1.4} />
            Share
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-8 w-8 items-center justify-center text-[#20201E] md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={19} strokeWidth={1.2} /> : <Menu size={19} strokeWidth={1.2} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-[52px] z-40 border-b border-[#E5DED6] bg-[#FEFDFC] p-5 shadow-sm md:hidden">
          <button
            onClick={() => setMenuOpen(false)}
            className="flex w-full items-center gap-2 py-3 text-left text-[13px]"
          >
            <Bookmark size={16} strokeWidth={1.4} />
            Save
          </button>

          <button
            onClick={async () => {
              setMenuOpen(false)
              if (navigator.share) {
                try {
                  await navigator.share({ url: window.location.href })
                } catch {
                  // User cancelled sharing.
                }
              } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(window.location.href)
              }
            }}
            className="flex w-full items-center gap-2 py-3 text-left text-[13px]"
          >
            <Share2 size={16} strokeWidth={1.4} />
            Share
          </button>
        </div>
      )}

      {/* Decorative side arches */}
      {/* Left arches */}
      <div className="pointer-events-none absolute bottom-[85px] left-0 top-[52px] w-[55px] md:bottom-0 md:top-[55px] md:w-[16%]">
        <div className="absolute left-[-47px] top-[0%] h-[115%] w-[95px] rounded-t-full border border-[#e5d9cc] md:left-[-110px] md:top-[6%] md:h-[125%] md:w-[220px]" />

        <div className="absolute left-[-42px] top-[1%] h-[115%] w-[85px] rounded-t-full border border-[#e5d9cc] md:left-[-103px] md:top-[7%] md:h-[125%] md:w-[206px]" />

        <div className="absolute left-[-37px] top-[2%] h-[115%] w-[75px] rounded-t-full border border-[#e5d9cc] md:left-[-96px] md:top-[8%] md:h-[125%] md:w-[192px]" />
      </div>

      {/* Right arches */}
      <div className="pointer-events-none absolute bottom-[85px] right-0 top-[52px] w-[55px] md:bottom-0 md:top-[55px] md:w-[16%]">
        <div className="absolute right-[-47px] top-[0%] h-[115%] w-[95px] rounded-t-full border border-[#e5d9cc] md:right-[-110px] md:top-[6%] md:h-[125%] md:w-[220px]" />

        <div className="absolute right-[-42px] top-[1%] h-[115%] w-[85px] rounded-t-full border border-[#e5d9cc] md:right-[-103px] md:top-[7%] md:h-[125%] md:w-[206px]" />

        <div className="absolute right-[-37px] top-[2%] h-[115%] w-[75px] rounded-t-full border border-[#e5d9cc] md:right-[-96px] md:top-[8%] md:h-[125%] md:w-[192px]" />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 text-center">

        <p className="mb-8 font-['Poppins'] text-[clamp(10px,0.9vw,14px)] font-normal tracking-[0.23em] uppercase text-[#898989]">
          The Allure Studio
        </p>
        <h1 className="font-['Poppins'] text-[clamp(48px,5vw,78px)] font-light leading-[1.12] tracking-[0] text-[#20201E]">
          Your bathroom.
          <br />
          Your way.
        </h1>

        <p className="mb-9 mt-7 font-['Poppins'] text-[clamp(13px,1.1vw,18px)] font-normal text-[#898989]">
          Create a space that feels like you.
        </p>
        <button
          onClick={() => navigate('/studio-select')}
          className="
    flex
    h-[52px]
    w-[340px]
    max-w-full
    items-center
    justify-center
    gap-4
    rounded-[4px]
    bg-[#B7925E]
    font-['Poppins']
    text-[14px]
    font-normal
    text-white
    transition-colors
    hover:bg-[#a58050]
  "
        >
          Start designing
          <ArrowRight size={17} strokeWidth={1.5} />
        </button>

        <button
          onClick={() => setSavedDesign(!savedDesign)}
          className="mt-5 flex items-center gap-2 font-['Poppins'] text-[clamp(11px,0.85vw,14px)] font-normal text-[#20201E]"
        >
          <Bookmark
            size={15}
            strokeWidth={1.3}
            fill={savedDesign ? '#B7925E' : 'none'}
          />
          Open a saved design
        </button>

        {/* Steps */}
        <div className="mt-9 flex w-[315px] items-center border-t border-[#e4e4e4] pt-4">
          {[
            ['01', 'Choose'],
            ['02', 'Customise'],
            ['03', 'Preview'],
          ].map(([number, title], index) => (
            <div
              key={number}
              className={`flex flex-1 flex-col items-center gap-1 ${index !== 2 ? 'border-r border-[#e4e4e4]' : ''
                }`}
            >
              <span className="font-['Poppins'] text-[clamp(11px,0.9vw,15px)] font-normal text-[#898989]">
                {number}
              </span>
              <span className="font-['Poppins'] text-[clamp(10px,0.85vw,13px)] font-normal text-[#20201E]">
                {title}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <PlayCanvasProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/studio-select" element={<StudioSelect />} />
          <Route path="/furniture-studio" element={<FurnitureStudio />} />
        </Routes>
      </BrowserRouter>
    </PlayCanvasProvider>
  )
}

export default App