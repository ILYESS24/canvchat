"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { ArrowUp, Presentation, BarChart3, FileText, Layers, Video, Search, Image, X, Mic, Paperclip, Zap, CornerDownLeft, ChevronDown, Lock } from "lucide-react";
import { Mode } from "./ModeSelector";
import { IntegrationsRegistry } from "../agents/integrations-registry";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  selectedMode: Mode;
  value?: string;
  onChange?: (message: string) => void;
}

const modeIcons: Record<Mode, React.ElementType> = {
  slides: Presentation,
  data: BarChart3,
  docs: FileText,
  canvas: Layers,
  video: Video,
  research: Search,
  image: Image,
};

const modeLabels: Record<Mode, string> = {
  slides: "slides",
  data: "data",
  docs: "docs",
  canvas: "canvas",
  video: "video",
  research: "research",
  image: "image",
};

export function ChatInput({ onSubmit, selectedMode, value, onChange }: ChatInputProps) {
  const [internalMessage, setInternalMessage] = useState("");
  const [showModeTag, setShowModeTag] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);


  // Use controlled or uncontrolled mode
  const message = value !== undefined ? value : internalMessage;
  const setMessage = (newMessage: string) => {
    if (onChange) {
      onChange(newMessage);
    } else {
      setInternalMessage(newMessage);
    }
  };

  // Update mode tag when selectedMode changes
  useEffect(() => {
    setShowModeTag(true);
  }, [selectedMode]);

  const handleSubmit = () => {
    if (message.trim() || uploadedFiles.length > 0) {
      // Include file information in the submission
      const messageWithFiles = {
        text: message,
        files: uploadedFiles
      };
      onSubmit(message || '[Files attached]');
      setMessage("");
      setUploadedFiles([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Voice recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'voice-message.wav', { type: 'audio/wav' });
        setUploadedFiles(prev => [...prev, audioFile]);
        setMessage(prev => prev + ' [Voice message attached]');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // File upload functionality
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
      // Add file names to the message
      const fileNames = newFiles.map(file => `[${file.name}]`).join(' ');
      setMessage(prev => prev + ' ' + fileNames);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const toggleIntegrations = () => {
    setShowIntegrations(!showIntegrations);
  };

  const ModeIcon = modeIcons[selectedMode];

  return (
    <div className="w-full p-1.5 pb-2 bg-card border rounded-[24px]">
      <div className="relative flex flex-col w-full h-full gap-2 justify-between">
        <div className="flex flex-col gap-1 px-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Décris ce dont tu as besoin d'aide..."
            rows={1}
            aria-label="Message input"
            className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content border py-2 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm w-full bg-transparent dark:bg-transparent border-none shadow-none focus-visible:ring-0 px-0.5 pb-6 pt-4 min-h-[100px] sm:min-h-[72px] max-h-[200px] overflow-y-auto resize-none rounded-[24px] !text-[16px] sm:!text-[15px]"
            style={{ height: '72px', maxHeight: '200px', overflowY: 'hidden' }}
          />
        </div>

        <div className="flex items-center justify-between mt-0 mb-1 px-2 gap-1.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={openFileDialog}
              className="whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-card dark:hover:bg-card/50 gap-1.5 has-[&>svg]:px-2.5 h-10 w-10 p-0 bg-transparent border-[1.5px] border-border rounded-2xl text-muted-foreground hover:text-foreground hover:bg-accent/50 flex items-center justify-center cursor-pointer"
              aria-label="Attach file"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            <div className="relative">
              <button
                onClick={toggleIntegrations}
                className="whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-card dark:hover:bg-card/50 gap-1.5 has-[&>svg]:px-2.5 h-10 w-10 p-0 bg-transparent border-[1.5px] border-border rounded-2xl text-muted-foreground hover:text-foreground hover:bg-accent/50 flex items-center justify-center cursor-pointer"
                aria-label="Integrations"
              >
                <div className="relative h-3 w-3 overflow-hidden">
                  <img
                    alt="googledrive"
                    className="absolute inset-0 h-3 w-3 object-contain transition-opacity duration-500 ease-in-out opacity-0"
                    src="https://logos.composio.dev/api/googledrive"
                    style={{ willChange: 'opacity', backfaceVisibility: 'hidden', transform: 'translateZ(0px)' }}
                  />
                  <img
                    alt="gmail"
                    className="absolute inset-0 h-3 w-3 object-contain transition-opacity duration-500 ease-in-out opacity-100"
                    src="https://logos.composio.dev/api/gmail"
                    style={{ willChange: 'opacity', backfaceVisibility: 'hidden', transform: 'translateZ(0px)' }}
                  />
                </div>
              </button>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center z-10 pointer-events-none">
                <Lock className="h-2.5 w-2.5 text-primary-foreground" />
              </div>
            </div>

          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="cursor-pointer justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:hover:bg-accent/50 has-[&>svg]:px-2.5 h-10 px-2 bg-transparent border-[1.5px] border-border rounded-2xl text-muted-foreground hover:text-foreground hover:bg-accent/50 flex items-center gap-1.5" aria-label="Kortix menu">
              <div className="flex items-center gap-2 min-w-0 max-w-[180px]">
                <img alt="Kortix" className="invert dark:invert-0 flex-shrink-0" src="/logomark-white.svg" style={{ height: '14px', width: 'auto' }} />
                <ChevronDown className="opacity-60 flex-shrink-0" style={{ width: '12px', height: '12px' }} />
              </div>
            </button>

            <button
              onClick={toggleRecording}
              className={`cursor-pointer justify-center whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:hover:bg-accent/50 has-[&>svg]:px-2.5 h-10 px-2 py-2 bg-transparent border-[1.5px] border-border rounded-2xl text-muted-foreground hover:text-foreground hover:bg-accent/50 flex items-center gap-2 transition-colors ${
                isRecording
                  ? 'text-red-400 hover:text-red-300 animate-pulse'
                  : ''
              }`}
              aria-label="Voice recording"
            >
              <Mic className="h-5 w-5" />
            </button>

            <div className="relative">
              <button
                onClick={handleSubmit}
                disabled={!message.trim()}
                className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 px-3 has-[&>svg]:px-2.5 flex-shrink-0 self-end border-[1.5px] border-border rounded-2xl relative z-10 transition-all duration-200 w-10 h-10"
                aria-label="Send message"
              >
                <CornerDownLeft className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.rtf,.epub,.txt,.csv,.md,.markdown,.html,.htm,.css,.js,.jsx,.ts,.tsx,.mjs,.cjs,.py,.pyw,.pyi,.java,.class,.c,.cpp,.h,.hpp,.cc,.cxx,.cs,.go,.rs,.rb,.php,.swift,.kt,.kts,.scala,.sh,.bash,.zsh,.sql,.r,.m,.lua,.pl,.dart,.yaml,.yml,.toml,.xml,.json,.jsonc,.json5,.env,.ini,.cfg,.conf,.lock,.vue,.svelte,.astro,.ejs,.pug,.hbs,.handlebars,.jpeg,.jpg,.png,.gif,.webp,.svg,.bmp,.ico,.heic,.heif,.tiff,.tif,.mp4,.webm,.mov,.avi,.mkv,.m4v,.flv,.wmv,.mp3,.wav,.ogg,.m4a,.aac,.flac,.wma,.zip,.tar,.gz,.7z,.rar,.bz2,.xz,.ttf,.otf,.woff,.woff2,.eot,.svg,.ai,.sketch,.fig,.xd,.obj,.stl,.gltf,.glb,.fbx,.bin,.exe,.dll,.so,.dylib,.wasm,.db,.sqlite,.sqlite3,.ipynb"
        type="file"
        className="hidden"
        aria-label="File upload"
      />

      {/* Integrations Popup */}
      {showIntegrations && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F0F0F] border border-[#252525] rounded-xl shadow-2xl z-50 max-h-[70vh] overflow-y-auto scrollbar-thin">
          <IntegrationsRegistry
            onClose={() => setShowIntegrations(false)}
            onToolsSelected={(profileId, selectedTools, appName, appSlug) => {
              console.log('Tools selected:', { profileId, selectedTools, appName, appSlug });
              setShowIntegrations(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

