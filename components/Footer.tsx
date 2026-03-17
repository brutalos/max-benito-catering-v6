import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-background border-t border-primary/10 mt-20">
      <div className="row text-center md:text-left">
        <p className="text-[14px] md:text-[16px] text-primary/80">
          <a href="/legal" rel="nofollow" className="uppercase font-medium hover:text-accent transition-colors">Imprint & Privacy Policy</a>
          <span className="mx-3 text-primary/30">|</span>
          © Max & Benito 2026
          <span className="hidden md:inline mx-3 text-primary/30">|</span>
          <br className="md:hidden" />
          <a className="hover:text-accent transition-colors mt-2 md:mt-0 inline-block" href="mailto:job@maxbenito.at">job@maxbenito.at</a>
          <span className="mx-3 text-primary/30">|</span>
          <a className="hover:text-accent transition-colors mt-2 md:mt-0 inline-block" href="mailto:feedback@maxbenito.at">feedback@maxbenito.at</a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
