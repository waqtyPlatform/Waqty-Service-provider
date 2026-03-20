// ── Service Price Override & Resolution ──────────────────

export interface ServicePriceOverride {
    id: string;
    serviceId: string;
    branchId?: string;
    employeeId?: string;
    pricingTier?: string;
    price: number;
}

export type PriceSource = 'branch+employee' | 'branch+tier' | 'branch' | 'employee' | 'tier' | 'base';

export interface ResolvedPrice {
    price: number;
    source: PriceSource;
}

/**
 * Resolves the effective price for a service based on cascading overrides.
 *
 * Priority (first match wins):
 * 1. Branch + Employee override
 * 2. Branch + Tier override
 * 3. Branch-only override
 * 4. Employee-only override
 * 5. Tier-only override
 * 6. Base service price
 */
export function resolveServicePrice(
    service: { id: string; price: number },
    employee: { id: string; level?: string },
    branchId: string | undefined,
    overrides: ServicePriceOverride[]
): ResolvedPrice {
    // 1. Branch + Employee
    if (branchId) {
        const match = overrides.find(
            o => o.serviceId === service.id && o.branchId === branchId && o.employeeId === employee.id && !o.pricingTier
        );
        if (match) return { price: match.price, source: 'branch+employee' };
    }

    // 2. Branch + Tier
    if (branchId && employee.level) {
        const match = overrides.find(
            o =>
                o.serviceId === service.id &&
                o.branchId === branchId &&
                o.pricingTier === employee.level &&
                !o.employeeId
        );
        if (match) return { price: match.price, source: 'branch+tier' };
    }

    // 3. Branch-only
    if (branchId) {
        const match = overrides.find(
            o => o.serviceId === service.id && o.branchId === branchId && !o.employeeId && !o.pricingTier
        );
        if (match) return { price: match.price, source: 'branch' };
    }

    // 4. Employee-only
    const empMatch = overrides.find(
        o => o.serviceId === service.id && !o.branchId && o.employeeId === employee.id && !o.pricingTier
    );
    if (empMatch) return { price: empMatch.price, source: 'employee' };

    // 5. Tier-only
    if (employee.level) {
        const tierMatch = overrides.find(
            o => o.serviceId === service.id && !o.branchId && o.pricingTier === employee.level && !o.employeeId
        );
        if (tierMatch) return { price: tierMatch.price, source: 'tier' };
    }

    // 6. Base price
    return { price: service.price, source: 'base' };
}
