#!/usr/bin/env node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const defaultTemplates = [
  {
    name: 'Urgent Sale Layout',
    description: 'High-converting urgent sale template with countdown and scarcity elements',
    category: 'single_product',
    placeholders: ['title', 'image', 'originalPrice', 'salePrice', 'discount', 'cta', 'ctaUrl', 'urgencyText', 'timeLeft'],
    htmlContent: `
<div class="urgent-sale-container">
  <div class="urgency-banner">
    <span class="urgency-text">🔥 {{urgencyText}}</span>
    <span class="countdown" id="countdown-timer">⏰ Loading...</span>
  </div>
  
  <div class="product-hero">
    <div class="product-image-container">
      <img src="{{image}}" alt="{{title}}" class="product-image" />
      <div class="discount-badge">{{discount}}% OFF</div>
    </div>
    
    <div class="product-details">
      <h1 class="urgent-title">{{title}}</h1>
      
      <div class="price-container">
        <span class="original-price">\${{originalPrice}}</span>
        <span class="sale-price">\${{salePrice}}</span>
      </div>
      
      <a href="{{ctaUrl}}" class="urgent-cta">{{cta}}</a>
      
      <div class="trust-signals">
        <div class="trust-item">✅ Free Shipping</div>
        <div class="trust-item">✅ 30-Day Guarantee</div>
        <div class="trust-item">✅ Secure Checkout</div>
      </div>
    </div>
  </div>
</div>


<style>
.urgent-sale-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.urgency-banner {
  background: linear-gradient(45deg, #ff4444, #ff6666);
  color: white;
  padding: 15px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
  border-radius: 8px;
  animation: pulse 2s infinite;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.countdown {
  font-family: 'Courier New', monospace;
  font-size: 1.1em;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 5px;
  min-width: 100px;
  text-align: center;
}

.product-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.product-image-container {
  position: relative;
}

.product-image {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.discount-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #ff4444;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 18px;
}

.urgent-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.2;
}

.price-container {
  margin-bottom: 30px;
}

.original-price {
  font-size: 1.5rem;
  color: #999;
  text-decoration: line-through;
  margin-right: 15px;
}

.sale-price {
  font-size: 2.5rem;
  color: #ff4444;
  font-weight: bold;
}

.urgent-cta {
  background: linear-gradient(45deg, #ff4444, #ff6666);
  color: white;
  border: none;
  padding: 20px 40px;
  font-size: 1.3rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  width: 100%;
  margin-bottom: 30px;
  transition: transform 0.2s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.urgent-cta:hover {
  transform: scale(1.05);
}

.trust-signals {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trust-item {
  color: #28a745;
  font-weight: 500;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* Mobile-first responsive design - Full width on mobile */
@media (max-width: 768px) {
  .urgent-sale-container {
    width: 100%;
    max-width: 100%;
    padding: 0 16px;
    margin: 0;
  }
  
  .urgency-banner {
    flex-direction: column;
    text-align: center;
    gap: 8px;
    padding: 12px;
    margin-bottom: 16px;
  }
  
  .countdown {
    min-width: auto;
    width: 100%;
    max-width: 200px;
  }
  
  .product-hero {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .urgent-title {
    font-size: 2rem;
    margin-bottom: 16px;
  }
  
  .price-container {
    margin-bottom: 20px;
    text-align: center;
  }
  
  .original-price {
    font-size: 1.2rem;
    display: block;
    margin-bottom: 5px;
    margin-right: 0;
  }
  
  .sale-price {
    font-size: 2rem;
  }
  
  .urgent-cta {
    padding: 16px 32px;
    font-size: 1.1rem;
  }
  
  .discount-badge {
    top: 10px;
    right: 10px;
    padding: 6px 12px;
    font-size: 16px;
  }
}

/* Extra small screens */
@media (max-width: 480px) {
  .urgent-sale-container {
    padding: 0 12px;
  }
  
  .urgent-title {
    font-size: 1.8rem;
  }
  
  .sale-price {
    font-size: 1.8rem;
  }
  
  .original-price {
    font-size: 1.1rem;
  }
}
</style>`
  },
  
  {
    name: 'Minimal Product Focus',
    description: 'Clean, minimal template focusing on product benefits and social proof',
    category: 'single_product',
    placeholders: ['title', 'image', 'price', 'description', 'cta', 'ctaUrl', 'rating', 'reviewCount'],
    htmlContent: `
<div class="minimal-container">
  <div class="product-showcase">
    <img src="{{image}}" alt="{{title}}" class="hero-image" />
    
    <div class="product-info">
      <div class="rating-container">
        <div class="stars">★★★★★</div>
        <span class="rating-text">{{rating}}/5 ({{reviewCount}} reviews)</span>
      </div>
      
      <h1 class="product-title">{{title}}</h1>
      
      <p class="product-description">{{description}}</p>
      
      <div class="price-section">
        <span class="price">\${{price}}</span>
      </div>
      
      <a href="{{ctaUrl}}" class="minimal-cta">{{cta}}</a>
      
      <div class="guarantees">
        <div class="guarantee">30-day money back guarantee</div>
        <div class="guarantee">Free shipping worldwide</div>
      </div>
    </div>
  </div>
</div>

<style>
.minimal-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.product-showcase {
  text-align: center;
}

.hero-image {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.rating-container {
  margin-bottom: 20px;
}

.stars {
  color: #ffc107;
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.rating-text {
  color: #666;
  font-size: 0.9rem;
}

.product-title {
  font-size: 2.2rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 300;
  line-height: 1.3;
}

.product-description {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.price-section {
  margin-bottom: 30px;
}

.price {
  font-size: 2rem;
  color: #333;
  font-weight: 600;
}

.minimal-cta {
  background: #333;
  color: white;
  border: none;
  padding: 16px 48px;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 30px;
  transition: background 0.2s;
  text-decoration: none;
  display: inline-block;
}

.minimal-cta:hover {
  background: #555;
}

.guarantees {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #666;
  font-size: 0.9rem;
}

.guarantee {
  position: relative;
  padding-left: 20px;
}

.guarantee:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #28a745;
  font-weight: bold;
}

/* Mobile responsive design */
@media (max-width: 768px) {
  .minimal-container {
    width: 100%;
    max-width: 100%;
    padding: 20px 16px;
    margin: 0;
  }
  
  .product-title {
    font-size: 1.8rem;
  }
  
  .product-description {
    font-size: 1rem;
    max-width: 100%;
  }
  
  .price {
    font-size: 1.8rem;
  }
  
  .minimal-cta {
    padding: 14px 32px;
    font-size: 1rem;
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .minimal-container {
    padding: 16px 12px;
  }
  
  .product-title {
    font-size: 1.6rem;
  }
  
  .price {
    font-size: 1.6rem;
  }
}
</style>`
  },
  
  {
    name: 'Social Proof Hero',
    description: 'Template emphasizing testimonials and social proof for trust building',
    category: 'single_product',
    placeholders: ['title', 'image', 'price', 'cta', 'ctaUrl', 'testimonial1', 'testimonial2', 'testimonial3', 'customerCount'],
    htmlContent: `
<div class="social-proof-container">
  <div class="hero-section">
    <h1 class="hero-title">{{title}}</h1>
    <div class="social-stats">
      <span class="customer-count">Join {{customerCount}}+ Happy Customers</span>
    </div>
  </div>
  
  <div class="main-content">
    <div class="product-section">
      <img src="{{image}}" alt="{{title}}" class="product-image" />
      <div class="price-cta">
        <div class="price">\${{price}}</div>
        <a href="{{ctaUrl}}" class="social-cta">{{cta}}</a>
      </div>
    </div>
    
    <div class="testimonials-section">
      <h3>What Our Customers Say</h3>
      
      <div class="testimonial">
        <div class="testimonial-text">"{{testimonial1}}"</div>
        <div class="testimonial-author">- Sarah M.</div>
      </div>
      
      <div class="testimonial">
        <div class="testimonial-text">"{{testimonial2}}"</div>
        <div class="testimonial-author">- Mike R.</div>
      </div>
      
      <div class="testimonial">
        <div class="testimonial-text">"{{testimonial3}}"</div>
        <div class="testimonial-author">- Lisa K.</div>
      </div>
    </div>
  </div>
</div>

<style>
.social-proof-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.hero-section {
  text-align: center;
  margin-bottom: 40px;
}

.hero-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 15px;
}

.social-stats {
  background: #f8f9fa;
  padding: 10px 20px;
  border-radius: 20px;
  display: inline-block;
}

.customer-count {
  color: #28a745;
  font-weight: 600;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

.product-image {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 20px;
}

.price-cta {
  text-align: center;
}

.price {
  font-size: 2rem;
  color: #333;
  font-weight: bold;
  margin-bottom: 20px;
}

.social-cta {
  background: #007bff;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.testimonials-section h3 {
  color: #333;
  margin-bottom: 25px;
  text-align: center;
}

.testimonial {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border-left: 4px solid #007bff;
}

.testimonial-text {
  font-style: italic;
  color: #555;
  margin-bottom: 10px;
  line-height: 1.5;
}

.testimonial-author {
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Mobile responsive design */
@media (max-width: 768px) {
  .social-proof-container {
    width: 100%;
    max-width: 100%;
    padding: 16px;
    margin: 0;
  }
  
  .main-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .price {
    font-size: 1.8rem;
  }
  
  .social-cta {
    padding: 14px 24px;
    font-size: 1rem;
  }
  
  .testimonial {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .social-proof-container {
    padding: 12px;
  }
  
  .hero-title {
    font-size: 1.8rem;
  }
  
  .price {
    font-size: 1.6rem;
  }
  
  .social-stats {
    padding: 8px 16px;
  }
}
</style>`
  }
]

async function createDefaultTemplates() {
  console.log('🚀 Creating default templates...')
  
  try {
    for (const template of defaultTemplates) {
      const existing = await prisma.template.findFirst({
        where: { name: template.name }
      })
      
      if (!existing) {
        await prisma.template.create({
          data: template
        })
        console.log(`✅ Created template: ${template.name}`)
      } else {
        // Update existing template with new placeholders and HTML
        await prisma.template.update({
          where: { id: existing.id },
          data: {
            placeholders: template.placeholders,
            htmlContent: template.htmlContent,
            description: template.description
          }
        })
        console.log(`🔄 Updated template: ${template.name}`)
      }
    }
    
    console.log('🎉 Default templates setup complete!')
  } catch (error) {
    console.error('❌ Error creating templates:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createDefaultTemplates()
