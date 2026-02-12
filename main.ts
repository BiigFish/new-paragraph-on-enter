import { Plugin, Editor, MarkdownView } from 'obsidian';

export default class NewParagraphPlugin extends Plugin {

    onload() {
        this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
            // 1. Check modifiers: Only trigger on plain 'Enter'
            if (evt.key === 'Enter' && !evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey) {

                // 2. SAFETY CHECK: Do not intercept if a suggestion/autocomplete popup is open.
                // Without this, you cannot select items in the Quick Switcher, Command Palette, 
                // or Link Autocomplete ([[link]]).
                if (document.querySelector('.suggestion-container')) {
                    return;
                }

                const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);

                if (activeView && activeView.editor.hasFocus()) {
                    const editor = activeView.editor;
                    const cursor = editor.getCursor();
                    const line = editor.getLine(cursor.line);

                    /**
                     * listOrSpecialRegex matches:
                     * 1. Standard lists: -, *, +, 1.
                     * 2. Task lists: - [ ], - [x]
                     * 3. Blockquotes: >
                     * 4. Tables: |
                     * 5. Code block markers: ```, ~~~
                     */
                    const listOrSpecialRegex = /^(\s*)([-*+]|\d+\.|>|\||```|~~~|[-*+]\s?\[[ xX]\])(\s|$)/;

                    if (!listOrSpecialRegex.test(line)) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        this.insertDoubleNewline(editor);
                    }
                }
            }
        }, true);
    }
    private insertDoubleNewline(editor: Editor): void {
        editor.replaceSelection('\n\n');
    }
}
