'use client'

import { useMemo, useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import {
  Check,
  Loader2,
  Flame,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Tag,
} from 'lucide-react'
import { toast } from 'sonner'
import ProductPrice, { type VariantExtension } from './product-price'
import { trackAddToCart } from '@/lib/analytics'
import { trackMetaEvent, toMetaCurrencyValue } from '@/lib/meta-pixel'
import { formatPrice } from '@/lib/utils/format-price'
import type { Product } from '@/types'

interface BundleActionsProps {
  product: Product
  variantExtensions?: Record<string, VariantExtension>
}

interface VariantOption {
  option_id?: string
  option?: { id: string }
  value: string
}

interface ProductVariantWithPrice {
  id: string
  options?: VariantOption[]
  calculated_price?:
    | {
        calculated_amount?: number
        currency_code?: string
      }
    | number
  [key: string]: unknown
}

interface ProductOptionValue {
  id?: string
  value: string
}

interface ProductOptionWithValues {
  id: string
  title: string
  values?: (string | ProductOptionValue)[]
}

function getVariantPriceAmount(
  variant: ProductVariantWithPrice | undefined,
): number | null {
  const cp = variant?.calculated_price
  if (!cp) return null
  return typeof cp === 'number' ? cp : cp.calculated_amount ?? null
}

interface BundleTier {
  id: 'single' | 'double' | 'triple'
  label: string
  qty: number
  badge?: string
  discountPct: number // fraction off each unit (0 = none)
  headline: string
  subline: string
}

const BUNDLE_TIERS: BundleTier[] = [
  {
    id: 'single',
    label: '1 Bottle',
    qty: 1,
    discountPct: 0,
    headline: 'Just the one',
    subline: 'Perfect to try',
  },
  {
    id: 'double',
    label: '2 Bottles',
    qty: 2,
    badge: 'Most Popular',
    discountPct: 0.15,
    headline: 'Save 15% — one for home, one for the car',
    subline: 'Best value for daily walks',
  },
  {
    id: 'triple',
    label: 'Buy 2 Get 1 FREE',
    qty: 3,
    badge: 'Best Deal',
    discountPct: 1 / 3, // 33% off because 3 for the price of 2
    headline: 'Gift one, keep two',
    subline: 'Free bottle auto-added at checkout',
  },
]

export default function BundleActions({
  product,
  variantExtensions,
}: BundleActionsProps) {
  const variants = useMemo(
    () => (product.variants || []) as unknown as ProductVariantWithPrice[],
    [product.variants],
  )
  const options = useMemo(() => product.options || [], [product.options])

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const defaults: Record<string, string> = {}
    const firstVariant = variants[0]
    if (firstVariant?.options) {
      for (const opt of firstVariant.options) {
        const optionId = opt.option_id || opt.option?.id
        if (optionId && opt.value) defaults[optionId] = opt.value
      }
    }
    return defaults
  })
  const [tier, setTier] = useState<BundleTier>(BUNDLE_TIERS[1])
  const [justAdded, setJustAdded] = useState(false)
  const { addItemAsync, isAddingItem } = useCart()

  const selectedVariant = useMemo(() => {
    if (variants.length <= 1) return variants[0]
    return (
      variants.find((v) => {
        if (!v.options) return false
        return v.options.every((opt) => {
          const optionId = opt.option_id || opt.option?.id
          if (!optionId) return false
          return selectedOptions[optionId] === opt.value
        })
      }) || variants[0]
    )
  }, [variants, selectedOptions])

  const ext = selectedVariant?.id
    ? variantExtensions?.[selectedVariant.id]
    : null
  const unitPriceCents = getVariantPriceAmount(selectedVariant)
  const cp = selectedVariant?.calculated_price
  const currency =
    (cp && typeof cp !== 'number' ? cp.currency_code : undefined) || 'usd'

  const allowBackorder = ext?.allow_backorder ?? false
  const inventoryQuantity = ext?.inventory_quantity
  const isOutOfStock =
    !allowBackorder && inventoryQuantity != null && inventoryQuantity <= 0
  const isLowStock =
    inventoryQuantity != null &&
    inventoryQuantity > 0 &&
    inventoryQuantity < 20

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }))
  }

  // Total calculations for bundle tiers
  const tierTotals = useMemo(() => {
    if (!unitPriceCents) return null
    return BUNDLE_TIERS.map((t) => {
      const baseTotal = unitPriceCents * t.qty
      const effectiveTotal = Math.round(baseTotal * (1 - t.discountPct))
      const perUnit = Math.round(effectiveTotal / t.qty)
      const savings = baseTotal - effectiveTotal
      return { id: t.id, baseTotal, effectiveTotal, perUnit, savings }
    })
  }, [unitPriceCents])

  const currentTotal =
    tierTotals?.find((t) => t.id === tier.id)?.effectiveTotal ?? null
  const currentBase =
    tierTotals?.find((t) => t.id === tier.id)?.baseTotal ?? null
  const currentSavings =
    tierTotals?.find((t) => t.id === tier.id)?.savings ?? 0

  const handleAddToCart = async () => {
    if (!selectedVariant?.id || isOutOfStock) return

    try {
      await addItemAsync({ variantId: selectedVariant.id, quantity: tier.qty })
      setJustAdded(true)
      toast.success(
        tier.qty > 1
          ? `${tier.qty} bottles added to your bag`
          : 'Added to your bag',
      )

      const metaValue = toMetaCurrencyValue(unitPriceCents)
      trackAddToCart(
        product?.id || '',
        selectedVariant.id,
        tier.qty,
        unitPriceCents ?? undefined,
      )
      trackMetaEvent('AddToCart', {
        content_ids: [selectedVariant.id],
        content_type: 'product',
        content_name: product?.title,
        value: metaValue ? metaValue * tier.qty : undefined,
        currency,
        contents: [
          { id: selectedVariant.id, quantity: tier.qty, item_price: metaValue },
        ],
        num_items: tier.qty,
      })
      setTimeout(() => setJustAdded(false), 2200)
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Failed to add to bag'
      toast.error(msg)
    }
  }

  const hasMultipleVariants = variants.length > 1

  return (
    <div className="space-y-6">
      {/* Live urgency banner */}
      <div className="flex items-center gap-2 text-xs font-medium text-accent">
        <Flame className="h-3.5 w-3.5 fill-accent" strokeWidth={0} />
        <span>
          <span className="font-semibold">47 people</span> bought this in the last
          24 hours
        </span>
      </div>

      {/* Price */}
      <ProductPrice
        amount={unitPriceCents}
        currency={currency}
        compareAtPrice={ext?.compare_at_price}
        soldOut={isOutOfStock}
        size="detail"
      />

      {/* Color selector */}
      {hasMultipleVariants &&
        options.map((option: ProductOptionWithValues) => {
          const values = (option.values || [])
            .map((v) => (typeof v === 'string' ? v : v.value))
            .filter(Boolean) as string[]

          if (
            values.length <= 1 &&
            (values[0] === 'One Size' || values[0] === 'Default')
          )
            return null

          const optionId = option.id
          const selectedValue = selectedOptions[optionId]

          return (
            <div key={optionId}>
              <h3 className="text-xs uppercase tracking-widest font-semibold mb-3">
                {option.title}
                {selectedValue && (
                  <span className="ml-2 normal-case tracking-normal font-normal text-muted-foreground">
                    — {selectedValue}
                  </span>
                )}
              </h3>
              <div className="flex flex-wrap gap-2">
                {values.map((value) => {
                  const isSelected = selectedValue === value
                  const isAvailable = variants.some((v) => {
                    const hasValue = v.options?.some(
                      (o) =>
                        (o.option_id === optionId ||
                          o.option?.id === optionId) &&
                        o.value === value,
                    )
                    if (!hasValue) return false
                    const vExt = variantExtensions?.[v.id]
                    if (!vExt) return true
                    if (vExt.allow_backorder) return true
                    return (
                      vExt.inventory_quantity == null ||
                      vExt.inventory_quantity > 0
                    )
                  })

                  return (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(optionId, value)}
                      disabled={!isAvailable}
                      className={`min-w-[48px] px-4 py-2.5 text-sm border transition-all ${
                        isSelected
                          ? 'border-foreground bg-foreground text-background'
                          : isAvailable
                            ? 'border-border hover:border-foreground'
                            : 'border-border text-muted-foreground/40 line-through cursor-not-allowed'
                      }`}
                    >
                      {value}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}

      {/* Bundle picker */}
      <div>
        <div className="flex items-end justify-between mb-3">
          <h3 className="text-xs uppercase tracking-widest font-semibold">
            Choose your pack
          </h3>
          {currentSavings > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
              <Tag className="h-3 w-3" />
              Saving {formatPrice(currentSavings, currency)}
            </span>
          )}
        </div>
        <div className="space-y-2.5">
          {BUNDLE_TIERS.map((t) => {
            const totals = tierTotals?.find((x) => x.id === t.id)
            const isSelected = tier.id === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTier(t)}
                className={`relative w-full text-left border-2 rounded-sm px-4 py-3.5 transition-all ${
                  isSelected
                    ? 'border-accent bg-accent/5'
                    : 'border-border hover:border-foreground/40'
                }`}
              >
                {t.badge && (
                  <span className="absolute -top-2 left-4 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm">
                    {t.badge}
                  </span>
                )}
                <div className="flex items-center gap-4">
                  {/* Radio */}
                  <div
                    className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-accent bg-accent'
                        : 'border-border'
                    }`}
                  >
                    {isSelected && (
                      <Check
                        className="h-3 w-3 text-accent-foreground"
                        strokeWidth={3}
                      />
                    )}
                  </div>

                  {/* Label block */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm font-semibold">{t.label}</span>
                      <span className="text-xs text-muted-foreground">
                        · {t.headline}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.subline}
                    </p>
                  </div>

                  {/* Price block */}
                  {totals && (
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-semibold">
                        {formatPrice(totals.effectiveTotal, currency)}
                      </p>
                      {totals.savings > 0 && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatPrice(totals.baseTotal, currency)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Low stock indicator */}
      {isLowStock && inventoryQuantity != null && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-accent font-semibold">
              <Flame className="h-3.5 w-3.5" />
              Selling fast
            </span>
            <span className="text-muted-foreground">
              Only{' '}
              <span className="font-semibold text-foreground">
                {inventoryQuantity}
              </span>{' '}
              left in this color
            </span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{
                width: `${Math.max(8, Math.min(100, (inventoryQuantity / 50) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Add to Cart — single prominent button with total */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAddingItem}
        className={`w-full flex items-center justify-center gap-3 py-4 text-sm font-bold uppercase tracking-wider transition-all rounded-sm ${
          isOutOfStock
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : justAdded
              ? 'bg-green-700 text-white'
              : 'bg-accent text-accent-foreground hover:opacity-90'
        }`}
      >
        {isAddingItem ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : justAdded ? (
          <>
            <Check className="h-4 w-4" />
            Added to Bag
          </>
        ) : isOutOfStock ? (
          'Sold Out'
        ) : (
          <>
            <span>Add {tier.qty > 1 ? `${tier.qty} to Bag` : 'to Bag'}</span>
            {currentTotal != null && (
              <>
                <span className="opacity-60">·</span>
                <span>{formatPrice(currentTotal, currency)}</span>
                {currentBase != null && currentSavings > 0 && (
                  <span className="opacity-60 line-through font-normal">
                    {formatPrice(currentBase, currency)}
                  </span>
                )}
              </>
            )}
          </>
        )}
      </button>

      {/* Secondary checkout info */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        <span>Secure checkout · Visa · Mastercard · Apple Pay · Shop Pay</span>
      </div>

      {/* Trust badges row */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        <div className="flex flex-col items-center text-center gap-1.5 py-3 border border-border/60 rounded-sm">
          <ShieldCheck
            className="h-5 w-5 text-accent"
            strokeWidth={1.5}
          />
          <p className="text-[11px] font-semibold leading-tight">
            30-Day
            <br />
            Guarantee
          </p>
        </div>
        <div className="flex flex-col items-center text-center gap-1.5 py-3 border border-border/60 rounded-sm">
          <Truck className="h-5 w-5 text-accent" strokeWidth={1.5} />
          <p className="text-[11px] font-semibold leading-tight">
            Free Shipping
            <br />
            Over $35
          </p>
        </div>
        <div className="flex flex-col items-center text-center gap-1.5 py-3 border border-border/60 rounded-sm">
          <RotateCcw
            className="h-5 w-5 text-accent"
            strokeWidth={1.5}
          />
          <p className="text-[11px] font-semibold leading-tight">
            Easy 30-Day
            <br />
            Returns
          </p>
        </div>
      </div>
    </div>
  )
}
