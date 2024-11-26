'use client';
import Signup from "@/components/Admin/Signup";
import { Button } from "@/components/ui/button";
import React, { useRef } from 'react';
import { ArrowRight, Wallet, Brain, BarChart3 } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface StatCardProps {
  value: string;
  label: string;
}

export default function Page() {
  const signupRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    signupRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Revolutionize Your Event Management</h1>
          <p className="text-xl mb-8">Harness the power of Web3 payments, AI recommendations, and advanced analytics.</p>
          <Button variant="secondary" size="lg" onClick={handleScroll}>
            Get Started <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12">Our Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Wallet className="w-12 h-12 text-purple-600" />}
              title="Web3 Payments"
              description="Accept cryptocurrency payments seamlessly with our integrated Solana payment system."
            />
            <FeatureCard
              icon={<Brain className="w-12 h-12 text-purple-600" />}
              title="AI Recommendations"
              description="Leverage AI to provide personalized event recommendations to your attendees."
            />
            <FeatureCard
              icon={<BarChart3 className="w-12 h-12 text-purple-600" />}
              title="Advanced Analytics"
              description="Gain valuable insights with our comprehensive analytics dashboard."
            />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <StatCard value="10,000+" label="Events Hosted" />
            <StatCard value="$5M+" label="in Transactions" />
            <StatCard value="98%" label="Customer Satisfaction" />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12">What Our Clients Say</h2>
          <div className="max-w-3xl mx-auto">
            <blockquote className="text-xl italic text-center">
              "This platform has transformed how we manage our events. The Web3 integration and AI recommendations have significantly boosted our attendance and revenue."
            </blockquote>
            <div className="mt-4 text-center">
              <p className="font-semibold">Jane Doe</p>
              <p className="text-gray-600">CEO, TechConf Inc.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sign Up Section */}
      <section className="py-20 bg-gray-100" ref={signupRef}>
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-8">Get Started Today</h2>
            <div className="bg-white shadow-lg rounded-lg p-8">
              <Signup />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-4">Ready to Transform Your Events?</h2>
          <p className="text-xl mb-8">Join thousands of successful event organizers using our platform.</p>
          <Button variant="secondary" size="lg" onClick={handleScroll}>
            Start Your Free Trial <ArrowRight className="ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div>
      <p className="text-4xl font-bold mb-2">{value}</p>
      <p className="text-xl">{label}</p>
    </div>
  );
}
