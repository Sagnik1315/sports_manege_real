"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { useCoachRegistrationStore } from "@/store/coachRegistrationStore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props { onNext: () => void; onBack: () => void; }

export function Step4DocumentUpload({ onNext, onBack }: Props) {
  const { setDocuments, coachId } = useCoachRegistrationStore();
  const documents = useCoachRegistrationStore(s => s.formData.documents);
  const [uploading, setUploading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (id: string, file: File) => {
    if (!coachId) { toast.error("Coach ID missing"); return; }
    setUploading(id);
    try {
      const url = await uploadToCloudinary(file, (p) => setProgress(p));
      setDocuments({ [id]: { fileName: file.name, fileType: file.type, storageUrl: url, uploadedAt: new Date().toISOString() } });
      toast.success(`${id} uploaded`);
    } catch (err: any) {
      console.error(`Coach upload error (${id}):`, err);
      const msg = err?.message || "Unknown error";
      toast.error(`Upload failed: ${msg}`);
    } finally { setUploading(null); setProgress(0); }
  };

  const isComplete = documents.photo && documents.identityProof && documents.sportsCertificate;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { id: "photo", label: "Profile Photo", type: "image/*" },
          { id: "identityProof", label: "Identity Proof (PDF/Image)", type: "*/*" },
          { id: "sportsCertificate", label: "Sports Certificate (PDF/Image)", type: "*/*" }
        ].map(doc => {
          const uploaded = documents[doc.id as keyof typeof documents];
          return (
            <div key={doc.id} className={cn("p-4 border-2 border-dashed rounded-xl", uploaded ? "border-emerald-200 bg-emerald-50" : "border-slate-200")}>
              <p className="text-sm font-semibold mb-3">{doc.label} *</p>
              {uploading === doc.id ? (
                <div className="py-2"><div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-600 transition-all" style={{ width: `${progress}%` }} /></div></div>
              ) : uploaded ? (
                <div className="flex items-center justify-between bg-white p-2 rounded border border-slate-100">
                  <span className="text-xs truncate max-w-[120px]">{uploaded.fileName}</span>
                  <button onClick={() => {
                    const newDocs = { ...documents };
                    delete newDocs[doc.id as keyof typeof newDocs];
                    setDocuments(newDocs, false);
                  }} className="text-red-400 p-1"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <label className="flex flex-col items-center py-4 cursor-pointer hover:text-emerald-500">
                  <Upload className="h-6 w-6 mb-1" /><span className="text-xs">Upload</span>
                  <input type="file" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(doc.id, e.target.files[0])} />
                </label>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="px-5 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg">← Back</button>
        <button onClick={onNext} disabled={!isComplete} className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium rounded-lg shadow-sm">Review & Submit →</button>
      </div>
    </motion.div>
  );
}
