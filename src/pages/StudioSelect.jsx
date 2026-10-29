import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Undo2,
  Redo2,
  Bookmark,
  Share2,
  Menu
} from 'lucide-react'
import { useState } from 'react'

import showerImg from '../assets/Shower-render.webp'
import bathroomImg from '../assets/Bathroom-render.webp'

function StudioSelect() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="flex min-h-screen flex-col bg-[#FEFDFC] font-['Poppins'] text-[#20201E]">

      {/* NAVBAR */}
      <nav className="relative z-20 flex h-[52px] shrink-0 items-center justify-between border-b border-[#dedbd7] bg-[#FEFDFC] px-4 md:h-[55px] md:px-7">
        <div className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#20201E] md:text-[10px] md:tracking-[0.4em]">
          Allure Bathware
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex h-8 w-8 items-center justify-center md:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={18} strokeWidth={1.2} />
        </button>

        {/* Desktop actions */}
        <div className="hidden items-center gap-4 text-[#444] md:flex">
          <button aria-label="Undo"><Undo2 size={17} strokeWidth={1.4} /></button>
          <button aria-label="Redo"><Redo2 size={17} strokeWidth={1.4} /></button>

          <span className="h-5 w-px bg-[#999]" />

          <button className="flex items-center gap-2 text-[12px]">
            <Bookmark size={17} strokeWidth={1.4} />
            Save
          </button>

          <span className="h-5 w-px bg-[#999]" />

          <button className="flex items-center gap-2 text-[12px]">
            <Share2 size={17} strokeWidth={1.4} />
            Share
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="relative z-30 border-b border-[#dedbd7] bg-[#FEFDFC] px-5 py-3 md:hidden">
          <button onClick={() => setMenuOpen(false)} className="mb-3 text-xs">
            Close
          </button>
          <div className="flex gap-5 text-xs">
            <button onClick={() => setMenuOpen(false)}>Save</button>
            <button
              onClick={() => {
                setMenuOpen(false)
                if (navigator.share) {
                  navigator.share({ url: window.location.href }).catch(() => { })
                } else if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href)
                }
              }}
            >
              Share
            </button>
          </div>
        </div>
      )}
      {/* MAIN CONTENT */}
      <main className="relative mx-auto flex w-full max-w-[1700px] flex-1 flex-col px-[22px] pb-6 pt-5 sm:px-10 sm:pb-12 sm:pt-10 lg:px-[6.5%]">

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          aria-label="Go back"
          className="absolute left-[22px] top-4 z-10 flex h-[22px] w-[22px] items-center justify-center text-[#20201E] md:left-10 md:top-8 md:h-[48px] md:w-[48px] md:rounded-full md:border md:border-[#E5E3DF] md:bg-white lg:left-[3.5%]"
        >
          <ArrowLeft className="h-[15px] w-[15px] md:h-[22px] md:w-[22px]" strokeWidth={1.5} />
        </button>

        {/* Heading Section */}
        <div className="mb-5 mt-1 text-center sm:mb-9">
          <p className="mb-2 text-[8px] font-normal uppercase tracking-[0.12em] text-[#898989] sm:mb-3 sm:text-[13px] sm:text-[#886746]">
            Choose Your Studio
          </p>

          <h1 className="mx-auto max-w-[245px] text-[22px] font-normal leading-[1.2] tracking-[-0.03em] text-[#20201E] sm:max-w-none sm:text-[40px] lg:text-[42px]">
            Where would you like to begin?
          </h1>
        </div>

        {/* STUDIO CARDS */}
        <div className="grid w-full grid-cols-1 gap-[10px] md:grid-cols-2 md:gap-7 lg:gap-9">

          <StudioCard
            number="01"
            image={showerImg}
            title="Shower Studio"
            subtitle="Shape your shower."
            // onClick={() => navigate('/shower-studio')}
          />

          <StudioCard
            number="02"
            image={bathroomImg}
            title="Furniture Studio"
            subtitle="Design your bathroom, your way."
            onClick={() => navigate('/furniture-studio')}
            highlighted
          />

        </div>
      </main>
    </div>
  )
}

function StudioCard({
  number,
  image,
  title,
  subtitle,
  onClick,
  highlighted = false
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        flex
        w-full
        flex-col
        overflow-hidden
      rounded-[6px] sm:rounded-[20px]
        border
        bg-white
        text-left
        transition-all
        duration-300
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#B7925E]
        ${highlighted
          ? 'border-[#C18B46]'
          : 'border-[#CECECE] hover:border-[#C18B46]'
        }
      `}
    >

      {/* Card Image */}
      <div className="h-[185px] w-full overflow-hidden bg-[#EAE6E0] sm:h-auto sm:aspect-[1.36/1]">
        <img
          src={image}
          alt={title}
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
        />
      </div>

      {/* Card Footer */}
      <div className="flex min-h-[67px] w-full items-center justify-between gap-2 px-3 py-2 sm:min-h-[130px] sm:gap-4 sm:px-8 sm:py-5">
        <div className="min-w-0">
          <p className="mb-0.5 text-[9px] font-normal text-[#BD8D50] sm:mb-1 sm:text-[16px]">
            {number}

          </p>

          <h2 className="text-[13px] font-normal leading-[1.2] text-[#20201E] sm:text-[26px]">


            {title}
          </h2>

          <p className="mt-0.5 text-[9px] font-normal leading-[1.4] text-[#777] sm:text-[16px]">
            {subtitle}
          </p>
        </div>

        <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#BE9259] text-white transition-colors group-hover:bg-[#A97A42] sm:h-[56px] sm:w-[56px]">
          <ArrowRight className="h-[14px] w-[14px] sm:h-[25px] sm:w-[25px]" strokeWidth={1.5} />
        </span>
      </div>
    </button>
  )
}

export default StudioSelect