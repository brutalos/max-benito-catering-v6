import Menu from "@/components/Menu";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section id="start" className="pt-24 pb-12">
        <div className="row flex flex-col items-center">
          <img 
            className="w-full max-w-[540px] mb-12" 
            src="/images/logo.svg" 
            alt="Max & Benito Logo" 
          />
          <img 
            className="w-full h-auto rounded-sm shadow-xl" 
            src="/images/max-und-benito-burrito-bowl.webp" 
            srcSet="/images/max-und-benito-burrito-bowl-mobile.webp 800w, /images/max-und-benito-burrito-bowl.webp" 
            alt="Foto von einem Burrito und einer Bowl von Max & Benito" 
          />
        </div>
      </section>
      
      {/* Food Section */}
      <section id="food" className="py-20 bg-white">
        <div className="row">
          <h1 className="text-[4rem] md:text-[6rem] font-medium uc mb-12">Food</h1>
          <Menu />
        </div>
      </section>

      {/* Order Section */}
      <section id="get" className="py-24 bg-primary text-white">
        <div className="row flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div className="flex-1 uc">
            <h2 className="text-[3rem] md:text-[4.5rem] leading-tight">
              Delivery <br className="hidden md:block" /> via <br className="md:hidden" />
              <a href="https://www.foodora.at/restaurant/hvvr/max-and-benito-hvvr" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors underline decoration-2 underline-offset-8">Foodora</a>, 
              <br className="hidden md:block" />
              <a href="https://www.lieferando.at/max-benito" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors underline decoration-2 underline-offset-8">Lieferando</a>
              <br className="hidden md:block" />
              or&nbsp;<a href="https://wolt.com/de-at/aut/vienna/brand/max-benito" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors underline decoration-2 underline-offset-8">Wolt</a>
            </h2>
          </div>
          
          <img 
            src="/images/logo-mini.svg" 
            alt="Max & Benito Logo mini" 
            className="hidden lg:block w-[170px] h-auto invert brightness-0" 
          />
          
          <div className="flex-1 uc">
            <h2 className="text-[3rem] md:text-[4.5rem] leading-tight">
              Order & pick up <br />
              <a href="#locations" className="hover:text-accent transition-colors underline decoration-2 underline-offset-8 text-accent">in our stores</a>
              <br /><br className="hidden md:block" />
              or with our 
              <br /> 
              <a target="_blank" href="https://play.google.com/store/apps/details?id=com.smorderloyalty.maxbenito" rel="noopener noreferrer" className="hover:text-accent transition-colors underline decoration-2 underline-offset-8">Max & Benito app</a>
            </h2>
          </div>
        </div>
      </section>

      <section className="w-full">
        <img 
          className="w-full h-auto" 
          src="/images/max-und-benito-store-front.webp" 
          srcSet="/images/max-und-benito-store-front-mobile.webp 800w, /images/max-und-benito-store-front.webp" 
          alt="Foto des Max & Benito Logos an einer Glastüre" 
        />
      </section>

      {/* Locations Section */}
      <section id="locations" className="py-24 bg-background">
        <div className="row">
          <h1 className="text-[4rem] md:text-[6rem] font-medium uc mb-16">Locations</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {/* Store Wipp */}
            <div className="flex flex-col gap-4">
              <h2 className="text-[2.8rem] font-medium uc">Store Wipp</h2>
              <p className="text-[1.8rem]">
                Wipplingerstraße 23<br />
                1010 Wien
              </p>
              <h3 className="text-[1.6rem] font-medium uc mt-4">Opening Hours</h3>
              <div className="text-[1.6rem]">
                <div className="flex justify-between border-b border-primary/10 py-2">
                  <span>Monday—Friday</span><span>11.30—20.00</span>
                </div>
              </div>
              <h3 className="text-[1.6rem] font-medium uc mt-4">Contact</h3>
              <p className="text-[1.6rem]">Tel: <a href="tel:004367761051321" className="hover:text-accent">+43 677 610 513 21</a></p>
              <a href="/#food" className="mt-6 inline-block bg-primary text-white uc py-4 px-8 text-center hover:bg-accent transition-colors rounded-full font-medium">Order now</a>
            </div>

            {/* Store AC */}
            <div className="flex flex-col gap-4">
              <h2 className="text-[2.8rem] font-medium uc">Store AC</h2>
              <p className="text-[1.8rem]">
                Austria Campus, Jakov-Lind-Straße 7<br />
                1020 Wien
              </p>
              <h3 className="text-[1.6rem] font-medium uc mt-4">Opening Hours</h3>
              <div className="text-[1.6rem]">
                <div className="flex justify-between border-b border-primary/10 py-2">
                  <span>Monday—Friday</span><span>11.15—20.00</span>
                </div>
              </div>
              <h3 className="text-[1.6rem] font-medium uc mt-4">Contact</h3>
              <p className="text-[1.6rem]">Tel: <a href="tel:004367761015332" className="hover:text-accent">+43 677 610 153 32</a></p>
              <a href="/#food" className="mt-6 inline-block bg-primary text-white uc py-4 px-8 text-center hover:bg-accent transition-colors rounded-full font-medium">Order now</a>
            </div>

            {/* Store Rotu */}
            <div className="flex flex-col gap-4">
              <h2 className="text-[2.8rem] font-medium uc">Store Rotu</h2>
              <p className="text-[1.8rem]">
                Rotenturmstraße 27<br />
                1010 Wien
              </p>
              <h3 className="text-[1.6rem] font-medium uc mt-4">Opening Hours</h3>
              <div className="text-[1.6rem] flex flex-col gap-1">
                <div className="flex justify-between border-b border-primary/10 py-2">
                  <span>Monday—Thursday</span><span>11.30—20.30</span>
                </div>
                <div className="flex justify-between border-b border-primary/10 py-2">
                  <span>Friday</span><span>11.30—21.30</span>
                </div>
                <div className="flex justify-between border-b border-primary/10 py-2">
                  <span>Saturday</span><span>12.00—21.30</span>
                </div>
                <div className="flex justify-between border-b border-primary/10 py-2">
                  <span>Sunday</span><span>12.00—20.30</span>
                </div>
              </div>
              <h3 className="text-[1.6rem] font-medium uc mt-4">Contact</h3>
              <p className="text-[1.6rem]">Tel: <a href="tel:004367763540127" className="hover:text-accent">+43 677 635 401 27</a></p>
              <a href="/#food" className="mt-6 inline-block bg-primary text-white uc py-4 px-8 text-center hover:bg-accent transition-colors rounded-full font-medium">Order now</a>
            </div>

            {/* Store Wimi */}
            <div className="flex flex-col gap-4">
              <h2 className="text-[2.8rem] font-medium uc">Store Wimi</h2>
              <p className="text-[1.8rem]">
                Landstraßer Hauptstraße 1b<br />
                1030 Wien
              </p>
              <h3 className="text-[1.6rem] font-medium uc mt-4">Opening Hours</h3>
              <div className="text-[1.6rem] flex flex-col gap-1">
                <div className="flex justify-between border-b border-primary/10 py-2">
                  <span>Monday—Friday</span><span>11.30—21.30</span>
                </div>
                <div className="flex justify-between border-b border-primary/10 py-2">
                  <span>Saturday—Sunday</span><span>12.00—20.30</span>
                </div>
              </div>
              <h3 className="text-[1.6rem] font-medium uc mt-4">Contact</h3>
              <p className="text-[1.6rem]">Tel: <a href="tel:004367761049127" className="hover:text-accent">+43 677 610 491 27</a></p>
              <a href="/#food" className="mt-6 inline-block bg-primary text-white uc py-4 px-8 text-center hover:bg-accent transition-colors rounded-full font-medium">Order now</a>
            </div>

            {/* Store Mahü 7 */}
            <div className="flex flex-col gap-4">
              <h2 className="text-[2.8rem] font-medium uc">Store Mahü 7</h2>
              <p className="text-[1.8rem]">
                Mariahilferstraße 4 <br />
                1070 Wien
              </p>
              <h3 className="text-[1.6rem] font-medium uc mt-4">Opening Hours</h3>
              <div className="text-[1.6rem] flex flex-col gap-1">
                <div className="flex justify-between border-b border-primary/10 py-2">
                  <span>Mon—Wed</span><span>11.30—21.30</span>
                </div>
                <div className="flex justify-between border-b border-primary/10 py-2">
                  <span>Thu—Sat</span><span>11.30—22.00</span>
                </div>
                <div className="flex justify-between border-b border-primary/10 py-2">
                  <span>Sunday</span><span>12.00—21.30</span>
                </div>
              </div>
              <h3 className="text-[1.6rem] font-medium uc mt-4">Contact</h3>
              <p className="text-[1.6rem]">Tel: <a href="tel:004367763540104" className="hover:text-accent">+43 677 635 401 04</a></p>
              <a href="/#food" className="mt-6 inline-block bg-primary text-white uc py-4 px-8 text-center hover:bg-accent transition-colors rounded-full font-medium">Order now</a>
            </div>

            {/* Store Mahü 88 */}
            <div className="flex flex-col gap-4">
              <h2 className="text-[2.8rem] font-medium uc">Store Mahü 88</h2>
              <p className="text-[1.8rem]">
                Mariahilferstraße 88 <br />
                1070 Wien
              </p>
              <h3 className="text-[1.6rem] font-medium uc mt-4">Opening Hours</h3>
              <div className="text-[1.6rem] flex flex-col gap-1">
                <div className="flex justify-between border-b border-primary/10 py-2">
                  <span>Mon—Wed</span><span>11.00—21.30</span>
                </div>
                <div className="flex justify-between border-b border-primary/10 py-2">
                  <span>Thu—Sat</span><span>11.00—22.00</span>
                </div>
                <div className="flex justify-between border-b border-primary/10 py-2">
                  <span>Sunday</span><span>11.30—21.30</span>
                </div>
              </div>
              <h3 className="text-[1.6rem] font-medium uc mt-4">Contact</h3>
              <p className="text-[1.6rem]">Tel: <a href="tel:004367761984291" className="hover:text-accent">+43 677 619 842 91</a></p>
              <a href="/#food" className="mt-6 inline-block bg-primary text-white uc py-4 px-8 text-center hover:bg-accent transition-colors rounded-full font-medium">Order now</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
