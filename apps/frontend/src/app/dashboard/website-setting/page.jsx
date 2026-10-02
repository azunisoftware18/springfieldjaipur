"use client";

import React, { useEffect, useState } from "react";
import { useGetSetting } from "@/lib/queries/useSetting";
import { useUpdateSetting } from "@/lib/mutations/useSetting";

import Button from "@/components/ui/Button";
import TextareaField from "@/components/ui/TextareaField";
import InputField from "@/components/ui/InputField";

function Page() {
  const { data, isLoading } = useGetSetting();
  const { mutate, isPending } = useUpdateSetting();

  const [form, setForm] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    linkedin: "",
  });

  const [logo, setLogo] = useState(null);

  useEffect(() => {
    if (data) {
      setForm({
        companyName: data.companyName || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        facebook: data.socialLinks?.facebook || "",
        instagram: data.socialLinks?.instagram || "",
        twitter: data.socialLinks?.twitter || "",
        youtube: data.socialLinks?.youtube || "",
        linkedin: data.socialLinks?.linkedin || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();

    Object.keys(form).forEach((key) => {
      fd.append(key, form[key]);
    });

    if (logo) {
      fd.append("logo", logo);
    }

    mutate(fd);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500 animate-pulse font-medium">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        
        {/* Page Header */}
        <div className="border-b border-slate-200 bg-white px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Website Settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your public-facing company details, contact information, and social presence.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8">
          
          {/* --- Section 1: General Info --- */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">General Information</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InputField
                label="Company Name"
                type="text"
                name="companyName"
                placeholder="Acme Corp"
                value={form.companyName}
                onChange={handleChange}
              />

              <InputField
                label="Email Address"
                type="email"
                name="email"
                placeholder="contact@company.com"
                value={form.email}
                onChange={handleChange}
              />

              <InputField
                label="Phone Number"
                type="text"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* --- Section 2: Branding --- */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Branding</h2>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Preview Avatar/Logo */}
              {data?.logo && (
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm">
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${data.logo}`}
                    alt="Company Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              
              {/* File Input */}
              <div className="flex-1">
                <InputField
                  label={data?.logo ? "Update Logo" : "Upload Logo"}
                  type="file"
                  onChange={(e) => setLogo(e.target.files[0])}
                  className="max-w-md"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Recommended format: PNG, JPG, or SVG. Maximum file size 2MB.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* --- Section 3: Location --- */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Location</h2>
            <TextareaField
              label="Physical Address"
              placeholder="123 Business Avenue&#10;Suite 100&#10;City, State, Zip"
              rows={3}
              name="address"
              value={form.address}
              onChange={handleChange}
              resize="vertical"
            />
          </section>

          <hr className="border-slate-200" />

          {/* --- Section 4: Social Links --- */}
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Social Profiles</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InputField
                label="Facebook"
                type="text"
                placeholder="https://facebook.com/your-page"
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
              />

              <InputField
                label="Instagram"
                type="text"
                placeholder="https://instagram.com/your-handle"
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
              />

              <InputField
                label="Twitter / X"
                type="text"
                placeholder="https://twitter.com/your-handle"
                name="twitter"
                value={form.twitter}
                onChange={handleChange}
              />

              <InputField
                label="YouTube"
                type="text"
                placeholder="https://youtube.com/@your-channel"
                name="youtube"
                value={form.youtube}
                onChange={handleChange}
              />

              <InputField
                label="LinkedIn"
                type="text"
                placeholder="https://linkedin.com/company/your-company"
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* --- Form Actions --- */}
          <div className="mt-8 flex items-center justify-end border-t border-slate-200 pt-6">
            <Button
              type="submit"
              text={isPending ? "Saving Changes..." : "Save Settings"}
              className={isPending ? "opacity-50 pointer-events-none" : "min-w-[150px]"}
            />
          </div>

        </form>
      </div>
    </div>
  );
}

export default Page;