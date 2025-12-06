import React, {useEffect} from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Toolbar from './Toolbar';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
                                                           content,
                                                           onChange,
                                                           placeholder = 'Начните писать ваш пост...'
                                                       }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'editor-image max-w-full h-auto rounded',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'editor-link text-blue-500 underline',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder,
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'tiptap-editor prose prose-lg max-w-none focus:outline-none min-h-[300px] p-4 text-[var(--text-primary)]',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content, {
                emitUpdate: false,
            });
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-[var(--bg-secondary)] rounded-none">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};

export default RichTextEditor;