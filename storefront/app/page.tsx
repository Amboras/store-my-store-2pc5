'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import {
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Droplets,
  Lock,
  MountainSnow,
  PawPrint,
  Star,
  Check,
  Sparkles,
} from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import { useCollections } from '@/hooks/use-collections'
import { trackMetaEvent } from '@/lib/meta-pixel'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=1600&q=80'
const LIFESTYLE_IMAGE =
  'https://images.unsplash.com/photo-1546975490-a58ba30b0f80?w=1600&q=80'
const STORY_IMAGE =
  'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1600&q=80'
const HOW_IMAGE =
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1600&q=80'

export default function HomePage() {
  const { data: collections, isLoading } = useCollections()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    trackMetaEvent('Lead', {
      content_name: 'newsletter_signup',
      status: 'submitted',
    })
    setSubmitted(true)
    setNewsletterEmail('')
  }

  return (
    <>
      {/* Hero Section — Editorial split with trust badges */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/40">
        <div className="container-custom grid lg:grid-cols-12 gap-10 lg:gap-16 items-center py-16 lg:py-24">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-7 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">
                New • 304 Stainless Steel
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-semibold text-balance leading-[1.05] tracking-tight">
              Never leave your dog
              <span className="block text-accent">thirsty again.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
              The 2-in-1 PawFlow bottle pours, collects, and clips — so every walk,
              hike, and road trip ends with a happy, hydrated pup. Zero spills.
              Zero waste.
            </p>

            {/* Rating row */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-accent text-accent"
                    strokeWidth={0}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">4.9 / 5</span> from
                12,400+ adventurous pup parents
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-3">
              <Link
                href="/products/pawflow-2-in-1-portable-pet-water-bottle"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity rounded-sm"
                prefetch={true}
              >
                Shop the Bottle
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 border border-foreground px-8 py-4 text-sm font-semibold uppercase tracking-wide hover:bg-foreground hover:text-background transition-colors rounded-sm"
                prefetch={true}
              >
                Explore All
              </Link>
            </div>

            {/* Inline trust badges */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-accent" strokeWidth={3} />
                Free US shipping $35+
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-accent" strokeWidth={3} />
                30-day guarantee
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-accent" strokeWidth={3} />
                BPA-free materials
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-6 relative animate-fade-in">
            <div className="relative aspect-[4/5] lg:aspect-[5/6] bg-muted rounded-sm overflow-hidden">
              <Image
                src={HERO_IMAGE}
                alt="Happy dog drinking fresh water outdoors with the PawFlow bottle"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            {/* Floating stat card */}
            <div className="hidden sm:flex absolute -left-4 bottom-6 lg:left-6 lg:bottom-8 items-center gap-3 bg-background shadow-xl border border-border/60 rounded-sm px-4 py-3 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <Droplets className="h-5 w-5 text-accent" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-semibold">550 ml capacity</p>
                <p className="text-xs text-muted-foreground">Full-day hydration</p>
              </div>
            </div>
            <div className="hidden sm:flex absolute -right-2 top-8 lg:right-4 lg:top-10 items-center gap-3 bg-background shadow-xl border border-border/60 rounded-sm px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/5">
                <Lock className="h-5 w-5 text-foreground" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-semibold">100% leak-proof</p>
                <p className="text-xs text-muted-foreground">Bone-dry bags</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-y bg-foreground text-primary-foreground">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {[
              {
                icon: Droplets,
                title: 'Squeeze & Pour',
                sub: 'One-handed design',
              },
              {
                icon: Lock,
                title: 'Leak-Proof Lock',
                sub: 'Zero spills, ever',
              },
              {
                icon: Shield,
                title: '304 Stainless',
                sub: 'Food-grade build',
              },
              {
                icon: MountainSnow,
                title: 'Trail-Ready Clip',
                sub: 'Clips to any pack',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex items-center justify-center gap-3 py-6 px-4"
              >
                <f.icon className="h-6 w-6 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-semibold">{f.title}</p>
                  <p className="text-xs opacity-70">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      {isLoading ? (
        <section className="py-section">
          <div className="container-custom">
            <div className="animate-pulse space-y-4 text-center">
              <div className="h-3 w-20 bg-muted rounded mx-auto" />
              <div className="h-8 w-64 bg-muted rounded mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-muted rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </section>
      ) : collections && collections.length > 0 ? (
        <>
          {collections.map(
            (
              collection: {
                id: string
                handle: string
                title: string
                metadata?: Record<string, unknown>
              },
              index: number,
            ) => (
              <CollectionSection
                key={collection.id}
                collection={collection}
                alternate={index % 2 === 1}
              />
            ),
          )}
        </>
      ) : null}

      {/* How It Works */}
      <section className="py-section bg-muted/40">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-3">
              How It Works
            </p>
            <h2 className="text-h2 font-heading font-semibold">
              Hydration in three simple steps
            </h2>
            <p className="mt-4 text-muted-foreground">
              No bowls to carry, no bottles to juggle, no water wasted — just
              squeeze, sip, and go.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative aspect-[4/5] bg-muted rounded-sm overflow-hidden order-2 lg:order-1">
              <Image
                src={HOW_IMAGE}
                alt="Dog drinking from the PawFlow silicone bowl"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <ol className="space-y-8 order-1 lg:order-2">
              {[
                {
                  n: '01',
                  title: 'Squeeze',
                  body:
                    'A gentle one-handed squeeze sends water from the 550 ml bottle into the silicone bowl — no caps to unscrew, no bowls to unpack.',
                },
                {
                  n: '02',
                  title: 'Pup drinks',
                  body:
                    'Your dog drinks from the integrated food-grade silicone bowl. Easy for small pups, spacious enough for big drinkers.',
                },
                {
                  n: '03',
                  title: 'Release — nothing is wasted',
                  body:
                    'Release pressure and every unused drop flows back into the bottle. Click the leak-proof cap and clip to your pack.',
                },
              ].map((step) => (
                <li key={step.n} className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-accent/50 flex items-center justify-center font-heading font-semibold text-accent">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Editorial / Brand Story */}
      <section className="py-section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/5] bg-muted rounded-sm overflow-hidden">
              <Image
                src={STORY_IMAGE}
                alt="Dog hiking with owner"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-6 lg:max-w-md">
              <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
                Built For Adventure
              </p>
              <h2 className="text-h2 font-heading font-semibold">
                For dogs that live off-leash.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                PawFlow started with a simple problem: our dogs were thirsty on the
                trail, and there wasn&apos;t a bottle good enough. So we built one.
                Every bottle is tested at 40,000 squeezes, engineered from
                food-grade 304 stainless steel, and backed by our 30-day happy pup
                guarantee.
              </p>
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div>
                  <p className="text-3xl font-heading font-semibold">12K+</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                    Happy pups
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-heading font-semibold">550ml</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                    Capacity
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-heading font-semibold">30-Day</p>
                  <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                    Guarantee
                  </p>
                </div>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide link-underline pb-0.5 pt-3"
                prefetch={true}
              >
                Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle / Adventure banner */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={LIFESTYLE_IMAGE}
            alt="Dog on the trail with PawFlow"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-foreground/10" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-xl text-primary-foreground space-y-6">
            <p className="text-xs uppercase tracking-[0.25em] font-semibold opacity-80">
              The Trail Awaits
            </p>
            <h2 className="text-h2 lg:text-h1 font-heading font-semibold text-balance">
              From sidewalks to summits — PawFlow is along for every step.
            </h2>
            <p className="opacity-80 leading-relaxed">
              Whether it&apos;s the morning walk or a weekend in the backcountry,
              your dog deserves fresh water on demand.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity rounded-sm"
              prefetch={true}
            >
              Shop PawFlow
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-section">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-3">
              Pack approved
            </p>
            <h2 className="text-h2 font-heading font-semibold">
              Loved by 12,000+ adventurous pups
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah M.',
                loc: 'Boulder, CO',
                body:
                  '&ldquo;Took it on a 12-mile hike and didn&rsquo;t spill a drop. Max drinks directly from the bowl — no more muddy puddles.&rdquo;',
                pup: 'Max · Golden Retriever',
              },
              {
                name: 'Daniel K.',
                loc: 'Austin, TX',
                body:
                  '&ldquo;The one-handed squeeze is genius. I can hold the leash and give Luna water without stopping. Best $25 I&rsquo;ve spent.&rdquo;',
                pup: 'Luna · Border Collie',
              },
              {
                name: 'Priya R.',
                loc: 'Brooklyn, NY',
                body:
                  '&ldquo;Leak-proof claim is real. Tossed it in my tote with my laptop — zero leaks. Bailey waits by the door now.&rdquo;',
                pup: 'Bailey · Mini Poodle',
              },
            ].map((t, i) => (
              <div
                key={i}
                className="border border-border/70 rounded-sm bg-background p-7 space-y-4"
              >
                <div className="flex items-center gap-0.5">
                  {[0, 1, 2, 3, 4].map((j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-accent text-accent"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <p
                  className="text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t.body }}
                />
                <div className="pt-2 border-t">
                  <p className="text-sm font-semibold">
                    {t.name}{' '}
                    <span className="text-muted-foreground font-normal">
                      · {t.loc}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{t.pup}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Features Bar */}
      <section className="py-section-sm border-y bg-muted/40">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <Truck className="h-6 w-6 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $35</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <RotateCcw className="h-6 w-6 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day guarantee</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <Shield className="h-6 w-6 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">Secure Checkout</p>
                <p className="text-xs text-muted-foreground">256-bit SSL</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-end">
              <PawPrint className="h-6 w-6 flex-shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold">Pack Approved</p>
                <p className="text-xs text-muted-foreground">12,000+ pups</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-section">
        <div className="container-custom max-w-xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-3">
            Join the pack
          </p>
          <h2 className="text-h2 font-heading font-semibold">
            10% off your first order
          </h2>
          <p className="mt-3 text-muted-foreground">
            Subscribe for training tips, trail guides, and exclusive drops.
            Unsubscribe anytime.
          </p>
          {submitted ? (
            <div className="mt-8 inline-flex items-center gap-2 bg-accent/10 text-accent px-5 py-3 rounded-sm text-sm font-medium">
              <Check className="h-4 w-4" strokeWidth={3} />
              You&apos;re in! Check your inbox for your code.
            </div>
          ) : (
            <form className="mt-8 flex gap-2" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 border-b border-foreground/30 bg-transparent px-1 py-3 text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-foreground text-background px-6 py-3 text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
