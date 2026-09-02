import React, { useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  RemoveFormatting,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label = 'Descripción de la propiedad (Editor Enriquecido)',
  placeholder = 'Escribe aquí la descripción detallada de la propiedad...'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const executeCommand = (command: string, arg: string = '') => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-bold text-[#1F2937]">
          {label}
        </label>
      )}

      <div className="border border-[#DBE3EE] rounded-xl overflow-hidden bg-white shadow-2xs focus-within:border-[#03459C] transition-all">
        {/* Formatting Toolbar */}
        <div className="bg-[#F7FAFC] border-b border-[#DBE3EE] p-1.5 flex flex-wrap items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className="p-1.5 hover:bg-white hover:text-[#03459C] text-gray-700 rounded transition-colors border border-transparent hover:border-[#DBE3EE]"
            title="Negrita (Bold)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className="p-1.5 hover:bg-white hover:text-[#03459C] text-gray-700 rounded transition-colors border border-transparent hover:border-[#DBE3EE]"
            title="Cursiva (Italic)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => executeCommand('underline')}
            className="p-1.5 hover:bg-white hover:text-[#03459C] text-gray-700 rounded transition-colors border border-transparent hover:border-[#DBE3EE]"
            title="Subrayado (Underline)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-[#DBE3EE] mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h2>')}
            className="p-1.5 hover:bg-white hover:text-[#03459C] text-gray-700 rounded transition-colors border border-transparent hover:border-[#DBE3EE]"
            title="Título Principal (H2)"
          >
            <Heading1 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => executeCommand('formatBlock', '<h3>')}
            className="p-1.5 hover:bg-white hover:text-[#03459C] text-gray-700 rounded transition-colors border border-transparent hover:border-[#DBE3EE]"
            title="Subtítulo (H3)"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-[#DBE3EE] mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            className="p-1.5 hover:bg-white hover:text-[#03459C] text-gray-700 rounded transition-colors border border-transparent hover:border-[#DBE3EE]"
            title="Lista con viñetas"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            className="p-1.5 hover:bg-white hover:text-[#03459C] text-gray-700 rounded transition-colors border border-transparent hover:border-[#DBE3EE]"
            title="Lista numerada"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-[#DBE3EE] mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('justifyLeft')}
            className="p-1.5 hover:bg-white hover:text-[#03459C] text-gray-700 rounded transition-colors border border-transparent hover:border-[#DBE3EE]"
            title="Alinear Izquierda"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => executeCommand('justifyCenter')}
            className="p-1.5 hover:bg-white hover:text-[#03459C] text-gray-700 rounded transition-colors border border-transparent hover:border-[#DBE3EE]"
            title="Centrar"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => executeCommand('justifyRight')}
            className="p-1.5 hover:bg-white hover:text-[#03459C] text-gray-700 rounded transition-colors border border-transparent hover:border-[#DBE3EE]"
            title="Alinear Derecha"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-[#DBE3EE] mx-1" />

          <button
            type="button"
            onClick={() => executeCommand('removeFormat')}
            className="p-1.5 hover:bg-red-50 hover:text-red-600 text-gray-500 rounded transition-colors"
            title="Limpiar formato"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Editable Content Area */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          placeholder={placeholder}
          className="p-3.5 min-h-[120px] max-h-[260px] overflow-y-auto text-xs text-[#1F2937] focus:outline-none leading-relaxed prose prose-sm max-w-none"
        />
      </div>
    </div>
  );
};
