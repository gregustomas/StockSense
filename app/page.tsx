"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowLeftRightIcon,
  BarChart3Icon,
  PackageIcon,
  ShieldCheckIcon,
  UsersIcon,
  ZapIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScreenshotSlider } from "@/components/landing/ScreenshotSlider";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

const features = [
  {
    icon: PackageIcon,
    title: "Product Management",
    description:
      "Add, edit and track all your products with SKU, categories and stock levels.",
  },
  {
    icon: ArrowLeftRightIcon,
    title: "Stock Movements",
    description:
      "Record incoming and outgoing stock with full movement history per product.",
  },
  {
    icon: UsersIcon,
    title: "Role-based Access",
    description:
      "Admin, Manager and Viewer roles — each with appropriate permissions.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure by Default",
    description:
      "Firebase Auth and Firestore Security Rules keep your data safe.",
  },
  {
    icon: BarChart3Icon,
    title: "Real-time Dashboard",
    description:
      "Live stats, low stock alerts and movement charts updated in real time.",
  },
  {
    icon: ZapIcon,
    title: "Fast & Responsive",
    description:
      "Built with Next.js and Tailwind — works on desktop and mobile.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto px-6 py-4">
          <p className="text-xl font-bold">StockSense</p>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-start overflow-hidden">
        <BackgroundRippleEffect />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge>Demo version 1.0</Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Inventory management <br />
              <span className="text-muted-foreground">made simple.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Track products, manage stock movements and control team access — all
            in one real-time dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-4 justify-center"
          >
            <Button size="lg" asChild>
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Demo  */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto px-6 pb-24"
      >
        <ScreenshotSlider />
      </motion.section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need
          </h2>
          <p className="text-muted-foreground text-lg">
            Built for small and medium businesses.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <feature.icon className="h-8 w-8 mb-4 text-primary" />
                    <h3 className="font-semibold text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto px-6 pb-24"
      >
        <div className="rounded-xl bg-foreground text-background p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-background/70 mb-8">
            Create your account and start managing inventory today.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center md:flex md:items-center md:justify-between text-sm text-muted-foreground">
          <p>StockSense © 2026</p>
          <p>Built with Next.js & Firebase by Tomáš Greguš</p>
        </div>
      </footer>
    </div>
  );
}
