"use client";
import { useState, useRef, ChangeEvent, KeyboardEvent, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import domtoimage from "dom-to-image";

const BATCHES = [
  "Winter 2030",
  "Summer 2029",
  "Winter 2029",
  "Summer 2028",
  "Winter 2028",
  "Summer 2027",
  "Winter 2027",
  "Summer 2026",
  "Winter 2026",
];

export default function HomeClient() {
  const [form, setForm] = useState<{
    image: File | null;
    imageUrl: string;
    company: string;
    description: string;
    jobs: number;
    url: string;
    batch: string;
    tags: string[];
    tagInput: string;
  }>({
    image: null,
    imageUrl: "",
    company: "",
    description: "",
    jobs: 69,
    url: "",
    batch: "",
    tags: [],
    tagInput: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (
      type === "file" &&
      e.target instanceof HTMLInputElement &&
      e.target.files
    ) {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setForm((f) => ({ ...f, image: file, imageUrl: url }));
      }
    } else if (name === "jobs") {
      setForm((f) => ({ ...f, jobs: value ? parseInt(value) : 69 }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleTagInput = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, tagInput: e.target.value }));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "," || e.key === "Enter") && form.tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(form.tagInput.trim())) {
        setForm((f) => ({
          ...f,
          tags: [...f.tags, f.tagInput.trim()],
          tagInput: "",
        }));
      } else {
        setForm((f) => ({ ...f, tagInput: "" }));
      }
    }
  };

  const handleRemoveTag = (idx: number) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.image || !form.company || !form.url || !form.batch) return;
    setSubmitted(true);
  };

  const handleEdit = () => {
    setSubmitted(false);
  };

  const handleDownloadOG = async () => {
    if (!cardRef.current) return;

    setDownloading(true);
    try {
      const dataUrl = await domtoimage.toPng(cardRef.current, {
        quality: 1.0,
        bgcolor: "#faf9f6",
      });

      const link = document.createElement("a");
      link.download = `${form.company.replace(/\s+/g, "_")}_yc_card.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="grid grid-rows-[auto_20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Card
        className="w-full max-w-md p-6 flex flex-col gap-4 row-start-1"
        style={{ display: submitted ? "none" : undefined }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Label htmlFor="image">
            App Image <span className="text-red-500">*</span>
          </Label>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            name="image"
            id="image"
            required
            onChange={handleChange}
          />
          <Label htmlFor="company">
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            type="text"
            name="company"
            id="company"
            required
            value={form.company}
            onChange={handleChange}
          />
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            type="text"
            name="description"
            id="description"
            maxLength={100}
            value={form.description}
            onChange={handleChange}
            placeholder="Brief description of your company (max 100 characters)"
          />
          <Label htmlFor="jobs">Number of Jobs</Label>
          <Input
            type="number"
            name="jobs"
            id="jobs"
            min={0}
            value={form.jobs}
            onChange={handleChange}
          />
          <Label htmlFor="url">
            URL <span className="text-red-500">*</span>
          </Label>
          <Input
            type="url"
            name="url"
            id="url"
            required
            value={form.url}
            onChange={handleChange}
          />
          <Label htmlFor="batch">
            Batch <span className="text-red-500">*</span>
          </Label>
          <Select
            value={form.batch}
            onValueChange={(value) => setForm((f) => ({ ...f, batch: value }))}
            name="batch"
            required
          >
            <SelectTrigger id="batch">
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              {BATCHES.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label>Tags</Label>
          {form.tags.length > 0 && (
            <div
              className={cn(
                "flex flex-wrap gap-x-2 mb-1",
                form.tags.length > 0 && "mb-0 "
              )}
            >
              {form.tags.map((tag, idx) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-[2px] bg-[#E6E4DC] uppercase tracking-widest px-3 py-[3px] text-[12px] font-thin"
                >
                  {tag}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-4 w-4 p-0 ml-1 text-red-500"
                    aria-label={`Remove tag ${tag}`}
                    onClick={() => handleRemoveTag(idx)}
                  >
                    ×
                  </Button>
                </span>
              ))}
            </div>
          )}
          <Input
            type="text"
            value={form.tagInput}
            onChange={handleTagInput}
            onKeyDown={handleTagKeyDown}
            placeholder="Type and press Enter or ,"
          />
          <Button type="submit" className="mt-2 w-full">
            Generate
          </Button>
        </form>
      </Card>

      {submitted && (
        <div
            className=""
        >
          <Card
            ref={cardRef}
            className="w-full max-w-3xl bg-[#faf9f6] dark:bg-neutral-900 rounded-lg shadow p-8 flex flex-col gap-6 items-center row-start-1"
          >
            <div className="flex flex-col gap-6 w-full">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink>Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>Companies</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{form.company}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="flex flex-row gap-5 items-center">
                <Avatar className="w-32 h-32 bg-white border rounded-xl">
                  {form.imageUrl ? (
                    <AvatarImage src={form.imageUrl} alt="App logo" />
                  ) : (
                    <AvatarFallback>Logo</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{form.company}</h1>
                  {form.description && (
                    <p className="mb-4 prose text-black prose-md">
                      {form.description}
                    </p>
                  )}
                  <div className="align-center flex flex-row flex-wrap gap-x-2 gap-y-2">
                    <span>
                      <div className="rounded-[2px]  bg-[#E6E4DC] uppercase tracking-widest px-3 py-[3px] text-[12px] font-thin undefined flex flex-row items-center">
                        <div className="flex flex-row items-center gap-[6px]">
                          <svg
                            viewBox="0 0 320 320"
                            xmlns="http://www.w3.org/2000/svg"
                            className="inline-block h-3 w-3 text-[#E36D34]"
                            width="1.25em"
                            height="1.25em"
                          >
                            <title>Y Combinator Logo</title>
                            <g
                              stroke="none"
                              strokeWidth={1}
                              fill="none"
                              fillRule="evenodd"
                            >
                              <g>
                                <polygon
                                  fill="#F05F22"
                                  points="0 320 320 320 320 0 0 0"
                                />
                                <polygon
                                  fill="#FFFFFF"
                                  points="173 175.8652 173 247.0002 146 247.0002 146 175.8652 77.086 73.0002 110 73.0002 159.628 148.9972 209 73.0002 241.914 73.0002"
                                />
                              </g>
                            </g>
                          </svg>
                          <span>{form.batch}</span>
                        </div>
                      </div>
                    </span>
                    <div className="rounded-[2px]  bg-[#E6E4DC] uppercase tracking-widest px-3 py-[3px] text-[12px] font-thin">
                      <div className="flex flex-row items-center justify-between">
                        <div className="mr-[6px] h-3 w-3 rounded-full bg-green-500" />
                        Public
                      </div>
                    </div>
                    {form.tags.map((tag) => (
                      <span key={tag}>
                        <div className="rounded-[2px]  bg-[#E6E4DC] uppercase tracking-widest px-3 py-[3px] text-[12px] font-thin">
                          {tag}
                        </div>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="my-4 w-full">
              <hr />
              <div className="flex flex-col justify-between md:flex-row">
                <nav className="flex justify-start space-x-8">
                  <div className="flex h-16 items-center">
                    <span className="rounded-lg px-3 py-2 text-slate-700 no-underline hover:bg-[#EDEBE3] font-bold">
                      Company
                    </span>
                  </div>
                  <div className="flex h-16 items-center">
                    <span className="rounded-lg px-3 py-2 text-slate-700 no-underline hover:bg-[#EDEBE3] ">
                      Jobs
                    </span>
                    <span className="bg-[rgb(230,228,220)] ml-0 px-1.5 font-bold no-underline rounded-[4px] text-[12px] font-bold">
                      {form.jobs}
                    </span>
                  </div>
                  <div className="flex h-16 items-center">
                    <span className="rounded-lg px-3 py-2 text-slate-700 no-underline hover:bg-[#EDEBE3] ">
                      News
                    </span>
                  </div>
                </nav>
                <div className="group flex flex-row items-center px-3 leading-none text-linkColor ">
                  <a
                    href={form.url}
                    target="_blank"
                    className="mb-2 whitespace-nowrap md:mb-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      aria-hidden="true"
                      width="1.25em"
                      height="1.25em"
                      className="-mt-px inline-block h-4 w-4 text-gray-600 group-hover:underline"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    &nbsp;
                    <div className="inline-block group-hover:underline text-blue-500">
                      {form.url}
                    </div>
                  </a>
                </div>
              </div>
              <hr />
            </div>
          </Card>
          <div className="flex flex-row gap-2 mt-4 justify-center">
            <Button onClick={handleDownloadOG} disabled={downloading}>
              {downloading ? "Downloading..." : "Download"}
            </Button>
            <Button onClick={handleEdit} variant="outline">
              Edit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
