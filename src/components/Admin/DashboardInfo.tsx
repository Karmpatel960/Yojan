'use client';
import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventMain from "./EventMain";
import WalletMain from "@/components/Admin/Wallet/WalletMain";
import EventPage from "@/components/Admin/CreateEvent/AdminEvent";



export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="yourevents">Your Events</TabsTrigger>
        </TabsList>
        <TabsContent value="events" className="space-y-4">
          <div className="grid">
            <EventMain />
          </div>
        </TabsContent>
        <WalletMain />
        <EventPage/>
      </Tabs>
    </div>
  )
}
