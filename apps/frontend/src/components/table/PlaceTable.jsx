  "use client";

  import { useState, useMemo } from "react";
  import { useRouter } from "next/navigation";
  import { Pencil, Trash, MapPin, Calendar, Globe } from "lucide-react";
  import ActionMenu from "../common/ActionMenu";
  import { TableShell, TableLoader, TableEmpty } from "@/components/table/core";

  export default function PlaceCards({
    data = [],
    loading,
    onEdit,
    onDelete,
  }) {
    const [search, setSearch] = useState("");
    const router = useRouter();

    const filteredPlaces = useMemo(() => {
      return data.filter((place) =>
        [place.name, place.location].some((val) =>
          val?.toLowerCase().includes(search.toLowerCase())
        )
      );
    }, [data, search]);

    return (
      <TableShell
        title="Tourist Places"
        subtitle={`${filteredPlaces.length} total places found`}
        searchProps={{
          value: search,
          onChange: (e) => setSearch(e.target.value),
          onClear: () => setSearch(""),
          placeholder: "Search by name or city...",
        }}
      >
        {loading ? (
          <div className="p-8"><TableLoader rows={3} /></div>
        ) : filteredPlaces.length === 0 ? (
          <TableEmpty message="No tourist places found matching your search." />
        ) : (
          /* Card Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredPlaces.map((place) => (
              <div 
                key={place.id} 
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative group"
              >
                {/* Top Row: Name & Action Menu */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {place.name}
                    </h3>
                    <div className="flex items-center text-slate-500 text-sm mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      {place.location || "Unknown Location"}
                    </div>
                  </div>
                  
                  <ActionMenu
                    items={[
                      {
                        label: "View",
                        icon: MapPin,
                        onClick: () => router.push(`/dashboard/place/${place.id}`),
                      },
                      {
                        label: "Edit",
                        icon: Pencil,
                        onClick: () => onEdit?.(place),
                      },
                      // {
                      //   label: "Delete",
                      //   icon: Trash,
                      //   danger: true,
                      //   onClick: () => onDelete?.(place),
                      // },
                    ]}
                  />
                </div>

                {/* Coordinates Section */}
                <div className="bg-slate-50 rounded-lg p-3 flex justify-between mb-4">
                  <div className="text-center flex-1 border-r border-slate-200">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Latitude</p>
                    <p className="font-mono text-sm text-slate-700">{place.latitude?.toFixed(6) ?? "0.000000"}</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Longitude</p>
                    <p className="font-mono text-sm text-slate-700">{place.longitude?.toFixed(6) ?? "0.000000"}</p>
                  </div>
                </div>

                {/* Footer: Date */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex items-center text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(place.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <button 
                    onClick={() => router.push(`/dashboard/place/${place.id}`)}
                    className="text-xs font-medium text-blue-600 hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </TableShell>
    );
  }