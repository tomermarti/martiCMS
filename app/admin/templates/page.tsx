'use client'

import { useState } from 'react'
import TemplateManager from '@/components/TemplateManager'

export default function TemplatesPage() {
  return (
    <div className="templates-page">
      <div className="page-header">
        <h1>📄 Template Manager</h1>
        <p className="page-description">
          Create and manage HTML templates for your articles. Templates use placeholder syntax like <code>{`{{title}}`}</code> and <code>{`{{image}}`}</code> 
          to create dynamic, reusable layouts for AB testing.
        </p>
      </div>

      <TemplateManager />

      <style jsx>{`
        .templates-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 40px;
          padding: 40px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
        }

        .page-header h1 {
          margin: 0 0 15px 0;
          font-size: 2.5rem;
          font-weight: 600;
        }

        .page-description {
          margin: 0;
          font-size: 1.1rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .page-description code {
          background: rgba(255,255,255,0.2);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
        }
      `}</style>
    </div>
  )
}
