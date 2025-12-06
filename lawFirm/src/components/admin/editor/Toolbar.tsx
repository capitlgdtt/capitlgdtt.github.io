import React, { useEffect, useState } from 'react';
import { Editor } from '@tiptap/react';

interface ToolbarProps {
    editor: Editor;
}

const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
    const [isActive, setIsActive] = useState({
        bold: false,
        italic: false,
        heading1: false,
        heading2: false,
        heading3: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        code: false,
        link: false,
    });

    // Следим за изменениями состояния редактора
    useEffect(() => {
        if (!editor) return;

        const updateState = () => {
            setIsActive({
                bold: editor.isActive('bold'),
                italic: editor.isActive('italic'),
                heading1: editor.isActive('heading', { level: 1 }),
                heading2: editor.isActive('heading', { level: 2 }),
                heading3: editor.isActive('heading', { level: 3 }),
                bulletList: editor.isActive('bulletList'),
                orderedList: editor.isActive('orderedList'),
                blockquote: editor.isActive('blockquote'),
                code: editor.isActive('code'),
                link: editor.isActive('link'),
            });
        };

        // Подписываемся на события редактора
        editor.on('transaction', updateState);
        editor.on('selectionUpdate', updateState);
        editor.on('update', updateState);

        return () => {
            editor.off('transaction', updateState);
            editor.off('selectionUpdate', updateState);
            editor.off('update', updateState);
        };
    }, [editor]);

    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('URL изображения:');

        if (url) {
            // Проверяем, что URL валидный
            if (url.startsWith('http') || url.startsWith('/') || url.startsWith('./')) {
                editor.chain().focus().setImage({ src: url }).run();
            } else {
                alert('Пожалуйста, введите корректный URL (начинается с http, / или ./)');
            }
        }
    };

    const setLink = () => {
        const url = window.prompt('URL:');
        if (url === null) {
            return;
        }
        if (url === '') {
            editor.chain().focus().unsetLink().run();
            return;
        }
        editor.chain().focus().setLink({ href: url }).run();
    };

    const getButtonClass = (active: boolean) =>
        `p-2 rounded transition-colors ${
            active
                ? 'bg-[var(--accent)] text-white'
                : 'hover:bg-[var(--bg-secondary)]'
        }`;

    return (
        <div className="flex flex-wrap items-center gap-2 p-3 border-b border-[var(--bg-secondary)] bg-[var(--bg-primary)]">
            {/* Заголовки */}
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={getButtonClass(isActive.heading1)}
                type="button"
            >
                H1
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={getButtonClass(isActive.heading2)}
                type="button"
            >
                H2
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={getButtonClass(isActive.heading3)}
                type="button"
            >
                H3
            </button>

            {/* Текст */}
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={getButtonClass(isActive.bold)}
                type="button"
            >
                <strong>B</strong>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={getButtonClass(isActive.italic)}
                type="button"
            >
                <em>I</em>
            </button>

            {/* Списки */}
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={getButtonClass(isActive.bulletList)}
                type="button"
            >
                • List
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={getButtonClass(isActive.orderedList)}
                type="button"
            >
                1. List
            </button>

            {/* Цитата */}
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={getButtonClass(isActive.blockquote)}
                type="button"
            >
                Quote
            </button>

            {/* Code */}
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={getButtonClass(isActive.code)}
                type="button"
            >
                Code
            </button>

            {/* Ссылка */}
            <button
                onClick={setLink}
                className={getButtonClass(isActive.link)}
                type="button"
            >
                Link
            </button>

            {/* Изображение */}
            <button
                onClick={addImage}
                className="p-2 rounded hover:bg-[var(--bg-secondary)] transition-colors"
                type="button"
            >
                Image
            </button>
        </div>
    );
};

export default Toolbar;