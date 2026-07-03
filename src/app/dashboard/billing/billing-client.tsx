"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { subscriptionPlans } from "@/lib/utils";
import { createCheckoutSession, createCustomerPortalSession } from "@/actions/stripe";
import { toast } from "sonner";
import { Sparkles, Check, ArrowRight, CreditCard } from "lucide-react";

export function BillingClient({
  subscription,
}: {
  subscription: Record<string, any> | null;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const currentPlan = subscription?.plan || "FREE";

  const handleUpgrade = async (planId: string) => {
    setLoading(planId);
    try {
      const result = await createCheckoutSession(planId);
      if (result.url) {
        window.location.href = result.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const handlePortal = async () => {
    setLoading("portal");
    try {
      const result = await createCustomerPortalSession();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      toast.error("Failed to open billing portal");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      {subscription && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  Your subscription status and details
                </CardDescription>
              </div>
              <Badge variant="premium" className="text-sm">
                {currentPlan}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={subscription.status === "ACTIVE" ? "success" : "warning"}>
                {subscription.status}
              </Badge>
            </div>
            {subscription.currentPeriodEnd && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current period ends</span>
                <span>
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
              </div>
            )}
            {(currentPlan !== "FREE" || subscription.stripeCustomerId) && (
              <Button
                variant="outline"
                onClick={handlePortal}
                disabled={loading === "portal"}
                className="mt-2"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Billing
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {subscriptionPlans.map((plan) => {
          const isCurrent = currentPlan === plan.id.toUpperCase();
          const isFree = plan.id === "free";

          return (
            <Card
              key={plan.id}
              className={`relative transition-all hover:shadow-lg ${
                isCurrent ? "border-primary ring-1 ring-primary" : ""
              } ${plan.price === 49 ? "border-primary/50" : ""}`}
            >
              {plan.price === 49 && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="premium">Popular</Badge>
                </div>
              )}
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <Button disabled className="mt-6 w-full" variant="outline">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={loading === plan.id || isFree}
                    className="mt-6 w-full gap-2"
                    variant={plan.price === 49 ? "default" : "outline"}
                  >
                    {loading === plan.id ? (
                      "Processing..."
                    ) : isFree ? (
                      "Free"
                    ) : (
                      <>
                        Upgrade <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
