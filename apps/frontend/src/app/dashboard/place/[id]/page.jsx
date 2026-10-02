"use client";

import { useParams, useRouter } from "next/navigation";
import { usePlaceById } from "@/lib/queries/usePlace";
import { MapPin, Globe, ArrowLeft, Calendar, Compass } from "lucide-react";

export default function PlaceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: place, isLoading } = usePlaceById(id);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900 mb-4"></div>
        <p className="text-slate-500 font-medium">Loading details...</p>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Place not found</h2>
          <button 
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:underline inline-flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" /> Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation & Header */}
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to List
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {place.name}
                  </h1>
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Tourist Spot
                  </span>
                </div>

                <div className="flex items-center text-slate-500 mb-8 bg-slate-50 self-start px-3 py-2 rounded-lg border border-slate-100">
                  <MapPin className="mr-2 text-slate-400" size={18} />
                  <span className="font-medium">{place.location || "Location not specified"}</span>
                </div>

                <div className="space-y-8">
                  <section>
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                      <Globe size={16} className="mr-2" /> Overview
                    </h2>
                    <p className="text-slate-700 leading-relaxed text-lg font-medium">
                      {place.shortDescription || "No short description available for this place."}
                    </p>
                  </section>

                  <div className="h-px bg-slate-100 w-full" />

                  <section>
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                      Detailed Information
                    </h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line text-base">
                      {place.description || "The detailed description for this place has not been provided yet. Stay tuned for more updates."}
                    </p>
                  </section>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Metadata & Stats */}
          <div className="space-y-6">
            {/* Quick Stats Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-slate-900 font-bold mb-6 text-lg">Location Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center">
                    <div className="bg-white p-2 rounded-lg shadow-sm mr-3">
                      <Compass size={18} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Latitude</p>
                      <p className="font-mono font-bold text-slate-800">{place.latitude || "0.0000"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center">
                    <div className="bg-white p-2 rounded-lg shadow-sm mr-3">
                      <Compass size={18} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Longitude</p>
                      <p className="font-mono font-bold text-slate-800">{place.longitude || "0.0000"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Metadata */}
            <div className="bg-slate-900 rounded-3xl shadow-lg p-6 text-white">
              <div className="flex items-center mb-4">
                <Calendar size={20} className="text-slate-400 mr-3" />
                <h3 className="font-bold">Record Info</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-xs">Created On</p>
                  <p className="text-sm font-medium">
                    {new Date(place.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="h-px bg-slate-800" />
                <div>
                  <p className="text-slate-400 text-xs">Place ID</p>
                  <p className="text-xs font-mono text-slate-300 break-all">{id}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}