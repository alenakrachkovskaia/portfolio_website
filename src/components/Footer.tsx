import { useLocation } from 'react-router-dom'
import { ArrowRight } from './NavArrows'
import './Footer.css'

const base = import.meta.env.BASE_URL

export default function Footer() {
  const { pathname } = useLocation()
  if (pathname === '/') return null

  return (
    <footer className="footer">
      <img
        className="footer-bg"
        src={`${base}footer/BACKGROUND.webp`}
        alt=""
      />
      <div className="footer-content">
        <div className="footer-inner">

          {/* 1. Vibe-coded line at top */}
          <div className="footer-top-text h2">
            This website iteration was fully vibe coded by me from scratch (no website builders used).
          </div>

          {/* 2–5. Mid block: starts at 50% footer height */}
          <div className="footer-mid">

            {/* Row 1: arrow (left) + name (right) */}
            <div className="footer-row">
              <div className="footer-arrow tag"><ArrowRight /></div>
              <div className="footer-name h2">
                Alena Krachkovskaia<br />© 2026
              </div>
            </div>

            {/* Row 2: contact label (left) + links (right) */}
            <div className="footer-row footer-contact-row">
              <div className="footer-contact-label tag">contact</div>
              <div className="footer-contact-links h2">
                <a href="mailto:alenkra0@gmail.com">alenkra0@gmail.com</a><br />
                <a href="https://www.linkedin.com/in/alenakrachkovskaia/" target="_blank" rel="noopener noreferrer">LinkedIn</a><br />
                <a href="https://www.instagram.com/alenanaland/" target="_blank" rel="noopener noreferrer">Instagram</a><br />
                <a href="https://www.behance.net/alenanaland" target="_blank" rel="noopener noreferrer">Behance</a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}
