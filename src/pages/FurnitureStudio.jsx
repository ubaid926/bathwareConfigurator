
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayCanvas } from '../context/usePlayCanvas'
import {
  ArrowLeft,
  ArrowRight,
  Undo2,
  Redo2,
  Bookmark,
  Share2,
  Bath,
  Droplets,
  RectangleVertical,
  ShowerHead,
  RotateCw,
  ZoomIn,
  Maximize,
  ChevronRight,
  Check,
  Menu,
  X
} from 'lucide-react'

// Product button images (Option 1 = Black/Dark theme, Option 2 = White/Light theme)
import vanityBlack from '../assets/vanity_black.webp'
import vanityWhite from '../assets/vanity_option2.webp'
import sinkBlack from '../assets/sink_black.webp'
import sinkWhite from '../assets/sink_white.webp'
import tapOption1 from '../assets/tap_option1.webp'
import tapOption2 from '../assets/tap_option2.webp'

// Categories
const CATEGORIES = [
  { id: 'vanities', label: 'Vanities', Icon: Bath },
  { id: 'sinks', label: 'Sinks', Icon: Droplets },
  { id: 'taps', label: 'Taps', Icon: ShowerHead },
  /* Preserved for future use:
  { id: 'mirrors', label: 'Mirrors', Icon: RectangleVertical },
  */
]

// Preserved full categories list
const _ALL_CATEGORIES = [
  { id: 'vanities', label: 'Vanities', Icon: Bath },
  { id: 'sinks', label: 'Sinks', Icon: Droplets },
  { id: 'mirrors', label: 'Mirrors', Icon: RectangleVertical },
  { id: 'taps', label: 'Taps', Icon: ShowerHead },
]

const PRODUCTS = {
  vanities: [
    { id: 'vanity1', name: 'Option 1', image: vanityBlack },
    { id: 'vanity2', name: 'Option 2', image: vanityWhite },
    /* Preserved for future use:
    { id: 'arc120', name: 'Option 3 (Arc 120)' },
    { id: 'arcDouble', name: 'Option 4 (Arc Double)' },
    */
  ],
  sinks: [
    { id: 'sink1', name: 'Option 1', image: sinkBlack },
    { id: 'sink2', name: 'Option 2', image: sinkWhite },
  ],
  taps: [
    { id: 'tap1', name: 'Option 1', image: tapOption1 },
    { id: 'tap2', name: 'Option 2', image: tapOption2 },
  ],
  /* Preserved for future use:
  mirrors: [
    { id: 'mirror1', name: 'Option 1 (Oval LED)' },
    { id: 'mirror2', name: 'Option 2 (Round LED)' },
  ],
  */
}

// Backup of all original products with full details
const _ALL_PRODUCTS = {
  vanities: [
    { id: 'arc80', name: 'Arc 80' },
    { id: 'arc100', name: 'Arc 100' },
    { id: 'arc120', name: 'Arc 120' },
    { id: 'arcDouble', name: 'Arc Double' },
  ],
  sinks: [
    { id: 'sink1', name: 'Basin 50' },
    { id: 'sink2', name: 'Basin 60' },
  ],
  mirrors: [
    { id: 'mirror1', name: 'Oval LED' },
    { id: 'mirror2', name: 'Round LED' },
  ],
  taps: [
    { id: 'tap1', name: 'Mono Tall' },
    { id: 'tap2', name: 'Wall Spout' },
  ],
}

const FINISHES = [
  { id: 'graphite', label: 'Graphite', color: '#333333' },
  { id: 'white', label: 'Matte White', color: '#E5E1DC' },
  { id: 'oak', label: 'Natural Oak', color: '#B99465' },
  { id: 'sage', label: 'Sage Green', color: '#899C87' },
]

const METALS = [
  { id: 'brass', label: 'Brushed brass', color: '#BA9862' },
  { id: 'black', label: 'Matte black', color: '#292929' },
  { id: 'chrome', label: 'Chrome', color: '#D1D1D1' },
  { id: 'nickel', label: 'Brushed nickel', color: '#AAA69B' },
]

// Product preview: displays product image if provided, otherwise CSS fallback
function ProductPreview({ category = 'vanities', name = '', finish = '#333333', image = null }) {
  if (image) {
    return (
      <div className="flex h-full w-full items-center justify-center p-1 lg:p-2">
        <img
          src={image}
          alt={name}
          className="max-h-full max-w-full object-contain drop-shadow-sm transition-transform duration-200"
          loading="lazy"
        />
      </div>
    )
  }

  const isVanity = category === 'vanities' || name.startsWith('Arc')
  const isDouble = name.includes('Double')

  if (!isVanity) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex h-[40px] w-[50px] items-center justify-center rounded-lg border border-[#BBBBBB] bg-[#F5F5F5] text-[#666] lg:h-[65px] lg:w-[85px] lg:rounded-xl">
          {category === 'sinks' && <Droplets size={24} strokeWidth={1.2} className="lg:h-[35px] lg:w-[35px]" />}
          {category === 'mirrors' && <RectangleVertical size={24} strokeWidth={1.2} className="lg:h-[35px] lg:w-[35px]" />}
          {category === 'taps' && <ShowerHead size={24} strokeWidth={1.2} className="lg:h-[35px] lg:w-[35px]" />}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="relative h-[36px] rounded-b-[12px] rounded-t-[4px] shadow-[3px_6px_10px_rgba(0,0,0,0.14)] lg:h-[55px] lg:rounded-b-[17px] lg:rounded-t-[6px] lg:shadow-[4px_8px_12px_rgba(0,0,0,0.16)]"
        style={{
          width: isDouble ? '82%' : (name === 'Option 1' || name === 'Arc 80') ? '60%' : '76%',
          backgroundColor: finish,
          backgroundImage:
            'repeating-linear-gradient(90deg,transparent 0px,rgba(0,0,0,0.25) 2px,rgba(255,255,255,0.09) 4px,transparent 6px)',
        }}
      >
        <div
          className="absolute left-0 top-[-4px] h-[7px] w-full rounded-[50%] border border-black/10 lg:top-[-5px] lg:h-[9px]"
          style={{ backgroundColor: finish }}
        />

        <div className="absolute left-1/2 top-[4px] h-[2px] w-[14px] -translate-x-1/2 rounded-full bg-[#B99864] lg:top-[6px] lg:w-[18px]" />

        {isDouble && (
          <div className="absolute left-1/4 top-[4px] h-[2px] w-[14px] -translate-x-1/2 rounded-full bg-[#B99864] lg:top-[6px] lg:w-[18px]" />
        )}
      </div>
    </div>
  )
}

function FurnitureStudio() {
  const navigate = useNavigate()
  const viewerRef = useRef(null)
  const {
    registerContainer,
    unregisterContainer,
    isLoaded,
    requestFullscreen,
    sendMessage,
  } = usePlayCanvas()

  useEffect(() => {
    if (viewerRef.current) {
      registerContainer(viewerRef.current)
    }
    return () => {
      unregisterContainer()
    }
  }, [registerContainer, unregisterContainer])

  const [activeCategory, setActiveCategory] = useState('vanities')
  const [selectedProducts, setSelectedProducts] = useState({
    vanities: 'vanity1',
    sinks: 'sink1',
    taps: 'tap1',
    // mirrors: 'mirror1', // Preserved for future use
  })

  const [selectedFinish, setSelectedFinish] = useState('graphite')
  const [selectedMetal, setSelectedMetal] = useState('brass')
  const [finishOpen, setFinishOpen] = useState(false)
  const [metalOpen, setMetalOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // Flag to temporarily hide color/finish options while preserving all code
  const [showColorOptions] = useState(false)

  const products = PRODUCTS[activeCategory]
  const selectedId = selectedProducts[activeCategory]
  const currentProduct = products.find(p => p.id === selectedId)
  const currentFinish = FINISHES.find(f => f.id === selectedFinish)
  const currentMetal = METALS.find(m => m.id === selectedMetal)

  const saveDesign = () => {
    const data = {
      selectedProducts,
      selectedFinish,
      selectedMetal,
    }
    localStorage.setItem('allure-design', JSON.stringify(data))
    setSaved(true)
  }

  const shareDesign = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Allure Bathware', url })
      } catch {
        // Sharing was cancelled or unavailable.
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url)
    }
  }

  const openFullscreen = () => {
    requestFullscreen()
  }

  const hasInitializedRef = useRef(false)

  // Send initial configuration string to PlayCanvas once loaded
  useEffect(() => {
    if (isLoaded && !hasInitializedRef.current) {
      hasInitializedRef.current = true
      // Send string, e.g. "vanity1"
      sendMessage(selectedProducts.vanities)
    }
  }, [isLoaded, sendMessage, selectedProducts.vanities])

  const PRODUCT_ENTITY_MAP = {
    vanity1: 'arc80',
    vanity2: 'arc100',
    sink1: 'sink1',
    sink2: 'sink2',
    tap1: 'tap1',
    tap2: 'tap2',
  }

  const handleSelectProduct = (categoryId, productId) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [categoryId]: productId,
    }))
    setSaved(false)

    // 1. Send plain string, e.g. "vanity1", "vanity2", "sink1", "sink2", "tap1", "tap2"
    sendMessage(productId)

    // 2. Also send matching object in case PlayCanvas HtmlHandler script expects it
    const entityId = PRODUCT_ENTITY_MAP[productId] || productId
    sendMessage({
      type: 'CHANGE_PRODUCT',
      action: 'setProduct',
      category: categoryId,
      productId: entityId,
    })
  }

  const handleSelectCategory = (cat) => {
    setActiveCategory(cat.id)
    sendMessage(cat.id)
  }

  const handleSelectFinish = (finish) => {
    setSelectedFinish(finish.id)
    setFinishOpen(false)
    setSaved(false)
    sendMessage(finish.id)
  }

  const handleSelectMetal = (metal) => {
    setSelectedMetal(metal.id)
    setMetalOpen(false)
    setSaved(false)
    sendMessage(metal.id)
  }

  const handleRotate = () => {
    sendMessage('rotate')
  }

  const handleZoom = () => {
    sendMessage('zoom')
  }

  const continueNext = () => {
    const index = CATEGORIES.findIndex((c) => c.id === activeCategory)
    const next = CATEGORIES[index + 1]
    if (next) handleSelectCategory(next)
  }

  return (
    <div className="flex h-screen max-h-screen flex-col overflow-hidden bg-[#FEFDFC] font-['Poppins'] text-[#20201E]">

      {/* TOP NAVIGATION */}
      <nav className="relative z-30 flex h-[48px] shrink-0 items-center justify-between border-b border-[#BEBEBE] bg-[#FEFDFC] px-[18px] sm:h-[52px] sm:px-7">

        <span className="text-[9px] font-medium uppercase tracking-[0.32em] sm:text-[12px] sm:tracking-[0.38em]">
          Allure Bathware
        </span>

        <div className="hidden items-center gap-3 md:flex md:gap-6">
          <button disabled aria-label="Undo" className="text-[#444] opacity-60">
            <Undo2 size={19} strokeWidth={1.5} />
          </button>

          <button disabled aria-label="Redo" className="text-[#444] opacity-60">
            <Redo2 size={19} strokeWidth={1.5} />
          </button>

          <div className="h-5 w-px bg-[#999]" />

          <button
            onClick={saveDesign}
            className="flex items-center gap-2 text-[12px] hover:text-[#B7925E]"
          >
            <Bookmark size={18} strokeWidth={1.4} fill={saved ? '#B7925E' : 'none'} />
            <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
          </button>

          <div className="h-5 w-px bg-[#999]" />

          <button
            onClick={shareDesign}
            className="flex items-center gap-2 text-[12px] hover:text-[#B7925E]"
          >
            <Share2 size={18} strokeWidth={1.4} />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        <button
          type="button"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(v => !v)}
          className="flex h-8 w-8 items-center justify-center md:hidden"
        >
          {mobileMenuOpen ? <X size={19} strokeWidth={1.3} /> : <Menu size={19} strokeWidth={1.3} />}
        </button>

        {mobileMenuOpen && (
          <div className="absolute left-0 right-0 top-full z-40 flex flex-col gap-1 border-b border-[#DDD] bg-[#FEFDFC] px-5 py-3 shadow-md md:hidden">
            <button onClick={() => { saveDesign(); setMobileMenuOpen(false) }} className="flex items-center gap-2 py-2 text-sm"><Bookmark size={16} /> {saved ? 'Saved' : 'Save design'}</button>
            <button onClick={() => { shareDesign(); setMobileMenuOpen(false) }} className="flex items-center gap-2 py-2 text-sm"><Share2 size={16} /> Share</button>
            <button onClick={() => { navigate('/studio-select'); setMobileMenuOpen(false) }} className="flex items-center gap-2 py-2 text-sm"><ArrowLeft size={16} /> Back to studios</button>
          </div>
        )}
      </nav>

      {/* MAIN LAYOUT */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">

        {/* LEFT VIEWER */}
        <div
          ref={viewerRef}
          className="relative h-[48vh] min-h-[220px] shrink-0 overflow-hidden bg-[#D7D5D1] lg:h-full lg:min-h-0 lg:min-w-0 lg:flex-1"
        >
          {/* Subtle loading fallback only if accessed before background preload finishes */}
          {!isLoaded && (
            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-[#D7D5D1] text-[#777]">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B7925E] border-t-transparent" />
              <span className="mt-3 font-['Poppins'] text-xs tracking-wider uppercase text-[#666]">
                Loading 3D Studio...
              </span>
            </div>
          )}

          {/* Mobile quick controls, matching reference */}
          <div className="absolute left-[14px] top-2 z-20 flex gap-2 lg:hidden">
            <button type="button" disabled aria-label="Undo unavailable" className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#333] opacity-90"><Undo2 size={15} strokeWidth={1.4} /></button>
            <button type="button" disabled aria-label="Redo unavailable" className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#333] opacity-90"><Redo2 size={15} strokeWidth={1.4} /></button>
          </div>

          {/* Back */}
          <button
            onClick={() => navigate('/studio-select')}
            aria-label="Go back"
            className="absolute left-5 top-6 z-20 hidden h-[48px] w-[48px] items-center justify-center rounded-full bg-white text-black shadow-sm transition-colors hover:bg-[#F1EBE3] lg:flex lg:left-8 lg:top-8"
          >
            <ArrowLeft size={24} strokeWidth={1.6} />
          </button>

          {/* Viewer Controls */}
          <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2">
            <div className="flex items-center overflow-hidden rounded-full bg-white/95 backdrop-blur-sm px-2 py-1 shadow-lg lg:px-4 lg:py-1.5">

              <button
                type="button"
                onClick={handleRotate}
                title="Rotate 3D View"
                className="flex w-[42px] flex-col items-center gap-0.5 py-0.5 text-black transition-colors hover:text-[#B7925E] lg:w-[74px] lg:gap-1 lg:py-1"
              >
                <RotateCw size={21} strokeWidth={1.5} />
                <span className="text-[10px]">Rotate</span>
              </button>

              <button
                type="button"
                onClick={handleZoom}
                title="Zoom 3D View"
                className="flex w-[42px] flex-col items-center gap-0.5 py-0.5 text-black transition-colors hover:text-[#B7925E] lg:w-[74px] lg:gap-1 lg:py-1"
              >
                <ZoomIn size={21} strokeWidth={1.5} />
                <span className="text-[10px]">Zoom</span>
              </button>

              <button
                onClick={openFullscreen}
                className="flex w-[50px] flex-col items-center gap-0.5 py-0.5 text-black hover:text-[#B7925E] lg:w-[85px] lg:gap-1 lg:py-1"
              >
                <Maximize size={21} strokeWidth={1.5} />
                <span className="text-[10px]">Fullscreen</span>
              </button>

            </div>
          </div>
        </div>

        {/* RIGHT CONFIGURATOR PANEL */}
        <aside className="relative flex min-h-0 h-[52vh] w-full shrink-0 flex-col bg-white overflow-hidden lg:h-full lg:w-[31.25%] lg:min-w-[410px] lg:flex-none border-t border-[#E5E3DF] lg:border-t-0 lg:border-l">

          <div className="mx-auto mt-[5px] h-[4px] w-[26px] shrink-0 rounded-full bg-[#D3D3D3] lg:hidden" />
          {/* Panel Content */}
          <div className="min-h-0 flex-1 overflow-y-auto px-[17px] pt-[8px] sm:px-8 lg:px-[9%] lg:pt-[35px]">

            {/* Heading */}
            <p className="mb-[5px] text-[8px] font-normal uppercase tracking-[0.35em] text-[#20201E] lg:mb-3 lg:text-[12px]">
              Your Bathroom
            </p>

            <h1 className="mb-[9px] text-[24px] font-light leading-[1.1] tracking-[-0.035em] text-black lg:mb-6 lg:text-[37px] xl:text-[45px]">
              Make it yours
            </h1>

            {/* Category Tabs */}
            <div className="grid grid-cols-3 gap-[7px] lg:gap-3">
              {CATEGORIES.map(cat => {
                const Icon = cat.Icon
                const active = activeCategory === cat.id

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat)}
                    className={`flex h-[46px] flex-col items-center justify-center gap-[2px] rounded-[4px] border transition-colors lg:h-[84px] lg:gap-2 lg:rounded-[6px] ${
                      active
                        ? 'border-[#F0E4D8] bg-[#F3E6D8]'
                        : 'border-[#D2CECA] bg-white hover:border-[#B7925E]'
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px] lg:h-[27px] lg:w-[27px]" strokeWidth={1.1} />
                    <span className="text-[9px] lg:text-[12px]">{cat.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="my-[8px] h-px bg-[#E1E1E1] lg:my-7 lg:bg-[#C8C8C8]" />

            {/* Product Grid - Exactly 2 options per category */}
            <div className="grid grid-cols-2 gap-[8px] lg:gap-5">
              {products.map(product => {
                const active = selectedId === product.id

                return (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(activeCategory, product.id)}
                    className={`relative flex h-[72px] flex-col overflow-hidden rounded-[4px] border text-left transition-colors lg:h-[142px] lg:rounded-[6px] ${
                      active
                        ? 'border-[#B7925E] bg-[#E7E7E7]'
                        : 'border-transparent bg-[#E7E7E7] hover:border-[#B7925E]'
                    }`}
                  >
                    {active && (
                      <span className="absolute right-1 top-1 z-10 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#B7925E] text-white lg:right-2 lg:top-2 lg:h-[20px] lg:w-[20px]">
                        <Check size={13} strokeWidth={2.6} />
                      </span>
                    )}

                    <div className="min-h-0 w-full flex-1">
                      <ProductPreview
                        category={activeCategory}
                        name={product.name}
                        finish={currentFinish?.color}
                        image={product.image}
                      />
                    </div>

                    <p className="w-full px-[8px] pb-[6px] text-[10px] font-medium text-black lg:px-3 lg:pb-3 lg:text-[15px]">
                      {product.name}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Color & Metal Options (temporarily hidden) */}
            {/* Set showColorOptions state to true to re-enable them later */}
            {showColorOptions && (
              <>
                {/* Finish */}
                <div className="mt-[7px] border-t border-[#D5D5D5] lg:mt-7 lg:border-[#C8C8C8]">
                  <button
                    onClick={() => setFinishOpen(!finishOpen)}
                    className="flex h-[34px] w-full items-center gap-[9px] text-left lg:h-[63px] lg:gap-4"
                  >
                    <div
                      className="h-[25px] w-[25px] shrink-0 rounded-full border border-black/10 lg:h-[45px] lg:w-[45px]"
                      style={{
                        backgroundColor: currentFinish?.color,
                        backgroundImage:
                          'repeating-linear-gradient(90deg,transparent 0px,rgba(255,255,255,.13) 2px,rgba(0,0,0,.2) 4px)'
                      }}
                    />

                    <div className="flex-1">
                      <p className="text-[10px] lg:text-[15px]">Finish</p>
                      <p className="text-[9px] lg:text-[12px]">{currentFinish?.label}</p>
                    </div>

                    <ChevronRight
                      size={20}
                      strokeWidth={1.4}
                      className={`transition-transform ${finishOpen ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {finishOpen && (
                    <div className="grid grid-cols-2 gap-2 pb-4">
                      {FINISHES.map(finish => (
                        <button
                          key={finish.id}
                          onClick={() => handleSelectFinish(finish)}
                          className={`flex items-center gap-2 rounded border px-2 py-2 text-left text-[11px] ${
                            selectedFinish === finish.id
                              ? 'border-[#B7925E]'
                              : 'border-[#DDDDDD]'
                          }`}
                        >
                          <span
                            className="h-5 w-5 shrink-0 rounded-full border border-black/10"
                            style={{ backgroundColor: finish.color }}
                          />
                          {finish.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Metalwork */}
                <div className="border-y border-[#C8C8C8]">
                  <button
                    onClick={() => setMetalOpen(!metalOpen)}
                    className="flex h-[34px] w-full items-center gap-[9px] text-left lg:h-[63px] lg:gap-4"
                  >
                    <div
                      className="h-[25px] w-[25px] shrink-0 rounded-full border border-black/10 lg:h-[45px] lg:w-[45px]"
                      style={{
                        background: `linear-gradient(110deg,#F3E3C4,${currentMetal?.color},#816C4E)`
                      }}
                    />

                    <div className="flex-1">
                      <p className="text-[10px] lg:text-[15px]">Metalwork</p>
                      <p className="text-[9px] lg:text-[12px]">{currentMetal?.label}</p>
                    </div>

                    <ChevronRight
                      size={20}
                      strokeWidth={1.4}
                      className={`transition-transform ${metalOpen ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {metalOpen && (
                    <div className="grid grid-cols-2 gap-2 pb-4">
                      {METALS.map(metal => (
                        <button
                          key={metal.id}
                          onClick={() => handleSelectMetal(metal)}
                          className={`flex items-center gap-2 rounded border px-2 py-2 text-left text-[11px] ${
                            selectedMetal === metal.id
                              ? 'border-[#B7925E]'
                              : 'border-[#DDDDDD]'
                          }`}
                        >
                          <span
                            className="h-5 w-5 shrink-0 rounded-full border border-black/10"
                            style={{ backgroundColor: metal.color }}
                          />
                          {metal.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Bottom Summary */}
          <div className="shrink-0 z-10 flex items-center gap-2 border-t border-[#EEEEEE] bg-white px-[17px] py-[8px] sm:px-8 lg:gap-4 lg:px-[9%] lg:py-[18px]">

            <div className="h-[36px] w-[53px] shrink-0 overflow-hidden rounded-[4px] border border-[#DDD] bg-[#E7E7E7] lg:h-[65px] lg:w-[99px]">
              <ProductPreview
                category={activeCategory}
                name={currentProduct?.name || ''}
                finish={currentFinish?.color}
                image={currentProduct?.image}
              />
            </div>

            <span className="min-w-0 flex-1 truncate text-[9px] font-normal lg:text-[14px]">
              {currentProduct?.name}
            </span>

            <button
              onClick={continueNext}
              disabled={activeCategory === 'taps'}
              className="flex h-[29px] min-w-[119px] items-center justify-center gap-2 rounded-[4px] bg-[#B7925E] px-3 text-[10px] text-white transition-colors hover:bg-[#A77F4A] disabled:opacity-60 lg:h-[47px] lg:min-w-[130px] lg:gap-3 lg:px-4 lg:text-[14px] xl:min-w-[196px]"
            >
              Continue
              <ArrowRight size={19} strokeWidth={1.5} />
            </button>

          </div>
        </aside>
      </div>
    </div>
  )
}

export default FurnitureStudio
