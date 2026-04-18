import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 3600 // ISR: revalidate every hour
import { medusaServerClient } from '@/lib/medusa-client'
import Image from 'next/image'
import Link from 'next/link'
import {
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  Droplets,
  Lock,
  MountainSnow,
  PawPrint,
  Star,
  Check,
  ShieldCheck,
  Flame,
} from 'lucide-react'
import ProductActions from '@/components/product/product-actions'
import BundleActions from '@/components/product/bundle-actions'
import ProductAccordion from '@/components/product/product-accordion'
import { ProductViewTracker } from '@/components/product/product-view-tracker'
import { getProductPlaceholder } from '@/lib/utils/placeholder-images'
import { type VariantExtension } from '@/components/product/product-price'

const HERO_PRODUCT_HANDLE = 'pawflow-2-in-1-portable-pet-water-bottle'

async function getProduct(handle: string) {
  try {
    const regionsResponse = await medusaServerClient.store.region.list()
    const regionId = regionsResponse.regions[0]?.id
    if (!regionId) throw new Error('No region found')

    const response = await medusaServerClient.store.product.list({
      handle,
      region_id: regionId,
      fields: '*variants.calculated_price',
    })
    return response.products?.[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getVariantExtensions(
  productId: string,
): Promise<Record<string, VariantExtension>> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const storeId = process.env.NEXT_PUBLIC_STORE_ID
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    const headers: Record<string, string> = {}
    if (storeId) headers['X-Store-Environment-ID'] = storeId
    if (publishableKey) headers['x-publishable-api-key'] = publishableKey

    const res = await fetch(
      `${baseUrl}/store/product-extensions/products/${productId}/variants`,
      { headers, next: { revalidate: 30 } },
    )
    if (!res.ok) return {}

    const data = await res.json()
    const map: Record<string, VariantExtension> = {}
    for (const v of data.variants || []) {
      map[v.id] = {
        compare_at_price: v.compare_at_price,
        allow_backorder: v.allow_backorder ?? false,
        inventory_quantity: v.inventory_quantity,
      }
    }
    return map
  } catch {
    return {}
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: product.title,
    description: product.description || `Shop ${product.title}`,
    openGraph: {
      title: product.title,
      description: product.description || `Shop ${product.title}`,
      ...(product.thumbnail ? { images: [{ url: product.thumbnail }] } : {}),
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  const variantExtensions = await getVariantExtensions(product.id)
  const isHeroProduct = handle === HERO_PRODUCT_HANDLE

  const allImages = [
    ...(product.thumbnail ? [{ url: product.thumbnail }] : []),
    ...(product.images || []).filter(
      (img: { url: string }) => img.url !== product.thumbnail,
    ),
  ]

  const displayImages =
    allImages.length > 0
      ? allImages
      : [{ url: getProductPlaceholder(product.id) }]

  const rating = 4.9
  const reviewCount = 1247

  return (
    <>
      {/* Breadcrumbs */}
      <div className="border-b">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href="/products"
              className="hover:text-foreground transition-colors"
            >
              Shop
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm">
              <Image
                src={displayImages[0].url}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {isHeroProduct && (
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm">
                    Bestseller
                  </span>
                  <span className="bg-foreground text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm">
                    Save 37%
                  </span>
                </div>
              )}
            </div>

            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {displayImages
                  .slice(1, 5)
                  .map((image: { url: string }, idx: number) => (
                    <div
                      key={idx}
                      className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm"
                    >
                      <Image
                        src={image.url}
                        alt={`${product.title} ${idx + 2}`}
                        fill
                        sizes="12vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            {/* Title & Subtitle */}
            <div>
              {isHeroProduct ? (
                <p className="text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-2">
                  PawFlow Adventure Series
                </p>
              ) : (
                product.subtitle && (
                  <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-2">
                    {product.subtitle}
                  </p>
                )
              )}
              <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-balance leading-tight">
                {product.title}
              </h1>

              {/* Rating row */}
              {isHeroProduct && (
                <div className="flex items-center gap-3 mt-3">
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
                    <span className="font-semibold text-foreground">
                      {rating}
                    </span>{' '}
                    · {reviewCount.toLocaleString()} reviews
                  </p>
                </div>
              )}
            </div>

            <ProductViewTracker
              productId={product.id}
              productTitle={product.title}
              variantId={product.variants?.[0]?.id || null}
              currency={
                product.variants?.[0]?.calculated_price?.currency_code || 'usd'
              }
              value={
                product.variants?.[0]?.calculated_price?.calculated_amount ??
                null
              }
            />

            {/* Key features strip (hero product only) */}
            {isHeroProduct && (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 pb-2">
                {[
                  { icon: Droplets, label: '550 ml capacity' },
                  { icon: Lock, label: 'Leak-proof cap' },
                  { icon: Shield, label: '304 stainless steel' },
                  { icon: MountainSnow, label: 'Clip-on carabiner' },
                ].map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2 text-sm">
                    <Icon
                      className="h-4 w-4 text-accent flex-shrink-0"
                      strokeWidth={2}
                    />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Variant Selector + Add to Cart */}
            {isHeroProduct ? (
              <BundleActions
                product={product}
                variantExtensions={variantExtensions}
              />
            ) : (
              <>
                <ProductActions
                  product={product}
                  variantExtensions={variantExtensions}
                />

                {/* Trust Signals (non-hero) */}
                <div className="grid grid-cols-3 gap-4 py-6 border-t">
                  <div className="text-center">
                    <Truck
                      className="h-5 w-5 mx-auto mb-1.5"
                      strokeWidth={1.5}
                    />
                    <p className="text-xs text-muted-foreground">
                      Free Shipping
                    </p>
                  </div>
                  <div className="text-center">
                    <RotateCcw
                      className="h-5 w-5 mx-auto mb-1.5"
                      strokeWidth={1.5}
                    />
                    <p className="text-xs text-muted-foreground">
                      30-Day Returns
                    </p>
                  </div>
                  <div className="text-center">
                    <Shield
                      className="h-5 w-5 mx-auto mb-1.5"
                      strokeWidth={1.5}
                    />
                    <p className="text-xs text-muted-foreground">
                      Secure Checkout
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Accordion Sections */}
            <ProductAccordion
              description={product.description}
              details={product.metadata as Record<string, string> | undefined}
            />
          </div>
        </div>
      </div>

      {/* Hero-product only: extended storytelling sections */}
      {isHeroProduct && (
        <>
          {/* Why PawFlow */}
          <section className="py-section border-t bg-muted/40">
            <div className="container-custom">
              <div className="max-w-2xl mx-auto text-center mb-12">
                <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-3">
                  Why PawFlow
                </p>
                <h2 className="text-h2 font-heading font-semibold">
                  Engineered for the trail, loved at home
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
                {[
                  {
                    icon: Droplets,
                    title: 'Zero-waste design',
                    body:
                      'Unused water flows right back into the bottle with a squeeze — no tipping, no puddles, no mess.',
                  },
                  {
                    icon: Shield,
                    title: '304 food-grade steel',
                    body:
                      'Medical-grade stainless steel keeps water pure. BPA-free silicone bowl is dishwasher-safe.',
                  },
                  {
                    icon: Lock,
                    title: 'Truly leak-proof',
                    body:
                      'Our double-seal locking cap is pressure-tested at 40,000 cycles. Your bag stays bone-dry.',
                  },
                  {
                    icon: MountainSnow,
                    title: 'Trail-ready clip',
                    body:
                      'Integrated carabiner clips to any pack, leash, or belt loop. Lightweight 195g — barely noticed.',
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="bg-background border border-border/60 rounded-sm p-6 space-y-3"
                  >
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <f.icon
                        className="h-5 w-5 text-accent"
                        strokeWidth={2}
                      />
                    </div>
                    <h3 className="font-heading font-semibold">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Guarantee block */}
          <section className="py-section">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto grid md:grid-cols-[auto_1fr] gap-8 items-center border border-accent/30 bg-accent/5 rounded-sm p-8 lg:p-12">
                <div className="flex-shrink-0 h-20 w-20 lg:h-24 lg:w-24 rounded-full bg-accent text-accent-foreground flex items-center justify-center mx-auto md:mx-0">
                  <ShieldCheck
                    className="h-10 w-10 lg:h-12 lg:w-12"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="text-center md:text-left space-y-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
                    Happy Pup Guarantee
                  </p>
                  <h2 className="text-h3 font-heading font-semibold">
                    30 days to love it — or your money back
                  </h2>
                  <p className="text-muted-foreground leading-relaxed max-w-xl">
                    If you or your dog aren&apos;t obsessed with PawFlow, send it
                    back within 30 days for a full refund. No questions, no fuss —
                    just tail wags.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-section border-t bg-muted/40">
            <div className="container-custom">
              <div className="max-w-2xl mx-auto text-center mb-12">
                <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold mb-3">
                  From the pack
                </p>
                <h2 className="text-h2 font-heading font-semibold">
                  What pup parents are saying
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Jamie T.',
                    loc: 'Portland, OR',
                    title: 'Game changer for hikes',
                    body:
                      '&ldquo;We live in rainy PNW and Rosie is outside all day. The leak-proof claim held up through a 14-mile rain-soaked hike. Zero drips in my pack.&rdquo;',
                    pup: 'Rosie · Aussie Shepherd',
                  },
                  {
                    name: 'Marcus D.',
                    loc: 'Denver, CO',
                    title: 'Worth every penny',
                    body:
                      '&ldquo;I was skeptical about another dog bottle. This one just works. Squeeze, pour, release, done. Bentley drinks on every walk now.&rdquo;',
                    pup: 'Bentley · Pit Mix',
                  },
                  {
                    name: 'Alyssa V.',
                    loc: 'Los Angeles, CA',
                    title: 'My car&rsquo;s new MVP',
                    body:
                      '&ldquo;Lives in my cup holder full-time. Perfect for beach days, dog park, errands. The stainless steel keeps water cool in CA summers.&rdquo;',
                    pup: 'Biscuit · Mini Dachshund',
                  },
                ].map((t, i) => (
                  <div
                    key={i}
                    className="bg-background border border-border/70 rounded-sm p-6 space-y-4"
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
                    <h3 className="font-semibold">{t.title}</h3>
                    <p
                      className="text-sm text-muted-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: t.body }}
                    />
                    <div className="pt-3 border-t">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <Check
                          className="h-3.5 w-3.5 text-accent"
                          strokeWidth={3}
                        />
                        {t.name}
                        <span className="text-muted-foreground font-normal">
                          · {t.loc}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                        <PawPrint className="h-3 w-3" strokeWidth={2} />
                        {t.pup}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Final urgency strip */}
          <section className="py-section-sm bg-foreground text-primary-foreground">
            <div className="container-custom flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center">
              <Flame
                className="h-5 w-5 fill-accent text-accent"
                strokeWidth={0}
              />
              <p className="text-sm sm:text-base font-semibold">
                Limited sale — Save 37% while supplies last.
              </p>
              <Link
                href="#top"
                className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-sm"
              >
                Claim Yours
              </Link>
            </div>
          </section>
        </>
      )}
    </>
  )
}
