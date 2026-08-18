// Beast-System-3-Resolution/src/resolution-violation.ts

export type ViolationSeverity =
  | "LOW"
  | "MODERATE"
  | "HIGH"
  | "CRITICAL";

export type ViolationType =
  | "CONSTITUTIONAL_BREACH"
  | "MUNICIPAL_INFRACTION"
  | "TRAUMA_RISK"
  | "WELLBEING_HARM"
  | "LUCR_IMPACT"
  | "UNDEFINED";

export interface ResolutionViolation {
  id: string;
  type: ViolationType;
  severity: ViolationSeverity;
  description: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export class ViolationFactory {
  public create(
    type: ViolationType,
    severity: ViolationSeverity,
    description: string,
    metadata?: Record<string, unknown>
  ): ResolutionViolation {
    return {
      id: `violation_${Date.now()}`,
      type,
      severity,
      description,
      createdAt: new Date().toISOString(),
      metadata,
    };
  }

  public classify(payload: Record<string, unknown>): ResolutionViolation {
    const trauma = payload["traumaRisk"] as number | undefined;
    const lucr = payload["lucrImpact"] as number | undefined;
    const constitutional = payload["constitutionalFlag"] as boolean | undefined;

    if (constitutional) {
      return this.create(
        "CONSTITUTIONAL_BREACH",
        "CRITICAL",
        "Constitutional rule violation detected.",
        payload
      );
    }

    if (trauma && trauma >= 0.5) {
      return this.create(
        "TRAUMA_RISK",
        trauma >= 0.8 ? "CRITICAL" : "HIGH",
        "High trauma‑risk detected.",
        payload
      );
    }

    if (lucr && lucr < 0.3) {
      return this.create(
        "LUCR_IMPACT",
        "MODERATE",
        "Negative LUCR wellbeing impact detected.",
        payload
      );
    }

    return this.create(
      "UNDEFINED",
      "LOW",
      "No clear violation detected.",
      payload
    );
  }
}

export function createViolationFactory(): ViolationFactory {
  return new ViolationFactory();
}
