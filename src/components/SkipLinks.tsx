'use client'

import { skipLinkData } from '@/lib/accessibility'

/**
 * Skip Links Component
 * 
 * Provides keyboard navigation shortcuts for accessibility.
 * These links are visually hidden but become visible when focused,
 * allowing keyboard users to quickly navigate to main content areas.
 */
export default function SkipLinks() {
  return (
    <div className="skip-links">
      <a
        href={`#${skipLinkData.mainContent}`}
        className="skip-link"
        tabIndex={0}
      >
        {skipLinkData.skipToMain}
      </a>
      <a
        href={`#${skipLinkData.navigation}`}
        className="skip-link"
        tabIndex={0}
      >
        {skipLinkData.skipToNav}
      </a>
      
      <style jsx>{`
        .skip-links {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
        }
        
        .skip-link {
          position: absolute;
          left: -9999px;
          top: 0;
          background: #000;
          color: #fff;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 0 0 4px 0;
          font-weight: 600;
          transition: left 0.3s ease;
        }
        
        .skip-link:focus {
          left: 0;
          outline: 2px solid #10b981;
          outline-offset: 2px;
        }
        
        .skip-link:hover {
          background: #374151;
        }
      `}</style>
    </div>
  )
}
