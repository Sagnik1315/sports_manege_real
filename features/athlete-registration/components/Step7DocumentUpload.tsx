"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useRegistrationStore } from "@/store/registrationStore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import { cn, formatFileSize } from "@/lib/utils";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const MANDATORY_DOCS = [
  { id: "photo", label: "Athlete Photo", type: "image/*", description: "JPG/PNG up to 1MB" },
  { id: "aadhaar", label: "Aadhaar Card", type: "image/", description: "JPG/PNG up to 1MB" },
  { id: "birthCertificate", label: "Birth Certificate", type: "image/", description: "JPG/PNG up to 1MB" },
];

const OPTIONAL_DOCS = [
  { id: "insuranceCertificate", label: "Insurance Certificate", type: "image/", description: "Optional - JPG/PNG up to 2MB" },
  { id: "passport", label: "Passport", type: "image/", description: "Optional - JPG/PNG up to 2MB" },
  { id: "medicalCertificate", label: "Medical Certificate", type: "image/", description: "Optional - JPG/PNG up to 2MB" },
  { id: "previousCertificate", label: "Previous Competition Certificate", type: "image/", description: "Optional - JPG/PNG up to 2MB" },
];

export function Step7DocumentUpload({ onNext, onBack }: Props) {
  const { setDocuments, athleteId } = useRegistrationStore();
  const documents = useRegistrationStore(s => s.formData.documents);
  const [uploading, setUploading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (docId: string, file: File) => {
    if (!athleteId) {
      // In a real app, we'd ensure athleteId exists or use a temp path
      // For now, let's assume we generated it at the start or persist it
      toast.error("Registration ID not found. Please restart.");
      return;
    }

    // Basic Validation
    if (file.type.startsWith("image/") && file.size > 1024 * 1024 * 5) { // 5MB limit before compression
      toast.error("File is too large (max 5MB for images)");
      return;
    }
    if (file.type === "image/" && file.size > 1024 * 1024 * 5) {
      toast.error("File is too large (max 5MB for images)");
      return;
    }

    setUploading(docId);
    setProgress(0);

    try {
      const url = await uploadToCloudinary(file, (p) => setProgress(p));
      
      setDocuments({
        [docId]: {
          fileName: file.name,
          fileType: file.type,
          storageUrl: url,
          uploadedAt: new Date().toISOString(),
        }
      });
      
      toast.success(`${docId} uploaded successfully`);
    } catch (error: any) {
      console.error(`Upload error for ${docId}:`, error);
      const msg = error?.message || "Unknown error";
      if (msg.includes("storage/unauthorized")) {
        toast.error(`Permission denied. Please check your Storage Rules.`);
      } else if (msg.includes("storage/quota-exceeded")) {
        toast.error("Cloud Storage quota exceeded.");
      } else {
        toast.error(`Upload failed: ${msg}`);
      }
    } finally {
      setUploading(null);
      setProgress(0);
    }
  };

  const removeFile = (docId: string) => {
    const newDocs = { ...documents };
    delete newDocs[docId as keyof typeof newDocs];
    setDocuments(newDocs, false);
  };

  const isComplete = MANDATORY_DOCS.every(doc => documents[doc.id as keyof typeof documents]);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700 leading-relaxed">
          Please upload clear scans of the required documents. Images will be automatically compressed. 
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...MANDATORY_DOCS, ...OPTIONAL_DOCS].map((doc) => {
          const uploaded = documents[doc.id as keyof typeof documents];
          const isUploading = uploading === doc.id;

          return (
            <div key={doc.id} className={cn(
              "p-4 rounded-xl border-2 border-dashed transition-all",
              uploaded ? "border-green-200 bg-green-50/50" : "border-slate-200 bg-white hover:border-blue-300"
            )}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-slate-800">
                  {doc.label} {MANDATORY_DOCS.includes(doc) && <span className="text-red-500">*</span>}
                </p>
                {uploaded && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              </div>
              
              {isUploading ? (
                <div className="py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-500">Uploading...</span>
                    <span className="text-xs font-bold text-blue-600">{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ) : uploaded ? (
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="text-xs text-slate-600 truncate max-w-[140px]">{uploaded.fileName}</span>
                  </div>
                  <button 
                    onClick={() => removeFile(doc.id)}
                    className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer group">
                  <input 
                    type="file" 
                    accept={doc.type} 
                    className="hidden" 
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(doc.id, e.target.files[0])}
                  />
                  <div className="flex flex-col items-center justify-center py-4 text-slate-400 group-hover:text-blue-500 transition">
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="text-xs font-medium">{doc.description}</span>
                  </div>
                </label>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="px-6 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">
          ← Back
        </button>
        <button 
          onClick={onNext}
          disabled={!isComplete}
          className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition"
        >
          Review & Submit →
        </button>
      </div>
    </motion.div>
  );
}
